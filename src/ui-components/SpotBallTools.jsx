import React, { useState, useRef } from "react";
import { Stage, Layer, Text, Shape, Circle, Rect } from "react-konva";

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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Stage width={75} height={230} ref={stageRef}>
        <Layer>
          <Rect
            x={0}
            y={0}
            width={75}
            height={230}
            fill="#CACACF"
            cornerRadius={[10, 0, 0, 5]}
          />
        </Layer>
        <Layer>
          {[35, 75, 115, 155, 195].map((y, i) => (
            <Circle
              key={i}
              x={35}
              y={y}
              radius={18}
              stroke="black"
              strokeWidth={1}
              onMouseMove={(e) => handleMouseIn(e, "Draw Lines")}
              onMouseOut={handleMouseOut}
            />
          ))}
        </Layer>
        <Layer>
          {tooltip.visible && (
            <>
              <Rect
                x={tooltip.x - 35}
                y={tooltip.y + 10}
                width={tooltip.text.length * 6}
                height={20}
                fill="white"
                shadowBlur={2}
                cornerRadius={4}
              />
              <Text
                text={tooltip.text}
                x={tooltip.x - 35}
                y={tooltip.y + 10}
                fontFamily="Calibri"
                fontSize={12}
                padding={5}
                fill="black"
              />
            </>
          )}
        </Layer>
      </Stage>
      <Stage width={75} height={250}>
        <Layer>
          <Shape
            style={{ width: "75px" }}
            sceneFunc={(context, shape) => {
              context.moveTo(2, 0);
              context.lineTo(75, 0);
              context.lineTo(90, 100);
              context.closePath();
              context.fillStrokeShape(shape);
            }}
            fill="#CACACF"
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default SpotBallTools;
