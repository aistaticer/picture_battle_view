import { useEffect, useState } from "react";
import { sendClickInfo } from "../api/gameApi";
import { useSocketStore } from "../store/socketStore";
import { useBoardStore } from "../store/boardStore";

// クリックするとクリックしたタイルの情報をバックエンドに送るイベント（現状）
export function useGameLogic() {
  const [selectedTile, setSelectedTile] = useState(null);
  const socket = useSocketStore((state) => state.socket);
  const board = useBoardStore((state) => state.board);
  const updateTile = useBoardStore((state) => state.updateTile);

  const handleTileClick = (userData) => {
    updateTile(userData.position[0], userData.position[2], { type: "clicked" });
  };

  useEffect(() => {
    if (!socket || !board) {
      return;
    }

    console.log("board更新");
    socket.send(JSON.stringify({
      type: "board",
      action: "save",
      payload: {
        boardId: "1",
        tiles: board.tiles,
      },
    }));
    
  }, [board, socket]);


  return { selectedTile, handleTileClick };
}
