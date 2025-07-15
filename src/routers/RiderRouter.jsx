import React from 'react';
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';
import Loading from '../pages/Loading/Loading';
import { useLocation } from 'react-router';

const RiderRouter = ({ children }) => {
    const { user, loading } = useAuth();
    const { role, isRoleLoading } = useUserRole();
    const location = useLocation();


    if (loading || isRoleLoading) {
        return <Loading></Loading>
    }

    if (!user || role !== 'rider') {
        return <Navigate to={`/forbiddenPage`} state={{ from: location.pathname }}></Navigate>
    }

    return children;
};

export default RiderRouter;