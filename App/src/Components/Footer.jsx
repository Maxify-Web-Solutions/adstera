import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaLinkedin, FaGithub, FaDiscord } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-slate-950 text-slate-300 py-12 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {/* Brand */}
                <div className="col-span-1 md:col-span-1">
                    <Link to="/" className="text-2xl font-bold text-white mb-4 block">
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            Adstera
                        </span>
                    </Link>
                    <p className="text-sm text-slate-400 mb-6">
                        Next-generation advertising network connecting premium publishers with top-tier advertisers.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-indigo-400 transition"><FaTwitter size={20} /></a>
                        <a href="#" className="hover:text-indigo-400 transition"><FaLinkedin size={20} /></a>
                        <a href="#" className="hover:text-indigo-400 transition"><FaGithub size={20} /></a>
                        <a href="#" className="hover:text-indigo-400 transition"><FaDiscord size={20} /></a>
                    </div>
                </div>

                {/* Links Column 1 */}
                <div>
                    <h4 className="text-white font-semibold mb-4">Platform</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-indigo-400 transition">Advertisers</Link></li>
                        <li><Link to="/" className="hover:text-indigo-400 transition">Publishers</Link></li>
                        <li><Link to="/" className="hover:text-indigo-400 transition">Pricing</Link></li>
                        <li><Link to="/" className="hover:text-indigo-400 transition">Features</Link></li>
                    </ul>
                </div>

                {/* Links Column 2 */}
                <div>
                    <h4 className="text-white font-semibold mb-4">Company</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-indigo-400 transition">About Us</Link></li>
                        <li><Link to="/" className="hover:text-indigo-400 transition">Careers</Link></li>
                        <li><Link to="/" className="hover:text-indigo-400 transition">Blog</Link></li>
                        <li><Link to="/" className="hover:text-indigo-400 transition">Contact</Link></li>
                    </ul>
                </div>

                {/* Links Column 3 */}
                <div>
                    <h4 className="text-white font-semibold mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-indigo-400 transition">Privacy Policy</Link></li>
                        <li><Link to="/" className="hover:text-indigo-400 transition">Terms of Service</Link></li>
                        <li><Link to="/" className="hover:text-indigo-400 transition">Cookie Policy</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
                &copy; {new Date().getFullYear()} Adstera Inc. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;