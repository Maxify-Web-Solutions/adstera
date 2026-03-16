import React, { useEffect } from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import BackToTop from '../Components/BackToTop'

const TermsOfService = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen w-full bg-slate-900 text-gray-300">
            <Header />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-20">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Terms of Service</h1>

                <p className="mb-6">
                    These Terms of Service govern your use of our website and services. By
                    accessing or using our platform, you agree to comply with these terms.
                    If you do not agree with any part of the terms, you may not use our
                    services.
                </p>

                <h2 className="text-xl md:text-2xl font-semibold text-white mt-10 mb-4">Use of Service</h2>
                <p className="mb-4">
                    You agree to use our platform only for lawful purposes and in accordance
                    with these Terms. You must not misuse the service, attempt to gain
                    unauthorized access, or interfere with the platform's operation.
                </p>

                <h2 className="text-xl md:text-2xl font-semibold text-white mt-10 mb-4">User Accounts</h2>
                <p className="mb-4">
                    When you create an account, you are responsible for maintaining the
                    confidentiality of your login credentials and for all activities that
                    occur under your account.
                </p>

                <h2 className="text-xl md:text-2xl font-semibold text-white mt-10 mb-4">Payments & Subscriptions</h2>
                <p className="mb-4">
                    Some features of the platform may require payment or a subscription.
                    By purchasing a plan, you agree to provide accurate billing
                    information and authorize us to process payments.
                </p>

                <h2 className="text-xl md:text-2xl font-semibold text-white mt-10 mb-4">Prohibited Activities</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Using the platform for illegal purposes</li>
                    <li>Attempting to hack, disrupt, or damage the system</li>
                    <li>Reselling or redistributing platform services without permission</li>
                </ul>

                <h2 className="text-xl md:text-2xl font-semibold text-white mt-10 mb-4">Limitation of Liability</h2>
                <p className="mb-4">
                    Our platform is provided "as is" without warranties of any kind. We
                    are not responsible for any damages, data loss, or business losses
                    resulting from the use of our services.
                </p>

                <h2 className="text-xl md:text-2xl font-semibold text-white mt-10 mb-4">Termination</h2>
                <p className="mb-4">
                    We reserve the right to suspend or terminate accounts that violate
                    these Terms of Service or misuse the platform.
                </p>

                <h2 className="text-xl md:text-2xl font-semibold text-white mt-10 mb-4">Changes to Terms</h2>
                <p className="mb-4">
                    We may update these Terms from time to time. Continued use of the
                    platform after changes are posted means you accept the revised
                    terms.
                </p>

                <h2 className="text-xl md:text-2xl font-semibold text-white mt-10 mb-4">Contact</h2>
                <p>
                    If you have any questions about these Terms of Service, please contact
                    us through the contact page on our website.
                </p>
            </div>

            <Footer />
            <BackToTop />
        </div>
    )
}

export default TermsOfService
