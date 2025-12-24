import UserHeader from '../../components/layout/UserHeader.tsx';
import StudentSideBar from '../../components/layout/StudentSideBar.tsx';
import Footer from '../../components/layout/Footer.tsx';
import '../styles/StudentDashboard.css';
import '../styles/StudentLayout.css';

export default function StudentDashboard()
{
    return (
        <>
            <title> Student - Wildocs AI </title>
            <UserHeader/>
            <div className="student-layout">
                <StudentSideBar/>
                <main className="student-dashboard-container">
                    
                </main>
            </div>
            <Footer/>
        </>
    );
}