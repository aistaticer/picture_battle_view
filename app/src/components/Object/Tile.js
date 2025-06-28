// Board.js
import React from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Physics, useBox } from '@react-three/cannon';
import { useGameLogic } from '../../hooks/useGameLogic';
import { useBoardStore } from '../../store/boardStore';
import shallow from 'zustand/shallow';

// 🔸 物理付き Box
/*const Tile = React.memo(function Tile({type, position }) {

  const key = position.join('-')
  const tile = useBoardStore((s) => s.tiles[key], shallow);

  //console.log("key:",key," type:",type);

  React.useEffect(() => {
    console.log("Tile component mounted or updated");
  });
  

	// 親クラスで作成してpropsで渡した方がいい
	const { handleTileClick } = useGameLogic();

  const [ref] = useBox(() => ({
    mass: 0, // 静的（動かない）
    position: position,
    args: [1, 0.2, 1]
  }));

	  // Tile生成時にrefに情報を追加する
		React.useEffect(() => {
			if (ref.current) {
				ref.current.userData = { type, position };
			}
		}, [ref, type, position]);
	
  const colors = ['#bada55', '#ff6f61', '#6a5acd', '#ffa500', '#20b2aa', '#ff69b4', '#87cefa', '#7fff00', '#dc143c', '#00ced1', '#ff1493', '#1e90ff', '#32cd32', '#9932cc', '#ff4500', '#00fa9a', '#ff6347', '#8a2be2', '#40e0d0', '#f08080'];
  let color = colors[Math.floor(Math.random() * colors.length)];

  // 色をライトコーラルで固定
  color = '#f08080';

  switch(type){
    case 'player1':
      color = '#f08080';
      break;
    case 'player2':
      color = '#87cefa';
      break;
    case 'empty':
      color = '#00fa9a';
      break;
    case 'clicked':
      color = '#8a2be2';
      break;
    default:
  }

  return (
    <mesh ref={ref} position={position} 
			onClick={() => {
				if (ref.current) {
          console.log("tileのposition",position);
          
					handleTileClick(ref.current.userData);
				}
			}}
		>
      <boxGeometry args={[1, 0.2, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}, (prev, next) => (
  prev.type === next.type &&
  prev.position?.toString() === next.position?.toString()
));*/

const Tile = React.memo(function Tile({ position, type, onClick }) {

  console.log("Tile再レンダリング");
  
  //const { handleTileClick } = useGameLogic();

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