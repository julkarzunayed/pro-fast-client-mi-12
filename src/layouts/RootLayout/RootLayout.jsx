import React from 'react';
import { Outlet } from 'react-router';
import NavBar from '../../pages/shared/NavBar/NavBar';
import Footer from '../../pages/shared/Footer/Footer';

const RootLayout = () => {
    return (
        <div>
            <NavBar></NavBar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;