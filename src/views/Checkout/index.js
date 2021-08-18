import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

import { apiUrl } from '../../config.js';
import { formatCurrency } from '../../utils';

const Checkout = () => {

  const { productId } = useParams();

  const [product, setProduct] = useState({});
  const [productDataLoading, setProductDataLoading] = useState(false);
  const [productDataError, setProductDataError] = useState(false);

  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountCodeApplied, setDiscountCodeApplied] = useState('');
  const [total, setTotal] = useState(0);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const [discountCode, setDiscountCode] = useState('');

  const [order, setOrder] = useState({});
  const [orderDataLoading, setOrderDataLoading] = useState(false);
  const [orderDataError, setOrderDataError] = useState(false);

  const [paymentScreen, setPaymentScreen] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState('');
  const [paymentDisabled, setPaymentDisabled] = useState(true);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const source = axios.CancelToken.source();
    const getData = async () => {
      try {
        setProductDataError(false);
        setProductDataLoading(true);
        const response = await axios({
          method: 'get',
          url: `${apiUrl}/api/v1/products/${productId}`,
          cancelToken: source.token
        });

        // console.log(response.data.data);

        setProduct(response.data.data.product);
        setSubtotal(response.data.data.product.salePrice);
        setTotal(response.data.data.product.salePrice);
        setProductDataLoading(false);
      } catch (error) {
        // console.error(error);
        setProductDataError(true);
        setProductDataLoading(false);
      }
    };

    getData();

    return () => {
      source.cancel('Cancelling in cleanup');
    }
  // eslint-disable-next-line
  }, []);

  const handleProceedPayment = async (e) => {
    e.preventDefault();

    setOrderDataLoading(true);

    const dataPayload = {
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      addressLine1: addressLine1,
      city: city,
      state: state,
      postalCode: postalCode,
      country: country,
      productId: product.id
    };

    if (addressLine2 !== '') {
      dataPayload.addressLine2 = addressLine2;
    }

    if (discountCode !== '') {
      dataPayload.discountCode = discountCode;
    }

    try {
      const response = await axios({
        method: 'POST',
        url: `${apiUrl}/api/v1/orders`,
        data: dataPayload
      });

      // console.log(response.data.data.order);

      setOrder(response.data.data.order);
      setClientSecret(response.data.data.clientSecret);
      setSubtotal(response.data.data.order.subtotal);
      setDiscount(response.data.data.order.discount);
      setDiscountCodeApplied(response.data.data.order.discountCode);
      setTotal(response.data.data.order.total);
      setOrderDataLoading(false);
      setPaymentScreen(true);
    } catch (error) {
      // console.log(error.response.data.message);
      if (error && error.response && error.response.data && error.response.data.message) {
        setOrderDataError(error.response.data.message);
      } else {
        setOrderDataError('Something went wrong');
      }
      setOrderDataLoading(false);
    }
  };

  const handlePaymentChange = async (e) => {
    setPaymentDisabled(e.empty);
    setPaymentError(e.error ? e.error.message : '');
  };

  const handleSubmitPay = async (e) => {
    e.preventDefault();
    setPaymentProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
    });

    if (payload.error) {
      setPaymentError(`Payment failed ${payload.error.message}`);
      setPaymentProcessing(false);
    } else {
      setPaymentError(null);
      setPaymentProcessing(false);
      setPaymentSucceeded(true);
    }
  };

  const handleInputDiscountCode = (e) => {
    if (e.currentTarget.value.includes(" ")) {
      e.currentTarget.value = e.currentTarget.value.replace(/\s/g, "");
    }
    setDiscountCode(e.target.value.toUpperCase());
  }

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  if (productDataLoading) {
    return (
      <div>
        <p>dataLoading</p>
      </div>
    );
  }

  if (productDataError) {
    return (
      <div>
        <p>dataError</p>
      </div>
    );
  }

  return (
    <div>

      <div className='container px-5 py-5'>

        {
          !paymentSucceeded &&
          <div className='columns is-variable is-4'>

            <div className='column is-5'>
              <div className='card is-shadowless' style={{ border: 'solid 2px black' }}>
                <div className='card-content'>

                  <div className='is-flex is-justify-content-space-between is-align-items-center'>
                    <div style={{ width: '60%' }} className='is-flex is-align-items-center'>
                      <figure className='image'>
                        <img src={product.imageFileName} alt='product' style={{ objectFit: 'contain', width: '60px', height: '60px' }}/>
                      </figure>
                      <p className='ml-3 is-size-7'>{product.name}</p>
                    </div>
                    <p>{formatCurrency(product.salePrice)}</p>
                  </div>

                  <hr className='my-3 has-text-black'/>

                  <div className='is-flex is-justify-content-space-between is-align-items-center mb-3'>
                    <p className='has-text-grey'>Subtotal</p>
                    <p>{formatCurrency(subtotal)}</p>
                  </div>

                  <div className='is-flex is-justify-content-space-between is-align-items-center mb-3'>
                    <div>
                      <p className='has-text-grey'>Discount</p>
                      {
                        discountCodeApplied &&
                        <span className='tag is-light'>{discountCodeApplied}</span>
                      }
                    </div>
                    <p>-{formatCurrency(discount)}</p>
                  </div>

                  <hr className='my-3'/>

                  <div className='is-flex is-justify-content-space-between is-align-items-center'>
                    <p className='has-text-weight-bold'>Total</p>
                    <p className='has-text-weight-bold is-size-4'>{formatCurrency(total)}</p>
                  </div>

                </div>
              </div>
            </div>

            <div className='column is-7'>
              {
                !paymentScreen &&
                <form onSubmit={handleProceedPayment}>

                  <p className='is-size-4 mb-4'>Contact information</p>
                  <div className='field'>
                    <label className='label'>Name</label>
                    <div className='control'>
                      <input
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                        className='input'
                        name='name'
                        type='text'
                      />
                    </div>
                  </div>
                  <div className='field'>
                    <label className='label'>Email</label>
                    <div className='control'>
                      <input
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                        className='input'
                        name='email'
                        type='email'
                      />
                    </div>
                  </div>
                  <div className='field'>
                    <label className='label'>Phone number</label>
                    <div className='control'>
                      <input
                        value={phoneNumber}
                        onChange={(e) => { setPhoneNumber(e.target.value) }}
                        className='input'
                        name='phone'
                        type='text'
                      />
                    </div>
                  </div>
                  
                  <p className='is-size-4 mb-4 mt-6'>Shipping address</p>
                  <div className='field'>
                    <label className='label'>Address line 1</label>
                    <div className='control'>
                      <input
                        value={addressLine1}
                        onChange={(e) => { setAddressLine1(e.target.value) }}
                        className='input'
                        name='line1'
                        type='text'
                      />
                    </div>
                  </div>
                  <div className='field'>
                    <label className='label'>Address line 2</label>
                    <div className='control'>
                      <input
                        value={addressLine2}
                        onChange={(e) => { setAddressLine2(e.target.value) }}
                        className='input'
                        name='line2'
                        type='text'
                      />
                    </div>
                  </div>
                  <div className='columns'>
                    <div className='column'>
                      <div className='field'>
                        <label className='label'>City</label>
                        <div className='control'>
                          <input
                            value={city}
                            onChange={(e) => { setCity(e.target.value) }}
                            className='input'
                            name='city'
                            type='text'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='column'>
                      <div className='field'>
                        <label className='label'>Postal code</label>
                        <div className='control'>
                          <input
                            value={postalCode}
                            onChange={(e) => { setPostalCode(e.target.value) }}
                            className='input'
                            name='postal'
                            type='text'
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='columns'>
                    <div className='column pt-0'>
                      <div className='field'>
                        <label className='label'>State</label>
                        <div className='control'>
                          <input
                            value={state}
                            onChange={(e) => { setState(e.target.value) }}
                            className='input'
                            name='state'
                            type='text'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='column pt-0'>
                      <div className='field'>
                        <label className='label'>Country</label>
                        <div className='control'>
                          <input
                            value={country}
                            onChange={(e) => { setCountry(e.target.value) }}
                            className='input'
                            name='country'
                            type='text'
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className='is-size-4 mb-4 mt-6'>Discount</p>
                  <div className='field mb-6'>
                    <label className='label'>Discount code</label>
                    <div className='control'>
                      <input
                        value={discountCode}
                        onChange={handleInputDiscountCode}
                        className='input'
                        type='text'
                      />
                    </div>
                  </div>

                  <button
                    type='submit'
                    className={`button is-dark is-medium is-fullwidth ${orderDataLoading ? 'is-loading' : ''}`}
                    disabled={orderDataLoading}
                  >
                    Proceed to payment
                  </button>
                  {
                    orderDataError !== '' &&
                    <p className='has-text-danger mt-2'>{orderDataError}</p>
                  }

                </form>
              }

              {
                paymentScreen &&
                <div>
                  <p className='is-size-4 mb-4'>Payment details</p>
                  <form onSubmit={handleSubmitPay}>
                    <div className='field'>
                      <label className='label'>Card information</label>
                      <div
                        style={{
                          borderRadius: '4px 4px 0 0',
                          padding: '12px',
                          border: '1px solid rgba(50, 50, 93, 0.1)',
                          maxHeight: '44px',
                          width: '100%',
                          background: 'white',
                          boxSizing: 'border-box'
                        }}
                      >
                        <CardElement
                          onChange={handlePaymentChange}
                          options={CARD_ELEMENT_OPTIONS}
                        />
                      </div>
                    </div>
                    
                    <button
                      className={`button is-dark is-fullwidth is-medium mt-4 ${paymentProcessing ? 'is-loading' : ''}`}
                      disabled={paymentProcessing || paymentDisabled || paymentSucceeded}
                      type='submit'
                    >
                      Pay now
                    </button>
                    {
                      paymentError &&
                      <p className='has-text-danger mt-2'>{paymentError}</p>
                    }
                    
                  </form>
                </div>
              }
            </div>

          </div>
        }

        

        {
          paymentSucceeded &&
          <div>
            <div className='has-text-centered mb-4'>
              <p>Thank you for your order.</p>
              <p>We'll let you know when your items are on their way.</p>
            </div>

            <div className='has-text-centered mb-6'>
              <p className='is-size-3 has-text-weight-bold'>Order # {order.id}</p>
            </div>

            <div className='columns mb-6'>
              <div className='column is-4'>
                <p className='is-size-4'>Contact</p>
              </div>
              <div className='column is-8'>
                <div className='block'>
                  <p className='has-text-grey'>Name</p>
                  <p>{order.name}</p>
                </div>
                <div className='block'>
                  <p className='has-text-grey'>Email</p>
                  <p>{order.email}</p>
                </div>
                <div className='block'>
                  <p className='has-text-grey'>Phone number</p>
                  <p>{order.phoneNumber}</p>
                </div>
              </div>
            </div>

            <div className='columns mb-6'>
              <div className='column is-4'>
                <p className='is-size-4'>Item</p>
              </div>
              <div className='column is-8'>
                <div>
                  <div className='is-flex is-justify-content-space-between is-align-items-center'>
                    <p>{order.productName}</p>
                    <p>{formatCurrency(order.subtotal)}</p>
                  </div>

                  <hr className='my-3'/>

                  <div className='is-flex is-justify-content-space-between is-align-items-center mb-3'>
                    <p className='has-text-grey'>Subtotal</p>
                    <p>{formatCurrency(order.subtotal)}</p>
                  </div>

                  <div className='is-flex is-justify-content-space-between is-align-items-center mb-3'>
                    <div>
                      <p className='has-text-grey'>Discount</p>
                      {
                        order.discountCode &&
                        <span className='tag is-light'>{order.discountCode}</span>
                      }
                    </div>
                    <p>-{formatCurrency(order.discount)}</p>
                  </div>

                  <hr className='my-3'/>

                  <div className='is-flex is-justify-content-space-between is-align-items-center'>
                    <p className='has-text-weight-bold'>Total</p>
                    <p className='has-text-weight-bold'>{formatCurrency(order.total)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='block columns'>
              <div className='column is-4'>
                <p className='is-size-4'>Shipping</p>
              </div>
              <div className='column is-8'>
                <p className='has-text-grey'>Shipping address</p>
                <p>{order.addressLine1}</p>
                <p>{order.addressLine2}</p>
                <p>{order.city}</p>
                <p>{order.state} {order.postalCode}</p>
                <p>{order.country}</p>
              </div>
            </div>
            
          </div>
        }
      </div>

    </div>
  );
}

export default Checkout;
