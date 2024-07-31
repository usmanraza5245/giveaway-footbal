import React, { useState } from "react";
import SpotBallTools from "../components/Practice/SpotBallTools";
import SpotBallInfo from "../components/Practice/SpotBallInfo";
import SpotBallContainer from "../components/Practice/SpotBallContainer";

const Page1 = () => {
 

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
     
      <div
        style={{
          marginTop: "5vh",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          height: "85vh",
          maxHeight: "638px",
          minHeight: "638px",
        }}
      >
        <SpotBallTools />
        <SpotBallContainer />
      </div>
    </div>
  );
};

export default Page1;
