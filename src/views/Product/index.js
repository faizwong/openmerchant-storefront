import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { unified } from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';

import { apiUrl } from '../../config.js';
import { formatCurrency } from '../../utils';

import Spinner from '../../components/Spinner';

const Product = () => {

  const { productId } = useParams();

  const [product, setProduct] = useState({});
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryImageSelectIndex, setGalleryImageSelectIndex] = useState(0);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState(false);

  const [imageModal, setImageModal] = useState(false);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const getData = async () => {
      try {
        setDataError(false);
        setDataLoading(true);
        const response = await axios({
          method: 'get',
          url: `${apiUrl}/api/v1/products/${productId}`,
          cancelToken: source.token
        });

        // console.log(response.data.data);

        const tempGalleryImages = [];
        tempGalleryImages.push(response.data.data.product.imageFileName);
        for (let i = 0; i < response.data.data.product.GalleryImages.length; i++) {
          tempGalleryImages.push(response.data.data.product.GalleryImages[i].imageFileName);
        }

        setProduct(response.data.data.product);
        setGalleryImages(tempGalleryImages);
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

  const handleOpenImageModal = () => {
    setImageModal(true);
  };

  const handleCloseImageModal = () => {
    setImageModal(false);
  };

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
    <div className='container px-5 py-5'>
      <div className='columns'>
        <div className='column'>
          <figure className='image is-square mb-4 is-clickable' onClick={handleOpenImageModal}>
            <img src={galleryImages[galleryImageSelectIndex]} alt='product' style={{ objectFit: 'contain' }}/>
          </figure>
          <div className='columns is-multiline is-mobile is-variable is-2'>

            {
              galleryImages.map((item, index) => (
                <div
                  key={item}
                  className='column is-one-fifth is-clickable'
                  onClick={() => { setGalleryImageSelectIndex(index) }}
                >
                  <figure className='image is-square'>
                    <img
                      src={item}
                      alt='product'
                      style={{
                        objectFit: 'contain',
                        border: galleryImageSelectIndex === index ? 'solid 2px black' : ''
                      }}
                    />
                  </figure>
                </div>
              ))
            }

          </div>
        </div>
        <div className='column'>
          <p className='is-size-1'>{product.name}</p>
          <p className='is-size-5 has-text-grey mb-6'>{product.shortDescription}</p>
          <p className='is-size-4 mb-6'>{formatCurrency(product.salePrice)}</p>
          <Link
            to={`/checkout/${product.id}`}
            className='button is-dark is-medium is-fullwidth'
          >
            Buy now
          </Link>
        </div>
      </div>

      <div className='content is-medium mt-6'>
        {
          unified()
            .use(parse)
            .use(remark2react)
            .processSync(product.longDescription).result
        }
      </div>

      <div className={`modal ${ imageModal ? 'is-active' : '' }`}>
        <div className='modal-background'></div>
        <div className='modal-content'>
          <figure className='image'>
            <img src={galleryImages[galleryImageSelectIndex]} alt='product' />
          </figure>
        </div>
        <button className='modal-close is-large' onClick={handleCloseImageModal}></button>
      </div>

    </div>
  );
}

export default Product;
