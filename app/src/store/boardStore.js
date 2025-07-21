// store/boardStore.js
import { create } from "zustand";
import { convertTilesTo2DArray } from '../hooks/useGameLogic';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {sendMessageWebsocket, sendUpdateTileWebsocket} from '../hooks/websocket';
import { useSocketStore } from "../store/socketStore";

const useBoardStore = create((set, get) => ({
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
		console.log("updateTile");
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

function updateBoardFromServer(tile,type) {
  updateBoard(tile, type, { origin: "server" });
}

function updateBoardFromUser(tile,type) {
  updateBoard(tile, type, { origin: "user" });
}

function updateBoard(updateTile, type, { origin }) {
	console.log("updateBoardFromServer に渡ってきた tile:", updateTile);
	const socket = useSocketStore.getState().socket;
	useBoardStore.getState().updateTile(updateTile.position[0], updateTile.position[2], { type: type });

	//const tile2DArray = convertTilesTo2DArray(useBoardStore.getState().tiles);
	
  if (origin === "user") {
    //sendMessageWebsocket(socket,tile2DArray);
		sendUpdateTileWebsocket(socket,updateTile);
  }
}

export {useBoardStore,updateBoardFromServer,updateBoardFromUser};
