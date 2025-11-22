import React, { useEffect } from "react";
import { create } from "zustand"; 

// 🔹 Zustand ストア（キー入力の管理）
const useControls = create((set) => ({
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false,
  setKey: (key, value) => set({ [key]: value }),
}));

// 🔹 キーのイベント登録
function KeyboardControls( api ) {
  useEffect(() => {
    const setKey = useControls.getState().setKey;

    const handleKeyDown = (e) => {
      switch (e.code) {
        case "ArrowUp": setKey("forward", true); break;
        case "ArrowDown": setKey("backward", true); break;
        case "ArrowLeft": setKey("left", true); break;
        case "ArrowRight": setKey("right", true); break;
        case "Space":
          setKey("jump", true);
          api?.applyImpulse([0, 2, 0], [0, 0, 0]); // ジャンプ
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.code) {
        case "ArrowUp": setKey("forward", false); break;
        case "ArrowDown": setKey("backward", false); break;
        case "ArrowLeft": setKey("left", false); break;
        case "ArrowRight": setKey("right", false); break;
        case "Space": setKey("jump", false); break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []); // 🔹 `api` に依存

  return null;
}

function getOrCreateUserId() {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = crypto.randomUUID(); // または uuid ライブラリ
    
    // 仮でDBに登録したUserIdを格納　いつか消す
    userId = "88bfbd90-9065-49ef-af81-68db708a4043"
    localStorage.setItem('userId', userId);
  }
  return userId;
}

export {getOrCreateUserId,useControls,KeyboardControls};
