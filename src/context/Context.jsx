import { createContext } from "react";
import { useState } from "react";
export const GameContext = createContext({});
const Context = ({ children }) => {
  const [lines, setLines] = useState([]);
  const [showLines, setShowLines] = useState(true);

  return (
    <GameContext.Provider value={{ lines, setLines, showLines, setShowLines }}>
      {children}
    </GameContext.Provider>
  );
};

export default Context;
