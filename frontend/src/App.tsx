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
import ViewClasses from './pages/teacher/ViewClasses.tsx';
import CreateClass from './pages/teacher/CreateClass.tsx';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard.tsx';

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
                    <Route path="/teacher/classes" element={<ViewClasses/>}/>
                    <Route path="/teacher/create" element={<CreateClass/>}/>
                </Route>

                {/* Student Pages */}
                <Route element={<ProtectedRoute allowedRoles={['STUDENT']}/>}>
                    <Route path="/student/dashboard" element={<StudentDashboard/>}/>
                </Route>

                {/* Admin Pages */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN']}/>}>
                    
                </Route>
            </Routes>
        </BrowserRouter>
    );
}