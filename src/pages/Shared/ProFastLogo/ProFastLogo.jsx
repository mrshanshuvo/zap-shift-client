import React from 'react';
import logo from '../../../assets/logo.png';
import { Link } from 'react-router';

const ProFastLogo = () => {
  return (
    <Link to="/">
      <div className="flex items-end gap-2" aria-label="ProFast logo">
        <img
          src={logo}
          alt="ProFast logo"
          className="w-10 h-10 object-contain mb-1.5"
        />
        <span className="text-3xl -ml-5 font-extrabold leading-none">
          ProFast
        </span>
      </div>
    </Link>
  );
};

export default ProFastLogo;
