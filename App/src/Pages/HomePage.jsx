import React from 'react'
import Header from '../Components/Header'
import Hero from '../Components/Hero'
import Features from '../Components/Features'
import Pricing from '../Components/Pricing'
import FAQ from '../Components/FAQ'

const HomePage = () => {
    return (
        <div className="min-h-screen bg-slate-900">
            <Header />
            <Hero/>
            <Features />
            <Pricing />
            <FAQ />
        </div>
        
    )
}

export default HomePage