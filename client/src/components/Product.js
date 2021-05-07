import React from "react";
import { Card } from "react-bootstrap";
import Rating from "./Rating";
import { Link } from "react-router-dom";

const Product = ({ products_data }) => {
  return (
    <Card className='my-3 p-3 rounded'>
      <Link to={`/product/${products_data._id}`}>
        <Card.Img src={products_data.image} variant='top' />
      </Link>

      <Card.Body>
        <Link to={`/product/${products_data._id}`}>
          <Card.Title as='div'>
            <strong>{products_data.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating
            value={products_data.rating}
            text={`${products_data.numReviews} 好评`}
          />
        </Card.Text>
        <Card.Text as='h3'>{products_data.price}元</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
