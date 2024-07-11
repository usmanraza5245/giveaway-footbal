import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Shape, Circle, Rect } from "react-konva";
import useImage from "use-image";
import CustomKonvaImage from "../../UI/CustomKonvaImage";
import { FaQuestion } from "react-icons/fa";

const SpotBallInfo = () => {
  

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <div
        style={{
          width: 0,
          height: 0,
          borderBottom: "60px solid #CACACF",
          borderRight: "80px solid transparent",
        }}
      ></div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#CACACF",
          zindex: -1,
          height: "100px",
          width: "80px",
          borderRadius: "0 0 10px 0",
        }}
      >
        <div className="border border-black rounded-[50%] cursor-pointer">
          <FaQuestion size={20} className="m-[15px]" />
        </div>
      </div>
    </div>
  );
};

export default SpotBallInfo;
