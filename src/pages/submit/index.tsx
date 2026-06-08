import React, { useState } from 'react';
import { View, Text, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useUser } from '@/store/userContext';
import { submitProgram } from '@/services/feishu';
import type { ProgramType } from '@/types';
import styles from './index.module.scss';

const SubmitPage: React.FC = () => {
  const { state, refreshUser } = useUser();
  const [name, setName] = useState('');
  const [type, setType] = useState<ProgramType>('miniapp');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Taro.showToast({ title: '请输入名称', icon: 'none' });
      return;
    }
    if (!description.trim()) {
      Taro.showToast({ title: '请输入描述', icon: 'none' });
      return;
    }
    if (!state.userInfo.openid) {
      Taro.showToast({ title: '用户信息加载中，请稍后', icon: 'none' });
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitProgram({
        name: name.trim(),
        type,
        description: description.trim(),
        ownerOpenid: state.userInfo.openid,
        ownerName: state.userInfo.nickname,
      });

      if (result.success) {
        await refreshUser();
        Taro.showToast({ title: '提交成功', icon: 'success' });
        setTimeout(() => {
          Taro.navigateBack();
        }, 1500);
      } else {
        Taro.showToast({ title: result.message || '提交失败，请重试', icon: 'none' });
      }
    } catch (error) {
      Taro.showToast({ title: '提交失败', icon: 'none' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className={styles.container}>
      <View className={styles.formCard}>
        <Text className={styles.formTitle}>提交小程序/公众号</Text>

        <View className={styles.formGroup}>
          <Text className={styles.label}>类型</Text>
          <View className={styles.typeSelector}>
            <View
              className={`${styles.typeOption} ${type === 'miniapp' ? styles.typeOptionActive : ''}`}
              onClick={() => setType('miniapp')}
            >
              <Text className={`${styles.typeOptionText} ${type === 'miniapp' ? styles.typeOptionTextActive : ''}`}>
                小程序
              </Text>
            </View>
            <View
              className={`${styles.typeOption} ${type === 'official' ? styles.typeOptionActive : ''}`}
              onClick={() => setType('official')}
            >
              <Text className={`${styles.typeOptionText} ${type === 'official' ? styles.typeOptionTextActive : ''}`}>
                公众号
              </Text>
            </View>
          </View>
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.label}>名称</Text>
          <Input
            className={styles.input}
            placeholder="请输入小程序或公众号名称"
            value={name}
            onInput={(e) => setName(e.detail.value)}
          />
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.label}>描述</Text>
          <Input
            className={styles.input}
            placeholder="请输入简短描述"
            value={description}
            onInput={(e) => setDescription(e.detail.value)}
          />
        </View>

        <View
          className={`${styles.submitButton} ${submitting ? styles.submitButtonDisabled : ''}`}
          onClick={() => !submitting && handleSubmit()}
        >
          <Text className={styles.submitButtonText}>
            {submitting ? '提交中...' : '提交'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SubmitPage;
