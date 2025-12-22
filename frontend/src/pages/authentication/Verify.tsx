import Header from '../../components/layout/Header.tsx';
import Footer from '../../components/layout/Footer.tsx';
import GoldButton from '../../components/buttons/GoldButton.tsx';
import '../styles/Verify.css';

export default function Verify()
{
    return (
        <>
            <Header/>
            <main className="verify-container">
                <h1> Verify Your Email </h1>
                <p>
                    We've sent a verification code to your email.
                    Please enter it here.
                </p>
                <form>
                    <label htmlFor="code"> Verification Code </label>
                    <input
                        type="text"
                        placeholder="Enter verification code"
                    />
                    <GoldButton btnText={"Verify Email"}/>
                    <div> <span> Didn't receive code? </span> <span> Resend Email </span> </div>
                </form>
            </main>
            <Footer/>
        </>
    );
}