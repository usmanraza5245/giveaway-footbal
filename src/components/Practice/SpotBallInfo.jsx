import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Shape, Circle, Rect } from "react-konva";
import useImage from "use-image";
import CustomKonvaImage from "../../UI/CustomKonvaImage";
import { FaQuestion } from "react-icons/fa";

const SpotBallInfo = () => {
  const stageRef = useRef(null);

  const [guideimage] = useImage("guide.png");
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  useEffect(() => {
    if (guideimage) {
      setImageDimensions({ width: 25, height: 25 });
    }
  }, [guideimage]);

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

  return (
    // <div
    //   style={{
    //     display: "flex",
    //     flexDirection: "column",
    //     alignItems: "flex-end",
    //     justifyContent: "flex-end",
    //   }}
    // >
    //   <Stage width={50} height={57}>
    //     <Layer>
    //       <Shape
    //         style={{ width: "75px" }}
    //         sceneFunc={(context, shape) => {
    //           context.moveTo(0, 100);
    //           context.lineTo(75, 100);
    //           context.lineTo(0, 0);
    //           context.closePath();
    //           context.fillStrokeShape(shape);
    //         }}
    //         fill="#CACACF"
    //       />
    //     </Layer>
    //   </Stage>
    //   <Stage x={0} width={50} height={50}>
    //     <Layer>
    //       {guideimage && (
    //         <>
    //           <Rect
    //             x={0}
    //             y={0}
    //             width={50}
    //             height={50}
    //             fill="#CACACF"
    //             cornerRadius={[0, 10, 10, 0]}
    //           />
    //           <Circle
    //             x={20}
    //             y={20}
    //             radius={18}
    //             stroke="black"
    //             strokeWidth={1}
    //             onMouseMove={(e) => handleMouseIn(e, "Info")}
    //             onMouseOut={handleMouseOut}
    //           />

    //           <CustomKonvaImage
    //             image={guideimage}
    //             width={imageDimensions.width}
    //             height={imageDimensions.height}
    //             x={8}
    //             y={8}
    //           />
    //         </>
    //       )}
    //     </Layer>
    //   </Stage>
    // </div>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <div
        style={{
          width: 0,
          height: 0,
          borderBottom: "60px solid #CACACF",
          borderRight: "80px solid transparent",
        }}
      ></div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#CACACF",
          zindex: -1,
          height: "100px",
          width: "80px",
          borderRadius: "0 0 10px 0",
        }}
      >
        <div className="border border-black rounded-[50%] cursor-pointer">
          <FaQuestion size={20} className="m-[15px]" />
        </div>
      </div>
    </div>
  );
};

export default SpotBallInfo;
