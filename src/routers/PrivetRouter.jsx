import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router';

const PrivetRouter = ({ children }) => {
    const { user, loading } = useAuth();

    if(loading){
        return <Loader></Loader>
    }

    if (!user) {
        return <Navigate to={`/login`}></Navigate>
    }

    return children;
};

export default PrivetRouter;