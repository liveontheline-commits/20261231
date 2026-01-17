import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Pricing = () => {
    const { language } = useLanguage();

    const text = {
        en: {
            title: "Simple, transparent pricing.",
            subtitle: "No hidden fees. Pay only when you succeed.",
            month: "/month",
            forever: "/forever",

            // Standard
            stdTitle: "Standard",
            stdPrice: "Free",
            stdDesc: "Perfect for independent owner-operators and occasional shippers.",
            stdFeat1: "Access global load board",
            stdFeat2: "Basic market rates",
            stdFeat3: "Standard support",
            stdBtn: "Sign Up Free",

            // Pro
            proTag: "Most Popular",
            proTitle: "Pro Fleet",
            proPrice: "€49",
            proDesc: "For growing carriers and shippers needing advanced tools.",
            proFeat1: "Priority load booking",
            proFeat2: "Predictive pricing AI",
            proFeat3: "Reduced factoring fees",
            proFeat4: "24/7 Premium support",
            proBtn: "Get Pro Access",

            // Enterprise
            entTitle: "Enterprise",
            entPrice: "Custom",
            entDesc: "Full-scale logistics management for large organizations.",
            entFeat1: "Dedicated API integrations",
            entFeat2: "Custom control tower",
            entFeat3: "Managed transportation",
            entBtn: "Contact Sales",

            // Testimonial
            quote: "\"Switching to the Enterprise plan saved us 12% in yearly freight spend. The visibility is unmatched.\"",
            authorRole: "Head of Supply Chain, GlobalRetail Inc."
        },
        tr: {
            title: "Basit, şeffaf fiyatlandırma.",
            subtitle: "Gizli ücret yok. Sadece başardığınızda ödeyin.",
            month: "/ay",
            forever: "/süresiz",

            // Standard
            stdTitle: "Standart",
            stdPrice: "Ücretsiz",
            stdDesc: "Bağımsız operatörler ve arada bir gönderim yapanlar için mükemmel.",
            stdFeat1: "Küresel yük ilanlarına erişim",
            stdFeat2: "Temel piyasa fiyatları",
            stdFeat3: "Standart destek",
            stdBtn: "Ücretsiz Kaydol",

            // Pro
            proTag: "En Popüler",
            proTitle: "Pro Filo",
            proPrice: "€49",
            proDesc: "Gelişmiş araçlara ihtiyaç duyan büyüyen taşıyıcılar ve göndericiler için.",
            proFeat1: "Öncelıklı yük rezervasyonu",
            proFeat2: "Tahminleyici fiyatlandırma yapay zekası",
            proFeat3: "Azaltılmış faktoring ücretleri",
            proFeat4: "7/24 Premium destek",
            proBtn: "Pro Erişim Al",

            // Enterprise
            entTitle: "Kurumsal",
            entPrice: "Özel",
            entDesc: "Büyük organizasyonlar için tam ölçekli lojistik yönetimi.",
            entFeat1: "Özel API entegrasyonları",
            entFeat2: "Özel kontrol kulesi",
            entFeat3: "Yönetilen taşımacılık",
            entBtn: "Satışla İletişime Geç",

            // Testimonial
            quote: "\"Kurumsal plana geçmek yıllık navlun harcamalarımızda %12 tasarruf sağladı. Görünürlük eşsiz.\"",
            authorRole: "Tedarik Zinciri Başkanı, GlobalRetail A.Ş."
        }
    };

    const t = text[language];

    return (
        <div className="bg-[#0A0A0A] min-h-screen text-white font-sans">
            {/* Header */}
            <div className="py-24 text-center border-b border-gray-900">
                <h1 className="text-5xl md:text-6xl font-medium mb-6">{t.title}</h1>
                <p className="text-xl text-gray-400 font-light">{t.subtitle}</p>
            </div>

            {/* Plans Grid */}
            <div className="container mx-auto px-6 py-20">
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

                    {/* Standard */}
                    <div className="bg-[#111] border border-gray-800 p-10 rounded-lg hover:border-gray-600 transition duration-300 flex flex-col">
                        <h3 className="text-xl font-bold text-white mb-2">{t.stdTitle}</h3>
                        <div className="mb-6">
                            <span className="text-4xl font-medium text-white">{t.stdPrice}</span>
                            <span className="text-gray-500 ml-2">{t.forever}</span>
                        </div>
                        <p className="text-gray-400 mb-8 border-b border-gray-800 pb-8">{t.stdDesc}</p>

                        <ul className="space-y-4 mb-auto text-gray-300">
                            <li className="flex items-center"><span className="text-[#384BE7] mr-3">✓</span> {t.stdFeat1}</li>
                            <li className="flex items-center"><span className="text-[#384BE7] mr-3">✓</span> {t.stdFeat2}</li>
                            <li className="flex items-center"><span className="text-[#384BE7] mr-3">✓</span> {t.stdFeat3}</li>
                        </ul>

                        <div className="mt-8">
                            <Link to="/register" className="block w-full text-center bg-white text-black py-4 rounded font-medium hover:bg-gray-200 transition">{t.stdBtn}</Link>
                        </div>
                    </div>

                    {/* Pro */}
                    <div className="bg-[#111] border-2 border-[#384BE7] p-10 rounded-lg relative flex flex-col transform md:-translate-y-4 shadow-xl shadow-blue-900/10">
                        <div className="absolute top-0 right-0 bg-[#384BE7] text-white text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-bl">{t.proTag}</div>
                        <h3 className="text-xl font-bold text-[#384BE7] mb-2">{t.proTitle}</h3>
                        <div className="mb-6">
                            <span className="text-4xl font-medium text-white">{t.proPrice}</span>
                            <span className="text-gray-500 ml-2">{t.month}</span>
                        </div>
                        <p className="text-gray-400 mb-8 border-b border-gray-800 pb-8">{t.proDesc}</p>

                        <ul className="space-y-4 mb-auto text-white font-medium">
                            <li className="flex items-center"><span className="text-[#384BE7] mr-3">✓</span> {t.proFeat1}</li>
                            <li className="flex items-center"><span className="text-[#384BE7] mr-3">✓</span> {t.proFeat2}</li>
                            <li className="flex items-center"><span className="text-[#384BE7] mr-3">✓</span> {t.proFeat3}</li>
                            <li className="flex items-center"><span className="text-[#384BE7] mr-3">✓</span> {t.proFeat4}</li>
                        </ul>

                        <div className="mt-8">
                            <Link to="/register" className="block w-full text-center bg-[#384BE7] text-white py-4 rounded font-medium hover:bg-blue-600 transition shadow-lg">{t.proBtn}</Link>
                        </div>
                    </div>

                    {/* Enterprise */}
                    <div className="bg-[#111] border border-gray-800 p-10 rounded-lg hover:border-gray-600 transition duration-300 flex flex-col">
                        <h3 className="text-xl font-bold text-white mb-2">{t.entTitle}</h3>
                        <div className="mb-6">
                            <span className="text-4xl font-medium text-white">{t.entPrice}</span>
                        </div>
                        <p className="text-gray-400 mb-8 border-b border-gray-800 pb-8">{t.entDesc}</p>

                        <ul className="space-y-4 mb-auto text-gray-300">
                            <li className="flex items-center"><span className="text-[#384BE7] mr-3">✓</span> {t.entFeat1}</li>
                            <li className="flex items-center"><span className="text-[#384BE7] mr-3">✓</span> {t.entFeat2}</li>
                            <li className="flex items-center"><span className="text-[#384BE7] mr-3">✓</span> {t.entFeat3}</li>
                        </ul>

                        <div className="mt-8">
                            <Link to="/contact" className="block w-full text-center border border-gray-700 text-white py-4 rounded font-medium hover:bg-gray-800 transition">{t.entBtn}</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonial */}
            <div className="py-20 bg-[#050505] text-center border-t border-gray-900">
                <div className="container mx-auto px-6 max-w-4xl">
                    <p className="text-2xl md:text-3xl text-white font-light italic mb-8">
                        {t.quote}
                    </p>
                    <div className="text-gray-500">
                        <p className="font-bold text-white">Sarah Jenkins</p>
                        <p className="text-sm">{t.authorRole}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
