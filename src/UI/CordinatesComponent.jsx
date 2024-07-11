import React from 'react';

const CoordinatesComponent = ({ imgSrc, altText, text, imgWidth, imgHeight }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 40,
        margin: 2,
        height: "40px",
      }}
    >
      <img src={imgSrc} alt={altText} style={{ width: imgWidth, height: imgHeight }}></img>
      <h6
        style={{
          fontFamily: "sans-serif",
          fontSize: "15px",
          color: "#696971",
        }}
      >
        {text}
      </h6>
    </div>
  );
};

export default CoordinatesComponent;
