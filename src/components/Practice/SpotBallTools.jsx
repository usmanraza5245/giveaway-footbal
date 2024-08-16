import React, { useState, useRef, useEffect } from "react";
import { useContext } from "react";
import { GameContext } from "../../context/Context";
import { MdOutlineReplay } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { FaPen } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import Switch from "../../UI/Switch";

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

  const { lines, setLines, showLines, setShowLines, tool, setTool } =
    useContext(GameContext);

  const handleShowLines = () => {
    setShowLines(!showLines);
  };
  const handleUndo = () => {
    setLines(lines.slice(0, -1));
  };

  const handleClear = () => {
    setLines([]);
  };

  const handleTool = () => {
    console.log("tool")
    setTool((prev) => ({ ...prev, pen: !prev.pen }));
  };

  const handleTest = () => {
    window.top.postMessage({ text: "hi" }, "*");
  };

  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      <div style={{ height : windowDimensions.height }} className="bg-[#F4F4F4] flex flex-col justify-start items-center z-[-1]  w-[80px] rounded-l-[10px]"> 
        <div
          onClick={handleUndo}
          className="bg-[#FF9900] border border-black rounded-[50%] mt-[30px] mb-[5px] cursor-pointer"
        >
          <MdOutlineReplay size={30} className="m-[5px] text-white" />
        </div>
        <p>Replay</p>
        <div
          onClick={handleUndo}
          className="bg-[#FE0000] border border-black rounded-[50%] mt-[30px] mb-[5px] cursor-pointer"
        >
          <RxCross2 size={30} className="m-[5px] text-white" />
        </div>
        <p>Cancel</p>

        <Switch isChecked={!tool.pen} handleToggle={handleTool}  />
        {/* <p>{tool.pen ? "Line Tool" : "Plus Tool"}</p> */}
        <p>Plus Tool</p>
      </div>
    </div>
  );
};

export default SpotBallTools;
