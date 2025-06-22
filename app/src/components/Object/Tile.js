// Board.js
import React from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Physics, useBox } from '@react-three/cannon';
import { useGameLogic } from '../../hooks/useGameLogic';

// 🔸 物理付き Box
const Tile = React.memo(function Tile({type, position }) {
  //console.log("Tile rendered", type);

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
}, (prevProps, nextProps) => {
  // positionが変わらなければ再レンダリングしない
  return prevProps.position === nextProps.position && prevProps.type === nextProps.type;
});

export { Tile };