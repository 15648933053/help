import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import type { Program } from '@/types';
import styles from './index.module.scss';

interface ProgramCardProps {
  program: Program;
  onClick?: (program: Program) => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, onClick }) => {
  const isTop3 = program.ranking <= 3;

  return (
    <View
      className={classnames(
        styles.card,
        program.isTop && styles.cardTop,
        isTop3 && styles.cardHighlight
      )}
      onClick={() => onClick?.(program)}
    >
      {/* 排名徽章 */}
      <View className={classnames(
        styles.rankBadge,
        program.ranking === 1 && styles.rank1,
        program.ranking === 2 && styles.rank2,
        program.ranking === 3 && styles.rank3,
        !isTop3 && styles.rankDefault
      )}>
        <Text className={styles.rankNum}>{program.ranking}</Text>
      </View>

      {/* 主内容 */}
      <View className={styles.main}>
        <View className={styles.header}>
          <Text className={styles.name}>{program.name}</Text>
          <View className={styles.tags}>
            <View className={classnames(
              styles.typeTag,
              program.type === 'miniapp' ? styles.tagMiniapp : styles.tagOfficial
            )}>
              <Text className={styles.typeTagText}>
                {program.type === 'miniapp' ? '小程序' : '公众号'}
              </Text>
            </View>
            {program.isTop && (
              <View className={styles.topTag}>
                <Text className={styles.topTagText}>TOP</Text>
              </View>
            )}
          </View>
        </View>

        <Text className={styles.desc}>{program.description}</Text>

        <View className={styles.footer}>
          <Text className={styles.owner}>{program.ownerName}</Text>
        </View>
      </View>
    </View>
  );
};

export default ProgramCard;
