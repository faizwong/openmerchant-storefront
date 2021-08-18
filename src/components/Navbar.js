import React from 'react';
import { Link } from 'react-router-dom';

import logo from '../assets/logo-medium.png';

const Navbar = () => {
  return (
    <div className='py-4' style={{ borderBottom: 'solid 2px #222' }}>
      <div className='container px-4'>
        <div className='is-flex is-justify-content-space-between is-align-items-center'>
          <Link type='button' className='button is-white' to='/'>
            <span className='icon'>
              <i className='lni lni-restaurant' style={{ fontSize: '1.6rem' }}></i>
            </span>
          </Link>
          <img src={logo} style={{ height: '22px' }} alt='brand'/>
          <Link className='button is-white' to='/orders'>
            <span className='icon'>
              <i className='lni lni-delivery' style={{ fontSize: '2rem' }}></i>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
