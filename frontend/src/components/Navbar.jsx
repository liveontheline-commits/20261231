import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const { language, toggleLanguage } = useLanguage();

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const t = {
        home: language === 'en' ? 'Home' : 'Anasayfa',
        solutions: language === 'en' ? 'Solutions' : 'Çözümler',
        pricing: language === 'en' ? 'Pricing' : 'Fiyatlandırma',
        company: language === 'en' ? 'Company' : 'Şirket',
        dashboard: language === 'en' ? 'Dashboard' : 'Panel',
        logout: language === 'en' ? 'Logout' : 'Çıkış',
        login: language === 'en' ? 'Log in' : 'Giriş Yap',
        signup: language === 'en' ? 'Sign up' : 'Kayıt Ol',
        title: 'Clone'
    };

    return (
        <nav className="bg-[#0A0A0A] border-b border-gray-800 fixed w-full z-50 top-0 left-0 h-[72px] flex items-center">
            <div className="container mx-auto px-6 h-full">
                <div className="flex justify-between items-center h-full">

                    {/* LOGO */}
                    <Link to="/" className="text-2xl font-medium tracking-tight text-white flex items-center">
                        <span className="font-bold mr-1">Uber</span>Freight {t.title}
                    </Link>

                    {/* DESKTOP MENU */}
                    <div className="hidden md:flex space-x-10 items-center h-full">
                        <Link to="/" className="text-[15px] font-medium text-gray-300 hover:text-white transition-colors h-full flex items-center border-b-2 border-transparent hover:border-white">{t.home}</Link>
                        <Link to="/how-it-works" className="text-[15px] font-medium text-gray-300 hover:text-white transition-colors h-full flex items-center border-b-2 border-transparent hover:border-white">{t.solutions}</Link>
                        <Link to="/pricing" className="text-[15px] font-medium text-gray-300 hover:text-white transition-colors h-full flex items-center border-b-2 border-transparent hover:border-white">{t.pricing}</Link>
                        <Link to="/about" className="text-[15px] font-medium text-gray-300 hover:text-white transition-colors h-full flex items-center border-b-2 border-transparent hover:border-white">{t.company}</Link>
                    </div>

                    {/* RIGHT SIDE: LANG + AUTH */}
                    <div className="hidden md:flex items-center space-x-6">

                        {/* LANGUAGE TOGGLE */}
                        <div className="flex bg-gray-900 rounded p-1">
                            <button
                                onClick={() => toggleLanguage('en')}
                                className={`px-2 py-1 text-xs font-bold rounded ${language === 'en' ? 'bg-[#384BE7] text-white' : 'text-gray-400 hover:text-white'}`}>
                                EN
                            </button>
                            <button
                                onClick={() => toggleLanguage('tr')}
                                className={`px-2 py-1 text-xs font-bold rounded ${language === 'tr' ? 'bg-[#384BE7] text-white' : 'text-gray-400 hover:text-white'}`}>
                                TR
                            </button>
                        </div>

                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-sm font-medium text-white hover:text-gray-300 transition">
                                    {t.dashboard}
                                </Link>
                                <button onClick={handleLogout} className="bg-[#384BE7] text-white px-5 py-2.5 rounded-[4px] text-sm font-medium hover:bg-blue-700 transition">
                                    {t.logout}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-[15px] font-medium text-white hover:text-gray-300 transition">
                                    {t.login}
                                </Link>
                                <Link to="/register" className="bg-white text-black px-5 py-2.5 rounded-[4px] text-[15px] font-medium hover:bg-gray-100 transition">
                                    {t.signup}
                                </Link>
                            </>
                        )}
                    </div>

                    {/* MOBILE MENU TOGGLE */}
                    <div className="md:hidden flex items-center gap-4">
                        {/* Mobile Lang Toggle */}
                        <div className="flex bg-gray-900 rounded p-1">
                            <button
                                onClick={() => toggleLanguage('en')}
                                className={`px-2 py-1 text-xs font-bold rounded ${language === 'en' ? 'bg-[#384BE7] text-white' : 'text-gray-400 hover:text-white'}`}>
                                EN
                            </button>
                            <button
                                onClick={() => toggleLanguage('tr')}
                                className={`px-2 py-1 text-xs font-bold rounded ${language === 'tr' ? 'bg-[#384BE7] text-white' : 'text-gray-400 hover:text-white'}`}>
                                TR
                            </button>
                        </div>
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-gray-300 focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* MOBILE DROPDOWN */}
                {isOpen && (
                    <div className="md:hidden absolute top-[72px] left-0 w-full bg-[#0A0A0A] border-b border-gray-800 animate-slide-down shadow-xl">
                        <div className="px-6 py-6 space-y-4">
                            <Link to="/" className="block text-lg font-medium text-white" onClick={() => setIsOpen(false)}>{t.home}</Link>
                            <Link to="/how-it-works" className="block text-lg font-medium text-white" onClick={() => setIsOpen(false)}>{t.solutions}</Link>
                            <Link to="/pricing" className="block text-lg font-medium text-white" onClick={() => setIsOpen(false)}>{t.pricing}</Link>
                            {user ? (
                                <>
                                    <Link to="/dashboard" className="block text-lg font-medium text-white" onClick={() => setIsOpen(false)}>{t.dashboard}</Link>
                                    <button onClick={handleLogout} className="block w-full text-left text-lg font-medium text-[#384BE7]">{t.logout}</button>
                                </>
                            ) : (
                                <div className="pt-4 border-t border-gray-800 grid gap-4">
                                    <Link to="/login" className="block text-center w-full border border-gray-700 text-white px-4 py-3 rounded-[4px] font-medium" onClick={() => setIsOpen(false)}>
                                        {t.login}
                                    </Link>
                                    <Link to="/register" className="block text-center w-full bg-white text-black px-4 py-3 rounded-[4px] font-medium" onClick={() => setIsOpen(false)}>
                                        {t.signup}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
