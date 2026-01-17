import React, { useEffect, useState } from 'react';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';

const AdminPanel = () => {
    const { language } = useLanguage();
    const [users, setUsers] = useState([]);

    const text = {
        en: {
            title: "Admin Control Center",
            subtitle: "Manage users, companies, and platform integrity.",
            username: "Username",
            email: "Email",
            role: "Role",
            company: "Company",
            status: "Verification",
            actions: "Actions",
            verifyBtn: "Verify Company",
            alertSuccess: "Company verified successfully",
            pending: "Pending",
            rejected: "Rejected",
            rejectBtn: "Reject",
            searchPlaceholder: "Search users or companies...",
            loading: "Fetching platform data..."
        },
        tr: {
            title: "Admin Kontrol Merkezi",
            subtitle: "Kullanıcıları, şirketleri ve platform bütünlüğünü yönetin.",
            username: "Kullanıcı Adı",
            email: "E-posta",
            role: "Rol",
            company: "Şirket",
            status: "Doğrulama",
            actions: "İşlemler",
            verifyBtn: "Şirketi Doğrula",
            alertSuccess: "Şirket başarıyla doğrulandı",
            pending: "Beklemede",
            rejected: "Reddedildi",
            rejectBtn: "Reddet",
            searchPlaceholder: "Kullanıcı veya şirket ara...",
            loading: "Platform verileri getiriliyor..."
        }
    };

    const t = text[language];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to fetch users', err);
        }
    };

    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.company_name && u.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleVerify = async (companyId, status) => {
        try {
            await api.put(`/admin/companies/${companyId}/verify`, { status });
            alert(status === 'VERIFIED' ? t.alertSuccess : 'Status updated');
            fetchUsers();
        } catch (err) {
            alert(t.alertFail);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-3xl font-black text-black uppercase tracking-tight">{t.title}</h2>
                    <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mt-1">{t.subtitle}</p>
                </div>
                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#384BE7]/20 transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">{t.username}</th>
                                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">{t.email}</th>
                                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">{t.role}</th>
                                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">{t.company}</th>
                                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">{t.status}</th>
                                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">{t.actions}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="p-6 font-bold text-black">{user.username}</td>
                                    <td className="p-6 text-gray-500 font-medium">{user.email}</td>
                                    <td className="p-6">
                                        <span className="text-[10px] font-black uppercase bg-gray-100 px-2 py-1 rounded text-gray-600 tracking-tighter">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-6 text-black font-bold">{user.company_name || '-'}</td>
                                    <td className="p-6">
                                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded tracking-tighter ${user.verification_status === 'VERIFIED' ? 'bg-green-100 text-green-700' :
                                                user.verification_status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {user.verification_status === 'VERIFIED' ? t.verified : user.verification_status === 'REJECTED' ? t.rejected : t.pending}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        {user.company_name && user.verification_status !== 'VERIFIED' && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleVerify(user.company_id || 0, 'VERIFIED')}
                                                    className="bg-[#384BE7] text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition shadow-lg"
                                                >
                                                    {t.verifyBtn}
                                                </button>
                                                {user.verification_status !== 'REJECTED' && (
                                                    <button
                                                        onClick={() => handleVerify(user.company_id || 0, 'REJECTED')}
                                                        className="bg-white text-red-500 border border-red-100 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition"
                                                    >
                                                        {t.rejectBtn}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
