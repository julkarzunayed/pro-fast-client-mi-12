import { useEffect } from 'react';
import { useLocation } from 'react-router';


/**
 * ScrollToTop component scrolls the window to the top whenever the route changes.
 * It should be rendered inside a <Router> component.
 */
const ScrollToTop = () => {
    const { pathname } = useLocation(); // Get the current path from react-router-dom

    useEffect(() => {
        // Scroll to the top of the page when the pathname changes
        window.scrollTo(0, 0);
    }, [pathname]); // Dependency array: re-run this effect whenever 'pathname' changes

    return null; // This component doesn't render any UI
};

export default ScrollToTop;
