import type { AuthenticatedUser } from '../../types.ts';
import { FaCircleUser } from 'react-icons/fa6';
import '../styles/StudentList.css';

interface StudentListProps { students: AuthenticatedUser[] }

export default function StudentList({students}: StudentListProps)
{
    return (
        <div className="student-list-container">
            <ul>
                {students.map((student) => 
                (
                    <li key={student.idNum}>
                        <FaCircleUser/>
                        <p>
                            {student.firstName} {student.lastName} <br/>
                            {student.idNum}
                        </p> 
                    </li>
                ))}
            </ul>
        </div>
    );
}