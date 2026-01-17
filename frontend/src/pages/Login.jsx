import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Login = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const text = {
        en: {
            title: "Sign In",
            email: "Work Email",
            password: "Password",
            login: "Sign In",
            dontHave: "Don't have an account?",
            register: "Get Started",
            fail: "Login failed"
        },
        tr: {
            title: "Giriş Yap",
            email: "İş E-postası",
            password: "Şifre",
            login: "Giriş Yap",
            dontHave: "Hesabınız yok mu?",
            register: "Hemen Katılın",
            fail: "Giriş başarısız"
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
            const res = await api.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || t.fail);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="bg-white p-12 rounded-[2rem] shadow-2xl w-full max-w-lg border border-gray-50 transform transition hover:scale-[1.01]">
                <div className="mb-10 text-center">
                    <h2 className="text-4xl font-black text-black uppercase tracking-tighter mb-2">{t.title}</h2>
                    <div className="w-12 h-1 bg-[#384BE7] mx-auto rounded-full"></div>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 text-sm font-bold uppercase tracking-widest animate-pulse">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{t.email}</label>
                        <input
                            type="email"
                            name="email"
                            required
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl font-bold focus:ring-4 focus:ring-blue-100 focus:border-[#384BE7] outline-none transition-all placeholder:text-gray-300"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{t.password}</label>
                        <input
                            type="password"
                            name="password"
                            required
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl font-bold focus:ring-4 focus:ring-blue-100 focus:border-[#384BE7] outline-none transition-all placeholder:text-gray-300"
                        />
                    </div>

                    <button type="submit" className="w-full bg-black text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#384BE7] transition-all shadow-xl transform active:scale-95 text-lg">
                        {t.login}
                    </button>

                    <div className="text-center pt-4">
                        <p className="text-gray-400 font-bold text-sm tracking-tight">
                            {t.dontHave} <Link to="/register" className="text-[#384BE7] border-b-2 border-transparent hover:border-[#384BE7] pb-1 transition-all ml-1">{t.register}</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
