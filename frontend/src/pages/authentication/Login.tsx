import { useState } from 'react';
import { Link } from 'react-router-dom';
import MaroonButton from '../../components/buttons/MaroonButton.tsx';
import Footer from '../../components/layout/Footer.tsx';
import wildocsai_logo from '../../assets/wildocsai_logo.svg';
import { HiOutlineMail } from 'react-icons/hi';
import { TbLockPassword } from 'react-icons/tb';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { TbEyeClosed } from 'react-icons/tb';
import '../styles/Login.css';
import '../styles/Form.css';

export default function Login()
{
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () =>
    {
        setShowPassword((prevState) => !prevState);
    };

    return (
        <>
            <main className="login-container">
                <form className="form-container">
                    <Link to="/"> <img src={wildocsai_logo} alt="Wildocs AI Logo"/> </Link>
                    <Link to="/" className="form-header">  
                        <h2> WILDOCS AI </h2>
                        <h3> AI-Powered SDD Evaluator </h3>
                    </Link>
                    <p> Sign in to your account to continue </p>
                    {/* Email */}
                    <div className="form-label">
                        <HiOutlineMail/>
                        <label htmlFor="email"> Email </label>
                    </div>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="form-input"
                        required
                    />
                    {/* Password */}
                    <div className="form-label">
                        <TbLockPassword/>
                        <label htmlFor="password"> Password </label>
                    </div>
                    <div className="toggle-password-container">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="form-input"
                            required
                        />
                        {showPassword ?
                            (<TbEyeClosed onClick={togglePasswordVisibility} className="toggle-password-icon"/>)    
                            : 
                            (<MdOutlineRemoveRedEye onClick={togglePasswordVisibility} className="toggle-password-icon"/>)   
                        }
                    </div>
                    <div className="login-extras">
                        <input type="checkbox"/> <span> Remember me </span>
                        <Link to="/"> Forgot password? </Link>
                    </div>
                    <MaroonButton btnText={"Login"} btnType={"submit"}/>
                    <div className="login-extras-2">
                        <span> Don't have an account? </span>
                        <Link to="/register"> Sign up here </Link>
                    </div>
                </form>
            </main>
            <Footer/>
        </>
    );
}