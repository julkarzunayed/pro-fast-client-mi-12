import React from 'react';
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';
import Loading from '../pages/Loading/Loading';
import { Navigate } from 'react-router';

const AdminRouter = ({ children }) => {
    const { user, loading } = useAuth();
    const { role, isRoleLoading } = useUserRole();
    if (loading || isRoleLoading) {
        return <Loading></Loading>
    }

    if (!user || role !== 'admin') {
        return <Navigate to={`/forbiddenPage`} ></Navigate>
    }

    return children;
};

export default AdminRouter;