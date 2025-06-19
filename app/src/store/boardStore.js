// store/boardStore.js
import { create } from "zustand";

export const useBoardStore = create((set) => ({
  board: null, // ← 最初は null、後からJSONで更新
  setBoard: (data) => set({ board: data }),
}));
