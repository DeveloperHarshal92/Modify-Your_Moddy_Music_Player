import React from "react";
import "./loader.scss";

const Loader = ({ fullScreen = true, message = "Loading..." }) => {
  return (
    <div className={`loader ${fullScreen ? "loader--fullscreen" : ""}`}>
      <div className="loader__equalizer">
        <span className="loader__bar loader__bar--1"></span>
        <span className="loader__bar loader__bar--2"></span>
        <span className="loader__bar loader__bar--3"></span>
        <span className="loader__bar loader__bar--4"></span>
        <span className="loader__bar loader__bar--5"></span>
      </div>
      {message && <p className="loader__message">{message}</p>}
    </div>
  );
};

export default Loader;
