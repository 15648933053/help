// 小程序/公众号类型
export type ProgramType = 'miniapp' | 'official';

// 小程序/公众号信息
export interface Program {
  id: string;
  name: string;
  type: ProgramType;
  description: string;
  avatar: string;
  ownerName: string;
  ownerOpenid: string;
  ranking: number;
  isTop: boolean;
  topExpireAt?: string;
  createdAt: string;
}

// 用户信息
export interface UserInfo {
  openid: string;
  nickname: string;
  avatar: string;
  stardustBalance: number;
  ranking: number;
  signInDates: string[];
  createdAt: string;
}

// 星尘交易类型
export type TransactionType = 'sign_in' | 'watch_ad' | 'redeem_top' | 'redeem_redpacket' | 'visit_reward';

// 星尘交易记录
export interface Transaction {
  id: string;
  userOpenid: string;
  type: TransactionType;
  amount: number;
  description: string;
  createdAt: string;
}

// 兑换类型
export type RedemptionType = 'ranking_boost' | 'red_packet';

// 兑换记录
export interface Redemption {
  id: string;
  userOpenid: string;
  type: RedemptionType;
  code: string;
  amount: number;
  stardustCost: number;
  status: 'unused' | 'used' | 'expired';
  createdAt: string;
  usedAt?: string;
}

// 奖励配置
export interface RewardConfig {
  id: string;
  type: RedemptionType;
  name: string;
  description: string;
  stardustCost: number;
  value: number;
  unit: string;
}

// 签到信息
export interface SignInInfo {
  todaySigned: boolean;
  continuousDays: number;
  totalDays: number;
  reward: number;
}

// 排行筛选
export type FilterType = 'all' | 'miniapp' | 'official';
