import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Route Wrappers
import PublicRoute from './components/wrappers/PublicRoute.tsx';
import ProtectedRoute from './components/wrappers/ProtectedRoute.tsx';

// Public Pages
import Home from './pages/authentication/Home.tsx';
import Login from './pages/authentication/Login.tsx';
import Register from './pages/authentication/Register.tsx';
import Verify from './pages/authentication/Verify.tsx';
import Test from './pages/authentication/Test.tsx';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard.tsx';
import TeacherViewClasses from './pages/teacher/TeacherViewClasses.tsx';
import TeacherClassDetails from './pages/teacher/TeacherClassDetails.tsx';
import CreateClass from './pages/teacher/CreateClass.tsx';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard.tsx';
import StudentViewClasses from './pages/student/StudentViewClasses.tsx';
import StudentClassDetails from './pages/student/StudentClassDetails.tsx';
import JoinClass from './pages/student/JoinClass.tsx';

export default function App()
{
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Pages */}
                <Route element={<PublicRoute/>}>
                    <Route index element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/verify" element={<Verify/>}/>
                    <Route path="/test" element={<Test/>}/>
                </Route>
                
                {/* Teacher Pages */}
                <Route element={<ProtectedRoute allowedRoles={['TEACHER']}/>}>
                    <Route path="/teacher/dashboard" element={<TeacherDashboard/>}/>
                    <Route path="/teacher/classes" element={<TeacherViewClasses/>}/>
                    <Route path="/teacher/class-details/:joinCode" element={<TeacherClassDetails/>}/>
                    <Route path="/teacher/create" element={<CreateClass/>}/>

                </Route>

                {/* Student Pages */}
                <Route element={<ProtectedRoute allowedRoles={['STUDENT']}/>}>
                    <Route path="/student/dashboard" element={<StudentDashboard/>}/>
                    <Route path="/student/classes" element={<StudentViewClasses/>}/>
                    <Route path="/student/class-details/:joinCode" element={<StudentClassDetails/>}/>
                    <Route path="/student/join" element={<JoinClass/>}/>
                </Route>

                {/* Admin Pages */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN']}/>}>
                    
                </Route>
            </Routes>
        </BrowserRouter>
    );
}