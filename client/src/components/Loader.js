import React from "react";
import { Spinner } from "react-bootstrap";

const Loader = () => {
  return (
    <Spinner style={{
      display: "block", marginLeft: "auto",
      marginRight: "auto", height: "50px", width: "50px"
  }} animation="border" variant="primary" />
  );
};

export default Loader;
