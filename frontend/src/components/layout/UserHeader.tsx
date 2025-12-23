import { Link } from 'react-router-dom';
import { FaCircleUser } from "react-icons/fa6";
import wildocsai_logo from '../../assets/wildocsai_logo.svg';
import '../styles/Header.css';

export default function UserHeader()
{
    return (
        <header className="header-container">
            <Link to="/"> <img src={wildocsai_logo} alt="Wildocs AI Logo"/> </Link>
            <Link to="/" className="site-name"> 
                <h1> WILDOCS AI </h1>
                <h2> AI-Powered SDD Evaluator </h2>
            </Link>
            <div className="header-user">
                <h4> TEACHER </h4>
                <h3> John Doe </h3>
            </div>
            <FaCircleUser/>
        </header>
    );
}