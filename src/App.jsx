import React, { useState, useEffect } from "react";
import {
  Stage,
  Layer,
  Line,
  Circle,
  Group,
  Image as KonvaImage,
} from "react-konva";
import useImage from "use-image";

const App = () => {
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [lines, setLines] = useState([]);
  const [intersection, setIntersection] = useState(null);
  const [image] = useImage("../src/assets/test.jpg");
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (image) {
      setImageDimensions({ width: 400, height: 400 });
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
    if (startPoint) {
      setEndPoint(pos);
    }
  };

  const handleMouseUp = () => {
    if (startPoint && endPoint) {
      const newLine = {
        points: [startPoint.x, startPoint.y, endPoint.x, endPoint.y],
      };
      setLines([...lines, newLine]);
      if (lines.length > 0) {
        const intersect = getIntersection(
          lines[lines.length - 1].points,
          newLine.points
        );
        if (intersect) setIntersection(intersect);
      }
    }
    setStartPoint(null);
    setEndPoint(null);
  };

  const getIntersection = (line1, line2) => {
    const [x1, y1, x2, y2] = line1;
    const [x3, y3, x4, y4] = line2;

    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denom === 0) return null; // Lines are parallel or coincident

    const intersectX =
      ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
      denom;
    const intersectY =
      ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
      denom;

    return { x: intersectX, y: intersectY };
  };

  const magnifierSize = 50;
  const magnifierScale = 8;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
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
              {lines.map((line, i) => (
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
                  points={[startPoint.x, startPoint.y, endPoint.x, endPoint.y]}
                  stroke="red"
                  strokeWidth={2}
                  lineCap="round"
                  lineJoin="round"
                  dash={[10, 5]} // Optional: Add dash style for the currently drawn line
                />
              )}
              {intersection && (
                <Circle
                  x={intersection.x}
                  y={intersection.y}
                  radius={5}
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
              </Group>
            )}
          </Layer>
        </Stage>
      )}
    </div>
  );
};

export default App;
