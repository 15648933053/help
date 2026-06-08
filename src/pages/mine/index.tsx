import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useUser } from '@/store/userContext';
import { fetchMyPrograms, fetchTodayStats } from '@/services/feishu';
import type { Program } from '@/types';
import styles from './index.module.scss';

const MinePage: React.FC = () => {
  const { state, refreshUser } = useUser();
  const { userInfo } = state;
  const [myPrograms, setMyPrograms] = useState<Program[]>([]);
  const [todayStats, setTodayStats] = useState({ visits: 0, visited: 0 });

  // 从飞书加载我的提交和今日统计
  useEffect(() => {
    const loadData = async () => {
      if (!userInfo.openid) return;
      try {
        const [programs, stats] = await Promise.all([
          fetchMyPrograms(userInfo.openid),
          fetchTodayStats(userInfo.openid),
        ]);
        setMyPrograms(programs);
        setTodayStats(stats);
      } catch (error) {
        console.error('[Mine] Load data error:', error);
      }
    };
    loadData();
  }, [userInfo.openid]);

  // 页面显示时刷新数据
  useEffect(() => {
    const onShow = async () => {
      await refreshUser();
      if (userInfo.openid) {
        const data = await fetchMyPrograms(userInfo.openid);
        setMyPrograms(data);
      }
    };
    // Taro 页面生命周期通过 useDidShow 处理
  }, []);

  const handleSubmitEntry = () => {
    Taro.navigateTo({ url: '/pages/submit/index' });
  };

  const handleAbout = () => {
    Taro.showModal({
      title: '关于互帮互助',
      content: '互帮互助是一个小程序/公众号互推平台，帮助开发者增加曝光、互相推广。通过星尘系统激励用户互相访问和支持。',
      showCancel: false,
    });
  };

  return (
    <View className={styles.container}>
      {/* 用户信息卡片 */}
      <View className={styles.profileCard}>
        <View className={styles.profileDecor1} />
        <View className={styles.profileDecor2} />
        <View className={styles.profileContent}>
          <View className={styles.avatarWrap}>
            <Text className={styles.avatarText}>
              {userInfo.nickname.charAt(0) || '新'}
            </Text>
          </View>
          <View className={styles.profileInfo}>
            <Text className={styles.nickname}>{userInfo.nickname}</Text>
            <View className={styles.stardustRow}>
              <Text className={styles.stardustIcon}>✦</Text>
              <Text className={styles.stardustValue}>{userInfo.stardustBalance}</Text>
              <Text className={styles.stardustLabel}>星尘</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 数据统计 - 横向卡片 */}
      <View className={styles.statsSection}>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{todayStats.visits}</Text>
          <Text className={styles.statLabel}>今日访问</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{todayStats.visited}</Text>
          <Text className={styles.statLabel}>今日被访</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{myPrograms.length}</Text>
          <Text className={styles.statLabel}>已提交</Text>
        </View>
      </View>

      {/* 我的提交 */}
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>我的提交</Text>
        </View>
        {myPrograms.length > 0 ? (
          <View className={styles.myProgramList}>
            {myPrograms.map(program => (
              <View key={program.id} className={styles.myProgramItem}>
                <View className={styles.myProgramRank}>
                  <Text className={styles.myProgramRankText}>{program.ranking}</Text>
                </View>
                <View className={styles.myProgramInfo}>
                  <Text className={styles.myProgramName}>{program.name}</Text>
                  <Text className={styles.myProgramDesc}>
                    {program.type === 'miniapp' ? '小程序' : '公众号'} · 排名 #{program.ranking}
                  </Text>
                </View>
                <Text className={styles.myProgramArrow}>›</Text>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptySection}>
            <Text className={styles.emptyText}>暂无提交，快去提交你的小程序吧</Text>
          </View>
        )}
      </View>

      {/* 功能列表 */}
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>更多</Text>
        </View>
        <View className={styles.menuList}>
          <View className={styles.menuItem} onClick={() => Taro.switchTab({ url: '/pages/stardust/index' })}>
            <View className={styles.menuIconWrap}>
              <Text className={styles.menuIcon}>✦</Text>
            </View>
            <Text className={styles.menuText}>星尘中心</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={handleSubmitEntry}>
            <View className={styles.menuIconWrap}>
              <Text className={styles.menuIcon}>📌</Text>
            </View>
            <Text className={styles.menuText}>提交小程序/公众号</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={handleAbout}>
            <View className={styles.menuIconWrap}>
              <Text className={styles.menuIcon}>💡</Text>
            </View>
            <Text className={styles.menuText}>关于互帮互助</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MinePage;
