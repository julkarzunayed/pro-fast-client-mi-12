import React from 'react';
import { Outlet } from 'react-router';
import ProFastLogo from '../../components/ProFastLogo/ProFastLogo';
import authImage from '../../assets/authImage.png';

const AuthLayout = () => {
    return (
        <div className="p-10">
            <ProFastLogo></ProFastLogo>
            <div className="hero-content flex-col lg:flex-row-reverse">
                <figure className='flex-1  flex items-center justify-center'>
                    <img
                        src={authImage}
                        className="max-w-sm rounded-lg w-full"
                    />
                </figure>
                <div className='flex-1 w-full flex items-center justify-center'>
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;