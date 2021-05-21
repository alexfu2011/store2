import React, { useEffect } from "react";
import Product from "../components/Product.js";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { listProductByCategoryId } from "../actions/productActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
const HomeScreen = ({match}) => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);

  const { loading, error, products } = productList;
  // console.log(products);

  useEffect(() => {
    dispatch(listProductByCategoryId(match.params.id));
  }, [dispatch]);

  // const products = [];
  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Row>
          {products &&
            products.map((product) => (
              <Col key={product._id} xs={6} md={6} lg={6}>
                <Product products_data={product} />
              </Col>
            ))}
        </Row>
      )}
    </>
  );
};

export default HomeScreen;
