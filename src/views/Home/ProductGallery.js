import React from 'react';
import { useHistory } from 'react-router-dom';

import { formatCurrency } from '../../utils';

const ProductGallery = (props) => {

  const { products } = props;

  const history = useHistory();

  return (
    <div className='container px-5 py-5'>
      <div className='columns is-multiline'>
        {
          products.map((product) => (
            <div
              key={product.id}
              onClick={() => {
                history.push(`/products/${product.id}`);
              }}
              className='column is-half-tablet is-clickable p-6'
            >
              <figure className='image is-square mb-4'>
                <img src={product.imageFileName} alt='product' style={{ objectFit: 'contain' }}/>
              </figure>
              <div className='has-text-centered'>
                <p className='is-size-4 mb-1'>{product.name}</p>
                <p className='is-size-5 has-text-grey'>{formatCurrency(product.salePrice)}</p>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default ProductGallery;
