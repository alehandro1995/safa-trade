import { create } from 'zustand'

export enum AlertStatus {
	SUCCESS = 'success',
	ERROR = 'error',
	INFO = 'info',
	EMPTY = 'empty'
}

interface AlertState {
  isVisible: boolean;
	type: AlertStatus;
	message: string;
  show: (type: AlertStatus, message: string) => void;
	hide: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  isVisible: false,
	type: AlertStatus.EMPTY,
	message: '',
  show: (type, message) => set({isVisible: true, type: type, message: message}),
	hide: () => set({isVisible: false, type: AlertStatus.EMPTY, message: ''}),  
}));