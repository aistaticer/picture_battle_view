// hooks/useBoardSocket.js
import { useEffect, useRef } from "react";
import { useBoardStore } from "../store/boardStore";
import { useSocketStore } from "../store/socketStore";

export const useBoardSocket = () => {
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
					type: "board",
					action: "get",
					payload: {
						boardId: "1",
						tiles: [
							[
								{
									type: "enemy",
									position: [0, 0],
								}
							],
							[
								{
									type: "water",
									position: [0, 1],
								}
							]
						]
					}
				})
			);
		}

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
					console.log(data);
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
