import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { FaRegSquarePlus } from 'react-icons/fa6';
import { logout } from '../../api/AuthService';
import WhiteButton from '../buttons/WhiteButton';
import '../styles/Sidebar.css';

export default function TeacherSideBar()
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
                <Link to="/teacher/dashboard">
                    <MdOutlineSpaceDashboard/> 
                    <li> Dashboard </li> 
                </Link>
                <Link to="/teacher/dashboard">
                    <FaChalkboardTeacher/>
                    <li> View Classes </li> 
                </Link>
                <Link to="/teacher/dashboard">
                    <FaRegSquarePlus/>
                    <li> Create Class </li> 
                </Link>
            </ul>
            <WhiteButton btnText={"Logout"} btnType={"button"} clickHandler={handleLogout}/>
        </nav>
    );
}