import React from "react";
import { Layer, Text, Rect } from "react-konva";

const ButtonLayerComponent = ({plusClick}) => {

  const handleButtonClick = () => {
    // history.push("/Result");
  };

  return (
    <Layer
      onMouseEnter={() => {
        document.body.style.cursor = "pointer";
      }}
      onMouseLeave={() => {
        document.body.style.cursor = "default";
      }}
    >
      <Rect
        x={330}
        y={550}
        width={150}
        height={40}
        fill={plusClick === 1 ? "orange" : "#9A9A9A"}
        cornerRadius={10}
        shadowBlur={10}
        onClick={handleButtonClick}
      />
      <Text
        x={350}
        y={563}
        text="TAP PHOTO"
        fontSize={18}
        fill="white"
        onClick={handleButtonClick}
      />
    </Layer>
  );
};

export default ButtonLayerComponent;
