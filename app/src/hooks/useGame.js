import { createContext, useContext } from "react";
import { useGameLogic } from "./useGameLogic";

const GameContext = createContext();

export function useGame() {
  return useContext(GameContext);
}

export function GameProvider({ children }) {
  const gameState = useGameLogic(); // ここで useGameLogic を使う！

  return (
    <GameContext.Provider value={gameState}>
      {children}
    </GameContext.Provider>
  );
}
