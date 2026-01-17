import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
    const { language } = useLanguage();

    const text = {
        en: {
            title: "Contact Us",
            hqTitle: "Headquarters",
            emailTitle: "Email",
            phoneTitle: "Phone",
            formTitle: "Send us a message",
            nameLabel: "Name",
            emailLabel: "Email",
            subjectLabel: "Subject",
            msgLabel: "Message",
            btn: "Send Message",
            placeholders: {
                name: "Your Name",
                email: "you@company.com",
                msg: "How can we help?"
            },
            subjects: {
                general: "General Inquiry",
                support: "Support",
                sales: "Sales"
            }
        },
        tr: {
            title: "Bize Ulaşın",
            hqTitle: "Genel Merkez",
            emailTitle: "E-posta",
            phoneTitle: "Telefon",
            formTitle: "Bize mesaj gönderin",
            nameLabel: "İsim",
            emailLabel: "E-posta",
            subjectLabel: "Konu",
            msgLabel: "Mesaj",
            btn: "Mesaj Gönder",
            placeholders: {
                name: "Adınız",
                email: "mail@sirket.com",
                msg: "Size nasıl yardımcı olabiliriz?"
            },
            subjects: {
                general: "Genel Bilgi",
                support: "Destek",
                sales: "Satış"
            }
        }
    };

    const t = text[language];

    return (
        <div className="bg-gray-50 min-h-screen py-10 selection:bg-[#384BE7] selection:text-white">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-4xl font-bold text-center mb-12">{t.title}</h1>

                <div className="grid md:grid-cols-2 gap-12">

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded shadow hover:shadow-md transition">
                            <h3 className="font-bold text-lg mb-2">{t.hqTitle}</h3>
                            <p className="text-gray-600">Levent 199, Buyukdere Cd.</p>
                            <p className="text-gray-600">Istanbul, Turkey 34394</p>
                        </div>
                        <div className="bg-white p-6 rounded shadow hover:shadow-md transition">
                            <h3 className="font-bold text-lg mb-2">{t.emailTitle}</h3>
                            <p className="text-gray-600">support@logisticshub.com</p>
                            <p className="text-gray-600">sales@logisticshub.com</p>
                        </div>
                        <div className="bg-white p-6 rounded shadow hover:shadow-md transition">
                            <h3 className="font-bold text-lg mb-2">{t.phoneTitle}</h3>
                            <p className="text-gray-600">+90 212 555 0123</p>
                            <p className="text-gray-600">Mon-Fri: 9am - 6pm</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded shadow">
                        <h2 className="text-2xl font-bold mb-6">{t.formTitle}</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t.nameLabel}</label>
                                <input type="text" className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-[#384BE7] outline-none" placeholder={t.placeholders.name} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t.emailLabel}</label>
                                <input type="email" className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-[#384BE7] outline-none" placeholder={t.placeholders.email} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t.subjectLabel}</label>
                                <select className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-[#384BE7] outline-none">
                                    <option>{t.subjects.general}</option>
                                    <option>{t.subjects.support}</option>
                                    <option>{t.subjects.sales}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t.msgLabel}</label>
                                <textarea className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-[#384BE7] outline-none" rows="4" placeholder={t.placeholders.msg}></textarea>
                            </div>
                            <button type="submit" className="w-full bg-[#384BE7] text-white font-bold py-3 rounded hover:bg-blue-800 transition">{t.btn}</button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;
