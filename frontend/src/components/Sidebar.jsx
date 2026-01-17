import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

// Inline Icons (SVG)
const Icons = {
    Dashboard: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
    ),
    Reports: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10" /><line x1="18" x2="18" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="16" /></svg>
    ),
    Financials: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
    ),
    Fleet: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    ),
    Shipments: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.5 4.27a10 10 0 1 1 9 0" /><path d="M12 12V4" /><path d="m12 12 5.1 5.1" /><path d="m12 12-5.1 5.1" /></svg>
    ),
    Post: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="16" /><line x1="8" x2="16" y1="12" y2="12" /></svg>
    ),
    Book: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></svg>
    ),
    Match: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 3 4 4-4 4" /><path d="M20 7H4" /><path d="m8 21-4-4 4-4" /><path d="M4 17h16" /></svg>
    )
};

const Sidebar = () => {
    const { language } = useLanguage();
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (!user) return null;

    const isShipper = user.role.startsWith('RCV');
    const isCarrier = user.role.startsWith('TRANS');

    const text = {
        en: {
            dashboard: "Control Tower",
            shipments: "My Shipments",
            findLoads: "Find Loads",
            fleet: "My Fleet",
            postEmpty: "Post Empty Return",
            financials: "Financials",
            reports: "Reports",
            addressBook: "Address Book",
            team: "Team Management",
            admin: "Admin Console",
            createJob: "Get a Quote"
        },
        tr: {
            dashboard: "Kontrol Kulesi",
            shipments: "Sevkiyatlarım",
            findLoads: "Yük Bul",
            fleet: "Filom",
            postEmpty: "Boş Dönüş Bildir",
            financials: "Finans",
            reports: "Raporlar",
            addressBook: "Adres Defteri",
            team: "Ekip Yönetimi",
            admin: "Yönetici Paneli",
            createJob: "Teklif Al"
        }
    };

    const t = text[language];

    const menuItems = [
        { name: t.dashboard, path: '/dashboard', icon: Icons.Dashboard },
        ...(isShipper ? [
            { name: t.createJob, path: '/create-job-wizard', icon: Icons.Post },
            { name: t.shipments, path: '/my-shipments', icon: Icons.Shipments },
        ] : []),
        ...(isCarrier ? [
            { name: t.findLoads, path: '/find-loads', icon: Icons.Fleet },
            { name: t.postEmpty, path: '/empty-vehicle', icon: Icons.Match },
            { name: t.fleet, path: '/my-fleet', icon: Icons.Fleet },
        ] : []),
        { name: t.financials, path: '/financials', icon: Icons.Financials },
        { name: t.reports, path: '/reports', icon: Icons.Reports },
        { name: t.addressBook, path: '/address-book', icon: Icons.Book },
        { name: t.team, path: '/team', icon: Icons.Fleet },
        ...(user.role === 'ADMIN' ? [{ name: t.admin, path: '/admin', icon: Icons.Dashboard }] : [])
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-[calc(100vh-72px)] sticky top-[72px] z-40 hidden lg:flex">
            <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 group ${isActive
                                ? 'bg-[#384BE7] text-white shadow-lg shadow-blue-100'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                            }`
                        }
                    >
                        <item.icon />
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </div>

            <div className="p-4 border-t border-gray-50">
                <div className="bg-gray-50 rounded-2xl p-4 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-black text-xs">
                        {user.username.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-black text-black truncate">{user.full_name || user.username}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{user.role}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
