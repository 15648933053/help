import Taro from '@tarojs/taro';
import type { Program, UserInfo, Transaction, Redemption, RewardConfig } from '@/types';
import feishuConfig from '@/config/feishu.json';

const FEISHU_CONFIG = feishuConfig.feishu;
const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis';

let accessToken = '';
let tokenExpireAt = 0;

// ============================================
// 基础请求
// ============================================

async function getAccessToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpireAt) return accessToken;

  const res = await Taro.request({
    url: `${FEISHU_API_BASE}/auth/v3/tenant_access_token/internal`,
    method: 'POST',
    data: { app_id: FEISHU_CONFIG.appId, app_secret: FEISHU_CONFIG.appSecret },
    header: { 'Content-Type': 'application/json' },
  });

  if (res.data?.code === 0) {
    accessToken = res.data.tenant_access_token;
    tokenExpireAt = Date.now() + (res.data.expire - 300) * 1000;
    return accessToken;
  }
  throw new Error('获取飞书凭证失败');
}

async function feishuRequest(options: {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  data?: any;
}): Promise<any> {
  const token = await getAccessToken();
  const res = await Taro.request({
    url: `${FEISHU_API_BASE}${options.path}`,
    method: options.method,
    data: options.data,
    header: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (res.data?.code !== 0) {
    console.error('[Feishu] API error:', res.data);
    throw new Error(res.data?.msg || '飞书 API 请求失败');
  }
  return res.data;
}

// ============================================
// 小程序/公众号 API
// ============================================

/** 获取排名列表（支持筛选和搜索） */
export async function fetchPrograms(filter?: string, search?: string): Promise<Program[]> {
  try {
    let filterParts: string[] = [];
    if (filter && filter !== 'all') {
      filterParts.push(`CurrentValue.[类型] = "${filter}"`);
    }
    if (search && search.trim()) {
      const kw = search.trim();
      filterParts.push(
        `OR(CurrentValue.[名称].Contains("${kw}"),CurrentValue.[描述].Contains("${kw}"),CurrentValue.[提交者名称].Contains("${kw}"))`
      );
    }
    const filterStr = filterParts.length > 0 ? filterParts.join(' AND ') : '';
    const path = `/bitable/v1/apps/${FEISHU_CONFIG.bitableAppToken}/tables/${FEISHU_CONFIG.tables.programs}/records${filterStr ? `?filter=${encodeURIComponent(filterStr)}` : ''}`;

    const res = await feishuRequest({ method: 'GET', path });
    const records = res?.data?.items || [];

    const programs = records.map(mapRecordToProgram);
    // 排序：置顶优先，然后按创建时间倒序（新提交排前面）
    programs.sort((a: Program, b: Program) => {
      if (a.isTop && !b.isTop) return -1;
      if (!a.isTop && b.isTop) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return programs.map((p, i) => ({ ...p, ranking: i + 1 }));
  } catch (error) {
    console.error('[Feishu] Fetch programs error:', error);
    return [];
  }
}

/** 检查用户是否已提交某类型 */
export async function checkUserSubmitted(openid: string, type: string): Promise<boolean> {
  try {
    const filter = `AND(CurrentValue.[提交者] = "${openid}", CurrentValue.[类型] = "${type}")`;
    const res = await feishuRequest({
      method: 'GET',
      path: `/bitable/v1/apps/${FEISHU_CONFIG.bitableAppToken}/tables/${FEISHU_CONFIG.tables.programs}/records?filter=${encodeURIComponent(filter)}`,
    });
    const records = res?.data?.items || [];
    return records.length > 0;
  } catch (error) {
    console.error('[Feishu] Check user submitted error:', error);
    return false;
  }
}

/** 提交小程序/公众号（每人每类型只能提交一个） */
export async function submitProgram(data: {
  name: string; type: string; description: string; ownerOpenid: string; ownerName: string;
}): Promise<{ success: boolean; message?: string }> {
  try {
    // 校验：该用户此类型是否已提交
    const alreadySubmitted = await checkUserSubmitted(data.ownerOpenid, data.type);
    if (alreadySubmitted) {
      const typeLabel = data.type === 'miniapp' ? '小程序' : '公众号';
      return { success: false, message: `你已提交过${typeLabel}，每种类型只能提交一个` };
    }

    await feishuRequest({
      method: 'POST',
      path: `/bitable/v1/apps/${FEISHU_CONFIG.bitableAppToken}/tables/${FEISHU_CONFIG.tables.programs}/records`,
      data: {
        fields: {
          '名称': data.name, '类型': data.type, '描述': data.description,
          '提交者': data.ownerOpenid, '提交者名称': data.ownerName,
          '是否置顶': false, '创建时间': Date.now(),
        }
      }
    });
    return { success: true };
  } catch (error) {
    console.error('[Feishu] Submit program error:', error);
    return { success: false, message: '提交失败，请重试' };
  }
}

/** 获取我提交的小程序 */
export async function fetchMyPrograms(openid: string): Promise<Program[]> {
  try {
    const res = await feishuRequest({
      method: 'GET',
      path: `/bitable/v1/apps/${FEISHU_CONFIG.bitableAppToken}/tables/${FEISHU_CONFIG.tables.programs}/records?filter=${encodeURIComponent(`CurrentValue.[提交者] = "${openid}"`)}`,
    });
    const records = res?.data?.items || [];
    const programs = records.map(mapRecordToProgram);
    programs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return programs.map((p, i) => ({ ...p, ranking: i + 1 }));
  } catch (error) {
    console.error('[Feishu] Fetch my programs error:', error);
    return [];
  }
}

/** 兑换排名置顶 */
export async function redeemRankingBoost(recordId: string, hours: number): Promise<boolean> {
  try {
    await feishuRequest({
      method: 'PUT',
      path: `/bitable/v1/apps/${FEISHU_CONFIG.bitableAppToken}/tables/${FEISHU_CONFIG.tables.programs}/records/${recordId}`,
      data: { fields: { '是否置顶': true, '置顶到期时间': Date.now() + hours * 3600 * 1000 } }
    });
    return true;
  } catch (error) {
    console.error('[Feishu] Redeem ranking boost error:', error);
    return false;
  }
}

// ============================================
// 用户 API
// ============================================

/** 获取用户信息 */
export async function fetchUserInfo(openid: string): Promise<UserInfo | null> {
  try {
    const res = await feishuRequest({
      method: 'GET',
      path: `/bitable/v1/apps/${FEISHU_CONFIG.bitableAppToken}/tables/${FEISHU_CONFIG.tables.users}/records?filter=${encodeURIComponent(`CurrentValue.[openid] = "${openid}"`)}`,
    });
    const records = res?.data?.items || [];
    return records.length > 0 ? mapRecordToUser(records[0]) : null;
  } catch (error) {
    console.error('[Feishu] Fetch user info error:', error);
    return null;
  }
}

/** 创建用户 */
export async function createUser(openid: string, nickname?: string, avatar?: string): Promise<UserInfo | null> {
  try {
    await feishuRequest({
      method: 'POST',
      path: `/bitable/v1/apps/${FEISHU_CONFIG.bitableAppToken}/tables/${FEISHU_CONFIG.tables.users}/records`,
      data: {
        fields: {
          'openid': openid, '昵称': nickname || '新用户', '头像': avatar || '',
          '星尘余额': 0, '签到日期': '', '创建时间': Date.now(),
        }
      }
    });
    return fetchUserInfo(openid);
  } catch (error) {
    console.error('[Feishu] Create user error:', error);
    return null;
  }
}

/** 更新用户信息 */
export async function updateUserInfo(openid: string, updates: Partial<UserInfo>): Promise<boolean> {
  try {
    const res = await feishuRequest({
      method: 'GET',
      path: `/bitable/v1/apps/${FEISHU_CONFIG.bitableAppToken}/tables/${FEISHU_CONFIG.tables.users}/records?filter=${encodeURIComponent(`CurrentValue.[openid] = "${openid}"`)}`,
    });
    const records = res?.data?.items || [];
    if (records.length === 0) return false;

    const fields: any = {};
    if (updates.nickname !== undefined) fields['昵称'] = updates.nickname;
    if (updates.avatar !== undefined) fields['头像'] = updates.avatar;
    if (updates.stardustBalance !== undefined) fields['星尘余额'] = updates.stardustBalance;
    if (updates.signInDates !== undefined) fields['签到日期'] = updates.signInDates.join(',');

    await feishuRequest({
      method: 'PUT',
      path: `/bitable/v1/apps/${FEISHU_CONFIG.bitableAppToken}/tables/${FEISHU_CONFIG.tables.users}/records/${records[0].recordId}`,
      data: { fields }
    });
    return true;
  } catch (error) {
    console.error('[Feishu] Update user info error:', error);
    return false;
  }
}

// ============================================
// 每日统计 API（核心优化表）
// ============================================

/** 获取用户某天的统计记录 */
async function fetchDailyStat(openid: string, date: string): Promise<{ recordId: string; visits: number; visited: number } | null> {
  try {
    const filter = `AND(CurrentValue.[日期] = "${date}", CurrentValue.[用户openid] = "${openid}")`;
    const res = await feishuRequest({
      method: 'GET',
      path: `/bitable/v1/apps/${FEISHU_CONFIG.bitableAppToken}/tables/${FEISHU_CONFIG.tables.dailyStats}/records?filter=${encodeURIComponent(filter)}`,
    });
    const records = res?.data?.items || [];
    if (records.length === 0) return null;
    const f = records[0].fields || {};
    return {
      recordId: records[0].recordId,
      visits: f['访问次数'] || 0,
      visited: f['被访问次数'] || 0,
    };
  } catch (error) {
    console.error('[Feishu] Fetch daily stat error:', error);
    return null;
  }
}

/** 创建或更新每日统计 */
async function upsertDailyStat(openid: string, date: string, updates: { visitDelta?: number; visitedDelta?: number }): Promise<boolean> {
  try {
    const existing = await fetchDailyStat(openid, date);

    if (existing) {
      const fields: any = {};
      if (updates.visitDelta) fields['访问次数'] = existing.visits + updates.visitDelta;
      if (updates.visitedDelta) fields['被访问次数'] = existing.visited + updates.visitedDelta;

      await feishuRequest({
        method: 'PUT',
        path: `/bitable/v1/apps/${FEISHU_CONFIG.bitableAppToken}/tables/${FEISHU_CONFIG.tables.dailyStats}/records/${existing.recordId}`,
        data: { fields }
      });
    } else {
      await feishuRequest({
        method: 'POST',
        path: `/bitable/v1/apps/${FEISHU_CONFIG.bitableAppToken}/tables/${FEISHU_CONFIG.tables.dailyStats}/records`,
        data: {
          fields: {
            '日期': date,
            '用户openid': openid,
            '访问次数': updates.visitDelta || 0,
            '被访问次数': updates.visitedDelta || 0,
          }
        }
      });
    }
    return true;
  } catch (error) {
    console.error('[Feishu] Upsert daily stat error:', error);
    return false;
  }
}

/** 获取用户今日统计 */
export async function fetchTodayStats(openid: string): Promise<{ visits: number; visited: number }> {
  const today = getTodayStr();
  const stat = await fetchDailyStat(openid, today);
  return stat ? { visits: stat.visits, visited: stat.visited } : { visits: 0, visited: 0 };
}

/** 获取用户多日统计（用于"我的"页面展示） */
export async function fetchRecentStats(openid: string, days: number = 7): Promise<Array<{ date: string; visits: number; visited: number }>> {
  try {
    const res = await feishuRequest({
      method: 'GET',
      path: `/bitable/v1/apps/${FEISHU_CONFIG.bitableAppToken}/tables/${FEISHU_CONFIG.tables.dailyStats}/records?filter=${encodeURIComponent(`CurrentValue.[用户openid] = "${openid}"`)}`,
    });
    const records = res?.data?.items || [];
    const stats = records.map((r: any) => {
      const f = r.fields || {};
      return { date: f['日期'] || '', visits: f['访问次数'] || 0, visited: f['被访问次数'] || 0 };
    }).filter((s: any) => s.date).sort((a: any, b: any) => b.date.localeCompare(a.date));
    return stats.slice(0, days);
  } catch (error) {
    console.error('[Feishu] Fetch recent stats error:', error);
    return [];
  }
}

// ============================================
// 核心业务：访问互助（优化为2次飞书请求）
// ============================================

/**
 * 访问互助 - 点击他人小程序时调用
 * 优化：仅2次飞书请求
 *   1. 更新访问者每日统计 + 星尘余额（并行）
 *   2. 更新被访问者每日统计（并行）
 * 不再单独记录交易，减少请求次数
 */
export async function recordVisit(visitorOpenid: string, ownerOpenid: string): Promise<{ success: boolean; stardustEarned: number }> {
  try {
    const today = getTodayStr();
    const reward = 3;

    // 并行执行：更新访问者统计 + 更新被访问者统计 + 更新访问者星尘
    const [visitorStatOk, ownerStatOk, userOk] = await Promise.all([
      upsertDailyStat(visitorOpenid, today, { visitDelta: 1 }),
      upsertDailyStat(ownerOpenid, today, { visitedDelta: 1 }),
      (async () => {
        const user = await fetchUserInfo(visitorOpenid);
        if (!user) return false;
        return updateUserInfo(visitorOpenid, { stardustBalance: user.stardustBalance + reward });
      })(),
    ]);

    return { success: visitorStatOk, stardustEarned: reward };
  } catch (error) {
    console.error('[Feishu] Record visit error:', error);
    return { success: false, stardustEarned: 0 };
  }
}

// ============================================
// 签到 API（2次请求：更新用户 + 更新统计）
// ============================================

export async function signIn(openid: string): Promise<{ success: boolean; stardustEarned: number; continuousDays: number }> {
  try {
    const user = await fetchUserInfo(openid);
    if (!user) return { success: false, stardustEarned: 0, continuousDays: 0 };

    const today = getTodayStr();
    if (user.signInDates.includes(today)) {
      return { success: false, stardustEarned: 0, continuousDays: 0 };
    }

    const newDates = [...user.signInDates, today];
    const continuousDays = getContinuousDays(newDates);
    const reward = 10;

    await updateUserInfo(openid, { signInDates: newDates, stardustBalance: user.stardustBalance + reward });
    return { success: true, stardustEarned: reward, continuousDays };
  } catch (error) {
    console.error('[Feishu] Sign in error:', error);
    return { success: false, stardustEarned: 0, continuousDays: 0 };
  }
}

// ============================================
// 看广告 API（2次请求：获取用户 + 更新星尘）
// ============================================

export async function watchAdReward(openid: string): Promise<{ success: boolean; stardustEarned: number }> {
  try {
    const user = await fetchUserInfo(openid);
    if (!user) return { success: false, stardustEarned: 0 };

    const reward = 5;
    await updateUserInfo(openid, { stardustBalance: user.stardustBalance + reward });
    return { success: true, stardustEarned: reward };
  } catch (error) {
    console.error('[Feishu] Watch ad reward error:', error);
    return { success: false, stardustEarned: 0 };
  }
}

// ============================================
// 兑换 API
// ============================================

export async function redeemReward(openid: string, reward: RewardConfig): Promise<Redemption | null> {
  try {
    const user = await fetchUserInfo(openid);
    if (!user || user.stardustBalance < reward.stardustCost) return null;

    await updateUserInfo(openid, { stardustBalance: user.stardustBalance - reward.stardustCost });

    const typeLabel = reward.type === 'ranking_boost' ? '排名置顶' : '现金红包';
    await createTransaction({
      userOpenid: openid,
      type: reward.type === 'ranking_boost' ? 'redeem_top' : 'redeem_redpacket',
      amount: -reward.stardustCost,
      description: `兑换${typeLabel} ${reward.value}${reward.unit}`,
    });

    return createRedemption({
      userOpenid: openid,
      type: reward.type,
      amount: reward.type === 'red_packet' ? reward.value : 0,
      stardustCost: reward.stardustCost,
    });
  } catch (error) {
    console.error('[Feishu] Redeem reward error:', error);
    return null;
  }
}

// ============================================
// 交易记录 API
// ============================================

export async function createTransaction(transaction: Partial<Transaction>): Promise<boolean> {
  try {
    await feishuRequest({
      method: 'POST',
      path: `/bitable/v1/apps/${FEISHU_CONFIG.bitableAppToken}/tables/${FEISHU_CONFIG.tables.transactions}/records`,
      data: {
        fields: {
          '用户openid': transaction.userOpenid, '类型': transaction.type,
          '金额': transaction.amount, '描述': transaction.description, '创建时间': Date.now(),
        }
      }
    });
    return true;
  } catch (error) {
    console.error('[Feishu] Create transaction error:', error);
    return false;
  }
}

export async function fetchTransactions(openid: string, pageSize: number = 20): Promise<Transaction[]> {
  try {
    const res = await feishuRequest({
      method: 'GET',
      path: `/bitable/v1/apps/${FEISHU_CONFIG.bitableAppToken}/tables/${FEISHU_CONFIG.tables.transactions}/records?filter=${encodeURIComponent(`CurrentValue.[用户openid] = "${openid}"`)}&pageSize=${pageSize}`,
    });
    const records = res?.data?.items || [];
    return records.map(mapRecordToTransaction).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('[Feishu] Fetch transactions error:', error);
    return [];
  }
}

// ============================================
// 兑换码 API
// ============================================

export async function createRedemption(redemption: Partial<Redemption>): Promise<Redemption | null> {
  try {
    const code = generateRedemptionCode();
    const res = await feishuRequest({
      method: 'POST',
      path: `/bitable/v1/apps/${FEISHU_CONFIG.bitableAppToken}/tables/${FEISHU_CONFIG.tables.redemptions}/records`,
      data: {
        fields: {
          '用户openid': redemption.userOpenid, '类型': redemption.type, '兑换码': code,
          '金额': redemption.amount || 0, '星尘花费': redemption.stardustCost || 0,
          '状态': 'unused', '创建时间': Date.now(),
        }
      }
    });
    return {
      id: res?.data?.record?.recordId || '',
      userOpenid: redemption.userOpenid || '',
      type: (redemption.type as any) || 'red_packet',
      code, amount: redemption.amount || 0, stardustCost: redemption.stardustCost || 0,
      status: 'unused', createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[Feishu] Create redemption error:', error);
    return null;
  }
}

export async function verifyRedemptionCode(code: string): Promise<Redemption | null> {
  try {
    const res = await feishuRequest({
      method: 'GET',
      path: `/bitable/v1/apps/${FEISHU_CONFIG.bitableAppToken}/tables/${FEISHU_CONFIG.tables.redemptions}/records?filter=${encodeURIComponent(`CurrentValue.[兑换码] = "${code}"`)}`,
    });
    const records = res?.data?.items || [];
    return records.length > 0 ? mapRecordToRedemption(records[0]) : null;
  } catch (error) {
    console.error('[Feishu] Verify redemption code error:', error);
    return null;
  }
}

export async function useRedemptionCode(recordId: string): Promise<boolean> {
  try {
    await feishuRequest({
      method: 'PUT',
      path: `/bitable/v1/apps/${FEISHU_CONFIG.bitableAppToken}/tables/${FEISHU_CONFIG.tables.redemptions}/records/${recordId}`,
      data: { fields: { '状态': 'used', '使用时间': Date.now() } }
    });
    return true;
  } catch (error) {
    console.error('[Feishu] Use redemption code error:', error);
    return false;
  }
}

// ============================================
// 奖励配置
// ============================================

export const REWARD_CONFIGS: RewardConfig[] = [
  { id: 'reward_001', type: 'ranking_boost', name: '排名置顶', description: '让你的小程序/公众号在首页置顶展示', stardustCost: 100, value: 24, unit: '小时' },
  { id: 'reward_002', type: 'ranking_boost', name: '排名置顶', description: '让你的小程序/公众号在首页置顶展示', stardustCost: 250, value: 72, unit: '小时' },
  { id: 'reward_003', type: 'red_packet', name: '现金红包', description: '兑换现金红包，添加微信领取', stardustCost: 200, value: 1, unit: '元' },
  { id: 'reward_004', type: 'red_packet', name: '现金红包', description: '兑换现金红包，添加微信领取', stardustCost: 500, value: 3, unit: '元' },
];

// ============================================
// 辅助函数
// ============================================

function generateRedemptionCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'HELP-';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  code += '-';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function getTodayStr(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getContinuousDays(signInDates: string[]): number {
  if (signInDates.length === 0) return 0;
  const sorted = [...signInDates].sort().reverse();
  const today = getTodayStr();
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
  if (sorted[0] !== today && sorted[0] !== yStr) return 0;
  let c = 1;
  for (let i = 1; i < sorted.length; i++) {
    if ((new Date(sorted[i - 1]).getTime() - new Date(sorted[i]).getTime()) / 86400000 === 1) c++;
    else break;
  }
  return c;
}

function mapRecordToProgram(record: any): Program {
  const f = record.fields || {};
  const isTop = !!f['是否置顶'];
  const topExpire = f['置顶到期时间'];
  const topExpired = isTop && topExpire && Number(topExpire) < Date.now();
  return {
    id: record.recordId, name: f['名称'] || '', type: f['类型'] || 'miniapp',
    description: f['描述'] || '', avatar: '', ownerName: f['提交者名称'] || '',
    ownerOpenid: f['提交者'] || '', ranking: 0,
    isTop: topExpired ? false : isTop, topExpireAt: f['置顶到期时间'],
    createdAt: f['创建时间'] || '',
  };
}

function mapRecordToUser(record: any): UserInfo {
  const f = record.fields || {};
  return {
    openid: f['openid'] || '', nickname: f['昵称'] || '新用户', avatar: f['头像'] || '',
    stardustBalance: f['星尘余额'] || 0, ranking: 0,
    signInDates: f['签到日期'] ? String(f['签到日期']).split(',').filter(Boolean) : [],
    createdAt: f['创建时间'] || '',
  };
}

function mapRecordToTransaction(record: any): Transaction {
  const f = record.fields || {};
  return {
    id: record.recordId, userOpenid: f['用户openid'] || '', type: f['类型'] || 'sign_in',
    amount: f['金额'] || 0, description: f['描述'] || '', createdAt: f['创建时间'] || '',
  };
}

function mapRecordToRedemption(record: any): Redemption {
  const f = record.fields || {};
  return {
    id: record.recordId, userOpenid: f['用户openid'] || '', type: f['类型'] || 'red_packet',
    code: f['兑换码'] || '', amount: f['金额'] || 0, stardustCost: f['星尘花费'] || 0,
    status: f['状态'] || 'unused', createdAt: f['创建时间'] || '', usedAt: f['使用时间'],
  };
}
