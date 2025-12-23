// This page is for testing the look of components

import '../styles/Test.css';
import GoldButton from '../../components/buttons/GoldButton.tsx';
import MaroonButton from '../../components/buttons/MaroonButton.tsx';
import WhiteButton from '../../components/buttons/WhiteButton.tsx';
import Header from '../../components/layout/Header.tsx';
import UserHeader from '../../components/layout/UserHeader.tsx';
import TeacherSideBar from '../../components/layout/TeacherSideBar.tsx';
import Footer from '../../components/layout/Footer.tsx';

export default function Test()
{
    return (
        <>
            <title> Test - Wildocs AI </title>
            <UserHeader/>
            <div className='test-container'>
                <TeacherSideBar/>
                <main className='test-main'>
                
                </main>
            </div>
            <Footer/>
        </>
    );
}