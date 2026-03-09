import React from 'react'
import Header from '../Components/Header'
import Hero from '../Components/Hero'

const HomePage = () => {
    return (
        <div className="min-h-screen bg-slate-900">
            <Header />
            <Hero/>
            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-white">Welcome to the Dashboard</h1>
                <p className="mt-4 text-lg text-slate-300">You are now logged in. Use the navigation bar above to access different sections.</p>
            </main>
        </div>
    )
}

export default HomePage