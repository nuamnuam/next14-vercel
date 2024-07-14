import { type CaptchaResponseResult } from '@/requests/captcha/captchaQuery';
import { type TUser } from '@/types/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  token: string;
  user: TUser;
  captcha: CaptchaResponseResult | undefined;
  setToken: (token: string) => void;
  setUser: (user: TUser) => void;
  setCaptcha: (cap: CaptchaResponseResult) => void;
  reset: () => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: { email: '', username: '' },
      token: '',
      captcha: undefined,
      setToken: (newToken) => {
        set({ token: newToken });
      },
      setUser: (user) => {
        set(() => ({ user }));
      },
      setCaptcha: (cap) => {
        set(() => ({ captcha: cap }));
      },
      reset: () => {
        set({
          user: { email: '', username: '' },
          token: '',
          captcha: undefined,
        });
      },
    }),
    {
      name: 'auth-state',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    },
  ),
);

export default useAuthStore;
