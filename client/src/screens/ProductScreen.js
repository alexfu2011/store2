import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating";
import { listProductDetails } from "../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
// import products from "../products";
import { Link } from "react-router-dom";
// import axios from "axios";

export default function ProductScreen({ history, match }) {
  const dispatch = useDispatch();

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`);
  };

  const [qty, setQty] = useState(1);

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  useEffect(() => {
    dispatch(listProductDetails(match.params.id));
  }, [dispatch, match]);

  // const product = products.find((p) => p._id === );
  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <div>
        <h3>{product.name}</h3>
        <Row>
          <Col md={9}>
            <Image src={"/"+product.image} alt={product.image} fluid />
          </Col>

          <Col md={3}>
            <Card>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col>价格：</Col>
                    <Col>
                      <strong>{product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>库存：</Col>
                    <Col>
                      {product.countInStock > 0 ? <p style={{ color: "green", fontWeight: "bolder" }}>有库存</p> : <span style={{ color: "red", fontWeight: "bolder" }}>断货</span>}
                    </Col>
                  </Row>
                </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  value={product.rating || 0}
                  text={` ${product.numReviews || 0} 好评`}
                />
              </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>数量：</Col>
                      <Col>
                        <Form.Control
                          as='select'
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <Button
                    onClick={addToCartHandler}
                    className='btn btn-block'
                    type='button'
                    disabled={product.countInStock === 0}
                  >
                    添加购物车
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
        <p style={{ "margin-top": "20px" }}>{product.description}</p>
        </div>
      )}
    </>
  );
}
