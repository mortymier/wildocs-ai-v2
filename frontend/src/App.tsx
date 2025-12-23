import { BrowserRouter, Routes, Route } from 'react-router-dom';

{/* Public Pages */}
import Home from './pages/authentication/Home.tsx';
import Login from './pages/authentication/Login.tsx';
import Register from './pages/authentication/Register.tsx';
import Verify from './pages/authentication/Verify.tsx';
import Test from './pages/authentication/Test.tsx';

{/* Teacher Pages */}
import TeacherDashboard from './pages/teacher/TeacherDashboard.tsx';

export default function App()
{
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Pages */}
                <Route index element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/verify" element={<Verify/>}/>
                <Route path="/test" element={<Test/>}/>

                {/* Teacher Pages */}
                <Route path="/teacher/dashboard" element={<TeacherDashboard/>}/>
            </Routes>
        </BrowserRouter>
    );
}