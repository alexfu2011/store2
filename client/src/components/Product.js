import React from "react";
import { Image } from "react-bootstrap";
import Rating from "./Rating";
import { Link } from "react-router-dom";

const Product = ({ products_data }) => {
  return (
    <div className="my-3 p-3 rounded shadow-sm">
      <Link to={`/product/${products_data._id}`}>
        <Image src={"/" + products_data.image} fluid />
      </Link>
      <Link to={`/product/${products_data._id}`}>
        <h3>{products_data.name}</h3>
      </Link>
      {products_data.price}元
      <Rating
        value={products_data.rating || 0}
        text={` ${products_data.numReviews || 0} 好评`}
      />
    </div>
  );
};

export default Product;
