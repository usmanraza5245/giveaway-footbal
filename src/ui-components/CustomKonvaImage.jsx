import React from 'react';
import { Image as KonvaImage } from 'react-konva';

const CustomKonvaImage = ({ image, width, height, x = 0, y = 0 }) => {
  return (
    <KonvaImage
      image={image}
      width={width}
      height={height}
      x={x}
      y={y}
    />
  );
};

export default CustomKonvaImage;
