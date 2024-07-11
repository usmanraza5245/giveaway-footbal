import React from "react";
import Button from "./Button";

const ButtonComponent = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        marginTop: 60,
      }}
    >
      <Button
        text="Play Now"
        textColor="#FFFFFF"
        borderColor="#FFFFFF"
        backgroundColor="#FF8200"
      />
      <Button
        text="Practice Again"
        textColor="#4D4D55"
        borderColor="#4D4D55"
        backgroundColor="transparent"
      />
    </div>
  );
};

export default ButtonComponent;
