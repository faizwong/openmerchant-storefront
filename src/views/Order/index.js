import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

import { apiUrl } from '../../config.js';
import { formatDate } from '../../utils';

import Spinner from '../../components/Spinner';

const Order = () => {

  const { orderId } = useParams();

  const [orderIdInput, setOrderIdInput] = useState(orderId);

  const [order, setOrder] = useState({});
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState(false);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const getData = async () => {
      try {
        setDataError(false);
        setDataLoading(true);
        const response = await axios({
          method: 'get',
          url: `${apiUrl}/api/v1/orders/${orderId}`,
          cancelToken: source.token
        });

        // console.log(response.data.data.order);

        setOrder(response.data.data.order);
        setDataLoading(false);
      } catch (error) {
        // console.log(error.response.data.message);
        if (error && error.response && error.response.data && error.response.data.message) {
          setDataError(error.response.data.message);
        } else {
          setDataError('Something went wrong.');
        }
        setDataLoading(false);
      }
    };

    getData();

    return () => {
      source.cancel('Cancelling in cleanup');
    }
  // eslint-disable-next-line
  }, [orderId]);

  const getOrderStepNumber = (status) => {
    if (status === 'awaiting_payment') {
      return 0;
    } else if (status === 'preparing_for_shipment') {
      return 1;
    } else if (status === 'shipped') {
      return 2;
    } else if (status === 'canceled') {
      return 2;
    }
  };

  const getCarrierName = (value) => {
    if (value === 'citylinkexpress') {
      return 'City-Link Express';
    } else if (value === 'fmx') {
      return 'FMX';
    } else if (value === 'ninjavan-my') {
      return 'Ninja Van Malaysia'
    } else if (value === 'skynet') {
      return 'SkyNet Malaysia'
    } else if (value === 'jtexpress') {
      return 'J&T EXPRESS MALAYSIA';
    } else {
      return value;
    }
  };

  if (dataLoading) {
    return (
      <div className='container px-5 py-5'>
        <div className='field has-addons'>
          <div className='control is-expanded'>
            <input
              placeholder='Enter order number'
              className='input is-medium'
              value={orderIdInput}
              onChange={(e) => { setOrderIdInput(e.target.value) }}
              type='number'
            />
          </div>
          <div className='control'>
            <Link className='button is-medium is-dark' to={`/orders/${orderIdInput}`}>Submit</Link>
          </div>
        </div>
        <div className='has-text-centered mt-6'>
          <Spinner />
        </div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className='container px-5 py-5'>
        <div className='field has-addons'>
          <div className='control is-expanded'>
            <input
              placeholder='Enter order number'
              className='input is-medium'
              value={orderIdInput}
              onChange={(e) => { setOrderIdInput(e.target.value) }}
              type='number'
            />
          </div>
          <div className='control'>
            <Link className='button is-medium is-dark' to={`/orders/${orderIdInput}`}>Submit</Link>
          </div>
        </div>
        <p className='has-text-centered mt-6'>{dataError}</p>
      </div>
    );
  }

  return (
    <div className='container px-5 py-5'>
      <div className='field has-addons'>
        <div className='control is-expanded'>
          <input
            placeholder='Enter order number'
            className='input is-medium'
            value={orderIdInput}
            onChange={(e) => { setOrderIdInput(e.target.value) }}
            type='number'
          />
        </div>
        <div className='control'>
          <Link className='button is-medium is-dark' to={`/orders/${orderIdInput}`}>Submit</Link>
        </div>
      </div>
      <p className='has-text-centered mt-5 is-size-2 has-text-weight-bold'>Order # {order.id}</p>
      <div className='has-text-centered mt-5'>
        {
          getOrderStepNumber(order.status) >= 0 ?
          <div>
            <p className='is-size-4'>
              We have received your order.
            </p>
            <p className='has-text-grey'>{formatDate(order.orderPlacedAt)}</p>
          </div> :
          <div>
            <p className='is-size-4 has-text-grey-light'>
              We have received your order.
            </p>
          </div>
        }        
        <p className='is-size-1'>.</p>
        {
          getOrderStepNumber(order.status) >= 1 ?
          <div>
            <p className='is-size-4'>
              We are preparing your order.
            </p>
            <p className='has-text-grey'>{formatDate(order.paymentCompletedAt)}</p>
          </div> :
          <div>
            <p className='is-size-4 has-text-grey-light'>
              We are preparing your order.
            </p>
          </div>
        }
        <p className='is-size-1'>.</p>
        {
          getOrderStepNumber(order.status) < 2 &&
          <div>
            <p className='is-size-4 has-text-grey-light'>
              Your order has been shipped.
            </p>
          </div>
        }
        {
          getOrderStepNumber(order.status) >= 2 && order.status === 'shipped' &&
          <div>
            <p className='is-size-4'>
              Your order has been shipped.
            </p>
            <p className='mb-3 has-text-grey'>{formatDate(order.shippedAt)}</p>
            <p className='has-text-grey'>Carrier</p>
            {
              order.carrier ?
              <p className='mb-3'>{getCarrierName(order.carrier)}</p> :
              <p className='mb-3 has-text-grey-light'>Not available</p>
            }
            <p className='has-text-grey'>Tracking number</p>
            {
              order.trackingNumber ?
              <p className='mb-3'>{order.trackingNumber}</p> :
              <p className='mb-3 has-text-grey-light'>Not available</p>
            }
          </div>
        }
        {
          getOrderStepNumber(order.status) >= 2 && order.status === 'canceled' &&
          <div>
            <p className='is-size-4'>
              Your order has been canceled.
            </p>
            <p className='has-text-grey'>{formatDate(order.canceledAt)}</p>
          </div>
        }
      </div>
    </div>
  );
}

export default Order;
