import React, { useState, useEffect, useMemo, useCallback , useRef} from 'react';
import ThemeForm from '../components/Form';
import {useThemeFetcher} from '../api/themeApi'
import {startGame,useBoardInitFetcher} from '../api/gameApi'
import "../sass/gameScreen.sass"
import * as THREE from "three";
import { Canvas, useThree , useFrame} from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Physics, useTrimesh, useBox, Debug} from "@react-three/cannon";
import { CreateBoard, useBoardState, CreateBoard2} from '../hooks/setObject/setObject';
import {Tile} from "../components/Object/Tile"
//import { GameProvider,useGame } from '../hooks/useGame';
import { useBoardStore,updateBoardFromServer,updateBoardFromUser,createUpdatedTile } from "../store/boardStore";
import {useBoardSocket,sendMessageWebsocket} from '../hooks/websocket';
import { useSocketStore } from "../store/socketStore";
import { convertTilesTo2DArray } from '../hooks/useGameLogic';
import { useRewardStore } from '../store/rewardStore';

function GameScreen(){

  const [shouldFetchTheme, setShouldFetchTheme] = useState(true);

	useBoardSocket();

	console.log("GameScreen");


	
	const theme = useGetTheme(shouldFetchTheme, setShouldFetchTheme);

	return (
		<div className="gameScreenContainer">
				<div className='topArea'>
					ヘッダー
				</div>
				<div className='centerArea'>
					gameScreen画面

					<p>お題: {theme}</p>
					<div className="canvasArea">

					{
						//<SendMessageWebsocket/>
					}

					<Canvas frameloop="demand" shadows={false} dpr={[1, 1.5]}>
							<OrbitControls />

							<ambientLight intensity={1.0} />
							<directionalLight position={[5, 10, 5]} intensity={1} castShadow />
							<Physics gravity={[0, -9.81, 0]}>
								<Debug color="black" scale={1.01}>
									<FallingBlock/>

									{<CreateBoard3/>}
									
								</Debug>
							</Physics>		
						</Canvas>		
						<StartGameButton token="token"/>

						<button onClick={() => {
							A()
						}}>
							音を鳴らす
						</button>
					</div>

		
				</div>



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

const FallingBlock2 = React.memo(function FallingBlock2({ position }) {
  const [ref] = useBox(() => ({
    mass: 0,
    position: position, // 初期位置（高いところから落ちる）,
		args: [1.01, 0.5, 1.01]
  }));
	console.log("createBox rendered");

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1.01, 0.5, 1.01]} />
      <meshStandardMaterial color="red" transparent opacity={0.5} />
    </mesh>
  );
})

function useGetTheme(shouldFetchTheme, setShouldFetchTheme) {
  const { theme, themeHandleClick } = useThemeFetcher();

  useEffect(() => {
    if (shouldFetchTheme) {
      themeHandleClick();
      setShouldFetchTheme(false);
    }
  }, [shouldFetchTheme, themeHandleClick]);

  return theme;
}

