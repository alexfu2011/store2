import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Nav } from "react-bootstrap";
import classNames from "classnames";
import { listCategories } from "../actions/categoryActions";

const SideBar = (props) => {
  const dispatch = useDispatch();

  const categoryList = useSelector((state) => state.categoryList);

  const { loading, error, categories } = categoryList;
  // console.log(products);

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);
  return (
    <div className={classNames("sidebar", { "is-open": props.isOpen })}>

      <Nav className="flex-column pt-2">
        <Nav.Link onClick={props.toggle}>返回</Nav.Link>
        <Nav.Item className="active">
          <Nav.Link href="/">
            <strong>首页</strong>
          </Nav.Link>
        </Nav.Item>

        {categories &&
          categories.map((category) => (
            <Nav.Item key={category._id}>
              <Nav.Link href={"/category/"+category._id}>
                <strong>{category.name}</strong>
              </Nav.Link>
            </Nav.Item>
          ))}
      </Nav>
    </div>
  );
}

export default SideBar;
