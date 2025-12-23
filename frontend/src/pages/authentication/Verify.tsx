import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyEmail } from '../../api/AuthService.ts';
import Header from '../../components/layout/Header.tsx';
import Footer from '../../components/layout/Footer.tsx';
import GoldButton from '../../components/buttons/GoldButton.tsx';
import '../styles/Verify.css';

export default function Verify()
{
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [code, setCode] = useState<string>('');

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try
        {
            const verificationResponse = await verifyEmail(code);
            console.log(verificationResponse);
            setSuccess(verificationResponse.message);

            setTimeout(() =>
            {
                navigate('/login');

            }, 3000);
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

    return (
        <>
            <Header/>
            <main className="verify-container">
                <h1> Verify Your Email </h1>
                <p>
                    We've sent a verification code to your email.
                    Please enter it here.
                </p>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="code"> Verification Code </label>
                    <input
                        id="code"
                        name="code"
                        type="text"
                        placeholder="Enter verification code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        onBlur={(e) => setCode(e.target.value.trimEnd())}
                        required
                    />
                    {error && <p className="form-error">{error}</p>}
                    {success && <p className="form-success">{success}</p>}
                    <GoldButton btnText={"Verify Email"} btnType={"submit"} disabled={loading}/>
                    <div> <span> Didn't receive code? Check Spam or </span> <span> Resend Email </span> </div>
                </form>
            </main>
            <Footer/>
        </>
    );
}