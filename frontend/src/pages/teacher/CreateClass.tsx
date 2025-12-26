import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { LuLetterText } from 'react-icons/lu';
import { IoCalendarClearOutline } from 'react-icons/io5';
import { IoSchoolOutline } from 'react-icons/io5';
import { createClass } from '../../api/ClassService.ts';
import type { CreateClassForm, AuthenticatedUser } from '../../types.ts';
import UserHeader from '../../components/layout/UserHeader.tsx';
import TeacherSideBar from '../../components/layout/TeacherSideBar.tsx';
import Footer from '../../components/layout/Footer.tsx';
import GoldButton from '../../components/buttons/GoldButton.tsx';
import MaroonButton from '../../components/buttons/MaroonButton.tsx';
import '../styles/CreateClass.css';
import '../styles/TeacherLayout.css';
import '../styles/Form.css';

interface OutletContext { userDetails: AuthenticatedUser }

export default function CreateClass()
{
    const navigate = useNavigate();
    const { userDetails } = useOutletContext<OutletContext>();
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [formData, setFormData] = useState<CreateClassForm>
    ({
        className: '',
        schoolYear: '',
        semester: '',
        section: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    {
        const { name, value } = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) =>
    {
        const { name, value } = e.target;
        setFormData((prev) => ({...prev, [name]: value.trimEnd()}));
    };

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try
        {
            const createResponse = await createClass(formData, userDetails.email);
            console.info(createResponse);
            setSuccess('Class created successfully! Redirecting to list of classes...');

            setTimeout(() =>
            {
                navigate('/teacher/dashboard');

            }, 3500);
        }
        catch(error: any)
        {
            setError(error.message);
        }
        finally
        {
            setLoading(false);
        }
    };

    return (
        <>
            <title> Create Class - Wildocs AI </title>
            <UserHeader/>
            <div className="teacher-layout">
                <TeacherSideBar/>
                <main className="create-class-container">
                    <div className="quick-tips">
                        <h2> Quick Tips </h2>
                        <ul>
                            <li> All fields are required to create a new class </li>
                            <li> Choose a descriptive class name that students will easily recognize </li>
                            <li> Select the appropriate school year and semester for scheduling </li>
                            <li> A code for joining the class will be automatically generated </li>
                        </ul>
                    </div>
                    <form className="form-container" onSubmit={handleSubmit}>
                        <h2> Create Class </h2>
                        {/* Class Name */}
                        <div className="form-label">
                            <LuLetterText/>
                            <label htmlFor="className"> Class Name </label>
                        </div>
                        <input
                            id="className"
                            name="className"
                            type="text"
                            placeholder="Enter class name"
                            className="form-input"
                            value={formData.className}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        {/* School Year */}
                        <div className="form-label">
                            <IoCalendarClearOutline/>
                            <label htmlFor="schoolYear"> School Year </label>
                        </div>
                        <select
                            id="schoolYear"
                            name="schoolYear"
                            className="form-input"
                            value={formData.schoolYear}
                            onChange={handleChange}
                            required
                        >
                            <option value=""> </option>
                            <option value="2024 - 2025"> 2024 - 2025 </option>
                            <option value="2025 - 2026"> 2025 - 2026 </option>
                        </select>
                        {/* Semester */}
                        <div className="form-label">
                            <IoSchoolOutline/>
                            <label htmlFor="semester"> Semester </label>
                        </div>
                        <select
                            id="semester"
                            name="semester"
                            className="form-input"
                            onChange={handleChange}
                            required
                        >
                            <option value=""> </option>
                            <option value="First"> First </option>
                            <option value="Second"> Second </option>
                            <option value="Summer"> Summer </option>
                        </select>
                        {/* Section */}
                        <div className="form-label">
                            <IoSchoolOutline/>
                            <label htmlFor="section"> Section </label>
                        </div>
                        <input
                            id="section"
                            name="section"
                            type="text"
                            placeholder="Enter section"
                            className="form-input"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        {error && <p className="form-error">{error}</p>}
                        {success && <p className="form-success">{success}</p>}  
                        {/* Form Buttons */}
                        <div className="create-class-buttons">
                            <GoldButton btnText={"Reset"} btnType={"button"} disabled={loading}/>
                            <MaroonButton btnText={"Create Class"} btnType={"submit"} disabled={loading}/>
                        </div>
                    </form>
                </main>
            </div>
            <Footer/>
        </>
    );
}