// サーバーから渡されたJsonデータをもとにBoaradを画面に描画する関数
const CreateBoard3 = () => {
	const board = useBoardStore((state) => state.board);
	const socket = useSocketStore((state) => state.socket);
	const setTiles = useBoardStore((state) => state.setTiles);
  const updateTile = useBoardStore((state) => state.updateTile);
  const tiles = useBoardStore((state) => state.tiles);
	const reward = useRewardStore(state => state.reward);
	const setReward = useRewardStore(state => state.setReward);
	const [clickableMap, setClickableMap] = useState(new Map()); 

	console.log("CreateBoard3");
	
	// タイルをクリックした際にタイルの情報を更新するイベントを定義
	/*const handleTileClick = useCallback((tile) => {
		console.log(reward);
		const currentReward = useRewardStore.getState().reward;
		
		if (currentReward > 0) {

			setClickableMap(getAdjacentNonClickedTiles(board,tile.position, clickableMap))
			console.log("ここ" + JSON.stringify(clickableMap));

      updateBoardFromUser(createUpdatedTile(tile,"clicked"),"clicked");

			setReward(currentReward - 1);
		} else {
			console.log("クリック回数の上限に達しました");
		}
	});*/

	/*const handleTileClick = useCallback((tile) => {

		const currentReward = useRewardStore.getState().reward;
		if (currentReward > 0) {
			setClickableMap(prevMap => {
				const newMap = getAdjacentNonClickedTiles(tiles, tile.position, prevMap);
				return newMap;
			});
			updateBoardFromUser(createUpdatedTile(tile, "clicked"), "clicked");
			setReward(currentReward - 1);
		}
	}, [tiles, clickableMap]);*/

	const tilesRef = useRef(tiles);
	useEffect(() => {
		tilesRef.current = tiles;
	}, [tiles]);

	const handleTileClick = useCallback((tile) => {
		const currentReward = useRewardStore.getState().reward;
		if (currentReward > 0) {
			setClickableMap(prevMap => {
				const newMap = getAdjacentNonClickedTiles(tilesRef.current, tile.position, prevMap);
				console.log(newMap);
				
				return newMap;
			});
			updateBoardFromUser(createUpdatedTile(tile, "clicked"), "clicked");
			setReward(currentReward - 1);
		}
	}, []);

	

  // gameがstartしたタイミングのみ動く
  useEffect(() => {
    if (board?.tiles) {
			// boardのtilesをpositionをもとにdictionary型に変換
      setTiles(board.tiles);
    }
  }, [board]);

	const isFirstRun = React.useRef(true);

	useEffect(() => {
		
		if (isFirstRun.current && tiles) {
			const newMap = getFirstAdjacentNonClickedTiles(tiles, clickableMap);
			setClickableMap(newMap);
			isFirstRun.current = false;
		}
	}, [tiles]);
	
	// tilesオブジェクトのキー（tileKey）一覧をメモ化して取得
	// tilesが変更されたときだけ再計算される
  const tileKeys = useMemo(() => Object.keys(tiles || {}), [tiles]);

  return (
    <>
      {
				tileKeys.map(key => (
        	<TileWrapper key={key} tileKey={key} onClick={handleTileClick}/>
      	))
			}

			{Array.from(clickableMap).map(([key, value]) => {
				return (
					<FallingBlock2 
						key={key} 
						position={value.position} 
					/>
				);
			})}
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

const StartGameButton = ({ token}) => {
  const handleJoin = async () => {
    try {
      const result = await startGame(token);
      console.log('ルームに参加しました:', result.roomId);
			localStorage.setItem("roomId", result.roomId);
    } catch (err) {
			console.log("ルーム参加に失敗しました");
    }
  };

  return <button onClick={handleJoin}>ルームに参加</button>;
};

function getAdjacentNonClickedTiles(tiles, position, clickableMap) {
  const [x, y, z] = position;
  
  const directions = [
    [1, 0, 0], //+x 右
    [-1, 0, 0], //-x 左
    [0, 0, 1], //+z 上
    [0, 0, -1] //-z 下
  ];
	

  const resultMap = new Map(clickableMap);;
	const clickKey = `${x}-${y}-${z}`;
	const clickTile = tiles[clickKey];
	if(true/*clickTile && clickTile.type === "clicked"*/){
		console.log("クリックしたタイルはmapから削除"+clickKey);
		resultMap.delete(clickKey);
	}
	
  for (const [dx, dy, dz] of directions) {
    const nx = x + dx;
    const ny = y + dy;
    const nz = z + dz;


    const key = `${nx}-${ny}-${nz}`;
    if (resultMap.has(key)) continue; // すでに存在してたらスキップ

    const tile = tiles[key];

    if (tile && tile.type !== "clicked") {
			//console.log(JSON.stringify(tile.type));
			//console.log(JSON.stringify(tile));
      resultMap.set(key, { position: [nx, ny, nz], tile });
    }
  }

		//console.log("clickableMap" + JSON.stringify(clickableMap));
		console.log("resultMap", Array.from(resultMap.entries()));

		

  return resultMap;
}

function getFirstAdjacentNonClickedTiles(tiles, clickableMap) {

	console.log("getFirstAdjacentNonClickedTiles");
  
  const directions = [
    [1, 0, 0], //+x 右
    [-1, 0, 0], //-x 左
    [0, 0, 1], //+z 上
    [0, 0, -1] //-z 下
  ];

  const resultMap = new Map(clickableMap);

	for (const [key, tile] of Object.entries(tiles)) {
		
  	if (tile.type === "clicked") {
		  const [x, y, z] = tile.position;

			for (const [dx, dy, dz] of directions) {
				const nx = x + dx;
				const ny = y + dy;
				const nz = z + dz;

				const key = `${nx}-${ny}-${nz}`;
				if (resultMap.has(key)) continue; // すでに存在してたらスキップ

				const tile = tiles[key];
				if (tile && tile.type !== "clicked") {
					
					resultMap.set(key, { position: [nx, ny, nz], tile });
				}
			}
		}
	}

  return resultMap;
}


export default GameScreen;
