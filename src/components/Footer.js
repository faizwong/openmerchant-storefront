import { Link } from 'react-router-dom';

import logoMedium from '../assets/logo-medium.png';
import fpx from '../assets/fpx.svg';
import visa from '../assets/visa.svg';
import mastercard from '../assets/mastercard.svg';

const Footer = () => {
  return (
    <footer className='py-6 mt-6' style={{ borderTop: 'solid 2px #222' }}>
      <div className='container px-4'>
        <div className='columns pb-6'>
          <div className='column is-4'>
            <img src={logoMedium} alt='logo' style={{ width: '150px' }}/>
            <p className='is-size-7 mt-3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lacinia sollicitudin nulla id auctor. Sed a euismod nisl, vel sodales metus.</p>
          </div>
          <div className='column is-3 is-offset-2'>
            <p className='has-text-grey'>Info</p>
            <div className='mt-3'>
              <Link className='has-text-dark' to='/'>Terms and conditions</Link>
            </div>
            <div className='mt-3'>
              <Link className='has-text-dark' to='/'>Refund policy</Link>
            </div>
            <div className='mt-3'>
              <Link className='has-text-dark' to='/'>Privacy policy</Link>
            </div>
          </div>
          <div className='column is-3'>
            <p className='has-text-grey'>Help</p>
            <div className='mt-3'>
              <Link className='has-text-dark' to='/'>Contact</Link>
            </div>
            <div className='mt-3'>
              <Link className='has-text-dark' to='/'>Track order</Link>
            </div>
            <div className='mt-3'>
              <Link className='has-text-dark' to='/'>FAQs</Link>
            </div>
          </div>
        </div>
        <div className='is-flex is-justify-content-space-between is-align-items-center'>
          <p>© 2021 Earthjoy</p>
          <div>
            <img src={fpx} alt='fpx logo'/>
            <img className='ml-2' src={visa} alt='visa logo'/>
            <img className='ml-2' src={mastercard} alt='mastercard logo'/>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
