import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Register = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [formData, setFormData] = useState({
        company_name: '',
        company_type: 'TRANSPORTER',
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const text = {
        en: {
            title: "Join the Network",
            companyLabel: "Company Legal Name",
            typeLabel: "Business Model",
            transporter: "Transporter / Carrier",
            receiver: "Shipper / Customer",
            username: "Primary Username",
            email: "Work Email",
            password: "Secure Password",
            submit: "Create Account",
            already: "Already have an account?",
            login: "Sign In",
            alertSuccess: "Registration Successful! Please Login.",
            alertFail: "Registration failed"
        },
        tr: {
            title: "Ağa Katılın",
            companyLabel: "Resmi Şirket Adı",
            typeLabel: "İş Modeli",
            transporter: "Nakliyeci / Taşıyıcı",
            receiver: "Yük Sahibi / Müşteri",
            username: "Birincil Kullanıcı Adı",
            email: "İş E-postası",
            password: "Güvenli Şifre",
            submit: "Hesap Oluştur",
            already: "Zaten bir hesabınız var mı?",
            login: "Giriş Yap",
            alertSuccess: "Kayıt Başarılı! Lütfen Giriş Yapın.",
            alertFail: "Kayıt başarısız"
        }
    };

    const t = text[language];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/register', formData);
            alert(t.alertSuccess);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || t.alertFail);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white py-20 px-4">
            <div className="bg-white p-12 rounded-[2rem] shadow-2xl w-full max-w-2xl border border-gray-50">
                <div className="mb-10 text-center">
                    <h2 className="text-4xl font-black text-black uppercase tracking-tighter mb-2">{t.title}</h2>
                    <div className="w-12 h-1 bg-[#384BE7] mx-auto rounded-full"></div>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 text-sm font-bold uppercase tracking-widest">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{t.companyLabel}</label>
                        <input name="company_name" required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl font-bold focus:ring-4 focus:ring-blue-100 focus:border-[#384BE7] outline-none transition-all" />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{t.typeLabel}</label>
                        <select name="company_type" onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl font-bold focus:ring-4 focus:ring-blue-100 focus:border-[#384BE7] outline-none transition-all">
                            <option value="TRANSPORTER">{t.transporter}</option>
                            <option value="RECEIVER">{t.receiver}</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{t.username}</label>
                        <input name="username" required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl font-bold focus:ring-4 focus:ring-blue-100 focus:border-[#384BE7] outline-none transition-all" />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{t.email}</label>
                        <input type="email" name="email" required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl font-bold focus:ring-4 focus:ring-blue-100 focus:border-[#384BE7] outline-none transition-all" />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{t.password}</label>
                        <input type="password" name="password" required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl font-bold focus:ring-4 focus:ring-blue-100 focus:border-[#384BE7] outline-none transition-all" />
                    </div>

                    <div className="md:col-span-2 pt-4">
                        <button type="submit" className="w-full bg-black text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#384BE7] transition-all shadow-xl transform active:scale-95 text-lg">
                            {t.submit}
                        </button>
                    </div>

                    <div className="md:col-span-2 text-center">
                        <p className="text-gray-400 font-bold text-sm">
                            {t.already} <Link to="/login" className="text-[#384BE7] border-b-2 border-transparent hover:border-[#384BE7] pb-1 transition-all ml-1">{t.login}</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
