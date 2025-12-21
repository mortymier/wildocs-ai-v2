import { BrowserRouter, Routes, Route } from 'react-router-dom';

{/* Public Pages */}
import Home from './pages/authentication/Home.tsx';
import Test from './pages/authentication/Test.tsx';

export default function App()
{
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Home/>}/>
                <Route path="/test" element={<Test/>}/>
            </Routes>
        </BrowserRouter>
    );
}