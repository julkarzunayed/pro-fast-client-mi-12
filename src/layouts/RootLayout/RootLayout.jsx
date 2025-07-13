import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import NavBar from '../../pages/shared/NavBar/NavBar';
import Footer from '../../pages/shared/Footer/Footer';

const RootLayout = () => {
    const { pathname } = useLocation(); // Get the current path from react-router-dom

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    useEffect(() => {
        // Scroll to the top of the page when the pathname changes
        window.scrollTo(0, 0);
    }, [pathname]);
    return (
        <div>
            <NavBar></NavBar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;