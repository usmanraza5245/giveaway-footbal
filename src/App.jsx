import React from "react";
import Practice from "./pages/Practice.jsx";
import Context from "./context/Context.jsx";

const App = () => {
  return (
    <Context>
      <Practice />
    </Context>
  );
};

export default App;
