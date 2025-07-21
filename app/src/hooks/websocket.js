// hooks/useBoardSocket.js
import { useEffect, useRef } from "react";
import { useBoardStore, updateBoardFromServer } from "../store/boardStore";
import { useSocketStore } from "../store/socketStore";
import { convertTilesTo2DArray } from "./useGameLogic";
import { getOrCreateUserId } from "./userController/userController";

const useBoardSocket = () => {
	console.log("useBoardSocket");
  const socketRef = useRef(null);
  const setBoard = useBoardStore((state) => state.setBoard);
	const setSocket = useSocketStore((state) => state.setSocket);

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
					action: "start",
					payload: {
						roomId: localStorage.getItem("roomId"),
						boardId: "1",
            userId: "1"
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

        if (data.type === "game" && data.action === "start") {
          setBoard(data.board);
        }else if (data.type === "server" && data.action === "send") {
          console.log("server send確認");
          console.log(data.tileDTO);

          // ここは更新されたtileじゃないとダメなのにboard渡しちゃってる
          updateBoardFromServer(data.tileDTO,"clicked");
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
			roomId: localStorage.getItem("roomId"),
      senderId: localStorage.getItem("userId"), 
			board: {
				boardId: "1",
				tiles: tiles
			}
		},
	}));
}

// WebSocketでboardの情報をサーバー側に送信する
const sendUpdateTileWebsocket = (socket, updatetile) => {
	console.log("sendUpdateTileWebsocket");

	if (!socket) return;

	socket.send(JSON.stringify({
		type: "board",
		action: "updateTile",
		payload: {
			roomId: localStorage.getItem("roomId"),
      senderId: localStorage.getItem("userId"), 
			updateTile: updatetile
		},
	}));
}

export { useBoardSocket,sendMessageWebsocket, sendUpdateTileWebsocket };
