import React, { useEffect } from "react";
import Product from "../components/Product.js";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { listBanners } from "../actions/bannerActions";
import { listProducts } from "../actions/productActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Carousel from "../components/Carousel";

const HomeScreen = () => {
  const dispatch = useDispatch();

  const bannerList = useSelector((state) => state.bannerList);
  const productList = useSelector((state) => state.productList);

  const { banners } = bannerList;
  const { loading, error, products } = productList;
  // console.log(products);

  useEffect(() => {
    dispatch(listBanners());
    dispatch(listProducts());
  }, [dispatch]);

  // const products = [];
  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Carousel>
            {products &&
              products.map((product) => (
                <img src={"/"+product.image} alt="" />
              ))}
          </Carousel>
          <Row>
            {products &&
              products.map((product) => (
                <Col key={product._id} xs={6} md={6} lg={12}>
                  <Product products_data={product} />
                </Col>
              ))}
          </Row>
        </>
      )}
    </>
  );
};

export default HomeScreen;
