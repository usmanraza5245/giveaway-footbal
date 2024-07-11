import React from "react";

const ZoneComponent = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        marginTop: "100px",
      }}
    >
      <img
        src="/nozoneicon.png"
        alt="Green Marker"
        style={{ width: "30px", height: "30px" }}
      ></img>

      <h1
        style={{
          fontFamily: "sans-serif",
          fontSize: "24px",
          color: "#696971",
        }}
      >
        NO ZONE!
      </h1>
      <p
        style={{
          fontFamily: "Roboto",
          fontSize: "15px",
        }}
      >
        Not to worry – this game needs a little practice and perseverance! Don't
        forget to use all the tools available to help and you’ll be in the zones
        before you know it!
      </p>
    </div>
  );
};

export default ZoneComponent;
