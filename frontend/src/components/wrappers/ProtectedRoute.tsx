import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../../api/AuthService.ts';
import type { ProtectRouteRoles, AuthenticatedUser } from '../../types.ts';

export default function ProtectedRoute({ allowedRoles }: ProtectRouteRoles)
{
    const [userDetails, setUserDetails] = useState<AuthenticatedUser | null>(null); 
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(false);

    useEffect(() =>
    {
        const verifyUser = async() =>
        {
            try
            {
                const userData = await getCurrentUser();
                setUserDetails(userData);
                setAuthError(false);
            }
            catch(error: any)
            {
                console.error(error.message);
                setAuthError(true);
            }
            finally
            {
                setLoading(false);
            }
        };

        verifyUser();

    }, []);

    if(loading)
    {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}>
                <p>Loading...</p>
            </div>
        );
    }

    if(authError || !userDetails)
    {
        return <Navigate to="/login" replace/>;
    }

    if(!allowedRoles.includes(userDetails.role))
    {
        console.warn('You do not have permission to access this page.');
    
        switch(userDetails.role)
        {
            case 'TEACHER':
                return <Navigate to="/teacher/dashboard" replace/>;

            case 'STUDENT':
                return <Navigate to="/student/dashboard" replace/>;

            // Add case for ADMIN role 
            
            default:
                return <Navigate to="/" replace/>
        }
    }

    return <Outlet context={{ userDetails }}/>;
}
