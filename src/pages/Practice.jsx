import React, { useState } from "react";
import SpotBallTools from "../components/Practice/SpotBallTools";
import SpotBallInfo from "../components/Practice/SpotBallInfo";
import SpotBallContainer from "../components/Practice/SpotBallContainer";

const Page1 = () => {
  const [tool, setTool] = useState("pen");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Remove Select tag in future  */}
      <select
        value={tool}
        onChange={(e) => {
          setTool(e.target.value);
        }}
      >
        <option value="pen">Pen</option>
        <option value="plus">Plus</option>
      </select>
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
        <SpotBallContainer tool={tool} />
      </div>
    </div>
  );
};

export default Page1;
