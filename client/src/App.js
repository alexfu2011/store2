import React, { useState } from "react";
import SideBar from "./components/SideBar";
import Content from "./components/Content";
import "./App.css";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="App wrapper">
      <SideBar toggle={toggle} isOpen={isOpen} />
      <Content toggle={toggle} isOpen={isOpen} />
    </div>
  );
}
