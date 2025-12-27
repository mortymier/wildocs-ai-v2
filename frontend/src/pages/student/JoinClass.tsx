import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { joinClass } from '../../api/ClassService.ts';
import type { AuthenticatedUser } from '../../types.ts';
import UserHeader from '../../components/layout/UserHeader.tsx';
import StudentSideBar from '../../components/layout/StudentSideBar.tsx';
import Footer from '../../components/layout/Footer.tsx';
import GoldButton from '../../components/buttons/GoldButton.tsx';
import '../styles/JoinClass.css';
import '../styles/StudentLayout.css';

interface OutletContext { userDetails: AuthenticatedUser }

export default function JoinClass()
{
    const navigate = useNavigate();
    const { userDetails } = useOutletContext<OutletContext>();
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [joinCode, setJoinCode] = useState<string>('');

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try
        {
            const joinResponse = await joinClass(userDetails.email, joinCode);
            console.info(joinResponse);
            setSuccess(joinResponse);

            setTimeout(() =>
            {
                navigate('/student/dashboard');

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
            <title> Join Class - Wildocs AI </title>
            <UserHeader/>
                <div className="student-layout">
                    <StudentSideBar/>
                    <main className="join-class-container">
                        <h2> Join Class </h2>
                        <p> Enter the Join Code provided by your teacher </p>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="joinCode"> Join Code </label>
                            <input
                                id="joinCode"
                                name="joinCode"
                                type="text"
                                placeholder="Enter join code"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value)}
                                onBlur={(e) => setJoinCode(e.target.value.trimEnd())} 
                                required   
                            />
                            {error && <p className="form-error">{error}</p>}
                            {success && <p className="form-success">{success}</p>}
                            <GoldButton btnText={"Join Class"} btnType={"submit"} disabled={loading}/>
                        </form>
                    </main>
                </div>
            <Footer/>
        </>
    );
}