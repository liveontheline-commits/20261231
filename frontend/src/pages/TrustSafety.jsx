import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const TrustSafety = () => {
    const { language } = useLanguage();

    const text = {
        en: {
            title: "Trust & Safety",
            subtitle: "Our framework for a secure and reliable logistics marketplace.",
            commitment: "Our Commitment",
            commitmentText: "Trust is the cornerstone of our marketplace. We are dedicated to providing a secure environment for both shippers and transporters to conduct business with absolute confidence.",
            verification: "Rigorous Verification",
            verificationText: "Every partner on our platform undergoes a multi-layered vetting process to ensure compliance and reliability:",
            v1: "Company Registration & Tax IDs",
            v2: "Transit Insurance Validity",
            v3: "Operating Licenses & Permits",
            v4: "Historical Performance Checks",
            ratings: "Rating & Accountability",
            ratingsText: "Our transparent reputation system tracks real-world performance. Every transaction ends with mutual reviews, driving high standards across the entire network.",
            payments: "Secure Financials",
            paymentsText: "We utilize enterprise-grade encryption and secure payment gateways to ensure your capital is protected and transactions are traceable."
        },
        tr: {
            title: "Güven ve Güvenlik",
            subtitle: "Güvenli ve güvenilir bir lojistik pazaryeri için çerçevemiz.",
            commitment: "Taahhüdümüz",
            commitmentText: "Güven, pazaryerimizin temel taşıdır. Hem yük sahiplerinin hem de nakliyecilerin tam bir güvenle iş yapabilecekleri güvenli bir ortam sağlamaya kararlıyız.",
            verification: "Titiz Doğrulama",
            verificationText: "Platformumuzdaki her ortak, uyumluluk ve güvenilirliği sağlamak için çok katmanlı bir inceleme sürecinden geçer:",
            v1: "Şirket Kaydı ve Vergi Kimlikleri",
            v2: "Nakliye Sigortası Geçerliliği",
            v3: "Çalışma Lisansları ve İzinleri",
            v4: "Geçmiş Performans Kontrolleri",
            ratings: "Puanlama ve Şeffaflık",
            ratingsText: "Şeffaf itibar sistemimiz gerçek dünyadaki performansı takip eder. Her işlem, tüm ağdaki standartları yükselten karşılıklı değerlendirmelerle sona erer.",
            payments: "Güvenli Ödemeler",
            paymentsText: "Sermayenizin korunmasını ve işlemlerin izlenebilir olmasını sağlamak için kurumsal düzeyde şifreleme ve güvenli ödeme ağ geçitleri kullanıyoruz."
        }
    };

    const t = text[language];

    return (
        <div className="bg-white min-h-screen selection:bg-[#384BE7] selection:text-white">
            {/* Header */}
            <div className="bg-black text-white py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-black mb-4 uppercase tracking-tighter">{t.title}</h1>
                    <p className="text-gray-400 text-lg font-medium">{t.subtitle}</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-12 mb-24">
                <div className="space-y-8">

                    <section className="bg-white p-10 rounded-[2rem] shadow-xl border border-gray-50 transition-transform hover:scale-[1.01]">
                        <h2 className="text-2xl font-black mb-6 uppercase tracking-tight flex items-center">
                            <span className="w-1.5 h-6 bg-[#384BE7] rounded-full mr-3 text-white"></span>
                            {t.commitment}
                        </h2>
                        <p className="text-gray-600 leading-relaxed font-medium text-lg">
                            {t.commitmentText}
                        </p>
                    </section>

                    <section className="bg-white p-10 rounded-[2rem] shadow-xl border border-gray-50 transition-transform hover:scale-[1.01]">
                        <h2 className="text-2xl font-black mb-6 uppercase tracking-tight flex items-center">
                            <span className="w-1.5 h-6 bg-green-500 rounded-full mr-3"></span>
                            {t.verification}
                        </h2>
                        <p className="text-gray-600 mb-8 font-medium">
                            {t.verificationText}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[t.v1, t.v2, t.v3, t.v4].map((v, i) => (
                                <div key={i} className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <span className="text-green-500 font-bold">✓</span>
                                    <span className="text-sm font-black text-black uppercase tracking-tight">{v}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="grid md:grid-cols-2 gap-8">
                        <section className="bg-white p-10 rounded-[2rem] shadow-xl border border-gray-50 flex flex-col justify-between transition-transform hover:scale-[1.01]">
                            <div>
                                <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">{t.ratings}</h2>
                                <p className="text-gray-600 leading-relaxed font-medium">
                                    {t.ratingsText}
                                </p>
                            </div>
                            <div className="mt-8 text-4xl text-[#384BE7]">⭐⭐⭐⭐⭐</div>
                        </section>

                        <section className="bg-white p-10 rounded-[2rem] shadow-xl border border-gray-50 flex flex-col justify-between transition-transform hover:scale-[1.01]">
                            <div>
                                <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">{t.payments}</h2>
                                <p className="text-gray-600 leading-relaxed font-medium">
                                    {t.paymentsText}
                                </p>
                            </div>
                            <div className="mt-8 bg-blue-50 p-4 rounded-xl flex items-center space-x-3">
                                <span className="text-2xl">🔒</span>
                                <span className="text-[10px] font-black text-[#384BE7] uppercase tracking-widest">AES-256 Protocol Enabled</span>
                            </div>
                        </section>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TrustSafety;
