import { createContext } from "react";
import { useState } from "react";
export const GameContext = createContext({});
const Context = ({ children }) => {
  const [lines, setLines] = useState([]);
  const [showLines, setShowLines] = useState(true);
  const [tool, setTool] = useState({pen : false});

  return (
    <GameContext.Provider
      value={{ lines, setLines, showLines, setShowLines, tool, setTool }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default Context;
