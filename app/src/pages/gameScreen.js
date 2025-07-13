import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ThemeForm from '../components/Form';
import {useThemeFetcher} from '../api/themeApi'
import {joinRoom,useBoardInitFetcher} from '../api/gameApi'
import "../sass/gameScreen.sass"
import * as THREE from "three";
import { Canvas, useThree , useFrame} from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Physics, useTrimesh, useBox, Debug} from "@react-three/cannon";
import { CreateBoard, useBoardState, CreateBoard2} from '../hooks/setObject/setObject';
import {Tile} from "../components/Object/Tile"
//import { GameProvider,useGame } from '../hooks/useGame';
import { useBoardStore } from "../store/boardStore";
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
						<JoinRoomButton token="token"/>
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

	console.log("CreateBoard3");
	
	//if(!board) {return}
	
	useEffect(() => {
		console.log(reward);
	}, [reward]);

	const tile2DArray = useMemo(() => convertTilesTo2DArray(tiles), [tiles]);

	useEffect(() => {		
		if (tiles && Object.keys(tiles).length > 0) {
			sendMessageWebsocket(socket,tile2DArray);
		}
  }, [tiles]);
	
	// タイルをクリックした際にタイルの情報を更新するイベントを定義
	const handleTileClick = useCallback((userData) => {
		console.log(reward);
		const currentReward = useRewardStore.getState().reward;
		
		if (currentReward > 0) {
			updateTile(userData.position[0], userData.position[2], { type: "clicked" });

			setReward(currentReward - 1);
		} else {
			console.log("クリック回数の上限に達しました");
		}
	});

  useEffect(() => {
    if (board?.tiles) {
			// boardのtilesをpositionをもとにdictionary型に変換
      setTiles(board.tiles);
    }
  }, []);
	
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

const JoinRoomButton = ({ token}) => {
  const handleJoin = async () => {
    try {
      const result = await joinRoom(token);
      console.log('ルームに参加しました:', result.roomId);
			localStorage.setItem("roomId", result.roomId);
    } catch (err) {
			console.log("ルーム参加に失敗しました");
    }
  };

  return <button onClick={handleJoin}>ルームに参加</button>;
};


export default GameScreen;
