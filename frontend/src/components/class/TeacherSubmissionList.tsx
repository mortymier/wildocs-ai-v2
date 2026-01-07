import { VscFilePdf } from 'react-icons/vsc';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { LiaCommentDots } from 'react-icons/lia';
import type { SubmissionDetails } from '../../types';
import '../styles/SubmissionList.css';

interface SubmissionListProps
{
    submissions: SubmissionDetails[],
    onViewEvalClick: (submission: SubmissionDetails) => void,
    onFeedbackClick: (submission: SubmissionDetails) => void
}

export default function TeacherSubmissionList({submissions, onViewEvalClick, onFeedbackClick}: SubmissionListProps)
{
    const formatLocalDateTime = (date: Date) =>
    {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return `${month} / ${day} / ${year}`;
    };

    return (
        <table className="submissions-table">
            <thead>
                <tr>
                    <th> ID </th>
                    <th> File </th>
                    <th> Submitter </th>
                    <th> Date </th>
                    <th> AI Evaluation </th>
                    <th> Feedback </th>
                </tr>
            </thead>
            <tbody>
                {submissions.map((submission => 
                    <tr key={submission.submissionNumber}>
                        <td> {submission.submissionNumber} </td>
                        <td className="file-name"> <span> <VscFilePdf/> {submission.fileName} </span> </td>
                        <td> {submission.studentName} </td>
                        <td> 
                            {formatLocalDateTime(new Date(submission.submittedAt))} 
                        </td>
                        <td className="ai-evaluation">
                            {
                                submission.isEvaluated ? 
                                <span 
                                    className="view-evaluation"
                                    title="View AI evaluation results"
                                    onClick={() => onViewEvalClick(submission)}
                                > 
                                    <MdOutlineRemoveRedEye/> View 
                                </span> : 
                                <span> Not Evaluated </span> 
                            }
                        </td>
                        <td className="teacher-feedback"> 
                            <span
                                title="View teacher feedback"
                                onClick={() => onFeedbackClick(submission)}    
                                className={(submission.thumbsUp === true ? "approved" : "") + " " + (submission.thumbsUp == false ? "rejected" : "")}
                            > 
                                <LiaCommentDots/> &nbsp; 
                                {submission.thumbsUp === true ? "Approved" : ""} 
                                {submission.thumbsUp === false ? "Rejected" : ""}
                            </span> 
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}