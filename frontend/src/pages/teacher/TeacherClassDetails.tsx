import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getClassDetails, getStudentsInClass } from '../../api/ClassService.ts';
import { IoArrowBack, IoDocumentTextOutline } from 'react-icons/io5';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { FaRegUser } from 'react-icons/fa6';
import type { ClassDetails, AuthenticatedUser } from '../../types.ts';
import UserHeader from '../../components/layout/UserHeader.tsx';
import TeacherSideBar from '../../components/layout/TeacherSideBar.tsx';
import Footer from '../../components/layout/Footer.tsx';
import StudentList from '../../components/class/StudentList.tsx';
import '../styles/ClassDetails.css';
import '../styles/TeacherLayout.css';

export default function TeacherClassDetails()
{
    const { joinCode } = useParams<{ joinCode: string }>();
    const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
    const [students, setStudents] = useState<AuthenticatedUser[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => 
    {
        const fetchClassDetailsAndStudents = async() =>
        {
            try
            {
                const detailsResponse = await getClassDetails(joinCode!);
                setClassDetails(detailsResponse);

                const studentsResponse = await getStudentsInClass(joinCode!);
                setStudents(studentsResponse);
            }
            catch(error: any)
            {
                setError(error.message);
            }
        };

        fetchClassDetailsAndStudents();

    }, []);

    // Improve returned elements for abnormal states (include header, footer, nav)
    if(error)
    {
        return <p> {error} </p>
    }

    if(!classDetails)
    {
        return <p> Loading... </p>
    }

    return (
        <>
            <title> Class Details - Wildocs AI </title>
            <UserHeader/>
            <div className="teacher-layout">
                <TeacherSideBar/>
                <main className="class-details-container">
                    <Link to="/teacher/classes">
                        <IoArrowBack/>
                        <p> Back </p>
                    </Link>
                    <div className="class-details-card">
                        <div className="class-details-header">
                            <h1> {classDetails.className} </h1>
                            <div>
                                <h3> Join Code: </h3>
                                <h2> {classDetails.joinCode} </h2>
                            </div>
                        </div>
                        <div className="class-details-columns">
                            <div className="left-column">
                                <div className="column-header">
                                    <IoIosInformationCircleOutline/>
                                    <h3> Details </h3>
                                </div>
                                <div className="class-details">
                                    <div>
                                        <p> <span> School Year : </span> &nbsp; {classDetails.schoolYear} </p>
                                        <p> <span> Semester : </span> &nbsp; {classDetails.semester} </p>
                                    </div>
                                    <div>
                                        <p> <span> Section : </span> &nbsp; {classDetails.section} </p>
                                        <p> <span> Teacher : </span> &nbsp; {classDetails.teacherName} </p>
                                    </div>
                                </div>
                                <div className="column-header">
                                    <IoDocumentTextOutline/>
                                    <h3> Submissions </h3>
                                </div>
                                <div>
                                    <p> Insert submissions component here </p>
                                </div>
                            </div>
                            <div className="right-column">
                                <div className="column-header">
                                    <FaRegUser/>
                                    <h3> Enrolled Students ({students.length}) </h3>
                                </div>
                                <StudentList students={students}/>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Footer/>
        </>
    );
}