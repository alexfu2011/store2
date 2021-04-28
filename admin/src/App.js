import './App.css';
import LoginPage from './auth/login';
import { Route, BrowserRouter } from 'react-router-dom'
import Home from './home/home';
import { Product } from './products/product';
import { OrderList } from './orders/orderList'
import ProductForm from './products/productForm';
import ProductEditForm from './products/productEditForm';
import VariantForm from './products/variantForm';
import { TagList } from './tag/tagList'
import SubCategoryForm from './category/subCategory/subCategoryForm'
import CategoryList from './category/categoryList';
import OrderDetails from './orders/orderDetails';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

function App() {
  return (
    <BrowserRouter>
      <Route path='/category/addSubCategory' component={SubCategoryForm} />
      <Route path='/login' component={() => <LoginPage />} />
      <Route path='/home' component={Home} />
      <Route exact path='/product' component={Product} />
      <Route exact path='/orders' component={OrderList} />
      <Route exact path='/orders/details' component={OrderDetails} />
      <Route exact path='/category' component={CategoryList} />
      <Route exact path='/product/add' component={ProductForm} />
      <Route exact path='/product/edit' component={ProductEditForm} />
      <Route exact path='/tags' component={TagList} />
      <Route path='/product/add' component={VariantForm} />
    </BrowserRouter>
  );
}

export default App;
