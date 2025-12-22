import { useState } from 'react';
import { Link } from 'react-router-dom';
import GoldButton from '../../components/buttons/GoldButton.tsx';
import MaroonButton from '../../components/buttons/MaroonButton.tsx';
import Footer from '../../components/layout/Footer.tsx';
import wildocsai_logo from '../../assets/wildocsai_logo.svg';
import { HiOutlineUser } from 'react-icons/hi2';
import { HiOutlineMail } from 'react-icons/hi';
import { LuIdCard } from 'react-icons/lu';
import { TbLockPassword } from 'react-icons/tb';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { TbEyeClosed } from 'react-icons/tb';
import '../styles/Register.css';
import '../styles/Form.css';

export default function Register()
{
    const [showPassword, setShowPassword] = useState(false);
    
    const togglePasswordVisibility = () =>
    {
        setShowPassword((prevState) => !prevState);
    };

    return (
        <>
            <main className="register-container">
                <form className="form-container">
                    <Link to="/"> <img src={wildocsai_logo} alt="Wildocs AI Logo"/> </Link>
                    <Link to="/" className="form-header">  
                        <h2> WILDOCS AI </h2>
                        <h3> AI-Powered SDD Evaluator </h3>
                    </Link>
                    <p> Sign up to Wildocs AI to get started </p>

                    {/* Role */}
                    <div className="form-label">
                        <HiOutlineUser/>
                        <label htmlFor="role"> Role </label>
                    </div>
                    <select
                        id="role"
                        name="role"
                        className="form-input"
                        required
                    >
                        <option value=""> </option>
                        <option value="student"> Student </option>
                        <option value="teacher"> Teacher </option>
                    </select>

                    <hr/>

                    {/* First Name */}
                    <div className="form-label">
                        <LuIdCard/>
                        <label htmlFor="firstName"> First Name </label>
                    </div>
                    <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Enter your first name"
                        className="form-input"
                        required
                    />

                    {/* Last Name */}
                    <div className="form-label">
                        <LuIdCard/>
                        <label htmlFor="lastName"> Last Name </label>
                    </div>
                    <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Enter your last name"
                        className="form-input"
                        required
                    />

                    {/* ID Number */}
                    <div className="form-label">
                        <LuIdCard/>
                        <label htmlFor="idNumber"> ID Number </label>
                    </div>
                    <input
                        id="idNum"
                        name="idNum"
                        type="text"
                        placeholder="Enter your ID number"
                        className="form-input"
                        required
                    />

                    <hr/>

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
                            placeholder="Must be at least 6 characters"
                            className="form-input"
                            required
                        />
                        {showPassword ?
                            (<TbEyeClosed onClick={togglePasswordVisibility} className="toggle-password-icon"/>)    
                            : 
                            (<MdOutlineRemoveRedEye onClick={togglePasswordVisibility} className="toggle-password-icon"/>)   
                        }
                    </div>

                    {/* Confirm Password */}
                    <div className="form-label">
                        <TbLockPassword/>
                        <label htmlFor="confirm"> Confirm Password </label>
                    </div>
                    <div className="toggle-password-container">
                        <input
                            id="confirm"
                            name="confirm"
                            type={showPassword ? "text" : "password"}
                            placeholder="Must be at least 6 characters"
                            className="form-input"
                            required
                        />
                        {showPassword ?
                            (<TbEyeClosed onClick={togglePasswordVisibility} className="toggle-password-icon"/>)    
                            : 
                            (<MdOutlineRemoveRedEye onClick={togglePasswordVisibility} className="toggle-password-icon"/>)   
                        }
                    </div>

                    {/* Terms & Conditions */}
                    <div className="terms-conditions"> 
                        <input type="checkbox"/> 
                        <span> I agree to the Terms & Conditions </span>
                    </div>

                    {/* Form Buttons */}
                    <div className="register-buttons"> 
                        <GoldButton btnText={"Reset"} btnType={"button"}/>
                        <MaroonButton btnText={"Create Account"} btnType={"submit"}/>
                    </div>
                     <div className="register-extras"> 
                        <span> Already have an account? </span>
                        <Link to="/login"> Sign in here </Link>
                    </div>
                </form>
            </main>
            <Footer/>
        </>
    );
}