import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const RedeemPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [amount, setAmount] = useState(0);
  const [cost, setCost] = useState(0);

  useEffect(() => {
    const params = Taro.getCurrentInstance().router?.params || {};
    // 兑换码由飞书API生成，通过URL参数传入
    const redeemCode = params.code || '';
    const redeemAmount = Number(params.amount) || 1;
    const redeemCost = Number(params.cost) || 200;
    setCode(redeemCode);
    setAmount(redeemAmount);
    setCost(redeemCost);
  }, []);

  const handleCopyCode = () => {
    Taro.setClipboardData({
      data: code,
      success: () => {
        Taro.showToast({ title: '已复制兑换码', icon: 'success' });
      }
    });
  };

  const handleCopyWechat = () => {
    Taro.setClipboardData({
      data: 'YOUR_WECHAT_ID',
      success: () => {
        Taro.showToast({ title: '已复制微信号', icon: 'success' });
      }
    });
  };

  return (
    <View className={styles.container}>
      {/* 成功提示 */}
      <View className={styles.successCard}>
        <Text className={styles.successIcon}>🎉</Text>
        <Text className={styles.successTitle}>兑换成功</Text>
        <Text className={styles.successDesc}>
          已消耗 {cost} 星尘，兑换 {amount} 元红包
        </Text>
      </View>

      {/* 兑换码 */}
      <View className={styles.codeCard}>
        <Text className={styles.codeLabel}>兑换码</Text>
        <View className={styles.codeRow}>
          <Text className={styles.codeValue}>{code}</Text>
        </View>
        <View className={styles.copyButton} onClick={handleCopyCode}>
          <Text className={styles.copyButtonText}>复制兑换码</Text>
        </View>
      </View>

      {/* 兑换说明 */}
      <View className={styles.instructionCard}>
        <Text className={styles.instructionTitle}>兑换说明</Text>
        <View className={styles.instructionList}>
          <View className={styles.instructionItem}>
            <Text className={styles.instructionNum}>1</Text>
            <Text className={styles.instructionText}>复制上方兑换码</Text>
          </View>
          <View className={styles.instructionItem}>
            <Text className={styles.instructionNum}>2</Text>
            <Text className={styles.instructionText}>添加客服微信，发送兑换码</Text>
          </View>
          <View className={styles.instructionItem}>
            <Text className={styles.instructionNum}>3</Text>
            <Text className={styles.instructionText}>客服验证后发放红包</Text>
          </View>
        </View>
        <View className={styles.wechatButton} onClick={handleCopyWechat}>
          <Text className={styles.wechatButtonText}>复制客服微信号</Text>
        </View>
      </View>

      {/* 安全提示 */}
      <View className={styles.securityCard}>
        <Text className={styles.securityIcon}>🔒</Text>
        <Text className={styles.securityText}>
          每个兑换码仅可使用一次，验证后自动失效。请勿将兑换码分享给他人。
        </Text>
      </View>
    </View>
  );
};

export default RedeemPage;
