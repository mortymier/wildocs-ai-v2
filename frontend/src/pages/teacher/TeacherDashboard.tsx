import UserHeader from '../../components/layout/UserHeader.tsx';
import TeacherSideBar from '../../components/layout/TeacherSideBar.tsx';
import Footer from '../../components/layout/Footer.tsx';
import '../styles/TeacherDashboard.css';
import '../styles/TeacherLayout.css';

export default function TeacherDashboard()
{
    return (
        <>
            <title> Teacher - Wildocs AI </title>
            <UserHeader/>
            <div className="teacher-layout">
                <TeacherSideBar/>
                <main className="teacher-dashboard-container">
                    
                </main>
            </div>
            <Footer/>
        </>
    );
}