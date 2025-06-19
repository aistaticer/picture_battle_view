import { useState } from "react";
import { sendClickInfo } from "../api/gameApi";
import { useSocketStore } from "../store/socketStore";

export function useGameLogic() {
  const [selectedTile, setSelectedTile] = useState(null);
  const socket = useSocketStore((state) => state.socket);

  const handleTileClick = (userData) => {
    console.log(userData);
    const sendMessage = JSON.stringify({
      type: "board",
      action: "save",
      payload: {
        boardId: "1",
        tiles: [[userData, userData], [userData, userData]],
      },
    });
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        sendMessage
      );
    } else {
      console.warn("❌ WebSocketがまだ接続されていません");
    }
  };

  return { selectedTile, handleTileClick };
}
