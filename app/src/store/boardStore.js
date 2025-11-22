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

  /**
   * 任意のタイルのみ更新する
   */
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
	},

	getBoard: () => get().board,

}));

/**
 * 更新者がserverのboard更新メソッド。これは更新者がserverのためサーバーサイドに送信せず、ここで止めている。
 * @param {*} tile 更新されるタイルの情報   
 * @param {*} type 更新されるタイルのタイプ 
 */
function updateBoardFromServer(tile,type) {
  updateBoard(tile, type, { updater: "server" });
}

/**
 * 更新者がuserのboard更新メソッド。これは更新者userのためサーバーサイドにも送信する処理を内部のメソッド先で行っている
 * @param {*} tile 更新されるタイルの情報   
 * @param {*} type 更新されるタイルのタイプ 
 */
function updateBoardFromUser(tile,type) {
  updateBoard(tile, type, { updater: "user" });
}

/**
 *  更新されるタイルの情報を作成して返す
 * @param {*} tile 更新されるタイルの情報   
 * @param {*} type 更新されるタイルのタイプ 
 * @returns 更新されるタイルの情報
 */
function createUpdatedTile(tile,type){
	const key = tile.position[0] + "-" + tile.position[1] + "-" +tile.position[2];
	const currentTile = useBoardStore.getState().tiles[key];

	const updatedTile = {
	  ...currentTile,
  	type: type,
	};
	return updatedTile;
}

/**
 * 任意のタイルのみ更新し、更新者がuserの場合はサーバーサイドにも送信する
 * @param {*} tile 更新されるタイルの情報   
 * @param {*} type 更新されるタイルのタイプ 
 * @param {*} updater 更新者の種別
 */
function updateBoard(tile, type, { updater }) {
	const socket = useSocketStore.getState().socket;
	
	useBoardStore.getState().updateTile(tile.position[0], tile.position[2], { type: type });

  // 更新者がuserの場合はWebSocketで送信
  if (updater === "user") {
		sendUpdateTileWebsocket(socket,tile);
  }
}

export {useBoardStore,updateBoardFromServer,updateBoardFromUser,createUpdatedTile};
