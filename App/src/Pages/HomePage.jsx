import React from 'react'
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

const HomePage = () => {
    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-slate-900">
            <Header />
            <Hero/>
            <Features />
            <Pricing />
            <HowItWorks/>
            <PlatformStats />
            <AudienceSection />
            <Testimonials />
            <Contact />
            <FAQ />
            <Footer />
            <BackToTop />
        </div>
        
    )
}

export default HomePage