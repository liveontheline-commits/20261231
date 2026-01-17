import React from 'react';
import Sidebar from './Sidebar';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import NotificationCenter from './NotificationCenter';

const DashboardLayout = ({ children }) => {
    const { language } = useLanguage();
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) return <>{children}</>;

    const isShipper = user.role.startsWith('RCV');
    const isCarrier = user.role.startsWith('TRANS');

    const mobileText = {
        en: {
            home: "Home",
            shipments: "Shipments",
            find: "Find",
            fleet: "Fleet",
            more: "More"
        },
        tr: {
            home: "Panel",
            shipments: "Yüklerim",
            find: "Bul",
            fleet: "Filo",
            more: "Daha"
        }
    };

    const mt = mobileText[language];
    const location = useLocation();

    // Map path to title
    const pathTitles = {
        '/dashboard': language === 'tr' ? 'Kontrol Kulesi' : 'Control Tower',
        '/my-shipments': language === 'tr' ? 'Sevkiyatlarım' : 'My Shipments',
        '/find-loads': language === 'tr' ? 'Yük Bul' : 'Find Loads',
        '/my-fleet': language === 'tr' ? 'Filom' : 'My Fleet',
        '/financials': language === 'tr' ? 'Finans HQ' : 'Finance HQ',
        '/reports': language === 'tr' ? 'Analizler' : 'Analytics',
        '/team': language === 'tr' ? 'Ekibim' : 'My Team',
        '/create-job-wizard': language === 'tr' ? 'Akıllı Yük İlanı' : 'Smart Load Wizard',
    };

    const currentTitle = pathTitles[location.pathname] || 'Enterprise HQ';

    return (
        <div className="flex min-h-screen bg-[#F8F9FB] font-sans">
            {/* Sidebar (Desktop) */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* GLOBAL TOP BAR */}
                <header className="bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center sticky top-0 z-40">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-lg font-black text-gray-900 tracking-tight uppercase">{currentTitle}</h2>
                        <span className="h-4 w-px bg-gray-200 hidden md:block"></span>
                        <p className="text-xs text-gray-400 font-bold hidden md:block uppercase tracking-widest">
                            {user.username} <span className="text-gray-200 ml-1">|</span> <span className="text-[#384BE7]">{user.role}</span>
                        </p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <NotificationCenter />
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-black text-xs text-gray-500 border border-white shadow-sm">
                            {user.username?.[0]?.toUpperCase()}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 lg:p-10 pb-24 lg:pb-10">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 transition-all">
                <NavLink to="/dashboard" className={({ isActive }) => `flex flex-col items-center space-y-1 ${isActive ? 'text-[#384BE7]' : 'text-gray-400'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
                    <span className="text-[10px] font-black uppercase tracking-tighter">{mt.home}</span>
                </NavLink>

                {isShipper && (
                    <NavLink to="/my-shipments" className={({ isActive }) => `flex flex-col items-center space-y-1 ${isActive ? 'text-[#384BE7]' : 'text-gray-400'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M7.5 4.27a10 10 0 1 1 9 0" /><path d="M12 12V4" /><path d="m12 12 5.1 5.1" /><path d="m12 12-5.1 5.1" /></svg>
                        <span className="text-[10px] font-black uppercase tracking-tighter">{mt.shipments}</span>
                    </NavLink>
                )}

                {isCarrier && (
                    <NavLink to="/find-loads" className={({ isActive }) => `flex flex-col items-center space-y-1 ${isActive ? 'text-[#384BE7]' : 'text-gray-400'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                        <span className="text-[10px] font-black uppercase tracking-tighter">{mt.find}</span>
                    </NavLink>
                )}

                {isCarrier && (
                    <NavLink to="/my-fleet" className={({ isActive }) => `flex flex-col items-center space-y-1 ${isActive ? 'text-[#384BE7]' : 'text-gray-400'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M9 3.13a4 4 0 0 1 0 7.75" /></svg>
                        <span className="text-[10px] font-black uppercase tracking-tighter">{mt.fleet}</span>
                    </NavLink>
                )}

                <NavLink to="/financials" className={({ isActive }) => `flex flex-col items-center space-y-1 ${isActive ? 'text-[#384BE7]' : 'text-gray-400'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                    <span className="text-[10px] font-black uppercase tracking-tighter">{mt.more}</span>
                </NavLink>
            </div>
        </div>
    );
};

export default DashboardLayout;
