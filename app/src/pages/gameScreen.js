import React, { useState, useEffect, useMemo } from 'react';
import ThemeForm from '../components/Form';
import {useThemeFetcher} from '../api/themeApi'
import {useBoardInitFetcher} from '../api/gameApi'
import "../sass/gameScreen.sass"
import * as THREE from "three";
import { Canvas, useThree , useFrame} from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Physics, useTrimesh, useBox, Debug} from "@react-three/cannon";
import { CreateBoard, useBoardState, CreateBoard2} from '../hooks/setObject/setObject';
import {Tile} from "../components/Object/Tile"
//import { GameProvider,useGame } from '../hooks/useGame';
import { useBoardStore } from "../store/boardStore";
import {useBoardSocket} from '../hooks/websocket';
import { useSocketStore } from "../store/socketStore";
import { convertTilesTo2DArray } from '../hooks/useGameLogic';

function GameScreen(){
	const { theme, themeHandleClick } = useThemeFetcher();
	const { initBoard, fetchBoard } = useBoardInitFetcher();
	const [shouldFetchTheme, setShouldFetchTheme] = useState(true);
	const setTiles = useBoardStore((state) => state.setTiles);

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
									{
										//boardSoc && <CreateBoard board={boardSoc.tiles} />
										//boardSoc && <CreateBoard2/>
									}
									{boardSoc && <CreateBoard3/>}
									
								</Debug>
							</Physics>		
						</Canvas>
						<button onClick={() => updateTile(1, 3, { type: 'clicked',position: [1,0,3] })}>
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

const CreateBoard3 = () => {
	const board = useBoardStore((state) => state.board);
	const setTiles = useBoardStore((state) => state.setTiles);
	const socket = useSocketStore((state) => state.socket);
  const updateTile = useBoardStore((state) => state.updateTile);
  const tiles = useBoardStore((state) => state.tiles);

	console.log(tiles);
	
	if(tiles) {convertTilesTo2DArray(tiles)}
	
  const handleTileClick = (userData) => {
    updateTile(userData.position[0], userData.position[2], { type: "clicked" });
  };

	  useEffect(() => {
    if (!socket) {
      return;
    }

    console.log("useGameLogic send実行");

    socket.send(JSON.stringify({
      type: "board",
      action: "save",
      payload: {
        boardId: "1",
        tiles: convertTilesTo2DArray(tiles),
      },
    }));
  }, [tiles]);

  useEffect(() => {
    if (board?.tiles) {
      setTiles(board.tiles);
    }
  }, []);
	
  const tileKeys = useMemo(() => Object.keys(tiles || {}), [tiles]);
	
  return (
    <>
      {tileKeys.map(key => (
        <TileWrapper key={key} tileKey={key} onClick={handleTileClick}/>
      ))}
    </>
  );
};

const TileWrapper = React.memo(({ tileKey, onClick }) => {
  const tile = useBoardStore(state => state.tiles[tileKey]);

  if (!tile) return null;

  return (
    <Tile
      position={tile.position}
      type={tile.type}
			onClick={onClick}
    />
  );
});


export default GameScreen;
