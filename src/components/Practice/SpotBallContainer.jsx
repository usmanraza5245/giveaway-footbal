import React, { useState, useEffect, useContext } from "react";
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
import { GameContext } from "../../context/Context";

const SpotBallContainer = () => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [widthCanvas, setWidthCanvas] = useState(null);
  const [message, setMessage] = useState("");
  const [replay, setReplay] = useState("");
  const { lines, setLines, showLines, tool } = useContext(GameContext);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [image] = useImage("Test Image 1.png");
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [plusSigns, setPlusSigns] = useState([]);
  
 

  useEffect(() => {
    if (image ) {
      const canvasWidth = windowDimensions?.width * 0.8 ; // Set the desired canvas width here
      const aspectRatio = image.width / image.height;
      const width = canvasWidth;
      const height = windowDimensions?.height * 0.95;

      setImageDimensions({ width, height });
    }
  }, [image , windowDimensions?.width, windowDimensions?.height]);

  const handleMouseDown = (e) => {
    const pos = e.target.getStage().getPointerPosition();
    if (tool.pen) {
      setStartPoint(pos);
      setEndPoint(pos);
    } else {
      const newPlusSigns = [...plusSigns, { ...pos, color: "blue" }];
      setPlusSigns(newPlusSigns);
      localStorage.setItem(`x_${plusSigns.length}`, pos.x);
      localStorage.setItem(`y_${plusSigns.length}`, pos.y);
      window.top.postMessage(
        {
          ticketPlayed: true,
          coordinates: { x: pos.x.toFixed(0), y: pos.y.toFixed(0) },
          index: replay  ? replay : newPlusSigns.length - 1, // Send the index of the new plus sign
        },
        "*"
      );
    }
  };

  const handleMouseMove = (e) => {
    const pos = e.target.getStage().getPointerPosition();
    setMagnifierPosition(pos);

    if (startPoint) {
      const angle = Math.atan2(pos.y - startPoint.y, pos.x - startPoint.x);
      const newEndPoint = {
        x: startPoint.x + 500 * Math.cos(angle),
        y: startPoint.y + 500 * Math.sin(angle),
      };
      setEndPoint(newEndPoint);
    }
    setCursorPosition(pos);
  };

  const handleMouseUp = () => {
    if (startPoint && endPoint) {
      const fullLine = getFullLine(startPoint, endPoint);
      setLines([...lines, fullLine]);
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
  const magnifierScale = 5;

  const getCoordinatesPosition = () => {
    const padding = 10;
    const { x, y } = cursorPosition;
    const { width, height } = imageDimensions;

    let xPos = x - 80; // Default position to the left
    let yPos = y - 55; // Default position above

    // Adjust position based on cursor position
    if (x < 80) {
      xPos = x + padding; // Move to the right if near left edge
    } else if (x > width) {
      xPos = x - 160 - padding; // Move to the left if near right edge
    }

    if (y < 55) {
      yPos = y + padding + 40; // Move below if near top edge
    } else if (y > height) {
      yPos = y - 110 - padding; // Move above if near bottom edge
    }

    return { x: xPos, y: yPos };
  };

  useEffect(() => {
    function handleMessage(event) {
      if (
        event.origin !== "https://hw-dream-drive-test-store.myshopify.com" &&
        event.origin !== "http://localhost:5173"
      ) {
        return;
      }
      setMessage(event.data);

      // Update the color of the plus sign at the given index
      if (event.data.index !== undefined) {
        if (event.data.index === -1) {
          setPlusSigns((prevSigns) =>
            prevSigns.map((sign) => ({ ...sign, color: "blue" }))
          );
        } else {
          setPlusSigns((prevSigns) =>
            prevSigns.map((sign, idx) =>
              idx === event.data.index
                ? { ...sign, color: "green" }
                : { ...sign, color: "blue" }
            )
          );
        }
      }
    }
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    function handleReplay(event) {
      if (
        event.origin !== "https://hw-dream-drive-test-store.myshopify.com" &&
        event.origin !== "http://localhost:5173"
      ) {
        return;
      }
      
      if(event.data.replay) {
        setReplay(event.data.replay);
      }

      console.log('event.data.replay: ', event.data.replay);

      // Remove the plus sign at the replay index
      if (event.data.replay !== undefined) {
        setPlusSigns((prevSigns) =>
          prevSigns.filter((_, index) => index !== event.data.replay)
        );
      }
    }
    window.addEventListener("message", handleReplay);
    return () => {
      window.removeEventListener("message", handleReplay);
    };
  }, []);

  return (
    <div>
      <div>
        {image && (
          <Stage
            width={imageDimensions.width}
            height={imageDimensions.height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
              cursor: "crosshair",
            }}
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
                {plusSigns.map((plusSign, index) => (
                  <Group key={index}>
                    <Line
                      points={[
                        plusSign.x - 10,
                        plusSign.y,
                        plusSign.x + 10,
                        plusSign.y,
                      ]}
                      stroke={plusSign.color}
                      strokeWidth={2}
                      lineCap="round"
                    />
                    <Line
                      points={[
                        plusSign.x,
                        plusSign.y - 10,
                        plusSign.x,
                        plusSign.y + 10,
                      ]}
                      stroke={plusSign.color}
                      strokeWidth={2}
                      lineCap="round"
                    />
                  </Group>
                ))}
              </Group>

              {/* Magnifier Group */}
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
                </Group>
              )}
              {/* Overlay Group for drawing plus icons and lines without scaling */}
              <Group>
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
                {plusSigns.map((plusSign, index) => (
                  <Group key={index}>
                    <Line
                      points={[
                        plusSign.x - 10,
                        plusSign.y,
                        plusSign.x + 10,
                        plusSign.y,
                      ]}
                      stroke={plusSign.color}
                      strokeWidth={2}
                      lineCap="round"
                    />
                    <Line
                      points={[
                        plusSign.x,
                        plusSign.y - 10,
                        plusSign.x,
                        plusSign.y + 10,
                      ]}
                      stroke={plusSign.color}
                      strokeWidth={2}
                      lineCap="round"
                    />
                  </Group>
                ))}
              </Group>
              {/* Group to hold circle and line marks */}
              <Group
                x={cursorPosition.x - magnifierSize / 2}
                y={cursorPosition.y - magnifierSize / 2}
              >
                <Circle
                  x={magnifierSize / 2}
                  y={magnifierSize / 2}
                  radius={magnifierSize / 2}
                  stroke="white"
                  strokeWidth={1}
                />
                {/* Add marks on top, bottom, left, and right */}
                <Line
                  points={[magnifierSize / 2, -10, magnifierSize / 2, 0]}
                  stroke="white"
                  strokeWidth={1}
                />
                <Line
                  points={[
                    magnifierSize / 2,
                    magnifierSize,
                    magnifierSize / 2,
                    magnifierSize + 10,
                  ]}
                  stroke="white"
                  strokeWidth={1}
                />
                <Line
                  points={[-10, magnifierSize / 2, 0, magnifierSize / 2]}
                  stroke="white"
                  strokeWidth={1}
                />
                <Line
                  points={[
                    magnifierSize,
                    magnifierSize / 2,
                    magnifierSize + 10,
                    magnifierSize / 2,
                  ]}
                  stroke="white"
                  strokeWidth={1}
                />
              </Group>

              <Text
                x={getCoordinatesPosition().x}
                y={getCoordinatesPosition().y}
                text={`x: ${Math.floor(cursorPosition.x)}, y: ${Math.floor(
                  cursorPosition.y
                )}`}
                fontSize={14}
                fill="white"
                fontFamily="Sitara"
              />
            </Layer>
          </Stage>
        )}
      </div>
    </div>
  );
};

export default SpotBallContainer;
