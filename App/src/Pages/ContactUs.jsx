import React, { useState } from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import BackToTop from '../Components/BackToTop'

const faqs = [
    {
        question: "How long does it take to get a response?",
        answer: "Most inquiries are answered within 24 hours during business days."
    },
    {
        question: "Do you offer technical support?",
        answer: "Yes. Our support team can help with technical issues and platform guidance."
    },
    {
        question: "Can I request a feature?",
        answer: "Absolutely. We welcome feature suggestions from our users and evaluate them regularly."
    },
    {
        question: "Is my data secure?",
        answer: "We use modern security practices and industry standards to protect user data."
    },
    {
        question: "Do you offer refunds?",
        answer: "Refund policies depend on the subscription plan. Please contact support for assistance."
    },
    {
        question: "Can I upgrade my plan later?",
        answer: "Yes. You can upgrade your plan anytime from your dashboard."
    },
    {
        question: "Do you provide enterprise solutions?",
        answer: "Yes, we offer enterprise plans with custom features and dedicated support."
    },
    {
        question: "How can I contact support quickly?",
        answer: "You can use the contact form on this page or email our support team directly."
    }
]

const contactInfo = [
    {
        title: "Customer Support",
        description: "Need help with the platform or facing technical issues?",
        email: "support@yourdomain.com",
        phone: "+1 (555) 123-4567"
    },
    {
        title: "Business & Partnerships",
        description: "Interested in partnerships or enterprise plans?",
        email: "business@yourdomain.com",
        phone: "+1 (555) 987-6543"
    },
    {
        title: "Sales",
        description: "Questions about pricing, plans, or product features.",
        email: "sales@yourdomain.com",
        phone: "+1 (555) 111-2222"
    }
]

const ContactUs = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })

    const [openFAQ, setOpenFAQ] = useState(null)

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index)
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        alert('Message submitted! Connect this form to your backend or email service.')
    }

    return (
        <div className="min-h-screen w-full bg-slate-900 text-gray-300">
            <Header />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">

                {/* Heading */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Contact Us
                    </h1>
                    <p className="max-w-2xl mx-auto text-gray-400">
                        Have questions about our platform, pricing, or features? Our team is here to help.
                        Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                {/* TOP GRID */}
                <div className="grid lg:grid-cols-2 gap-10 items-start">

                    {/* LEFT CARDS */}
                    <div className="flex flex-col gap-6">

                        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                            <h3 className="text-xl font-semibold text-white mb-3">
                                Customer Support
                            </h3>
                            <p className="text-gray-400 mb-2">
                                Need help with the platform or facing technical issues?
                            </p>
                            <p className="text-blue-400">support@yourdomain.com</p>
                            <p className="text-gray-400">+1 (555) 123-4567</p>
                        </div>

                        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                            <h3 className="text-xl font-semibold text-white mb-3">
                                Business & Partnerships
                            </h3>
                            <p className="text-gray-400 mb-2">
                                Interested in partnerships or enterprise plans?
                            </p>
                            <p className="text-blue-400">business@yourdomain.com</p>
                            <p className="text-gray-400">+1 (555) 987-6543</p>
                        </div>

                        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                            <h3 className="text-xl font-semibold text-white mb-3">
                                Sales
                            </h3>
                            <p className="text-gray-400 mb-2">
                                Questions about pricing, plans, or product features.
                            </p>
                            <p className="text-blue-400">sales@yourdomain.com</p>
                            <p className="text-gray-400">+1 (555) 111-2222</p>
                        </div>

                    </div>

                    {/* CONTACT FORM */}
                    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">

                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="grid md:grid-cols-2 gap-4">

                                <div>
                                    <label className="block mb-2 text-sm text-gray-400">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm text-gray-400">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 focus:outline-none"
                                    />
                                </div>

                            </div>

                            <div>
                                <label className="block mb-2 text-sm text-gray-400">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm text-gray-400">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    rows="5"
                                    value={form.message}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 focus:outline-none resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition"
                            >
                                Send Message
                            </button>

                        </form>

                    </div>

                </div>

                {/* BOTTOM INFO */}
                <div className="grid md:grid-cols-2 gap-6 mt-12">

                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                        <h3 className="text-xl font-semibold text-white mb-3">
                            Office Location
                        </h3>
                        <p className="text-gray-400">
                            123 Tech Avenue <br />
                            Silicon Valley, CA 94043 <br />
                            United States
                        </p>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                        <h3 className="text-xl font-semibold text-white mb-3">
                            Working Hours
                        </h3>
                        <p className="text-gray-400">
                            Monday - Friday: 9:00 AM - 6:00 PM <br />
                            Saturday: 10:00 AM - 4:00 PM <br />
                            Sunday: Closed
                        </p>
                    </div>

                </div>

                <div className="mt-10 space-y-4">

                    {faqs.map((faq, index) => {
                        const isOpen = openFAQ === index;

                        return (
                            <div
                                key={index}
                                className={`border rounded-xl bg-slate-800 overflow-hidden transition-all duration-300
                                            ${isOpen ? "border-blue-500/60 shadow-lg shadow-blue-500/10" : "border-slate-700"}`}
                            >

                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex justify-between items-center p-5 text-left hover:bg-slate-700/40 transition"
                                >
                                    <span className="text-white font-medium text-sm md:text-base">
                                        {faq.question}
                                    </span>

                                    <span
                                        className={`text-blue-400 text-xl transition-transform duration-300 ${isOpen ? "rotate-45" : ""
                                            }`}
                                    >
                                        +
                                    </span>
                                </button>

                                <div
                                    className={`transition-all duration-300 ease-in-out overflow-hidden
                                    ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                                >
                                    <p className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>

                            </div>
                        );
                    })}

                </div>

            </div>
            <Footer />
            <BackToTop />
        </div>
    )
}

export default ContactUs
