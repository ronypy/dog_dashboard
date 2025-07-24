import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";
const NotFound = () => {
  return (
    <div className="Main-Content">
      <h1>There is Nothing Here</h1>
      <Link className="Back-Home-Button" to="/">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
