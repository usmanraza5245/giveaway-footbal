import React from "react";
import { Line, Group, Image as KonvaImage } from "react-konva";
import { useContext } from "react";
import { GameContext } from "../../context/Context";

const AimGroup = ({
  imageDimensions,
  startPoint,
  endPoint,
  plusSign,
  image,
  lines,
}) => {
  const { showLines } = useContext(GameContext);
  return (
    <Group
      clipFunc={(ctx) =>
        ctx.rect(0, 0, imageDimensions.width, imageDimensions.height)
      }
    >
      <KonvaImage
        image={image}
        width={imageDimensions.width}
        height={imageDimensions.height}
      />
      {showLines &&
        lines.map((line, i) => (
          <Line
            key={i}
            points={line.points}
            stroke="yellow"
            strokeWidth={1}
            lineCap="round"
            lineJoin="round"
          />
        ))}
      {startPoint && endPoint && (
        <Line
          points={[startPoint.x, startPoint.y, endPoint.x, endPoint.y]}
          stroke="yellow"
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
        />
      )}
      {plusSign && (
        <>
          <Line
            points={[plusSign.x - 15, plusSign.y, plusSign.x + 15, plusSign.y]}
            stroke="blue"
            strokeWidth={2}
            lineCap="round"
          />
          <Line
            points={[plusSign.x, plusSign.y - 15, plusSign.x, plusSign.y + 15]}
            stroke="blue"
            strokeWidth={2}
            lineCap="round"
          />
        </>
      )}
    </Group>
  );
};

export default AimGroup;
