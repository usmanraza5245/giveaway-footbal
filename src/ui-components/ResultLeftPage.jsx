import React, { useState, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import useImage from "use-image";
import CustomKonvaImage from "./CustomKonvaImage";

const ResultLeftPage = () => {
  const [image] = useImage("test.jpg");
  const [image1] = useImage("blackArrow.png");
  const [image2] = useImage("greenArrow.png");
  const [image3] = useImage("firerings.png");
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [px, setPx] = useState(null);
  const [py, setPy] = useState(null);

  useEffect(() => {
    if (image) {
      setImageDimensions({ width: 818, height: 618 });
    }
  }, [image]);

  useEffect(() => {
    const storedPx = localStorage.getItem("x");
    const storedPy = localStorage.getItem("y");
    setPx(storedPx);
    setPy(storedPy);
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "55%",
      }}
    >
      {image1 && (
        <Stage width={imageDimensions.width} height={imageDimensions.height}>
          <Layer>
            {image && (
              <CustomKonvaImage
                image={image}
                width={imageDimensions.width}
                height={imageDimensions.height}
              />
            )}
            {image2 && (
              <CustomKonvaImage
                image={image2}
                width={imageDimensions.width}
                height={imageDimensions.height}
                x={px - 375}
                y={py - 141}
              />
            )}
            {image3 && (
              <CustomKonvaImage
                image={image3}
                width={imageDimensions.width}
                height={imageDimensions.height}
                x={30}
                y={-33}
              />
            )}
            {image1 && (
              <CustomKonvaImage
                image={image1}
                width={imageDimensions.width}
                height={imageDimensions.height}
                x={-146}
                y={60}
              />
            )}
          </Layer>
        </Stage>
      )}
    </div>
  );
};

export default ResultLeftPage;
