import { useEffect } from "react";
import { create } from "zustand";

const useKeyboardStore = create((set) => ({
  keys: {},
  setKey: (key, value) => set((state) => ({ keys: { ...state.keys, [key]: value } })),
}));

function KeyboardListener() {
  const setKey = useKeyboardStore((state) => state.setKey);

  useEffect(() => {
    const handleKeyDown = (e) => setKey(e.code, true);
    const handleKeyUp = (e) => setKey(e.code, false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [setKey]);

  return null; // JSX を返さず、ただのイベントリスナー
}

const useStore = create((set) => ({
  objects: [], // 配置されたオブジェクトを格納
  addObject: (position) =>
    set((state) => ({
      objects: [...state.objects, { id: Date.now(), position }],
    })),
}));



export {KeyboardListener,useKeyboardStore,useStore};
