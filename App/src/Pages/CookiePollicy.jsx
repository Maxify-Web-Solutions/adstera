import React, { useEffect } from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import BackToTop from '../Components/BackToTop'

const CookiePolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen w-full dark:bg-slate-900 dark:text-gray-300 transition-colors duration-300 bg-gray-50 text-gray-900">
            <Header />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-20">
                <h1 className="text-3xl md:text-4xl font-bold dark:text-white text-gray-900 mb-8">Cookie Policy</h1>

                <p className="mb-6">
                    This Cookie Policy explains how our website uses cookies and similar
                    technologies to recognize you when you visit our platform. It
                    explains what these technologies are and why we use them, as well as
                    your rights to control our use of them.
                </p>

                <h2 className="text-xl md:text-2xl font-semibold dark:text-white text-gray-900 mt-10 mb-4">What Are Cookies</h2>
                <p className="mb-4">
                    Cookies are small text files that are stored on your device when you
                    visit a website. They are widely used to make websites work more
                    efficiently and to provide reporting information.
                </p>

                <h2 className="text-xl md:text-2xl font-semibold dark:text-white text-gray-900 mt-10 mb-4">How We Use Cookies</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>To keep users logged into their accounts</li>
                    <li>To remember user preferences</li>
                    <li>To analyze website traffic and performance</li>
                    <li>To support advertising and marketing services</li>
                </ul>

                <h2 className="text-xl md:text-2xl font-semibold dark:text-white text-gray-900 mt-10 mb-4">Third-Party Cookies</h2>
                <p className="mb-4">
                    In some cases, we may use cookies provided by trusted third parties.
                    These may include analytics providers, advertising networks, or
                    payment services that help us improve our platform.
                </p>

                <h2 className="text-xl md:text-2xl font-semibold dark:text-white text-gray-900 mt-10 mb-4">Managing Cookies</h2>
                <p className="mb-4">
                    Most web browsers allow you to control cookies through their
                    settings. You can choose to block or delete cookies, but doing so
                    may affect certain features of the website.
                </p>

                <h2 className="text-xl md:text-2xl font-semibold dark:text-white text-gray-900 mt-10 mb-4">Updates to This Policy</h2>
                <p className="mb-4">
                    We may update this Cookie Policy from time to time to reflect
                    changes in technology, legislation, or our services.
                </p>

                <h2 className="text-xl md:text-2xl font-semibold dark:text-white text-gray-900 mt-10 mb-4">Contact Us</h2>
                <p>
                    If you have any questions about our Cookie Policy, please contact us
                    through the contact page on our website.
                </p>
            </div>

            <Footer />
            <BackToTop />
        </div>
    )
}

export default CookiePolicy
