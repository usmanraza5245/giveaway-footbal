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

const App = () => {
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [lines, setLines] = useState([]);
  const [showLines, setShowLines] = useState(true);
  const [intersection, setIntersection] = useState(null);
  const [image] = useImage("../src/assets/test.jpg");
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

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
      // Line is more vertical
      if (dy > 0) {
        points.push(start.x + ((height - start.y) * dx) / dy, height);
      } else {
        points.push(start.x + ((0 - start.y) * dx) / dy, 0);
      }
    }

    return { points };
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

  const magnifierSize = 80;
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
      <div className="flex flex-col" style={{ marginRight: "20px" }}>
        <button
          style={{
            padding: "10px",
            marginBottom: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => {
            setLines(lines.slice(0, -1));
            setIntersection(null);
          }}
        >
          Undo
        </button>
        <button
          style={{
            padding: "10px",
            marginBottom: "10px",
            backgroundColor: "#008CBA",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => setShowLines(!showLines)}
        >
          {showLines ? "Hide Lines" : "Show Lines"}
        </button>
        <button
          style={{
            padding: "10px",
            marginBottom: "10px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => {
            setLines([]);
            setIntersection(null);
          }}
        >
          Clear Lines
        </button>
      </div>
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
                  dash={[10, 5]} // Optional: Add dash style for the currently drawn line
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
                  x={
                    -magnifierPosition.x * magnifierScale + magnifierSize / 2
                  }
                  y={
                    -magnifierPosition.y * magnifierScale + magnifierSize / 2
                  }
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
                      (intersection.x - magnifierPosition.x) *
                        magnifierScale +
                      magnifierSize / 2
                    }
                    y={
                      (intersection.y - magnifierPosition.y) *
                        magnifierScale +
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

export default App;
