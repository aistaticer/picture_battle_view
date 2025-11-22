// hooks/useBoardSocket.js
import { useEffect, useRef } from "react";
//import { useBoardStore, updateBoardFromServer } from "../store/boardStore";
import { useBoardStore, updateBoardFromServer } from "../moc/moc_boardStore";

import { useSocketStore } from "../store/socketStore";
import { getOrCreateUserId } from "../hooks/userController/userController";
import { useTeamStore } from "../store/teamStore";

const useBoardSocket = () => {
	console.log("useBoardSocket");
  const socketRef = useRef(null);
  const setBoard = useBoardStore((state) => state.setBoard);
	const setSocket = useSocketStore((state) => state.setSocket);
  const setMyTeamName = useTeamStore((state) => state.setMyTeamName);
  const myTeamName = useTeamStore((state) => state.myTeamName);
  const setTeamNames = useTeamStore((state) => state.setTeamNames);
  const teamNames = useTeamStore((state) => state.teamNames);
  

  useEffect(() => {
    console.log("myTeamName updated:", myTeamName);
  }, [myTeamName]);

  useEffect(() => {
    console.log("useBoardSocket webSocket");
    const userId = getOrCreateUserId();
    
    const socket = new WebSocket(`ws://localhost:8080/ws?userId=${userId}`);
    socketRef.current = socket;
		setSocket(socket);

    socket.onopen = () => {
      console.log("✅ WebSocket connected");

      // 送信例（接続時に board 情報をリクエスト）
      socket.send(
				JSON.stringify({
					type: "game",
					action: "join",
					payload: {
						gameId: localStorage.getItem("gameId"),
						boardId: "board1",
            userId: "88bfbd90-9065-49ef-af81-68db708a4043"
					}
				})
			);
		}

		// websocketで受け取ったメッセージをBoardに格納
    socket.onmessage = (event) => {
      try {
        console.log("受信した生データ:", event.data); // JSON文字列
        const data = JSON.parse(event.data);
        console.log("parseされたデータ",data);

        if (data.type === "game" && data.action === "join") {
					localStorage.setItem('teamName', data.teamName);
          setMyTeamName(data.myTeamName);
          setTeamNames(data.teamNames)
          console.log("受け取ったboard",data.board);
          
          setBoard(data.board);
        }else if (data.type === "server" && data.action === "send") {
          console.log("server send確認");
          console.log(data.updateTiles);

					const updateTilesMap = new Map(Object.entries(data.updateTiles));
          updateBoardFromServer(updateTilesMap,"");
        }
      } catch (err) {
        console.error("Invalid JSON:", err);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      socket.close();
    };
  }, [setBoard]);

  return socketRef;
};

// WebSocketでboardの情報をサーバー側に送信する
const sendMessageWebsocket = (socket, tiles) => {
	console.log("SendMessageWebsocket");

	if (!socket) return;

	socket.send(JSON.stringify({
		type: "board",
		action: "save",
		payload: {
			gameId: localStorage.getItem("gameId"),
      senderId: localStorage.getItem("userId"), 
			board: {
				boardId: "1",
				tiles: tiles
			}
		},
	}));
}

/**
 * WebSocketでboardの情報をサーバー側に送信する
 * @param {*} socket WebSocketのインスタンス
 * @param {*} updatetile 更新されるタイルの情報
 */
const sendUpdateTileWebsocket = (socket, updateTiles) => {
	console.log("sendUpdateTileWebsocket");

	console.log("updatetiles", updateTiles);
	

	if (!socket) return;

	socket.send(
		JSON.stringify({
		type: "board",
		action: "updateTile",
		payload: {
			gameId: localStorage.getItem("gameId"),
      senderId: localStorage.getItem("userId"),
      boardId: "board1", 
			updateTiles: Object.fromEntries(updateTiles)
		},
	}));
}

export { useBoardSocket,sendMessageWebsocket, sendUpdateTileWebsocket };
