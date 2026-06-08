import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useUser } from '@/store/userContext';
import { signIn, watchAdReward, redeemReward, REWARD_CONFIGS, fetchTransactions } from '@/services/feishu';
import { formatNumber, formatDate, getTodayStr, isTodaySigned, getContinuousDays } from '@/utils';
import type { RewardConfig, Transaction } from '@/types';
import styles from './index.module.scss';

const StardustPage: React.FC = () => {
  const { state, refreshUser, refreshTransactions } = useUser();
  const { userInfo } = state;
  const [activeTab, setActiveTab] = useState<'earn' | 'spend'>('earn');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const todaySigned = isTodaySigned(userInfo.signInDates);
  const continuousDays = getContinuousDays(userInfo.signInDates);

  // 加载交易记录
  useEffect(() => {
    const loadTransactions = async () => {
      if (!userInfo.openid) return;
      try {
        const data = await fetchTransactions(userInfo.openid);
        setTransactions(data);
      } catch (error) {
        console.error('[Stardust] Load transactions error:', error);
      }
    };
    loadTransactions();
  }, [userInfo.openid]);

  const earnMethods = [
    {
      id: 'sign_in',
      icon: '📅',
      title: '每日签到',
      description: `连续${continuousDays}天，今日+10星尘`,
      reward: '+10',
      disabled: todaySigned,
      buttonText: todaySigned ? '已签到' : '签到',
    },
    {
      id: 'watch_ad',
      icon: '🎬',
      title: '观看广告',
      description: '观看一段广告视频获得星尘',
      reward: '+5',
      disabled: false,
      buttonText: '观看',
    },
    {
      id: 'visit_reward',
      icon: '👀',
      title: '访问奖励',
      description: '访问他人小程序/公众号获得星尘',
      reward: '+3',
      disabled: false,
      buttonText: '去访问',
    },
  ];

  const handleSignIn = async () => {
    if (todaySigned || !userInfo.openid) return;
    setLoading(true);
    try {
      const result = await signIn(userInfo.openid);
      if (result.success) {
        await refreshUser();
        const data = await fetchTransactions(userInfo.openid);
        setTransactions(data);
        Taro.showToast({ title: `签到成功 +${result.stardustEarned}星尘`, icon: 'none' });
      } else {
        Taro.showToast({ title: '今日已签到', icon: 'none' });
      }
    } catch (error) {
      Taro.showToast({ title: '签到失败', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  const handleWatchAd = () => {
    if (!userInfo.openid) return;
    Taro.showModal({
      title: '观看广告',
      content: '模拟观看广告，确认获得5星尘？',
      success: async (res) => {
        if (res.confirm) {
          setLoading(true);
          try {
            const result = await watchAdReward(userInfo.openid);
            if (result.success) {
              await refreshUser();
              const data = await fetchTransactions(userInfo.openid);
              setTransactions(data);
              Taro.showToast({ title: `+${result.stardustEarned}星尘`, icon: 'none' });
            }
          } catch (error) {
            Taro.showToast({ title: '操作失败', icon: 'none' });
          } finally {
            setLoading(false);
          }
        }
      },
    });
  };

  const handleVisitReward = () => {
    Taro.switchTab({ url: '/pages/home/index' });
  };

  const handleEarnAction = (id: string) => {
    switch (id) {
      case 'sign_in':
        handleSignIn();
        break;
      case 'watch_ad':
        handleWatchAd();
        break;
      case 'visit_reward':
        handleVisitReward();
        break;
    }
  };

  const handleRedeem = (reward: RewardConfig) => {
    if (userInfo.stardustBalance < reward.stardustCost) {
      Taro.showToast({ title: '星尘不足', icon: 'none' });
      return;
    }
    if (!userInfo.openid) return;

    const typeLabel = reward.type === 'ranking_boost' ? '排名置顶' : '现金红包';

    Taro.showModal({
      title: `兑换${typeLabel}`,
      content: `确认花费${reward.stardustCost}星尘兑换${reward.value}${reward.unit}${typeLabel}？`,
      success: async (res) => {
        if (res.confirm) {
          setLoading(true);
          try {
            const redemption = await redeemReward(userInfo.openid, reward);
            if (redemption) {
              await refreshUser();
              const data = await fetchTransactions(userInfo.openid);
              setTransactions(data);

              if (reward.type === 'red_packet') {
                Taro.navigateTo({
                  url: `/pages/redeem/index?code=${redemption.code}&amount=${reward.value}&cost=${reward.stardustCost}`,
                });
              } else {
                Taro.showToast({ title: '兑换成功，置顶已生效', icon: 'none' });
              }
            } else {
              Taro.showToast({ title: '兑换失败，请重试', icon: 'none' });
            }
          } catch (error) {
            Taro.showToast({ title: '兑换失败', icon: 'none' });
          } finally {
            setLoading(false);
          }
        }
      },
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'sign_in': return '📅';
      case 'watch_ad': return '🎬';
      case 'visit_reward': return '👀';
      case 'redeem_top': return '📌';
      case 'redeem_redpacket': return '🧧';
      default: return '💫';
    }
  };

  return (
    <View className={styles.container}>
      {/* 星尘余额卡片 */}
      <View className={styles.balanceCard}>
        <View className={styles.balanceBg} />
        <Text className={styles.balanceLabel}>我的星尘</Text>
        <View className={styles.balanceRow}>
          <Text className={styles.balanceStar}>✦</Text>
          <Text className={styles.balanceValue}>{formatNumber(userInfo.stardustBalance)}</Text>
        </View>
        <View className={styles.signInInfo}>
          <Text className={styles.signInText}>
            {todaySigned ? `今日已签到 · 连续${continuousDays}天` : '今日未签到'}
          </Text>
        </View>
      </View>

      {/* Tab 切换 */}
      <View className={styles.tabBar}>
        <View
          className={classnames(styles.tabItem, activeTab === 'earn' && styles.tabItemActive)}
          onClick={() => setActiveTab('earn')}
        >
          <Text className={classnames(styles.tabText, activeTab === 'earn' && styles.tabTextActive)}>
            赚取星尘
          </Text>
        </View>
        <View
          className={classnames(styles.tabItem, activeTab === 'spend' && styles.tabItemActive)}
          onClick={() => setActiveTab('spend')}
        >
          <Text className={classnames(styles.tabText, activeTab === 'spend' && styles.tabTextActive)}>
            兑换奖励
          </Text>
        </View>
      </View>

      <ScrollView scrollY className={styles.content}>
        {/* 赚取星尘 */}
        {activeTab === 'earn' && (
          <View className={styles.section}>
            {earnMethods.map(method => (
              <View key={method.id} className={styles.earnCard}>
                <View className={styles.earnIconWrap}>
                  <Text className={styles.earnIcon}>{method.icon}</Text>
                </View>
                <View className={styles.earnInfo}>
                  <Text className={styles.earnTitle}>{method.title}</Text>
                  <Text className={styles.earnDesc}>{method.description}</Text>
                </View>
                <View className={styles.earnRight}>
                  <Text className={styles.earnReward}>{method.reward}</Text>
                  <View
                    className={classnames(
                      styles.earnButton,
                      (method.disabled || loading) && styles.earnButtonDisabled
                    )}
                    onClick={() => !method.disabled && !loading && handleEarnAction(method.id)}
                  >
                    <Text className={classnames(
                      styles.earnButtonText,
                      method.disabled && styles.earnButtonTextDisabled
                    )}>
                      {method.buttonText}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 兑换奖励 */}
        {activeTab === 'spend' && (
          <View className={styles.section}>
            {REWARD_CONFIGS.map(reward => (
              <View key={reward.id} className={styles.rewardCard}>
                <View className={styles.rewardIconWrap}>
                  <Text className={styles.rewardIcon}>
                    {reward.type === 'ranking_boost' ? '📌' : '🧧'}
                  </Text>
                </View>
                <View className={styles.rewardInfo}>
                  <Text className={styles.rewardTitle}>{reward.name}</Text>
                  <Text className={styles.rewardDesc}>{reward.description}</Text>
                  <Text className={styles.rewardValue}>{reward.value}{reward.unit}</Text>
                </View>
                <View
                  className={classnames(
                    styles.rewardButton,
                    (userInfo.stardustBalance < reward.stardustCost || loading) && styles.rewardButtonDisabled
                  )}
                  onClick={() => !(userInfo.stardustBalance < reward.stardustCost) && !loading && handleRedeem(reward)}
                >
                  <Text className={styles.rewardCost}>{reward.stardustCost}✦</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 交易记录 */}
        {transactions.length > 0 && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>最近记录</Text>
            {transactions.slice(0, 10).map(txn => (
              <View key={txn.id} className={styles.txnItem}>
                <Text className={styles.txnIcon}>{getTransactionIcon(txn.type)}</Text>
                <View className={styles.txnInfo}>
                  <Text className={styles.txnDesc}>{txn.description}</Text>
                  <Text className={styles.txnTime}>{formatDate(txn.createdAt)}</Text>
                </View>
                <Text className={classnames(
                  styles.txnAmount,
                  txn.amount > 0 ? styles.txnPositive : styles.txnNegative
                )}>
                  {txn.amount > 0 ? '+' : ''}{txn.amount}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default StardustPage;
