import { VscFilePdf } from 'react-icons/vsc';
import { LiaCommentDots } from 'react-icons/lia';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiRobot2Line } from 'react-icons/ri';
import { AiOutlineDelete } from 'react-icons/ai';
import type { SubmissionDetails } from '../../types';
import '../styles/SubmissionList.css';

interface SubmissionListProps 
{ 
    submissions: SubmissionDetails[],
    onViewEvalClick: (submission: SubmissionDetails) => void,
    onSDDAIClick: (submisson: SubmissionDetails) => void,
    onViewFeedbackClick: (submission: SubmissionDetails) => void
    onDeleteClick: (submission: SubmissionDetails) => void
}

export default function StudentSubmissionList({submissions, onViewEvalClick, onSDDAIClick, onViewFeedbackClick, onDeleteClick}: SubmissionListProps)
{
    return(
        <table className="submissions-table">
            <thead>
                <tr>
                    <th> ID </th>
                    <th> File </th>
                    <th> AI Evaluation </th>
                    <th> Feedback </th>
                    <th> Actions </th>
                </tr>
            </thead>
            <tbody> 
                {submissions.map((submission) => 
                (
                    <tr key={submission.submissionNumber}>
                        <td> {submission.submissionNumber} </td>
                        <td className="file-name"> <span> <VscFilePdf/> {submission.fileName} </span> </td>
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
                                onClick={() => onViewFeedbackClick(submission)}
                                className={(submission.thumbsUp === true ? "approved" : "") + " " + (submission.thumbsUp == false ? "rejected" : "")}
                            > 
                                <LiaCommentDots/> &nbsp; 
                                {submission.thumbsUp === true ? "Approved" : ""} 
                                {submission.thumbsUp === false ? "Rejected" : ""}
                            </span> 
                        </td>
                        <td className="actions">
                            <span>
                                {
                                    !submission.isEvaluated && 
                                    <RiRobot2Line 
                                        className="evaluate" 
                                        title="Evaluate SDD with AI"
                                        onClick={() => onSDDAIClick(submission)}
                                    />
                                }
                                <AiOutlineDelete 
                                    className="delete" 
                                    title="Delete SDD submission"
                                    onClick={() => onDeleteClick(submission)}
                                />
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}