import React, { useState } from 'react';
import axios from 'axios';

function useBoardInitFetcher() {

  const [initBoard, setInitBoard] = useState(null);

  const fetchBoard = async () => {
		
    try {
      const res = await fetch("http://localhost:8080/api/board/init");
      const data = await res.json();
			console.log(data.tiles);
			
      setInitBoard(data.tiles);
    } catch (e) {
      console.error("盤面取得失敗", e);
    }
  };

  return { initBoard, fetchBoard };
}

const startGame = async (token) => {
  const API_BASE_URL = 'http://localhost:8080/api'; // Spring Bootのエンドポイントなど
  try {
    const response = await axios.post(`${API_BASE_URL}/startGame`, {
      token: token
    });
    return response.data; // 例: { roomId: "room-123" }
  } catch (error) {
    console.error('ルーム参加失敗:', error);
    throw error;
  }
};

export { startGame, useBoardInitFetcher };
