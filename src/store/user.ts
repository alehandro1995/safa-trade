import { create } from 'zustand'
import  { IUserInfo } from '@/types/User';

interface UserState {
  user: IUserInfo | null;
  createUser: (user: IUserInfo) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  createUser: (user) => set({ user }),
}))
