import React, { useEffect } from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import BackToTop from '../Components/BackToTop'

const PrivacyPolicy = () => {
        useEffect(() => {
            window.scrollTo(0, 0);
        }, []);

    return (
        <div className="min-h-screen w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-300 transition-colors duration-300">
            <Header />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-20">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    This Privacy Policy explains how our platform collects, uses, and protects your
                    information when you use our website and services. By using our platform,
                    you agree to the collection and use of information in accordance with this policy.
                </p>

                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mt-10 mb-4">Information We Collect</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    We may collect personal information such as your name, email address, payment
                    information, and usage data when you register on our platform or use our services.
                </p>

                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mt-10 mb-4">How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
                    <li>To provide and maintain our services</li>
                    <li>To improve user experience</li>
                    <li>To process payments and subscriptions</li>
                    <li>To communicate important updates</li>
                </ul>

                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mt-10 mb-4">Cookies</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Our website may use cookies and similar tracking technologies to enhance user
                    experience and analyze website traffic.
                </p>

                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mt-10 mb-4">Third-Party Services</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    We may use third‑party services such as advertising networks, analytics tools,
                    and payment processors. These services may collect information according to
                    their own privacy policies.
                </p>

                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mt-10 mb-4">Data Security</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    We take reasonable measures to protect your information from unauthorized
                    access, misuse, or disclosure.
                </p>

                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mt-10 mb-4">Changes to This Policy</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    We may update this Privacy Policy from time to time. Any changes will be
                    posted on this page.
                </p>

                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mt-10 mb-4">Contact Us</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    If you have any questions about this Privacy Policy, you can contact us
                    through the contact page on our website.
                </p>
            </div>

            <Footer />
            <BackToTop />
        </div>
    )
}

export default PrivacyPolicy
