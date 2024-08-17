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
  const BASE_URL = "https://giveawayfootball.codistan.org";

  const getGameAttemptData = async (id) => {
    const url = `${BASE_URL}/api/game/getGameAttemptData?id=${encodeURIComponent(
      id
    )}`;
    try {
      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const initialPlusSigns = data.data.attempts_array
        ?.filter(
          (attempt) => attempt.coordinates && attempt.coordinates.length === 2
        )
        ?.map((attempt) => ({
          x: parseFloat(attempt?.coordinates[0]),
          y: parseFloat(attempt?.coordinates[1]),
          item_id: attempt.item_id,
          color: "blue",
        }));
      setPlusSigns(initialPlusSigns);
      return initialPlusSigns;
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

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

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [widthCanvas, setWidthCanvas] = useState(null);
  const [message, setMessage] = useState("");
  const [replay, setReplay] = useState(null);
  const { lines, setLines, showLines, tool } = useContext(GameContext);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [image] = useImage(
    "https://www.botb.com/umbraco/botb/spottheball/getcompetitionpicture/?competitionpictureguid=6ad56c28-48d6-40d5-894c-595a027cd51b&size=full&1723727413135"
  );
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [imageCoordinates, setImageCoordinates] = useState({
    width: 0,
    height: 0,
  });
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [plusSigns, setPlusSigns] = useState([]);
  const [markerId, setMarkerId] = useState(null);

  useEffect(() => {
    if (markerId) {
      getGameAttemptData(markerId);
    }
  }, [markerId]);

  useEffect(() => {
    if (image) {
      const canvasWidth = windowDimensions?.width - 80;
      const aspectRatio = image.width / image.height;
      const width = canvasWidth;
      const height = windowDimensions?.height;
      setImageCoordinates({
        width: image.width,
        height: image.height,
      });
      setImageDimensions({ width, height });
    }
  }, [image, windowDimensions?.width]);

  const handleMouseDown = async (e) => {
    const pos = e.target.getStage().getPointerPosition();
    const clampedPos = {
      x: Math.max(pos.x, 0),
      y: Math.max(pos.y, 0),
    };

    if (tool.pen) {
      setStartPoint(clampedPos);
      setEndPoint(clampedPos);
    } else {
      const newPlusSigns = [...plusSigns, { ...clampedPos, color: "blue" }];
      const image = e.target.getLayer().findOne("Image");
      let image_coordinates = {
        imageX: 0,
        imageY: 0,
      };
      if (image) {
        const { imageX, imageY } = getImageRealCoordinates(image, pos);
        image_coordinates = {
          imageX,
          imageY,
        };
      }
      setPlusSigns(newPlusSigns);
      localStorage.setItem(`x_${plusSigns.length}`, clampedPos.x);
      localStorage.setItem(`y_${plusSigns.length}`, clampedPos.y);
      window.top.postMessage(
        {
          ticketPlayed: true,
          coordinates: {
            x: clampedPos.x.toFixed(0),
            y: clampedPos.y.toFixed(0),
          },
          image_coordinates: image_coordinates,
          index: replay ? replay : newPlusSigns.length - 1,
        },
        "*"
      );
    }
  };

  const handleMouseMove = (e) => {
    let pos = e.target.getStage().getPointerPosition();

    // Assuming you're using Konva.js, get the image node from the layer
    const image = e.target.getLayer().findOne("Image");

    if (image) {
      pos = {
        ...pos,
        ...getImageRealCoordinates(image, pos),
      };
    }
    const clampedPos = {
      x: Math.max(pos.x, 0) || 0,
      y: Math.max(pos.y, 0) || 0,
      imageX: Math.max(pos.imageX, 0) || 0,
      imageY: Math.max(pos.imageY, 0) || 0,
    };

    setMagnifierPosition(clampedPos);

    if (startPoint) {
      const angle = Math.atan2(
        clampedPos.y - startPoint.y,
        clampedPos.x - startPoint.x
      );
      const newEndPoint = {
        x: startPoint.x + 500 * Math.cos(angle),
        y: startPoint.y + 500 * Math.sin(angle),
      };
      setEndPoint(newEndPoint);
    }

    setCursorPosition(clampedPos);
  };

  const getImageRealCoordinates = (image, pos) => {
    // Get the bounding box of the image on the canvas
    const imagePosition = image.getClientRect();

    // Get the scale factor of the image on the canvas
    const scaleX = image.scaleX();
    const scaleY = image.scaleY();

    // Calculate the position of the mouse relative to the image
    const relativeX = (pos.x - imagePosition.x) / scaleX;
    const relativeY = (pos.y - imagePosition.y) / scaleY;

    // Original image dimensions (4K)
    const originalImageWidth = imageCoordinates.width; // 4K width
    const originalImageHeight = imageCoordinates.height; // 4K height

    // Convert to the original 4K image coordinates
    const imageX = (relativeX / image.width()) * originalImageWidth;
    const imageY = (relativeY / image.height()) * originalImageHeight;

    return {
      imageX: imageX.toFixed(0),
      imageY: imageY.toFixed(0),
    };
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

    let xPos = x - 115;
    let yPos = y - 60;

    if (x < 80) {
      xPos = x + padding;
    } else if (x > width) {
      xPos = x - 160 - padding;
    }

    if (y < 55) {
      yPos = y + padding + 40;
    } else if (y > height) {
      yPos = y - 110 - padding;
    }

    return { x: xPos, y: yPos };
  };

  useEffect(() => {
    async function handleReplay(event) {
      console.log("event origin", event.origin);
      if (
        event.origin !== "https://dreamdrive.co.za" &&
        event.origin !== "http://localhost:5173" &&
        event.origin !== "https://hw-dream-drive-test-store.myshopify.com"
      ) {
        return;
      }
      if (event.data.idForMarkers) {
        setMarkerId(event.data.idForMarkers);
      }
      if (event.data.deletedMarker) {
        const set = await getGameAttemptData(event.data?._id);
        if (set) {
          setPlusSigns((prevSigns) =>
            prevSigns.filter(
              (item) => item.item_id !== event.data.deletedMarker
            )
          );
        }
      }

      if (event.data.replayId) {
        console.log("handle replay", event.data);
        setReplay(event.data.replayIndex);
        const set = await getGameAttemptData(event.data?._id);
        console.log("set: ------- ", set);
        if (set) {
          setPlusSigns((prevSigns) =>
            prevSigns.filter((item) => item.item_id !== event.data.replayId)
          );
          setReplay(null);
        }
      }
    }
    window.addEventListener("message", handleReplay);
    return () => {
      window.removeEventListener("message", handleReplay);
    };
  }, []);

  return (
    <div style={{ width: "100%" }}>
      {image && (
        <Stage
          width={imageDimensions?.width}
          height={imageDimensions?.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{
            cursor: "url('cursor.svg') 12 12, auto",
          }}
        >
          <Layer>
            <Group
              clipFunc={(ctx) => ctx.rect(0, 0, image?.width, image?.height)}
            >
              <KonvaImage
                image={image}
                width={image?.width}
                height={image?.height}
                scale={{
                  x: imageDimensions.width / image.width,
                  y: imageDimensions.height / image.height,
                }}
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
                    stroke="white"
                    strokeWidth={2}
                    lineCap="round"
                    shadowColor="black"
                    shadowBlur={2}
                    shadowOpacity={1}
                    shadowOffset={{ x: 0, y: 0 }}
                  />
                  <Line
                    points={[
                      plusSign.x,
                      plusSign.y - 10,
                      plusSign.x,
                      plusSign.y + 10,
                    ]}
                    stroke="white"
                    strokeWidth={2}
                    lineCap="round"
                    shadowColor="black"
                    shadowBlur={2}
                    shadowOpacity={1}
                    shadowOffset={{ x: 0, y: 0 }}
                  />
                </Group>
              ))}
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
                {/* Render lines inside the magnifier */}
                {showLines &&
                  lines.map((line, i) => (
                    <Line
                      key={i}
                      points={line.points.map((point, index) =>
                        index % 2 === 0
                          ? (point - magnifierPosition.x) * magnifierScale +
                            magnifierSize / 2
                          : (point - magnifierPosition.y) * magnifierScale +
                            magnifierSize / 2
                      )}
                      stroke="black"
                      strokeWidth={1}
                      lineCap="round"
                      lineJoin="round"
                    />
                  ))}
                {/* Render markers inside the magnifier */}
                {plusSigns.map((plusSign, index) => (
                  <Group key={index}>
                    <Line
                      points={[
                        (plusSign.x - magnifierPosition.x) * magnifierScale +
                          magnifierSize / 2 -
                          10,
                        (plusSign.y - magnifierPosition.y) * magnifierScale +
                          magnifierSize / 2,
                        (plusSign.x - magnifierPosition.x) * magnifierScale +
                          magnifierSize / 2 +
                          10,
                        (plusSign.y - magnifierPosition.y) * magnifierScale +
                          magnifierSize / 2,
                      ]}
                      stroke="white"
                      strokeWidth={2}
                      lineCap="round"
                      shadowColor="black"
                      shadowBlur={2}
                      shadowOpacity={1}
                      shadowOffset={{ x: 0, y: 0 }}
                    />
                    <Line
                      points={[
                        (plusSign.x - magnifierPosition.x) * magnifierScale +
                          magnifierSize / 2,
                        (plusSign.y - magnifierPosition.y) * magnifierScale +
                          magnifierSize / 2 -
                          10,
                        (plusSign.x - magnifierPosition.x) * magnifierScale +
                          magnifierSize / 2,
                        (plusSign.y - magnifierPosition.y) * magnifierScale +
                          magnifierSize / 2 +
                          10,
                      ]}
                      stroke="white"
                      strokeWidth={2}
                      lineCap="round"
                      shadowColor="black"
                      shadowBlur={2}
                      shadowOpacity={1}
                      shadowOffset={{ x: 0, y: 0 }}
                    />
                  </Group>
                ))}
              </Group>
            )}

            <Group
              x={cursorPosition.x - magnifierSize / 2}
              y={cursorPosition.y - magnifierSize / 2}
            >
              <Circle
                x={magnifierSize / 2}
                y={magnifierSize / 2}
                radius={magnifierSize / 2}
                stroke="#05FF00"
                strokeWidth={1}
              />
              <Line
                points={[magnifierSize / 2, -10, magnifierSize / 2, 0]}
                stroke="#05FF00"
                strokeWidth={1}
              />
              <Line
                points={[
                  magnifierSize / 2,
                  magnifierSize,
                  magnifierSize / 2,
                  magnifierSize + 10,
                ]}
                stroke="#05FF00"
                strokeWidth={1}
              />
              <Line
                points={[-10, magnifierSize / 2, 0, magnifierSize / 2]}
                stroke="#05FF00"
                strokeWidth={1}
              />
              <Line
                points={[
                  magnifierSize,
                  magnifierSize / 2,
                  magnifierSize + 10,
                  magnifierSize / 2,
                ]}
                stroke="#05FF00"
                strokeWidth={1}
              />
            </Group>

            <Text
              x={getCoordinatesPosition().x}
              y={getCoordinatesPosition().y}
              text={`x: ${Math.floor(cursorPosition.imageX) || 0}    y: ${
                Math.floor(cursorPosition.imageY) || 0
              }`}
              fontSize={16}
              fill="white"
              stroke="black"
              strokeWidth={1}
              fontStyle="bold"
            />
          </Layer>
        </Stage>
      )}
    </div>
  );
};

export default SpotBallContainer;
