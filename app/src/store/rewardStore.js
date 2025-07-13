import { create } from "zustand";

export const useRewardStore = create((set) => ({
  reward: null,
  setReward: (reward) => set({ reward }),
}));
