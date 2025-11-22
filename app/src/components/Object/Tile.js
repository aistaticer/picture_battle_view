// Board.js
import React from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Physics, useBox } from '@react-three/cannon';
import { useGameLogic } from '../../hooks/useGameLogic';
import { useBoardStore } from '../../store/boardStore';
import shallow from 'zustand/shallow';
import { useTeamStore } from '../../store/teamStore';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';

const Tile = React.memo(function Tile({ position, type, onClick }) {

  console.log("Tile描画");

  // GLBモデルをロード
  const gltf = useLoader(GLTFLoader, "/shouji.glb");
  

  const [ref] = useBox(() => ({
    mass: 0,
    position,
    args: [1, 0.2, 1],
  }));

  React.useEffect(() => {
    if (ref.current) {
      ref.current.userData = { position, type };
    }
  }, [ref, position, type]);

  const teamNames = useTeamStore((state) => state.teamNames);
  const myTeamName = useTeamStore((state) => state.myTeamName);

  const clicked = "clicked" + myTeamName;
  const clickable = "clickable" + myTeamName;

  // チームごとの色を teamNames の順番で自動割当
  const colorPalette = ["#f08080", "#87cefa", "#32cd32", "#ffa500", "#daa520", "#ff69b4"];

  const teamBaseColors = {};
  teamNames.forEach((team, index) => {
    teamBaseColors[team] = colorPalette[index % colorPalette.length];
  });

  // デフォルト
  let color = "#00fa9a";
  let opacity = 1.0;

  // 通常のチーム色
  if (teamBaseColors[type]) {
    color = teamBaseColors[type];
  }

  // 全チーム対応の clicked/clickable 判定
  if (type.startsWith("clicked")) {
    const team = type.replace("clicked", "");
    color = teamBaseColors[team] || "#8a2be2"; // 該当チームの色 or 紫
  }
  if (type.startsWith("clickable")) {
    const team = type.replace("clickable", "");
    color = teamBaseColors[team] || "rgba(30, 144, 255, 0.5)";
    opacity = 0.5;
  }

  const model = useMemo(() => gltf.scene.clone(), [gltf]);


  return (
    <mesh
      ref={ref}
      position={position}
      onClick={() => {
        onClick(ref.current.userData); 
      }}
    >
      <boxGeometry args={[1, 0.2, 1]} />
      <meshStandardMaterial 
        color={color}
        transparent={true} 
        opacity={opacity} 
      />

      {/* GLBモデルを配置 */}
      {type === clicked && (
        <primitive 
          object={model} 
          scale={[0.03, 0.03, 0.03]} 
          position={[0, 0.1, 0]} 
        />
      )}
    </mesh>
  );
}, (prev, next) =>
  prev.type === next.type &&
  prev.position?.toString() === next.position?.toString()
);

export { Tile };