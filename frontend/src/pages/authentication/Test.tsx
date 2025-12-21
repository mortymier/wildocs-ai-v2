// This page is for testing the look of components

import '../styles/Test.css';
import GoldButton from '../../components/buttons/GoldButton.tsx';
import MaroonButton from '../../components/buttons/MaroonButton.tsx';
import WhiteButton from '../../components/buttons/WhiteButton.tsx';
import Header from '../../components/layout/Header.tsx';

export default function Test()
{
    return (
        <>
            <title> Test - Wildocs AI </title>
            <Header/>
            <main className='test-container'>
                <GoldButton btnText="Gold"/>
                <MaroonButton btnText="Maroon"/>
                <WhiteButton btnText="White"/>
            </main>
        </>
    );
}