import React, { useEffect } from 'react'
import Header from '../Components/Header'
import Hero from '../Components/Hero'
import Features from '../Components/Features'
import Pricing from '../Components/Pricing'
import FAQ from '../Components/FAQ'
import HowItWorks from '../Components/HowItWorks'
import Testimonials from '../Components/Testimonials'
import Contact from '../Components/Contact'
import Footer from '../Components/Footer'
import BackToTop from '../Components/BackToTop'
import PlatformStats from '../Components/PlatformStats'
import AudienceSection from '../Components/AudienceSection'
import AdFormats from '../Components/AdFormats'
import DashboardPreview from '../Components/DashboardPreview'
import TrustedBy from '../Components/TrustedBy'
import Reveal from '../Components/Reveal'


const HomePage = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-white dark:bg-slate-900">
            
            <Header />
            <Reveal>
            <Hero/>
            </Reveal>

            {/* <TrustedBy/> */}
            <Reveal>
            <Features />
            </Reveal>

            <Reveal>
            <Pricing />
            </Reveal>
            
            <Reveal>
            <HowItWorks/>
            </Reveal>

            <Reveal>
            <AdFormats/>
            </Reveal>
            
            <Reveal>
            <AudienceSection />
            </Reveal>

            <Reveal>
            <DashboardPreview/>
            </Reveal>

            <Reveal>
            <PlatformStats />
            </Reveal>

            <Reveal>
            <Testimonials />
            </Reveal>

            <Reveal>
            <Contact />
            </Reveal>

            <Reveal>
            <FAQ />
            </Reveal>
            <Footer />
            <BackToTop />
        </div>
        
    )
}

export default HomePage