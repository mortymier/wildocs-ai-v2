import type { ClassCardDetails } from '../../types.ts';
import '../styles/ClassCard.css';

export default function ClassCard
({className, schoolYear, semester, section, joinCode, teacherName, clickHandler}: ClassCardDetails)
{
    return (
        <div className="class-card-container" onClick={() => clickHandler(joinCode)}>
            <h3> {className} </h3>
            <p> 
                {schoolYear}: {semester} Semester - {section} <br/>
                Teacher: {teacherName} <br/>
                Join Code: <span> {joinCode} </span>
            </p>
        </div>
    );
};