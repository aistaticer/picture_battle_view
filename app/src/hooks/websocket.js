// hooks/useBoardSocket.js
import { useEffect, useRef } from "react";
import { useBoardStore } from "../store/boardStore";
import { useSocketStore } from "../store/socketStore";
import { convertTilesTo2DArray } from "./useGameLogic";

const useBoardSocket = () => {
	console.log("useBoardSocket");
  const socketRef = useRef(null);
  const setBoard = useBoardStore((state) => state.setBoard);
	const setSocket = useSocketStore((state) => state.setSocket);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/ws");
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
						boardId: "1"
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

        setBoard(data); // Zustandに保存
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
			board: {
				boardId: "1",
				tiles: tiles
			}
		},
	}));
}

export { useBoardSocket,sendMessageWebsocket };
