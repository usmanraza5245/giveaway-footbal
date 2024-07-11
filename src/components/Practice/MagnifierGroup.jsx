import React from "react";
import { Layer, Line, Group, Text, Image as KonvaImage } from "react-konva";

const MagnifierGroup = ({
  imageDimensions,
  startPoint,
  endPoint,
  plusSign,
  image,
  lines,
  magnifierPosition,
}) => {
  const magnifierSize = 100;
  const magnifierScale = 2;
  const scalePoints = (points) =>
    points.map(
      (p, i) =>
        (i % 2 === 0 ? p - magnifierPosition.x : p - magnifierPosition.y) *
          magnifierScale +
        magnifierSize / 2
    );

  return (
    <>
      {!startPoint && (
        <Group
          x={magnifierPosition.x - magnifierSize / 2}
          y={magnifierPosition.y - magnifierSize / 2}
          clipFunc={(ctx) => {
            ctx.arc(
              magnifierSize / 2,
              magnifierSize / 2,
              magnifierSize / 2,
              0,
              Math.PI * 2
            );
          }}
        >
          <KonvaImage
            image={image}
            x={-magnifierPosition.x * magnifierScale + magnifierSize / 2}
            y={-magnifierPosition.y * magnifierScale + magnifierSize / 2}
            width={imageDimensions.width * magnifierScale}
            height={imageDimensions.height * magnifierScale}
          />
          {lines.map((line, i) => (
            <Line
              key={i}
              points={scalePoints(line.points)}
              stroke="yellow"
              strokeWidth={1 * magnifierScale}
              lineCap="round"
              lineJoin="round"
            />
          ))}
          {startPoint && endPoint && (
            <Line
              points={scalePoints([
                startPoint.x,
                startPoint.y,
                endPoint.x,
                endPoint.y,
              ])}
              stroke="yellow"
              strokeWidth={2 * magnifierScale}
              lineCap="round"
              lineJoin="round"
            />
          )}

          {plusSign && (
            <>
              <Line
                points={scalePoints([
                  plusSign.x - 15,
                  plusSign.y,
                  plusSign.x + 15,
                  plusSign.y,
                ])}
                stroke="blue"
                strokeWidth={2 * magnifierScale}
                lineCap="round"
              />
              <Line
                points={scalePoints([
                  plusSign.x,
                  plusSign.y - 15,
                  plusSign.x,
                  plusSign.y + 15,
                ])}
                stroke="blue"
                strokeWidth={2 * magnifierScale}
                lineCap="round"
              />
            </>
          )}
          <Text
            x={magnifierSize / 2 - 30}
            y={magnifierSize - 20}
            text={`x: ${magnifierPosition.x.toFixed(
              0
            )}, y: ${magnifierPosition.y.toFixed(0)}`}
            fontSize={10}
            fill="yellow"
          />
        </Group>
      )}
    </>
  );
};

export default MagnifierGroup;
