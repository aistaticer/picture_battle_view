// store/boardStore.js
import { create } from "zustand";

export const useBoardStore = create((set, get) => ({
  board: null, // ← 最初は null、後からJSONで更新
  setBoard: (data) => set({ board: data }),

	updateTile: (x, z, newTileData) => {
		const currentBoard = get().board.tiles.map((row) => [...row]);
		console.log(currentBoard);
		console.log("updateTileのx,z",x,z);
		console.log("storeで受け取ったboard",get().board);
		
    currentBoard[x][z] = { ...currentBoard[x][z], ...newTileData }; // タイル更新
		console.log("更新後のboard",get().board);
		set({ board: { ...get().board, tiles: currentBoard } });
  },

	getBoard: () => get().board,

}));
