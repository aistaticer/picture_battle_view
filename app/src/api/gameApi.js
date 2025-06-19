import React, { useState } from 'react';

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

export { useBoardInitFetcher };
