import React, { useState, useEffect } from "react";
import ResultRightPage from "../UI/ResultRightPage";
import ResultLeftPage from "../components/Result/ResultLeftPage";

const Result = () => {
  // Mobile Responsiveness
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1268);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "flex-start",
        cursor: "default",
      }}
    >
      <ResultLeftPage />
      <ResultRightPage />
    </div>
  );
};

export default Result;
