import { useEffect, useState } from "react";
import { sendClickInfo } from "../api/gameApi";
import { useSocketStore } from "../store/socketStore";
import { useBoardStore } from "../store/boardStore";

function convertTilesTo2DArray(tilesDict) {
  console.log("convertTilesTo2DArray");
  
  console.log('props:', tilesDict);

  const tileArray = Object.values(tilesDict);
  const grouped = {};

  // グループ化（例: x 行にグルーピング）
  tileArray.forEach(tile => {
    const [x, , z] = tile.position;
    if (!grouped[x]) grouped[x] = [];
    grouped[x][z] = tile;
  });

  // x順に並べて 2D配列にする
  const maxX = Math.max(...Object.keys(grouped));
  const result = [];

  for (let i = 0; i <= maxX; i++) {
    result.push(grouped[i] || []);
  }
  console.log(result);


  return result;
}

export {convertTilesTo2DArray };
