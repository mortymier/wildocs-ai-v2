import { useParams, Link, useOutletContext } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getClassDetails, getStudentsInClass } from '../../api/ClassService.ts';
import { getStudentSubmissionsInClass, uploadSubmission, deleteSubmission, getSubmissionEvaluationResults } from '../../api/SubmissionService.ts';
import { IoArrowBack, IoDocumentTextOutline } from 'react-icons/io5';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { FaRegUser } from 'react-icons/fa6';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { MdUpload } from 'react-icons/md';
import { HiOutlineUser } from 'react-icons/hi2';
import { FaFileCircleCheck } from 'react-icons/fa6';
import { FaFileCircleExclamation } from 'react-icons/fa6';
import type { ClassDetails, AuthenticatedUser, SubmissionDetails, EvaluationResults } from '../../types.ts';
import UserHeader from '../../components/layout/UserHeader.tsx';
import StudentSideBar from '../../components/layout/StudentSideBar.tsx';
import Footer from '../../components/layout/Footer.tsx';
import StudentList from '../../components/class/StudentList.tsx';
import StudentSubmissionList from '../../components/class/StudentSubmissionList.tsx';
import '../styles/ClassDetails.css';
import '../styles/StudentLayout.css';


interface OutletContext { userDetails: AuthenticatedUser }

export default function StudentClassDetails()
{
    const { joinCode } = useParams<{ joinCode: string }>();
    const { userDetails } = useOutletContext<OutletContext>();
    const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
    const [students, setStudents] = useState<AuthenticatedUser[]>([]);
    const [submissions, setSubmissions] = useState<SubmissionDetails[]>([]);
    const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedSubmission, setSelectedSubmission] = useState<SubmissionDetails | null>(null);
    const [evaluationResults, setEvaluationResults] = useState<EvaluationResults | null>(null);
    const [error, setError] = useState<string>('');
    const [modalError, setModalError] = useState<string>('');
    const [modalSuccess, setModalSuccess] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    
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

                const submissionsResponse = await getStudentSubmissionsInClass(userDetails.email, joinCode!);
                setSubmissions(submissionsResponse);
            }
            catch(error: any)
            {
                setError(error.message);
            }
        };

        fetchClassDetails();

    }, []);

    const toggleSubmitModal = () => 
    {
        setShowSubmitModal(!showSubmitModal);
        const modalBackground = document.getElementById('modal-blur-background');
        const modal = document.getElementById('submit-sdd-modal');
        const fileInput = document.querySelector('input[type="file"]');

        if(modalBackground && modal) 
        {
            modalBackground.style.display = showSubmitModal ? 'none' : 'block';
            modal.style.display = showSubmitModal ? 'none' : 'flex';
        }

        if(showSubmitModal) 
        {
            setSelectedFile(null);

            if (fileInput) 
            {
                (fileInput as HTMLInputElement).value = ''; 
            }
        }

        setModalError('');
        setModalSuccess('');
    };

    const toggleViewEvaluationModal = async(submission: SubmissionDetails) =>
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
            alert(error);
            modalBackground!.style.display = 'none';
        }
    };

    const closeEvaluationModal = () =>
    {
        const modalBackground = document.getElementById('modal-blur-background');
        const modal = document.getElementById('evaluation-results-modal');
        modalBackground!.style.display = 'none';
        modal!.style.display = 'none';
        setSelectedSubmission(null);
        setEvaluationResults(null);
    };

    const toggleDeleteModal = () =>
    {
        setShowDeleteModal(!showDeleteModal);
        const modalBackground = document.getElementById('modal-blur-background');
        const modal = document.getElementById('delete-modal');

        if(modalBackground && modal) 
        {
            modalBackground.style.display = showDeleteModal ? 'none' : 'block';
            modal.style.display = showDeleteModal ? 'none' : 'flex';
        }

        setModalError('');
        setModalSuccess('');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => 
    {
        if (e.target.files && e.target.files.length > 0) 
        {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUploadSubmit = async(e: React.FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();
        setModalError('');
        setModalSuccess('');
        setLoading(true);

        try
        {
            const uploadResponse = await uploadSubmission(selectedFile!, userDetails.email, joinCode!);
            console.log('Uploaded SDD:', uploadResponse);
            setModalSuccess('Upload successful!');

            setTimeout(() =>
            {
                window.location.reload();

            }, 1500);
        }
        catch(error: any)
        {
            setModalError(error.message);
        }
        finally
        {
            const fileInput = document.querySelector('input[type="file"]');
            setSelectedFile(null);

            if (fileInput) 
            {
                (fileInput as HTMLInputElement).value = ''; 
            }

            setLoading(false);
        }
    };

    const handleDeleteClick = (submission: SubmissionDetails) =>
    {
        setSelectedSubmission(submission);
        toggleDeleteModal();
    };

    const handleConfirmDelete = async(e: React.FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();
        setModalError('');
        setModalSuccess('');
        setLoading(true);

        try
        {
            const deleteResponse = await deleteSubmission(joinCode!, selectedSubmission!.submissionNumber)
            setModalSuccess(deleteResponse);

            setTimeout(() =>
            {
                window.location.reload();

            }, 1500);
        }
        catch(error: any)
        {
            setModalError(error.message);
        }
        finally
        {
            setLoading(false);
        }
    };

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
            <div className="student-layout">
                <StudentSideBar/>
                <main className="class-details-container">
                    <Link to="/student/classes">
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
                                    <h3> Submissions ({submissions.length}) </h3>
                                    <button className="btn-upload-sdd" onClick={toggleSubmitModal}> 
                                        <MdUpload/>
                                        Upload SDD 
                                    </button>
                                </div>
                                <div>
                                    <StudentSubmissionList 
                                        submissions={submissions} 
                                        onViewEvalClick={toggleViewEvaluationModal}
                                        onDeleteClick={handleDeleteClick}
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

            {/* Upload SDD modal */}
            <form id="submit-sdd-modal" onSubmit={handleUploadSubmit}>
                <IoIosCloseCircleOutline
                    onClick={!loading ? toggleSubmitModal : undefined} 
                    style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}
                />
                <h2> Upload SDD </h2>
                <p> Select PDF file (max 20MB) </p>
                <input
                    id="selectedFile"
                    name="selectedFile" 
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    required 
                />
                {modalError && <p className="form-error">{modalError}</p>}
                {modalSuccess && <p className="form-success">{modalSuccess}</p>}
                <button type="submit" disabled={loading}> Submit SDD </button>
            </form>

            {/* Evaluation Results Modal */}
            <div id="evaluation-results-modal">
                <IoIosCloseCircleOutline
                    className="er-close"
                    onClick={closeEvaluationModal}
                />
                {/* 1. Evaluation Results Header */}
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
                {/* 2. Evaluation Results Body */}
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
                        <div>
                            <p> </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete submission modal */}
            <form id="delete-modal" onSubmit={handleConfirmDelete}>
                <IoIosCloseCircleOutline
                    onClick={!loading ? toggleDeleteModal : undefined} 
                    style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}
                />
                <h2> Confirm delete? </h2>
                <p> Submission: {selectedSubmission?.fileName} </p>
                <p> Has AI Evaluation: {selectedSubmission?.isEvaluated ? "Yes" : "No"} </p>
                <p> Has Teacher Feedback: {selectedSubmission?.teacherFeedback ? "Yes" : "No"} </p>
                {modalError && <p className="form-error">{modalError}</p>}
                {modalSuccess && <p className="form-success">{modalSuccess}</p>}
                <button type="submit" disabled={loading}> Delete Submission </button>
            </form>
        </>
    );
}