import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { IoEnterOutline } from 'react-icons/io5';
import { logout } from '../../api/AuthService';
import WhiteButton from '../buttons/WhiteButton';
import '../styles/Sidebar.css';

export default function StudentSideBar()
{
    const navigate = useNavigate();

    const handleLogout = async() =>
    {
        try
        {
            const logoutResponse = await logout();
            console.log(logoutResponse);
            navigate('/login', { replace: true });
        }
        catch(error: any)
        {
            console.error(error.message);
            alert(error.message);
        }
    };

    return (
        <nav className="sidebar-container">
            <ul>
                <Link to="/student/dashboard">
                    <MdOutlineSpaceDashboard/> 
                    <li> Dashboard </li> 
                </Link>
                <Link to="/student/dashboard">
                    <IoDocumentTextOutline/>
                    <li> View Submissions </li> 
                </Link>
                <Link to="/student/dashboard">
                    <FaChalkboardTeacher/>
                    <li> View Classes </li> 
                </Link>
                <Link to="/student/dashboard">
                    <IoEnterOutline/>
                    <li> Join Class </li> 
                </Link>
            </ul>
            <WhiteButton btnText={"Logout"} btnType={"button"} clickHandler={handleLogout}/>
        </nav>
    );
}