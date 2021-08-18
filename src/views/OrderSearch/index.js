import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const OrderSearch = () => {

  const [orderId, setOrderId] = useState('');

  return (
    <div className='container px-5 py-5'>
      <div className='has-text-centered mb-6'>
        <p className='is-size-2'>Track order</p>
        <p className='is-size-5'>Enter order number to check your order status</p>
      </div>
      <div className='field has-addons'>
        <div className='control is-expanded'>
          <input
            placeholder='Enter order number'
            className='input is-medium'
            value={orderId}
            onChange={(e) => { setOrderId(e.target.value) }}
            type='number'
          />
        </div>
        <div className='control'>
          <Link className='button is-medium is-dark' to={`/orders/${orderId}`}>Submit</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSearch;
