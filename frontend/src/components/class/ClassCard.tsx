import type { ClassCardDetails } from '../../types.ts';
import '../styles/ClassCard.css';

export default function ClassCard
({className, schoolYear, semester, section, joinCode}: ClassCardDetails)
{
    return (
        <div className="class-card-container">
            <h3> {className} </h3>
            <p> 
                {semester} Semester - {section} <br/> 
                {schoolYear} <br/>
                Join Code: <span> {joinCode} </span>
            </p>
        </div>
    );
};