import React from 'react';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useUserRole = () => {
    const { user, isLoading: isLoadingAuth } = useAuth(); // Get user and auth loading state
    const axiosSecure = useAxiosSecure(); // Get authenticated axios instance

    const userEmail = user?.email; // Extract email from user object

    const {
        data: roleData,
        isLoading: isLoadingRole,
        isError: isErrorRole,
        error: roleError,
    } = useQuery({
        queryKey: ['userRole', userEmail], // Query key depends on user's email
        queryFn: async () => {
            if (!userEmail) {
                // If no email is available, don't make the API call
                // This scenario should ideally be handled by `enabled` option below
                throw new Error("User email not available to fetch role.");
            }
            // Make API call to your backend to get the user's role
            const response = await axiosSecure.post(`/users/role`,{ email: userEmail});
            return response.data; // Assuming your API returns { role: 'admin' }
        },
        // The query will only run if userEmail is available and not loading auth
        enabled: !!userEmail && !isLoadingAuth,
        // Keep data for a certain time even if inactive, good for roles that don't change often
        staleTime: 5 * 60 * 1000, // 5 minutes
        // Retry on failure, but only if userEmail is available
        retry: (failureCount, error) => {
            if (error.message === "User email not available to fetch role.") return false;
            return failureCount < 3; // Retry up to 3 times
        },
    });

    // Extract the role from roleData, default to 'user' or null if not found
    const role = roleData?.role;

    return {
        role : role || 'user',
        isRoleLoading: isLoadingAuth || isLoadingRole, // Overall loading state
        isRoleError: isErrorRole,
        error: roleError,
    };
};

export default useUserRole;