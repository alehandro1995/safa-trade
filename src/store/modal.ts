import { create } from 'zustand'

export enum ModalTypes {
	ADD_DEVICE = 'add_device',
	ADD_REQUISITE = 'add_requisite',
	ADD_GROUP = 'add_group',
	REMOVE_REQUISITE = 'remove_requisite',
	UPDATE_REQUISITE = 'update_requisite',
}
interface ModalState {
	isVisible: boolean;
	type: string;
	data: unknown;
	show: (type: ModalTypes, data?: unknown) => void;
	hide: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
	isVisible: false,
	type: '',
	data: null,
	show: (type, data) => set({isVisible: true, type: type, data: data}),
	hide: () => set({isVisible: false, type: '', data: null}),  
}));