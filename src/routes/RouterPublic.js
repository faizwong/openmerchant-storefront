import React, { Fragment } from 'react';
import {
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import Checkout from '../views/Checkout';
import Home from '../views/Home';
import Order from '../views/Order';
import OrderSearch from '../views/OrderSearch';
import Product from '../views/Product';

import Navbar from '../components/Navbar.js';
import Footer from '../components/Footer.js';

const promise = loadStripe('pk_test_51IuWCUH46z9A87jlVfvuw73j7jiQcbz9LyTY7XuzAlV3Kk6BZKsMzJ3ozyeXAQzlJZP92oZtlAK4EpB3k2QCHCl900wvi3knV5');

const RouterPublic = () => {
  return (
    <Fragment>
      <Navbar />
      <div style={{ minHeight: '600px' }}>
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route exact path='/products/:productId'>
            <Product />
          </Route>
          <Route exact path='/orders'>
            <OrderSearch />
          </Route>
          <Route exact path='/orders/:orderId'>
            <Order />
          </Route>
          <Route exact path='/checkout/:productId'>
            <Elements stripe={promise}>
              <Checkout />
            </Elements>
          </Route>
          <Redirect to='/' />
        </Switch>
      </div>
      
      <Footer />
    </Fragment>
  );
}

export default RouterPublic;
