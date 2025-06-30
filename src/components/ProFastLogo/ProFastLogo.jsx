import React from 'react';
import logo from '../../assets/logo.png'
import { Link } from 'react-router';
const ProFastLogo = () => {
    return (
        <Link to={`/`}>
            <div className='flex items-end max-w-fit'>
                <img src={logo} alt="" />
                <p className="text-3xl font-extrabold -mb-1 -ml-2.5">ProFast</p>
            </div>
        </Link>
    );
};

export default ProFastLogo;