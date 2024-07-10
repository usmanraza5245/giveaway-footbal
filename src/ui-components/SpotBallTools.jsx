import React, { useState, useRef } from "react";
import { Stage, Layer, Text, Shape, Circle, Rect } from "react-konva";

import { FaPen } from "react-icons/fa";
import { IoMdUndo } from "react-icons/io";
import { MdClearAll } from "react-icons/md";

import { useContext } from "react";
import { GameContext } from "../context/Context";

const SpotBallTools = () => {
  const stageRef = useRef(null);
  const [tooltip, setTooltip] = useState({
    text: "",
    visible: false,
    x: 0,
    y: 0,
  });

  const handleMouseIn = (e, text) => {
    const stage = stageRef.current.getStage();
    const mousePos = stage.getPointerPosition();
    setTooltip({
      text,
      visible: true,
      x: mousePos.x + 5,
      y: mousePos.y + 5,
    });
  };

  const handleMouseOut = () => {
    setTooltip({
      ...tooltip,
      visible: false,
    });
  };

  const { lines, setLines, showLines, setShowLines } = useContext(GameContext);

  const handleShowLines = () => {setShowLines(!showLines)};
  const handleUndo = () => {
    setLines(lines.slice(0, -1));
  };

  const handleClear = () => {
    setLines([]);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <div>
        <div
          onClick={handleShowLines}
          className="border border-black rounded-[50%] mb-[10px]"
        >
          <FaPen size={20} className="m-[15px]" />
        </div>
        <div
          onClick={handleUndo}
          className="border border-black rounded-[50%] mb-[10px]"
        >
          <IoMdUndo size={20} className="m-[15px]" />
        </div>
        <div
          onClick={handleClear}
          className="border border-black rounded-[50%]"
        >
          <MdClearAll size={20} className="m-[15px]" />
        </div>
      </div>
    </div>
  );
};

export default SpotBallTools;
