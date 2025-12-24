import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineUser } from 'react-icons/hi2';
import { HiOutlineMail } from 'react-icons/hi';
import { LuIdCard } from 'react-icons/lu';
import { TbLockPassword } from 'react-icons/tb';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { TbEyeClosed } from 'react-icons/tb';
import { register } from '../../api/AuthService.ts';
import type { RegisterForm } from '../../types.ts';
import GoldButton from '../../components/buttons/GoldButton.tsx';
import MaroonButton from '../../components/buttons/MaroonButton.tsx';
import Footer from '../../components/layout/Footer.tsx';
import wildocsai_logo from '../../assets/wildocsai_logo.svg';
import '../styles/Register.css';
import '../styles/Form.css';

export default function Register()
{
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState<string>('');
    const [confirmPw, setConfirmPw] = useState<string>('');
    const [formData, setFormData] = useState<RegisterForm>
    ({
        firstName: '',
        lastName: '',
        idNum: '',
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const { name, value } = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) =>
    {
        const { name, value } = e.target;
        setFormData((prev) => ({...prev, [name]: value.trimEnd()}));
    };

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        if(formData.password !== confirmPw)
        {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        
        try
        {
            const registerResponse = await register(formData, role);
            console.info(registerResponse);
            setSuccess(registerResponse);

            setTimeout(() =>
            {
                navigate('/verify');

            }, 3500);
        }
        catch(error: any)
        {
            setError(error.message);
        }
        finally
        {
            setLoading(false);
        }
    };
    
    const togglePasswordVisibility = () =>
    {
        setShowPassword((prevState) => !prevState);
    };

    return (
        <>
            <title> Register - Wildocs AI </title>
            <main className="register-container">
                <form className="form-container" onSubmit={handleSubmit}>
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
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value=""> </option>
                        <option value="STUDENT"> Student </option>
                        <option value="TEACHER"> Teacher </option>
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
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
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
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                    />

                    {/* ID Number */}
                    <div className="form-label">
                        <LuIdCard/>
                        <label htmlFor="idNum"> ID Number </label>
                    </div>
                    <input
                        id="idNum"
                        name="idNum"
                        type="text"
                        placeholder="Enter your ID number"
                        className="form-input"
                        value={formData.idNum}
                        onChange={handleChange}
                        onBlur={handleBlur}
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
                        autoComplete="on"
                        className="form-input"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
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
                            minLength={6}
                            placeholder="Must be at least 6 characters"
                            className="form-input"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
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
                        <label htmlFor="confirmPw"> Confirm Password </label>
                    </div>
                    <div className="toggle-password-container">
                        <input
                            id="confirmPw"
                            name="confirmPw"
                            type={showPassword ? "text" : "password"}
                            minLength={6}
                            placeholder="Must be at least 6 characters"
                            className="form-input"
                            value={confirmPw}
                            onChange={(e) => setConfirmPw(e.target.value)}
                            onBlur={(e) => setConfirmPw(e.target.value.trimEnd())}
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

                    {error && <p className="form-error">{error}</p>}
                    {success && <p className="form-success">{success}</p>}

                    {/* Form Buttons */}
                    <div className="register-buttons"> 
                        <GoldButton btnText={"Reset"} btnType={"button"} disabled={loading}/>
                        <MaroonButton btnText={"Create Account"} btnType={"submit"} disabled={loading}/>
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