import React, { useEffect, useState } from 'react';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';

const TeamManagement = () => {
    const { language } = useLanguage();
    const [team, setTeam] = useState([]);
    const [newMember, setNewMember] = useState({ username: '', email: '', password: '', full_name: '' });

    const text = {
        en: {
            title: "Team Management",
            addStaff: "Add Staff Member",
            fullName: "Full Name",
            username: "Username",
            email: "Email",
            password: "Password",
            createUser: "Create User",
            currentTeam: "Current Team",
            nameCol: "Name",
            roleCol: "Role",
            statusCol: "Status",
            alertAdded: "Member Added",
            alertFail: "Failed to add member"
        },
        tr: {
            title: "Ekip Yönetimi",
            addStaff: "Personel Ekle",
            fullName: "Ad Soyad",
            username: "Kullanıcı Adı",
            email: "E-posta",
            password: "Şifre",
            createUser: "Kullanıcı Oluştur",
            currentTeam: "Mevcut Ekip",
            nameCol: "İsim",
            roleCol: "Rol",
            statusCol: "Durum",
            alertAdded: "Üye Eklendi",
            alertFail: "Üye eklenemedi"
        }
    };

    const t = text[language];

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            const res = await api.get('/enterprise/team');
            setTeam(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('/enterprise/team', newMember);
            alert(t.alertAdded);
            fetchTeam();
            setNewMember({ username: '', email: '', password: '', full_name: '' });
        } catch (err) {
            alert(t.alertFail);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen selection:bg-[#384BE7] selection:text-white">
            <h2 className="text-3xl font-black mb-8 text-black uppercase tracking-tight">{t.title}</h2>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-10">
                <h3 className="text-xl font-black mb-6 flex items-center">
                    <span className="w-2 h-8 bg-[#384BE7] rounded-full mr-3"></span>
                    {t.addStaff}
                </h3>
                <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input className="bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-[#384BE7] outline-none font-bold" placeholder={t.fullName} value={newMember.full_name} onChange={e => setNewMember({ ...newMember, full_name: e.target.value })} required />
                    <input className="bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-[#384BE7] outline-none font-bold" placeholder={t.username} value={newMember.username} onChange={e => setNewMember({ ...newMember, username: e.target.value })} required />
                    <input className="bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-[#384BE7] outline-none font-bold" placeholder={t.email} type="email" value={newMember.email} onChange={e => setNewMember({ ...newMember, email: e.target.value })} required />
                    <input className="bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-[#384BE7] outline-none font-bold" placeholder={t.password} type="password" value={newMember.password} onChange={e => setNewMember({ ...newMember, password: e.target.value })} required />
                    <button type="submit" className="bg-black text-white p-4 rounded-xl md:col-span-2 font-black uppercase tracking-widest hover:bg-gray-800 transition shadow-xl mt-2">
                        {t.createUser}
                    </button>
                </form>
            </div>

            <div className="bg-white p-1 rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50">
                    <h3 className="text-xl font-black uppercase tracking-tight">{t.currentTeam}</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">{t.nameCol}</th>
                                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">{t.email}</th>
                                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">{t.roleCol}</th>
                                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">{t.statusCol}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {team.map(user => (
                                <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="p-6 font-bold text-black">{user.full_name}</td>
                                    <td className="p-6 text-gray-500 font-medium">{user.email}</td>
                                    <td className="p-6"><span className="text-[10px] font-black uppercase bg-gray-100 px-2 py-1 rounded text-gray-600 tracking-tighter">{user.role}</span></td>
                                    <td className="p-6">
                                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded tracking-tighter ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {user.status}
                                        </span>
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

export default TeamManagement;
