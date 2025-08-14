import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./HomePage";
import SQL from "./SQL"; 
import AI from "./Ai";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/sql" element={<SQL />} />
        <Route path="/ai" element={<AI />} />
      </Routes>
    </Router>
  );
};

export default App;
