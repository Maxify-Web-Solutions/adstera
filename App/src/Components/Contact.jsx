import React from 'react';
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

const Contact = () => {
    return (
        <section className="bg-slate-900 text-white py-16 md:py-20 relative">
            {/* Background decoration */}
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 blur-3xl rounded-full -z-0 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                        Get in <span className="text-indigo-400">Touch</span>
                    </h2>
                    <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
                        Have questions or need a custom plan? Our team is here to help you grow.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
                            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
                                        <FiMail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg">Email Us</h4>
                                        <p className="text-slate-400">support@adstera.com</p>
                                        <p className="text-slate-400">sales@adstera.com</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
                                        <FiPhone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg">Call Us</h4>
                                        <p className="text-slate-400">+1 (555) 123-4567</p>
                                        <p className="text-slate-400">Mon-Fri, 9am-6pm EST</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
                                        <FiMapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg">Visit Us</h4>
                                        <p className="text-slate-400">123 AdTech Blvd, Suite 400</p>
                                        <p className="text-slate-400">New York, NY 10001</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <form className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
                                <input type="text" className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="John" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
                                <input type="text" className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="Doe" />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                            <input type="email" className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="john@example.com" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                            <textarea rows="4" className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="How can we help you?"></textarea>
                        </div>

                        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-lg transition-colors shadow-lg shadow-indigo-600/20">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;