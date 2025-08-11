// Board.js
import React from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Physics, useBox } from '@react-three/cannon';
import { useGameLogic } from '../../hooks/useGameLogic';
import { useBoardStore } from '../../store/boardStore';
import shallow from 'zustand/shallow';

const Tile = React.memo(function Tile({ position, type, onClick }) {

  console.log("Tile描画");

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

  let color = '#00fa9a';
  if (type === 'player1') color = '#f08080';
  if (type === 'player2') color = '#87cefa';
  if (type === 'clicked') color = '#8a2be2';

  return (
    <mesh
      ref={ref}
      position={position}
      onClick={() => {
        onClick(ref.current.userData); 
      }}
    >
      <boxGeometry args={[1, 0.2, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}, (prev, next) =>
  prev.type === next.type &&
  prev.position?.toString() === next.position?.toString()
);

export { Tile };