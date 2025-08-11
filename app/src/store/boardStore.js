// store/boardStore.js
import { create } from "zustand";
import { convertTilesTo2DArray } from '../hooks/useGameLogic';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {sendMessageWebsocket, sendUpdateTileWebsocket} from '../hooks/websocket';
import { useSocketStore } from "../store/socketStore";

const useBoardStore = create((set, get) => ({
  board: null, // ← 最初は null、後からJSONで更新
  setBoard: (data) => set({ board: data }),
	tiles: null,

	setTiles: (tileMap) => {
    set({ tiles: tileMap });
    //console.log("保存したtiles:", Array.from(get().tiles.entries()));
  },

  updateTile: (x, z, newTileData) => {
		console.log("updateTile");
		
    const key = `${x}-0-${z}`; // 例: 3D空間を意識して z軸0
		
    set((state) => ({
      tiles: {
        ...state.tiles,
        [key]: {
          ...state.tiles[key],
          ...newTileData,
        },
      },
    }));


		//console.log(get().board);
		//console.log(get().board.tiles);
		
	},

	getBoard: () => get().board,

}));

function updateBoardFromServer(tile,type) {
  updateBoard(tile, type, { origin: "server" });
}

function updateBoardFromUser(tile,type) {
  updateBoard(tile, type, { origin: "user" });
}

function createUpdatedTile(tile,type){
	const key = tile.position[0] + "-" + tile.position[1] + "-" +tile.position[2];
	const currentTile = useBoardStore.getState().tiles[key];

	const updatedTile = {
	  ...currentTile,
  	type: type,
	};
	return updatedTile;
}

function updateBoard(tile, type, { origin }) {
	const socket = useSocketStore.getState().socket;
	
	useBoardStore.getState().updateTile(tile.position[0], tile.position[2], { type: type });

  if (origin === "user") {
		sendUpdateTileWebsocket(socket,tile);
  }
}

export {useBoardStore,updateBoardFromServer,updateBoardFromUser,createUpdatedTile};
