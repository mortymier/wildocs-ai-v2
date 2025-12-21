import { Link } from 'react-router-dom';
import wildocsai_logo from '../../assets/wildocsai_logo.svg';
import '../styles/Header.css';
import '../styles/Buttons.css';

export default function Header()
{
    return (
        <header className="header-container">
            <Link to="/"> <img src={wildocsai_logo} alt="Wildocs AI Logo"/> </Link>
            <Link to="/" className="site-name"> 
                <h1> WILDOCS AI </h1>
                <h2> AI-Powered SDD Evaluator </h2>
            </Link>
            <div className="header-buttons">
                <Link to="/login" className="btn-white"> Login </Link>
                <Link to="/register" className="btn-maroon"> Register </Link>
            </div>
        </header>
    );
}