import React, { useRef, useState } from "react";
import { Stage, Layer, Shape, Circle, Rect } from "react-konva";
const SpotBallInfo = () => {
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "flex-end",
      }}
    >
      <Stage width={50} height={57}>
        <Layer>
          <Shape
            style={{ width: "75px" }}
            sceneFunc={(context, shape) => {
              context.moveTo(0, 100);
              context.lineTo(75, 100);
              context.lineTo(0, 0);
              context.closePath();
              context.fillStrokeShape(shape);
            }}
            fill="#CACACF"
          />
        </Layer>
      </Stage>
      <Stage x={0} width={50} height={50}>
        <Layer>
          <Rect
            x={0}
            y={0}
            width={50}
            height={50}
            fill="#CACACF"
            cornerRadius={[0, 10, 10, 0]}
          />
          <Circle
            x={20}
            y={20}
            radius={18}
            stroke="black"
            strokeWidth={1}
            onMouseMove={(e) => handleMouseIn(e, "Info")}
            onMouseOut={handleMouseOut}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default SpotBallInfo;
