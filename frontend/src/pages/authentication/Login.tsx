import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineMail } from 'react-icons/hi';
import { TbLockPassword } from 'react-icons/tb';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { TbEyeClosed } from 'react-icons/tb';
import { login } from '../../api/AuthService.ts';
import type { LoginForm } from '../../types.ts';
import MaroonButton from '../../components/buttons/MaroonButton.tsx';
import Footer from '../../components/layout/Footer.tsx';
import wildocsai_logo from '../../assets/wildocsai_logo.svg';
import '../styles/Login.css';
import '../styles/Form.css';

export default function Login()
{
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [formData, setFormData] = useState<LoginForm>
    ({
        email: '',
        password: ''
    }); 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();
        setError('');
        setLoading(true);

        try
        {
            const loginResponse = await login(formData);

            // Add redirection upon successful login
            if(loginResponse)
                console.log(loginResponse);
        }
        catch(error: any)
        {
            setError(error.message);
            console.log(error.message);
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
            <main className="login-container">
                <form className="form-container" onSubmit={handleSubmit}>
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
                        value={formData.email}
                        onChange={handleChange}
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
                            value={formData.password}
                            onChange={handleChange}
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
                    {error && <div className="form-error">{error}</div>}
                    <MaroonButton btnText={"Login"} btnType={"submit"} disabled={loading}/>
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