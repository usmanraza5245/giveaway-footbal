import React, { useState, useEffect } from "react";
import {
  Stage,
  Layer,
  Line,
  Circle,
  Group,
  Image as KonvaImage,
  Text,
} from "react-konva";
import useImage from "use-image";
import { useContext } from "react";
import { GameContext } from "../../context/Context";
import { getIntersection } from "../../utils/practice";

const SpotBallContainer = () => {
  const {lines , setLines , showLines} = useContext(GameContext)
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [intersection, setIntersection] = useState(null);
  const [image] = useImage("test.jpg");
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (image) {
      setImageDimensions({ width: 638, height: 638 });
    }
  }, [image]);

  const handleMouseDown = (e) => {
    const pos = e.target.getStage().getPointerPosition();
    setStartPoint(pos);
    setEndPoint(pos);
  };

  const handleMouseMove = (e) => {
    const pos = e.target.getStage().getPointerPosition();
    setMagnifierPosition(pos);
    setCursorPosition(pos);
    if (startPoint) {
      setEndPoint(pos);
    }
  };

  const handleMouseUp = () => {
    if (startPoint && endPoint) {
      const fullLine = getFullLine(startPoint, endPoint);
      setLines([...lines, fullLine]);

      if (lines.length > 0) {
        const intersect = getIntersection(
          lines[lines.length - 1].points,
          fullLine.points
        );
        if (intersect) setIntersection(intersect);
      }
    }
    setStartPoint(null);
    setEndPoint(null);
  };

  const getFullLine = (start, end) => {
    const { width, height } = imageDimensions;
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    let points = [start.x, start.y];

    if (Math.abs(dx) > Math.abs(dy)) {
      // Line is more horizontal
      if (dx > 0) {
        points.push(width, start.y + ((width - start.x) * dy) / dx);
      } else {
        points.push(0, start.y + ((0 - start.x) * dy) / dx);
      }
    } else {
      if (dy > 0) {
        points.push(start.x + ((height - start.y) * dx) / dy, height);
      } else {
        points.push(start.x + ((0 - start.y) * dx) / dy, 0);
      }
    }
    return { points };
  };

  const magnifierSize = 80;
  const magnifierScale = 8;

  return (
    <div>
      {image && (
        <Stage
          width={imageDimensions.width}
          height={imageDimensions.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ border: "1px solid black" }}
        >
          <Layer>
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
                    stroke="black"
                    strokeWidth={1}
                    lineCap="round"
                    lineJoin="round"
                  />
                ))}
              {startPoint && endPoint && (
                <Line
                  points={getFullLine(startPoint, endPoint).points}
                  stroke="red"
                  strokeWidth={2}
                  lineCap="round"
                  lineJoin="round"
                  dash={[10, 5]} 
                />
              )}
              {intersection && (
                <Circle
                  x={intersection.x}
                  y={intersection.y}
                  radius={3}
                  fill="blue"
                />
              )}
            </Group>

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
                {showLines &&
                  lines.map((line, i) => (
                    <Line
                      key={i}
                      points={line.points.map(
                        (p, idx) =>
                          (p -
                            (idx % 2 === 0
                              ? magnifierPosition.x
                              : magnifierPosition.y)) *
                            magnifierScale +
                          magnifierSize / 2
                      )}
                      stroke="black"
                      strokeWidth={1}
                      lineCap="round"
                      lineJoin="round"
                    />
                  ))}
                {intersection && (
                  <Circle
                    x={
                      (intersection.x - magnifierPosition.x) * magnifierScale +
                      magnifierSize / 2
                    }
                    y={
                      (intersection.y - magnifierPosition.y) * magnifierScale +
                      magnifierSize / 2
                    }
                    radius={3 * magnifierScale}
                    fill="blue"
                  />
                )}
              </Group>
            )}
            
            <Text
              x={cursorPosition.x - 40}
              y={cursorPosition.y + 45}
              text={`x: ${Math.floor(cursorPosition.x)}, y: ${Math.floor(
                cursorPosition.y
              )}`}
              fontSize={14}
              fill="white"
            />
          </Layer>
        </Stage>
      )}
    </div>
  );
};

export default SpotBallContainer;
