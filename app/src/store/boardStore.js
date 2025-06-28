// store/boardStore.js
import { create } from "zustand";

export const useBoardStore = create((set, get) => ({
  board: null, // ← 最初は null、後からJSONで更新
  setBoard: (data) => set({ board: data }),
	tiles: {},

	setTiles: (tileArray2D) => {
		const tiles = {};
		for (const row of tileArray2D) {
			for (const tile of row) {
				const key = tile.position.join('-');
				tiles[key] = tile;
			}
		}
		set({ tiles });

		console.log("保存したtiles:", get().tiles);
	},

  updateTile: (x, z, newTileData) => {
    const key = `${x}-0-${z}`; // 例: 3D空間を意識して z軸0
		console.log("key: ",key);
		
    set((state) => ({
      tiles: {
        ...state.tiles,
        [key]: {
          ...state.tiles[key],
          ...newTileData,
        },
      },
    }));
	},

	getBoard: () => get().board,

}));
