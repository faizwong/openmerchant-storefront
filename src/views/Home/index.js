import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { apiUrl } from '../../config.js';

import ProductGallery from './ProductGallery';
import Spinner from '../../components/Spinner';

const Home = () => {

  const [products, setProducts] = useState([]);
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
          url: `${apiUrl}/api/v1/products`,
          cancelToken: source.token
        });

        // console.log(response.data.data);

        setProducts(response.data.data.products);
        setDataLoading(false);
      } catch (error) {
        // console.error(error);
        setDataError(true);
        setDataLoading(false);
      }
    };


    getData();

    return () => {
      source.cancel('Cancelling in cleanup');
    }
  // eslint-disable-next-line
  }, []);

  if (dataLoading) {
    return (
      <div
        style={{ height: '600px' }}
        className='is-flex is-justify-content-center is-align-items-center'
      >
        <Spinner />
      </div>
    );
  }

  if (dataError) {
    return (
      <div>
        <p>dataError</p>
      </div>
    );
  }

  return (
    <div>
      <ProductGallery products={products}/>
    </div>
  );
}

export default Home;
