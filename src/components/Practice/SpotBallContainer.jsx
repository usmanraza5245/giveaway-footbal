import React, { useState, useEffect } from "react";
import { Stage } from "react-konva";
import useImage from "use-image";
import ButtonLayerComponent from "../Result/ButtonLayerComponent";
import LinesLayer from "./LinesLayer";

import { useContext } from "react";
import { GameContext } from "../../context/Context";

const SpotBallContainer = ({ tool }) => {
  const { lines, setLines } = useContext(GameContext);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  console.log("lines: ", lines);
  const [image] = useImage("test.jpg");
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [plusSign, setPlusSign] = useState(null);

  const [magnifierPosition, setMagnifierPosition] = useState({
    x: 250,
    y: 250,
  });
  useEffect(() => {
    if (image) {
      setImageDimensions({ width: 818, height: 618 });
    }
  }, [image]);

  const [plusClick, setPlusClick] = useState(0);

  console.log(plusClick);
  const handleMouseDown = (e) => {
    const pos = e.target.getStage().getPointerPosition();
    const pos2 = e.target.getStage().getPointerPosition();

    if (tool === "pen") {
      setStartPoint(pos);
      setEndPoint(pos);
    } else if (tool === "plus" && plusClick === 0) {
      setPlusSign(pos2);
      localStorage.setItem("x", pos2.x);
      localStorage.setItem("y", pos2.y);
      console.log("Plus sign coordinates:", pos2);
      setPlusClick(1);
    }
  };

  const handleMouseMove = (e) => {
    const pos = e.target.getStage().getPointerPosition();

    setMagnifierPosition(pos);

    if (startPoint) {
      const angle = Math.atan2(pos.y - startPoint.y, pos.x - startPoint.x);
      const newEndPoint = {
        x: startPoint.x + 800 * Math.cos(angle),
        y: startPoint.y + 800 * Math.sin(angle),
      };
      setEndPoint(newEndPoint);
    }
  };

  const handleMouseUp = () => {
    if (startPoint && endPoint) {
      const newLine = {
        points: [startPoint.x, startPoint.y, endPoint.x, endPoint.y],
      };
      setLines([...lines, newLine]);
    }
    setStartPoint(null);
    setEndPoint(null);
  };

  return (
    <>
      {image && (
        <Stage
          width={imageDimensions.width}
          height={imageDimensions.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{
            border: "10px solid #CACACF",
            borderRadius: "0px 10px 0px 10px",
          }}
        >
          <LinesLayer
            plusSign={plusSign}
            magnifierPosition={magnifierPosition}
            image={image}
            imageDimensions={imageDimensions}
            lines={lines}
            startPoint={startPoint}
            plusClick={plusClick}
            endPoint={endPoint}
          />
          <ButtonLayerComponent plusClick={plusClick} />
        </Stage>
      )}
    </>
  );
};

export default SpotBallContainer;
