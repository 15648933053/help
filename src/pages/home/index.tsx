import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import ProgramCard from '@/components/ProgramCard';
import { fetchPrograms, recordVisit } from '@/services/feishu';
import { useUser } from '@/store/userContext';
import type { Program, FilterType } from '@/types';
import styles from './index.module.scss';

const HomePage: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const { state, refreshUser } = useUser();

  // 从飞书加载数据
  const loadPrograms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPrograms(activeFilter, searchValue);
      setPrograms(data);
    } catch (error) {
      console.error('[Home] Load programs error:', error);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, searchValue]);

  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  // 下拉刷新
  useEffect(() => {
    const onPullDownRefresh = async () => {
      await loadPrograms();
      await refreshUser();
      Taro.stopPullDownRefresh();
    };

    // 监听页面显示时刷新数据
    const onShow = () => {
      loadPrograms();
    };

    Taro.eventCenter.on('onPullDownRefresh', onPullDownRefresh);
    return () => {
      Taro.eventCenter.off('onPullDownRefresh', onPullDownRefresh);
    };
  }, [loadPrograms, refreshUser]);

  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: '全部', count: programs.length },
    { key: 'miniapp', label: '小程序', count: programs.filter(p => p.type === 'miniapp').length },
    { key: 'official', label: '公众号', count: programs.filter(p => p.type === 'official').length },
  ];

  const handleProgramClick = async (program: Program) => {
    // 访问互助：一次请求完成访问者统计+被访问者统计+星尘奖励
    if (state.userInfo.openid && program.ownerOpenid) {
      const result = await recordVisit(state.userInfo.openid, program.ownerOpenid);
      if (result.success) {
        await refreshUser();
      }
    }

    Taro.showToast({
      title: `正在访问 ${program.name}`,
      icon: 'none',
      duration: 1500,
    });
  };

  const handleSubmit = () => {
    Taro.navigateTo({ url: '/pages/submit/index' });
  };

  return (
    <View className={styles.container}>
      {/* 顶部区域 */}
      <View className={styles.header}>
        <View className={styles.headerContent}>
          <Text className={styles.headerTitle}>互帮互助</Text>
          <Text className={styles.headerSubtitle}>发现优质小程序与公众号</Text>
        </View>
        {/* 搜索栏 */}
        <View className={styles.searchWrap}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索名称、描述..."
            placeholderClass={styles.searchPlaceholder}
            value={searchValue}
            onInput={(e) => setSearchValue(e.detail.value)}
          />
        </View>
      </View>

      {/* 分类筛选 */}
      <View className={styles.filterSection}>
        {filters.map(filter => (
          <View
            key={filter.key}
            className={classnames(
              styles.filterChip,
              activeFilter === filter.key && styles.filterChipActive
            )}
            onClick={() => setActiveFilter(filter.key)}
          >
            <Text className={classnames(
              styles.filterChipText,
              activeFilter === filter.key && styles.filterChipTextActive
            )}>
              {filter.label}
            </Text>
            <Text className={classnames(
              styles.filterChipCount,
              activeFilter === filter.key && styles.filterChipCountActive
            )}>
              {filter.count}
            </Text>
          </View>
        ))}
      </View>

      {/* 排名列表 */}
      <View className={styles.list}>
        {loading ? (
          <View className={styles.empty}>
            <Text className={styles.emptyIcon}>⏳</Text>
            <Text className={styles.emptyText}>加载中...</Text>
          </View>
        ) : programs.length > 0 ? (
          programs.map(program => (
            <ProgramCard
              key={program.id}
              program={program}
              onClick={handleProgramClick}
            />
          ))
        ) : (
          <View className={styles.empty}>
            <Text className={styles.emptyIcon}>🔭</Text>
            <Text className={styles.emptyText}>暂无数据，快去提交你的小程序吧</Text>
          </View>
        )}
      </View>

      {/* 提交按钮 */}
      <View className={styles.fab} onClick={handleSubmit}>
        <Text className={styles.fabPlus}>+</Text>
      </View>
    </View>
  );
};

export default HomePage;
