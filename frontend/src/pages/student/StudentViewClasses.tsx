import { useState, useEffect } from 'react';
import { Link, useOutletContext, useNavigate } from 'react-router-dom';
import { MdAdd } from 'react-icons/md';
import { getClassesByStudent } from '../../api/ClassService.ts';
import type { ClassCardDetails, AuthenticatedUser } from '../../types.ts';
import UserHeader from '../../components/layout/UserHeader.tsx';
import StudentSideBar from '../../components/layout/StudentSideBar.tsx';
import Footer from '../../components/layout/Footer.tsx';
import ClassCard from '../../components/class/ClassCard.tsx';
import '../styles/ViewClasses.css';
import '../styles/StudentLayout.css';

interface OutletContext { userDetails: AuthenticatedUser }

export default function StudentViewClasses()
{
    const { userDetails } = useOutletContext<OutletContext>();
    const [classes, setClasses] = useState<ClassCardDetails[]>([]);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() =>
    {
        const fetchClasses = async() =>
        {
            try
            {
                const fetchResponse = await getClassesByStudent(userDetails.email);
                setClasses(fetchResponse);
            }
            catch(error: any)
            {
                setError(error.message);
            }
        };

        fetchClasses();

    }, []);

    const handleCardClick = (joinCode: string) => 
    {
        navigate(`/student/class-details/${joinCode}`);
    };

    return (
        <>
            <title> View Classes - Wildocs AI </title>
            <UserHeader/>
            <div className="student-layout">
                <StudentSideBar/>
                <main className="view-classes-container">
                    <div className="view-classes-header">
                        <h2> Your Joined Classes </h2>
                        <p>
                            These are the list of classes that you've joined. <br/> 
                            {classes.length > 0 ? "Click card to view details." : "You have not joined any classes yet."}
                        </p>
                    </div>
                    {error && <p className="classes-error">{error}</p>}
                    <div className="class-cards">
                        <div className="add-class">
                            <Link to="/student/join">
                                <MdAdd/>
                                <p> Join Class </p>
                            </Link>
                        </div>
                        {classes.map((classItem, index) => (
                            <ClassCard
                                key={index}
                                className={classItem.className}
                                schoolYear={classItem.schoolYear}
                                semester={classItem.semester}
                                section={classItem.section}
                                joinCode={classItem.joinCode}
                                teacherName={classItem.teacherName}
                                clickHandler={handleCardClick}
                            />
                        ))}
                    </div>
                </main>
            </div>
            <Footer/>
        </>
    );
}