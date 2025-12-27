import { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { MdAdd } from 'react-icons/md';
import { getClassesByTeacher } from '../../api/ClassService.ts';
import type { ClassCardDetails, AuthenticatedUser } from '../../types.ts';
import UserHeader from '../../components/layout/UserHeader.tsx';
import TeacherSideBar from '../../components/layout/TeacherSideBar.tsx';
import Footer from '../../components/layout/Footer.tsx';
import ClassCard from '../../components/class/ClassCard.tsx';
import '../styles/ViewClasses.css';
import '../styles/TeacherLayout.css';

interface OutletContext { userDetails: AuthenticatedUser }

export default function TeacherViewClasses()
{
    const { userDetails } = useOutletContext<OutletContext>();
    const [classes, setClasses] = useState<ClassCardDetails[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() =>
    {
        const fetchClasses = async() =>
        {
            try
            {
                const fetchResponse = await getClassesByTeacher(userDetails.email);
                console.log(fetchResponse);
                setClasses(fetchResponse);
            }
            catch(error: any)
            {
                setError(error.message);
            }
        };

        fetchClasses();

    }, []);


    return (
        <>
            <title> View Classes - Wildocs AI </title>
            <UserHeader/>
            <div className="teacher-layout">
                <TeacherSideBar/>
                <main className="view-classes-container">
                    <div className="view-classes-header">
                        <h2> View Created Classes </h2>
                        <p> 
                            These are the list of classes that you've created. <br/> 
                            {classes.length > 0 ? "Click card to view details." : "You have not created any classes yet."}
                        </p>
                    </div>
                    {error && <p className="classes-error">{error}</p>}
                    <div className="class-cards">
                        <div className="add-class">
                            <Link to="/teacher/create">
                                <MdAdd/>
                                <p> Add Class </p>
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
                            />
                        ))}
                    </div>
                </main>
            </div>
            <Footer/>
        </>
    );
}