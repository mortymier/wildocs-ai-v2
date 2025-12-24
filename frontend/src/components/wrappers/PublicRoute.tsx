import { Navigate, Outlet } from 'react-router-dom';

export default function PublicRoute()
{
    const storedUser = localStorage.getItem('authenticatedUser');

    if(storedUser)
    {
        const userDetails = JSON.parse(storedUser);
        
        console.warn('Cannot access public route. Please log out first');

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