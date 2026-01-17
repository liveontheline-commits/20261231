import React, { useState, useEffect } from 'react';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';

const NotificationCenter = () => {
    const { language } = useLanguage();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const text = {
        en: { title: "Notifications", empty: "No new alerts", markAll: "Mark all as read" },
        tr: { title: "Bildirimler", empty: "Yeni bildirim yok", markAll: "Tümünü okundu işaretle" }
    };
    const t = text[language];

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
            setUnreadCount(res.data.filter(n => !n.is_read).length);
        } catch (err) {
            console.error('Failed to fetch notifications');
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.post(`/notifications/${id}/read`);
            fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-[#384BE7] transition duration-300 bg-white border border-gray-100 rounded-xl shadow-sm"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-[10px] font-black text-white flex items-center justify-center border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fade-in-up">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                            <h4 className="text-sm font-black uppercase tracking-widest text-black">{t.title}</h4>
                            {unreadCount > 0 && <span className="text-[10px] font-black text-[#384BE7] uppercase tracking-widest">{unreadCount} New</span>}
                        </div>
                        <div className="max-h-96 overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                    {t.empty}
                                </div>
                            ) : (
                                notifications.map(n => (
                                    <div
                                        key={n.id}
                                        onClick={() => markAsRead(n.id)}
                                        className={`p-5 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${!n.is_read ? 'bg-blue-50/50' : ''}`}
                                    >
                                        <p className={`text-xs leading-relaxed ${!n.is_read ? 'font-black text-black' : 'font-medium text-gray-500'}`}>
                                            {n.message}
                                        </p>
                                        <p className="text-[9px] text-gray-300 font-black uppercase tracking-widest mt-2">
                                            {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationCenter;
