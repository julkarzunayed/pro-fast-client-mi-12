import React from 'react';
import logo from '../../assets/logo.png'
const ProFastLogo = () => {
    return (
        <div className='flex items-end'>
            <img src={logo} alt="" />
            <p className="text-3xl font-extrabold -mb-1 -ml-2.5">ProFast</p>
        </div>
    );
};

export default ProFastLogo;