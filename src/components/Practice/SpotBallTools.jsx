import React, { useState, useRef } from "react";
import { IoMdUndo } from "react-icons/io";
import { MdClearAll } from "react-icons/md";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useContext } from "react";
import { GameContext } from "../../context/Context";

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

  const handleShowLines = () => {
    setShowLines(!showLines);
  };
  const handleUndo = () => {
    setLines(lines.slice(0, -1));
  };

  const handleClear = () => {
    setLines([]);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#CACACF",
          zindex: -1,
          height: "200px",
          width: "80px",
          borderRadius: "10px 0 0 0",
        }}
      >
        <div
          onClick={handleShowLines}
          className="border border-black rounded-[50%] mb-[10px] cursor-pointer"
        >
          {showLines ? (
            <IoEyeOff size={20} className="m-[15px]" />
          ) : (
            <IoEye size={20} className="m-[15px]" />
          )}
        </div>
        <div
          onClick={handleUndo}
          className="border border-black rounded-[50%] mb-[10px] cursor-pointer"
        >
          <IoMdUndo size={20} className="m-[15px]" />
        </div>
        <div
          onClick={handleClear}
          className="border border-black rounded-[50%] cursor-pointer"
        >
          <MdClearAll size={20} className="m-[15px]" />
        </div>
      </div>
      <div
        style={{
          width: 0,
          height: 0,
          borderBottom: "60px solid transparent",
          borderRight: "80px solid #CACACF",
          borderRadius: "0 0 0 10px",
        }}
      ></div>
    </div>
  );
};

export default SpotBallTools;
