import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuthStatus, getCurrentUser } from '../../api/AuthService';
import type { AuthenticatedUser } from '../../types';
export default function PublicRoute()
{
    const [userDetails, setUserDetails] = useState<AuthenticatedUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() =>
    {
        const checkAuthentication = async() =>
        {
            try
            {
                const checkResponse = await getAuthStatus();
                
                if(checkResponse === 'Authenticated')
                {
                    const userData = await getCurrentUser();
                    setUserDetails(userData);
                }
            }
            catch(error: any)
            {
                console.error(error.message);
            }
            finally
            {
                setLoading(false);
            }
        };

        checkAuthentication();

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

    if(userDetails)
    {
        console.warn('Cannot access public page. Please log out first');

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

    return <Outlet/>;
}