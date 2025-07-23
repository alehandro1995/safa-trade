import { create } from 'zustand'
import type { IRequisites } from '@/types/Requisites';

interface RequisitesState {
	requisites: IRequisites[] | null;
  addRequisite: (requisite: IRequisites[]) => void;
  removeRequisite: (id: number) => void;
}

export const useRequisitesStore = create<RequisitesState>((set) => ({
  requisites: null,
  addRequisite: (requisite) => set(() => ({requisites: requisite})),
  removeRequisite: (id) => set((state) => ({
    requisites: state.requisites?.filter(req => req.id !== id)
  }))
}))