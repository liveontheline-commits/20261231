import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const AboutUs = () => {
    const { language } = useLanguage();

    const text = {
        en: {
            title: "About Us",
            heroTitle: "Moving the world forward.",
            heroSubtitle: "We are LogisticsHub. A technology company reshaping the future of freight.",

            // Mission
            missionTitle: "Our Mission",
            missionDesc: "To simplify the global supply chain through technology, transparency, and trust.",

            // DNA / Values
            dnaTitle: "Our DNA",
            val1Title: "Pioneering Spirit",
            val1Desc: "We challenge the status quo. Innovation is not just a buzzword; it's our engine.",
            val2Title: "Entrepreneurial Mindset",
            val2Desc: "We take ownership. Every challenge is an opportunity to build something better.",
            val3Title: "Agile Approach",
            val3Desc: "Speed matters. We adapt, iterate, and deliver solutions while others are still planning.",
            val4Title: "Success Together",
            val4Desc: "We win when our customers win. Collaboration is at the heart of everything we do.",
            val5Title: "Leading Results",
            val5Desc: "Data-driven decisions deliver measurable outcomes. We focus on impact.",

            // ESG
            esgTitle: "Commitment to Sustainability",
            esgDesc: "Logistics is the backbone of the economy, but it comes with a responsibility. We are committed to reducing our carbon footprint through route optimization, empty mile reduction, and investing in green technologies.",
            esgBtn: "Read 2024 CSR Report",

            // Awards
            awardsTitle: "Awards & Recognition",
            award1: "SmartWay Partner",
            award2: "Top Green Provider",
            award3: "Best Place to Work",

            // Team
            teamTitle: "Leadership",
            teamRole1: "CEO & Co-Founder",
            teamRole2: "CTO & Co-Founder",
            teamRole3: "Head of Operations",

            // CTA
            ctaTitle: "Join our journey.",
            ctaBtn: "View Careers",
        },
        tr: {
            title: "Hakkımızda",
            heroTitle: "Dünyayı ileri taşıyoruz.",
            heroSubtitle: "Biz LogisticsHub'ız. Navlunun geleceğini yeniden şekillendiren bir teknoloji şirketiyiz.",

            // Mission
            missionTitle: "Misyonumuz",
            missionDesc: "Teknoloji, şeffaflık ve güven yoluyla küresel tedarik zincirini basitleştirmek.",

            // DNA / Values
            dnaTitle: "DNA'mız",
            val1Title: "Öncü Ruh",
            val1Desc: "Statükoya meydan okuyoruz. İnovasyon sadece bir moda sözcük değil, bizim motorumuzdur.",
            val2Title: "Girişimci Zihniyet",
            val2Desc: "Sorumluluk alıyoruz. Her zorluk, daha iyi bir şey inşa etmek için bir fırsattır.",
            val3Title: "Çevik Yaklaşım",
            val3Desc: "Hız önemlidir. Biz uyum sağlar, yineler ve başkaları plan yaparken biz çözüm sunarız.",
            val4Title: "Birlikte Başarı",
            val4Desc: "Müşterilerimiz kazandığında biz de kazanırız. İşbirliği yaptığımız her şeyin kalbindedir.",
            val5Title: "Lider Sonuçlar",
            val5Desc: "Veriye dayalı kararlar ölçülebilir sonuçlar sunar. Biz etkiye odaklanıyoruz.",

            // ESG
            esgTitle: "Sürdürülebilirlik Taahhüdü",
            esgDesc: "Lojistik ekonominin belkemiğidir, ancak bir sorumlulukla gelir. Rota optimizasyonu, boş kilometrelerin azaltılması ve yeşil teknolojilere yatırım yaparak karbon ayak izimizi azaltmaya kararlıyız.",
            esgBtn: "2024 KSS Raporunu Oku",

            // Awards
            awardsTitle: "Ödüller & Tanınma",
            award1: "SmartWay Ortağı",
            award2: "En İyi Yeşil Sağlayıcı",
            award3: "Çalışılacak En İyi Yer",

            // Team
            teamTitle: "Liderlik",
            teamRole1: "CEO & Kurucu Ortak",
            teamRole2: "CTO & Kurucu Ortak",
            teamRole3: "Operasyon Başkanı",

            // CTA
            ctaTitle: "Yolculuğumuza katılın.",
            ctaBtn: "Kariyer Fırsatları",
        }
    };

    const t = text[language];

    return (
        <div className="bg-[#0A0A0A] text-white min-h-screen font-sans selection:bg-[#384BE7] selection:text-white">
            {/* Hero Section */}
            <div className="relative h-[60vh] flex items-center justify-center overflow-hidden border-b border-gray-800">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
                        alt="Office"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent"></div>
                </div>
                <div className="relative z-10 text-center px-6 max-w-4xl">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">{t.heroTitle}</h1>
                    <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed">
                        {t.heroSubtitle}
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-24 bg-white text-black">
                <div className="container mx-auto px-6 max-w-5xl text-center">
                    <span className="text-[#384BE7] font-bold tracking-widest uppercase mb-4 block text-sm">{t.missionTitle}</span>
                    <h2 className="text-4xl md:text-6xl font-medium leading-tight mb-12">
                        {t.missionDesc}
                    </h2>
                </div>
            </div>

            {/* DNA / Values Section */}
            <div className="py-24 bg-[#0A0A0A] border-y border-gray-900">
                <div className="container mx-auto px-6">
                    <div className="mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 border-l-4 border-[#384BE7] pl-6">{t.dnaTitle}</h2>
                    </div>

                    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
                        {/* Value 1 */}
                        <div className="p-6 border border-gray-800 rounded bg-gray-900/50 hover:border-[#384BE7] transition duration-300 group">
                            <div className="text-[#384BE7] mb-4 text-3xl group-hover:scale-110 transition-transform">🚀</div>
                            <h3 className="text-xl font-bold mb-3 text-white">{t.val1Title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t.val1Desc}</p>
                        </div>
                        {/* Value 2 */}
                        <div className="p-6 border border-gray-800 rounded bg-gray-900/50 hover:border-[#384BE7] transition duration-300 group">
                            <div className="text-[#384BE7] mb-4 text-3xl group-hover:scale-110 transition-transform">💡</div>
                            <h3 className="text-xl font-bold mb-3 text-white">{t.val2Title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t.val2Desc}</p>
                        </div>
                        {/* Value 3 */}
                        <div className="p-6 border border-gray-800 rounded bg-gray-900/50 hover:border-[#384BE7] transition duration-300 group">
                            <div className="text-[#384BE7] mb-4 text-3xl group-hover:scale-110 transition-transform">⚡</div>
                            <h3 className="text-xl font-bold mb-3 text-white">{t.val3Title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t.val3Desc}</p>
                        </div>
                        {/* Value 4 */}
                        <div className="p-6 border border-gray-800 rounded bg-gray-900/50 hover:border-[#384BE7] transition duration-300 group">
                            <div className="text-[#384BE7] mb-4 text-3xl group-hover:scale-110 transition-transform">🤝</div>
                            <h3 className="text-xl font-bold mb-3 text-white">{t.val4Title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t.val4Desc}</p>
                        </div>
                        {/* Value 5 */}
                        <div className="p-6 border border-gray-800 rounded bg-gray-900/50 hover:border-[#384BE7] transition duration-300 group">
                            <div className="text-[#384BE7] mb-4 text-3xl group-hover:scale-110 transition-transform">📈</div>
                            <h3 className="text-xl font-bold mb-3 text-white">{t.val5Title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t.val5Desc}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ESG & Awards Section */}
            <div className="grid md:grid-cols-2">
                {/* ESG */}
                <div className="bg-[#111] p-16 md:p-24 flex flex-col justify-center">
                    <span className="text-[#2fae60] font-bold tracking-widest uppercase mb-4 text-sm">Win-Win-Win</span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">{t.esgTitle}</h2>
                    <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                        {t.esgDesc}
                    </p>
                    <button className="text-white border border-white px-8 py-4 rounded hover:bg-white hover:text-black transition w-max">
                        {t.esgBtn}
                    </button>
                </div>

                {/* Awards */}
                <div className="bg-[#f3f3f3] text-black p-16 md:p-24 flex flex-col justify-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-12">{t.awardsTitle}</h2>
                    <div className="space-y-6">
                        <div className="flex items-center p-4 bg-white rounded shadow-sm">
                            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-6 text-2xl">🏆</div>
                            <span className="text-xl font-bold">{t.award1}</span>
                        </div>
                        <div className="flex items-center p-4 bg-white rounded shadow-sm">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-6 text-2xl">🌿</div>
                            <span className="text-xl font-bold">{t.award2}</span>
                        </div>
                        <div className="flex items-center p-4 bg-white rounded shadow-sm">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-6 text-2xl">💼</div>
                            <span className="text-xl font-bold">{t.award3}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="py-24 bg-[#0A0A0A]">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-16 text-center">{t.teamTitle}</h2>
                    <div className="grid md:grid-cols-3 gap-12">
                        {/* Member 1 */}
                        <div className="group text-center">
                            <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-2 border-gray-800 group-hover:border-[#384BE7] transition">
                                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=80" alt="CEO" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-xl font-bold mb-1">Aydın Akarsu</h3>
                            <p className="text-[#384BE7] text-sm uppercase tracking-wider">{t.teamRole1}</p>
                        </div>
                        {/* Member 2 */}
                        <div className="group text-center">
                            <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-2 border-gray-800 group-hover:border-[#384BE7] transition">
                                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80" alt="CTO" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-xl font-bold mb-1">David Chen</h3>
                            <p className="text-[#384BE7] text-sm uppercase tracking-wider">{t.teamRole2}</p>
                        </div>
                        {/* Member 3 */}
                        <div className="group text-center">
                            <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-2 border-gray-800 group-hover:border-[#384BE7] transition">
                                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80" alt="COO" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-xl font-bold mb-1">Sarah Miller</h3>
                            <p className="text-[#384BE7] text-sm uppercase tracking-wider">{t.teamRole3}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-24 bg-[#384BE7] text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-8">{t.ctaTitle}</h2>
                    <Link to="/careers" className="inline-block bg-white text-[#384BE7] px-10 py-4 rounded font-bold text-lg hover:bg-gray-100 transition">
                        {t.ctaBtn}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
