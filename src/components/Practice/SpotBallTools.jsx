import React, { useState, useRef } from "react";
import { useContext } from "react";
import { GameContext } from "../../context/Context";
import { MdOutlineReplay } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

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
      <div className="bg-[#F4F4F4] flex flex-col justify-start items-center z-[-1] h-[500px] w-[80px] rounded-l-[10px]">
        <div
          onClick={handleUndo}
          className="bg-[#FF9900] border border-black rounded-[50%] mt-[30px] mb-[5px] cursor-pointer"
        >
          <MdOutlineReplay size={30} className="m-[5px] text-white" />
        </div>
        <p>Replay</p>
        <div
          onClick={handleUndo}
          className="bg-[#FE0000] border border-black rounded-[50%] mt-[10px] mb-[5px] cursor-pointer"
        >
          <RxCross2 size={30} className="m-[5px] text-white" />
        </div>
        <p>Cancel</p>
      </div>
    </div>
  );
};

export default SpotBallTools;
