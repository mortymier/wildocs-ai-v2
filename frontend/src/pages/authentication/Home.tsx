import Header from '../../components/layout/Header.tsx';
import Footer from '../../components/layout/Footer.tsx';
import GoldButton from '../../components/buttons/GoldButton.tsx';
import hero_image from '../../assets/hero_image.webp';
import { FaCircleCheck } from 'react-icons/fa6';
import { IoPeople } from 'react-icons/io5';
import { FaChartPie } from 'react-icons/fa';
import '../styles/Home.css';

export default function Home()
{
    return (
        <>
            <Header/>
            <main className="home-container">
                <section className="hero">
                    <div>
                        <h1> WILDOCS AI </h1>
                        <h2> AI-Powered SDD Document Evaluator System </h2>
                        <hr/>
                        <p> 
                            Streamline your software design document evaluation process
                            with our comprehensive analysis tools. Get detailed insights,
                            automated scoring, and collaborative review features all in
                            one platform.
                        </p>
                        <GoldButton btnText={"Get Started"}/>
                    </div>
                    <div>
                        <img src={hero_image} alt="Hero section image about AI"/>
                    </div>
                </section>
                <section className="features">
                    <h2> Platform Features </h2>
                    <p> 
                        Discover comprehensive tools that make SDD evaluation <br/>
                        efficient and thorough
                    </p>
                    <div className="feature-card-container">
                        <div className="feature-card">
                            <FaCircleCheck/>
                            <h3> Automated Analysis </h3>
                            <p> 
                                Advanced algorithms analyze your software design documents
                                for completeness, consistency, and best practices compliance.
                            </p>
                        </div>
                        <div className="feature-card">
                            <IoPeople/>
                            <h3> Class Collaboration </h3>
                            <p>
                                Enable seamless class collaboration with real-time SDD submissions,
                                feedbacking, and evaluation.
                            </p>
                        </div>
                        <div className="feature-card">
                            <FaChartPie/>
                            <h3> Detailed Evaluation </h3>
                            <p>
                                Receive comprehensive evaluation reports with scoring metrics,
                                error identification, and improvement suggestions.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer/>
        </>
    );
}