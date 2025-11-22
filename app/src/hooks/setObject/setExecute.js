import React from "react";
import { usePlane } from "@react-three/cannon";
import { Canvas, useFrame } from "@react-three/fiber";
//import setObject from './setObject'
import {KeyboardListener,useKeyboardStore,useStore} from '../clickEvent/clickEvent.js'
import { useEffect } from "react";
//import { useStore } from "../hooks/useStore"; // オブジェクト管理用の Zustand ストア



// 🔹 クリックイベントを処理
export default function Scene() {

	const keys = useKeyboardStore((state) => state.keys) || {}; // 🔹 `keys` が `null` の場合に `{}` を返す
	const addObject = useStore((state) => state.addObject);
  const objects = useStore((state) => state.objects); // 配置されたオブジェクトのリスト

	useEffect(() => {
    if (keys.KeyA) {
      console.log("Aキーが押された！");
      const newPosition = [Math.random() * 5, 0.5, Math.random() * 5]; // ランダムな位置
      addObject(newPosition);
    }
  }, [keys]); // `KeyA` の変更を監視

  return (
    <>
      {objects.map((obj) => (
        <mesh key={obj.id} position={obj.position}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      ))}
    </>
  );
}