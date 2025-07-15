import { create } from 'zustand'

interface UserState {
  email: string;
  balance: number;
  createUser: (email: string, balance: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  email: '',
  balance: 0,
  createUser: (email, balance) => set({email: email, balance: balance}),  
}))
