import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getClassDetails, getStudentsInClass } from '../../api/ClassService.ts';
import { getAllSubmissionsInClass, getSubmissionEvaluationResults, updateTeacherFeedback } from '../../api/SubmissionService.ts';
import { IoArrowBack, IoDocumentTextOutline } from 'react-icons/io5';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { FaRegUser } from 'react-icons/fa6';
import { HiOutlineUser } from 'react-icons/hi2';
import { FaFileCircleCheck } from 'react-icons/fa6';
import { FaFileCircleExclamation } from 'react-icons/fa6';
import { CiClock2 } from "react-icons/ci";
import { BiLike, BiDislike } from "react-icons/bi";
import type { ClassDetails, AuthenticatedUser, SubmissionDetails, EvaluationResults } from '../../types.ts';
import UserHeader from '../../components/layout/UserHeader.tsx';
import TeacherSideBar from '../../components/layout/TeacherSideBar.tsx';
import Footer from '../../components/layout/Footer.tsx';
import StudentList from '../../components/class/StudentList.tsx';
import TeacherSubmissionList from '../../components/class/TeacherSubmissionList.tsx';
import '../styles/ClassDetails.css';
import '../styles/TeacherLayout.css';

export default function TeacherClassDetails()
{
    const { joinCode } = useParams<{ joinCode: string }>();
    const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
    const [students, setStudents] = useState<AuthenticatedUser[]>([]);
    const [submissions, setSubmissions] = useState<SubmissionDetails[]>([]);
    const [selectedSubmission, setSelectedSubmission] = useState<SubmissionDetails | null>(null);
    const [evaluationResults, setEvaluationResults] = useState<EvaluationResults | null>(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
    const [teacherFeedback, setTeacherFeedback] = useState<string>('');
    const [toggleLike, setToggleLike] = useState<boolean>(false);
    const [toggleDislike, setToggleDislike] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [modalError, setModalError] = useState<string>('');
    const [modalSuccess, setModalSuccess] = useState<string>('');

    useEffect(() => 
    {
        const fetchClassDetails = async() =>
        {
            try
            {
                const detailsResponse = await getClassDetails(joinCode!);
                setClassDetails(detailsResponse);

                const studentsResponse = await getStudentsInClass(joinCode!);
                setStudents(studentsResponse);

                const submissionsResponse = await getAllSubmissionsInClass(joinCode!);
                setSubmissions(submissionsResponse);
            }
            catch(error: any)
            {
                setError(error.message);
            }
        };

        fetchClassDetails();

    }, []);

    useEffect(() =>
    {
        if (selectedSubmission && showFeedbackModal) 
        {
            setTeacherFeedback(selectedSubmission.teacherFeedback || '');
            
            if (selectedSubmission.thumbsUp === true) 
            {
                setToggleLike(true);
                setToggleDislike(false);
            } 
            else if (selectedSubmission.thumbsUp === false) 
            {
                setToggleLike(false);
                setToggleDislike(true);
            } 
            else 
            {
                setToggleLike(false);
                setToggleDislike(false);
            }
        }
    }, [selectedSubmission, showFeedbackModal]);

    const toggleViewEvaluationResultsModal = async(submission: SubmissionDetails) =>
    {
        const modalBackground = document.getElementById('modal-blur-background');
        const modal = document.getElementById('evaluation-results-modal');
        modalBackground!.style.display = 'block';

        try
        {
            const fetchedResults = await getSubmissionEvaluationResults(joinCode!, submission.submissionNumber);
            console.info('Fetched AI Evaluation Results:', fetchedResults);
            setSelectedSubmission(submission);
            setEvaluationResults(fetchedResults);
            modal!.style.display = 'flex';
        }
        catch(error: any)
        {
            alert(error.message);
            modalBackground!.style.display = 'none';
        }
    };

    const closeEvaluationResultsModal = () =>
    {
        const modalBackground = document.getElementById('modal-blur-background');
        const modal = document.getElementById('evaluation-results-modal');
        modalBackground!.style.display = 'none';
        modal!.style.display = 'none';
        setSelectedSubmission(null);
        setEvaluationResults(null);
    };

    const toggleFeedbackModal = () =>
    {
        const newShowState = !showFeedbackModal;
        setShowFeedbackModal(newShowState);
        const modalBackground = document.getElementById('modal-blur-background');
        const modal = document.getElementById('update-feedback-modal');
        
        if(modalBackground && modal)
        {
            modalBackground.style.display = newShowState ? 'block' : 'none';
            modal.style.display = newShowState ? 'flex' : 'none';
        }

        if (!newShowState) 
        {
            setModalError('');
            setModalSuccess('');
            setSelectedSubmission(null);
        }
    };

    const handleFeedbackClick = (submission: SubmissionDetails) =>
    {
        setSelectedSubmission(submission);
        toggleFeedbackModal();
    };

    const formatLocalDateTime = (date: Date) =>
    {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        
        let hours = date.getHours();
        hours = hours % 12;
        hours = hours === 0 ? 12 : hours;

        const hoursStr = hours.toString().padStart(2, '0');
        const minutes = (date.getMinutes()).toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        return `${month}/ ${day} / ${year}, ${hoursStr}:${minutes} ${ampm}`;
    };

    const handleUpdateFeedback = async (e: React.FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();
        setModalError('');
        setModalSuccess('');
        
        try 
        {
            let thumbsUpValue: boolean | undefined = undefined;
            if (toggleLike) 
            {
                thumbsUpValue = true;
            } 
            else if (toggleDislike) 
            {
                thumbsUpValue = false;
            }
            
            await updateTeacherFeedback
            (
                joinCode!,
                selectedSubmission!.submissionNumber,
                teacherFeedback || undefined,
                thumbsUpValue
            );
            
            setModalSuccess('Feedback saved successfully!');
            
            const submissionsResponse = await getAllSubmissionsInClass(joinCode!);
            setSubmissions(submissionsResponse);
            
            setTimeout(() => 
            {
                toggleFeedbackModal();

            }, 1500);
        }
        catch(error: any) 
        {
            setModalError(error.message);
        }
    };

    const toggleDislikeButton = () =>
    {
        setToggleDislike(!toggleDislike);
        if (!toggleDislike) 
        {
            setToggleLike(false);
        }
    }

    const toggleLikeButton = () =>
    {
        setToggleLike(!toggleLike);
        if (!toggleLike) 
        {
            setToggleDislike(false);
        }
    }

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
                                    <TeacherSubmissionList
                                        submissions={submissions}
                                        onViewEvalClick={toggleViewEvaluationResultsModal}
                                        onFeedbackClick={handleFeedbackClick}
                                    />
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

            {/* Blur background behind modal */}
            <div id="modal-blur-background"> </div>

            {/* Evaluation Results Modal */}
            <div id="evaluation-results-modal">
                <IoIosCloseCircleOutline
                    className="er-close"
                    onClick={closeEvaluationResultsModal}
                />
                {/* Evaluation Results Header */}
                <div className="er-header">
                    <div className="er-header-a">
                        <h1> AI Evaluation Results </h1>
                        <div>
                            <p> <IoDocumentTextOutline/> Submission: {selectedSubmission?.fileName} </p>
                            <p> <HiOutlineUser/> Submitted by: {selectedSubmission?.studentName} </p>
                        </div>
                    </div>
                    <div className="er-header-b">
                        <p> Total Score </p>
                        <h1
                            className=
                            {
                                evaluationResults?.Total_Score! >= 65 ?
                                "green-total" : "red-total"
                            }
                        > 
                            {evaluationResults?.Total_Score} / 100 
                        </h1>
                    </div>
                </div>
                <hr/>
                {/* Evaluation Results Body */}
                <div className="er-body">
                    <div className="section-card">
                        <div
                            className=
                            {
                                evaluationResults?.Preface.Score! > 5 ? 
                                "section-card-header section-card-header-a" : 
                                "section-card-header section-card-header-b"
                            }
                        > 
                            {evaluationResults?.Preface.Score! > 5 ? <FaFileCircleCheck/> : <FaFileCircleExclamation/>}
                            <h3> Preface </h3>
                            <p> {evaluationResults?.Preface.Score} / 10 </p>
                        </div>
                        <div className="section-card-body">
                            <h4> Evaluation: </h4>
                            <p> {evaluationResults?.Preface.General_Evaluation} </p>
                        </div>
                    </div>
                    <div className="section-card">
                        <div
                            className=
                            {
                                evaluationResults?.Introduction.Score! > 15 ? 
                                "section-card-header section-card-header-a" : 
                                "section-card-header section-card-header-b"
                            }
                        > 
                            {evaluationResults?.Introduction.Score! > 15 ? <FaFileCircleCheck/> : <FaFileCircleExclamation/>}
                            <h3> Introduction </h3>
                            <p> {evaluationResults?.Introduction.Score} / 30 </p>
                        </div>
                        <div className="section-card-body">
                            <h4> Strengths (+): </h4>
                            <p> {evaluationResults?.Introduction.Strengths} </p>
                            <h4> Weaknesses (-): </h4>
                            <p> {evaluationResults?.Introduction.Weaknesses} </p>
                            <h4> Suggestions (~): </h4>
                            <p> {evaluationResults?.Introduction.Suggestions} </p>
                        </div>
                    </div>
                    <div className="section-card">
                        <div
                            className=
                            {
                                evaluationResults?.Architectural_Design.Score! > 10 ? 
                                "section-card-header section-card-header-a" : 
                                "section-card-header section-card-header-b"
                            }
                        > 
                            {evaluationResults?.Architectural_Design.Score! > 10 ? <FaFileCircleCheck/> : <FaFileCircleExclamation/>}
                            <h3> Architectural Design </h3>
                            <p> {evaluationResults?.Architectural_Design.Score} / 20 </p>
                        </div>
                        <div className="section-card-body">
                            <h4> Evaluation: </h4>
                            <p> {evaluationResults?.Architectural_Design.General_Evaluation} </p>
                        </div>
                    </div>
                    <div className="section-card">
                        <div 
                            className=
                            {
                                evaluationResults?.Detailed_Design.Score! > 20 ? 
                                "section-card-header section-card-header-a" : 
                                "section-card-header section-card-header-b"
                            }
                        > 
                            {evaluationResults?.Detailed_Design.Score! > 20 ? <FaFileCircleCheck/> : <FaFileCircleExclamation/>}
                            <h3> Detailed Design </h3>
                            <p> {evaluationResults?.Detailed_Design.Score} / 40 </p>
                        </div>
                        <div className="section-card-body">
                            <h4> Strengths (+): </h4>
                            <p> {evaluationResults?.Detailed_Design.Strengths} </p>
                            <h4> Weaknesses (-): </h4>
                            <p> {evaluationResults?.Detailed_Design.Weaknesses} </p>
                            <h4> Suggestions (~): </h4>
                            <p> {evaluationResults?.Detailed_Design.Suggestions} </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Teacher Feedback Modal */}
            <form id="update-feedback-modal" onSubmit={handleUpdateFeedback}>
                <IoIosCloseCircleOutline
                    className="feedback-close"
                    onClick={toggleFeedbackModal}
                />
                <h2> Teacher Feedback </h2>
                <p> <IoDocumentTextOutline/> Submission: {selectedSubmission?.fileName} </p>
                <p> <HiOutlineUser/> Submitted by: {selectedSubmission?.studentName} </p>
                <p> <CiClock2/> Submitted at: {formatLocalDateTime(new Date(selectedSubmission?.submittedAt!))} </p>
                <div className="feedback-inputs">
                    <label htmlFor="feedback-text"> Your Feedback:</label>
                    <textarea
                        id="feedback-text"
                        rows={6}
                        cols={100}
                        value={teacherFeedback}
                        onChange={(e) => setTeacherFeedback(e.target.value)}
                        placeholder="Enter your feedback here..."
                    >
                    </textarea>
                   <div className="feedback-like">
                        <p 
                            className={toggleDislike ? "toggle-dislike" : ""} 
                            onClick={toggleDislikeButton}
                        > 
                            Reject <BiDislike/> 
                        </p> 
                        <p 
                            className={toggleLike ? "toggle-like" : ""} 
                            onClick={toggleLikeButton}
                        > 
                            <BiLike/> Approve 
                        </p>
                    </div>
                </div>
                {modalError && <p className="form-error">{modalError}</p>}
                {modalSuccess && <p className="form-success">{modalSuccess}</p>}
                <button type="submit"> Save Feedback </button>
            </form>
        </>
    );
}