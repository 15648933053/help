import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import Taro from '@tarojs/taro';
import type { UserInfo, Transaction } from '@/types';
import {
  fetchUserInfo,
  createUser,
  fetchTransactions,
} from '@/services/feishu';
import feishuConfig from '@/config/feishu.json';

interface UserState {
  userInfo: UserInfo;
  transactions: Transaction[];
  isLoading: boolean;
  initialized: boolean;
}

type UserAction =
  | { type: 'SET_USER_INFO'; payload: UserInfo }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_INITIALIZED'; payload: boolean };

const defaultUser: UserInfo = {
  openid: '',
  nickname: '新用户',
  avatar: '',
  stardustBalance: 0,
  ranking: 0,
  signInDates: [],
  createdAt: '',
};

const initialState: UserState = {
  userInfo: defaultUser,
  transactions: [],
  isLoading: false,
  initialized: false,
};

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'SET_USER_INFO':
      return { ...state, userInfo: action.payload };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_INITIALIZED':
      return { ...state, initialized: action.payload };
    default:
      return state;
  }
}

interface UserContextType {
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
  refreshUser: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  ensureUser: (openid: string) => Promise<UserInfo | null>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // 从飞书刷新用户信息
  const refreshUser = async () => {
    if (!state.userInfo.openid) return;
    try {
      const user = await fetchUserInfo(state.userInfo.openid);
      if (user) {
        dispatch({ type: 'SET_USER_INFO', payload: user });
      }
    } catch (error) {
      console.error('[UserContext] Refresh user error:', error);
    }
  };

  // 从飞书刷新交易记录
  const refreshTransactions = async () => {
    if (!state.userInfo.openid) return;
    try {
      const transactions = await fetchTransactions(state.userInfo.openid);
      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
    } catch (error) {
      console.error('[UserContext] Refresh transactions error:', error);
    }
  };

  // 确保用户存在（不存在则创建）
  const ensureUser = async (openid: string): Promise<UserInfo | null> => {
    try {
      let user = await fetchUserInfo(openid);
      if (!user) {
        user = await createUser(openid);
      }
      if (user) {
        dispatch({ type: 'SET_USER_INFO', payload: user });
      }
      return user;
    } catch (error) {
      console.error('[UserContext] Ensure user error:', error);
      return null;
    }
  };

  // 通过 Vercel 接口用 code 换取真实 openid
  const getRealOpenId = async (code: string): Promise<string | null> => {
    try {
      const url = feishuConfig.wx.getOpenIdUrl;
      if (!url || url === 'YOUR_VERCEL_URL/api/getOpenId') {
        console.warn('[UserContext] Vercel URL not configured, using fallback');
        return null;
      }
      const res = await Taro.request({
        url: `${url}?code=${code}`,
        method: 'GET',
      });
      if (res.data?.openid) {
        return res.data.openid;
      }
      console.error('[UserContext] Get openid failed:', res.data);
      return null;
    } catch (error) {
      console.error('[UserContext] Get openid error:', error);
      return null;
    }
  };

  // 初始化：获取真实 openid 并加载数据
  useEffect(() => {
    const init = async () => {
      if (state.initialized) return;
      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        // 先尝试本地缓存的 openid
        let openid = Taro.getStorageSync('user_openid');

        if (!openid) {
          // 调用微信登录获取 code
          const loginRes = await Taro.login();
          if (loginRes.code) {
            // 通过 Vercel 接口用 code 换取真实 openid
            openid = await getRealOpenId(loginRes.code);
            if (openid) {
              Taro.setStorageSync('user_openid', openid);
            }
          }
        }

        if (openid) {
          // 确保用户在飞书存在
          const user = await ensureUser(openid);
          if (user) {
            const transactions = await fetchTransactions(openid);
            dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
          }
        }
      } catch (error) {
        console.error('[UserContext] Init error:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
        dispatch({ type: 'SET_INITIALIZED', payload: true });
      }
    };

    init();
  }, []);

  return (
    <UserContext.Provider value={{ state, dispatch, refreshUser, refreshTransactions, ensureUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
