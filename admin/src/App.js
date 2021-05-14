import './App.css';
import LoginPage from './auth/login';
import { Route, BrowserRouter } from 'react-router-dom'
import Home from './home/home';
import { Product } from './products/product';
import { OrderList } from './orders/orderList'
import { useEffect } from 'react';
import CategoryList from './category/categoryList';
import OrderDetails from './orders/orderDetails';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

function App() {
  return (
      <BrowserRouter>
        <Route path='/login' component={() => <LoginPage />} />
        <Route path='/home' component={Home} />
        <Route exact path='/product' component={Product} />
        <Route exact path='/orders' component={OrderList} />
        <Route exact path='/orders/details' component={OrderDetails} />
        <Route exact path='/category' component={CategoryList} />
      </BrowserRouter>
  );
}

export default App;
