import React from "react";

const Button = ({ text, textColor, borderColor, backgroundColor }) => {
  return (
    <button
      style={{
        backgroundColor: backgroundColor,
        position: "relative",
        fontFamily: "'madera', Arial, Helvetica, sans-serif",
        display: "inline-block",
        border: `2px solid ${borderColor}`,
        textAlign: "center",
        color: textColor,
        outline: "none",
        textTransform: "uppercase",
        textDecoration: "none",
        borderRadius: "5px",
        fontSize: "16px",
        transition: "all 0.3s ease-in-out",
        lineHeight: "unset",
        cursor: "pointer",
        height: "50px",
        width: "35vw",
      }}
    >
      {text}
    </button>
  );
};

export default Button;
