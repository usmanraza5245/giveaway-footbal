import React from "react";
import ButtonComponent from "./ButtonComponent";
import ZoneComponent from "./ZoneComponent";
import CoordinatesComponent from "../../UI/CordinatesComponent";
import HeadingComponent from "./HeadingComponent";
const ResultRightPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        height: "100%",
        width: "35%",
        backgroundColor: "#F0F0F0",
        textAlign: "left",
        marginLeft: "4vw",
        marginRight: "1vw",
        padding: 30,
      }}
    >
      <HeadingComponent />
      <CoordinatesComponent
        imgSrc="/greenmarker.png"
        altText="Green Marker"
        text="My coordinates"
        imgWidth="auto"
        imgHeight="auto"
      />
      <CoordinatesComponent
        imgSrc="/markerjudged.png"
        altText="Judged Marker"
        text="Judges coordinates"
        imgWidth="23px"
        imgHeight="23px"
      />
      <ZoneComponent />
      <ButtonComponent />
    </div>
  );
};

export default ResultRightPage;
