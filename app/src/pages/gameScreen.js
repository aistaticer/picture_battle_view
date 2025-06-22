import React, { useState, useEffect } from 'react';
import ThemeForm from '../components/Form';
import {useThemeFetcher} from '../api/themeApi'
import {useBoardInitFetcher} from '../api/gameApi'
import "../sass/gameScreen.sass"
import * as THREE from "three";
import { Canvas, useThree , useFrame} from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Physics, useTrimesh, useBox, Debug} from "@react-three/cannon";
import { CreateBoard, useBoardState} from '../hooks/setObject/setObject';
import {Tile} from "../components/Object/Tile"
import { GameProvider,useGame } from '../hooks/useGame';
import { useBoardStore } from "../store/boardStore";
import {useBoardSocket} from '../hooks/websocket';

function GameScreen(){
	const { theme, themeHandleClick } = useThemeFetcher();
	const { initBoard, fetchBoard } = useBoardInitFetcher();
	const [shouldFetchTheme, setShouldFetchTheme] = useState(true);

  useEffect(() => {
    if (shouldFetchTheme) {
			themeHandleClick();
      setShouldFetchTheme(false);
    }
  }, [shouldFetchTheme])

  useEffect(() => {
    fetchBoard();
  }, []);

	useBoardSocket();

	let initialBoard = initBoard;
	//console.log(initialBoard);
	const { board, setBoard, updateTile } = useBoardState(initialBoard);

	const boardSoc = useBoardStore((state) => state.board);
	console.log("screenのboard",boardSoc);
	
	const [visible, setVisible] = useState(false); 

	useEffect(() => {
    setBoard(initialBoard);
  }, [initialBoard]);

	//console.log(board);
	
	return (
		<div className="gameScreenContainer">
			<GameProvider>
				<div className='topArea'>
					ヘッダー
				</div>
				<div className='centerArea'>
					gameScreen画面

					<p>お題: {theme}</p>
					<div className="canvasArea">
					<Canvas frameloop="demand" shadows={false} dpr={[1, 1.5]}>
							<OrbitControls />

							<ambientLight intensity={1.0} />
							<directionalLight position={[5, 10, 5]} intensity={1} castShadow />
							<Physics gravity={[0, -9.81, 0]}>
								<Debug color="black" scale={1.01}>
									<FallingBlock/>
									{boardSoc && <CreateBoard board={boardSoc.tiles} />}
								</Debug>
							</Physics>		
						</Canvas>
						<button onClick={() => updateTile(1, 3, { type: 'player1',position: [1,0,3] })}>
								Change Tile
						</button>			
						<button onClick={() => {
							A()
						}}>
							音を鳴らす
						</button>
					</div>

		
				</div>

				<button onClick={() => setVisible(true)}>Boardを表示</button>
				<pre>{JSON.stringify(boardSoc, null, 2)}</pre>

				<div className='bottomArea'>
					<ThemeForm theme={theme} onAnswerSubmitted={() => setShouldFetchTheme(true)} />
				</div>
			</GameProvider>
		</div>
	);
}

function A(){
	const sound = new Audio('/sounds/風鈴が鳴る家2.mp3');
	sound.loop = true;
	sound.volume = 0.5;
	sound.play();
}

const FallingBlock = React.memo(function FallingBlock() {
  const [ref] = useBox(() => ({
    mass: 1,
    position: [0, 5, 0], // 初期位置（高いところから落ちる）,
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
