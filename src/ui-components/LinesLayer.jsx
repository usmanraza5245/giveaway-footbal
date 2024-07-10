import React from "react";
import { Layer, Line, Group, Text, Image as KonvaImage } from "react-konva";
import AimGroup from "./AimGroup";
import MagnifierGroup from "./MagnifierGroup";

const LinesLayer = ({
  magnifierPosition,
  plusSign,
  image,
  imageDimensions,
  lines,
  startPoint,
  endPoint,
}) => {
  return (
    <Layer
      onMouseEnter={() => {
        document.body.style.cursor = "crosshair";
      }}
      onMouseLeave={() => {
        document.body.style.cursor = "default";
      }}
    >
      <AimGroup
        plusSign={plusSign}
        magnifierPosition={magnifierPosition}
        image={image}
        imageDimensions={imageDimensions}
        lines={lines}
        startPoint={startPoint}
        endPoint={endPoint}
      />
      <MagnifierGroup
        plusSign={plusSign}
        magnifierPosition={magnifierPosition}
        image={image}
        imageDimensions={imageDimensions}
        lines={lines}
        startPoint={startPoint}
        endPoint={endPoint}
      />
    </Layer>
  );
};

export default LinesLayer;
