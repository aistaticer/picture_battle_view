import React, { useState, useEffect } from 'react';
import ThemeForm from '../components/Form';
import {useThemeFetcher} from '../api/themeApi'
import "../sass/gameScreen.sass"
import * as THREE from "three";
import { Canvas, useThree , useFrame} from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Physics, useTrimesh, useBox, Debug} from "@react-three/cannon";
import { CreateBoard, useBoardState} from '../hooks/setObject/setObject';
import {Tile} from "../components/Object/Tile"

function GameScreen(){
	const { theme, themeHandleClick } = useThemeFetcher();
	const [shouldFetchTheme, setShouldFetchTheme] = useState(true);

  useEffect(() => {
    if (shouldFetchTheme) {
			themeHandleClick();
      setShouldFetchTheme(false);
    }
  }, [shouldFetchTheme]);

	const initialBoard = [
    [{ type: 'empty', position: [0,0,0] }, { type: 'empty', position: [1,0,0] },{ type: 'empty', position: [2,0,0] }, { type: 'empty', position: [3,0,0] }],
		[{ type: 'empty', position: [0,0,1] }, { type: 'player1', position: [1,0,1] },{ type: 'empty', position: [2,0,1] }, { type: 'empty', position: [3,0,1] }],
		[{ type: 'empty', position: [0,0,2] }, { type: 'empty', position: [1,0,2] },{ type: 'empty', position: [2,0,2] }, { type: 'empty', position: [3,0,2] }],
		[{ type: 'empty', position: [0,0,3] }, { type: 'empty', position: [1,0,3] },{ type: 'player2', position: [2,0,3] }, { type: 'player2', position: [3,0,3] }],
  ];

	const { board, updateTile } = useBoardState(initialBoard);

	return (
		<div className="gameScreenContainer">
			<div className='topArea'>
				ヘッダー
			</div>
			<div className='centerArea'>
				gameScreen画面

				<p>お題: {theme}</p>
				<div className="canvasArea">
					<Canvas shadows>
						<OrbitControls />

						<ambientLight intensity={1.0} />
						<directionalLight position={[5, 10, 5]} intensity={1} castShadow />
						<Physics gravity={[0, -9.81, 0]}>
							<Debug color="black" scale={1.01}>
								<FallingBlock/>
								<CreateBoard board={board}/>
							</Debug>
						</Physics>		
					</Canvas>
					<button onClick={() => updateTile(1, 3, { type: 'player1',position: [1,0,3] })}>
							Change Tile
					</button>			
				</div>

	
			</div>

			<div className='bottomArea'>
				<ThemeForm theme={theme} onAnswerSubmitted={() => setShouldFetchTheme(true)} />
			</div>
		</div>
	);
}

const FallingBlock = React.memo(function FallingBlock() {
  const [ref] = useBox(() => ({
    mass: 1,
    position: [3, 5, 0], // 初期位置（高いところから落ちる）,
		args: [1, 1, 1]
  }));
	console.log("createBox rendered");

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
})

export default GameScreen;
