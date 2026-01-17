import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
    const { language } = useLanguage();

    const text = {
        en: {
            heroTitle: "Logistics that moves with you.",
            heroSubtitle: "Prioritize the consumer experience with Last Mile Delivery powered by LogisticsHub technology, scalability, and capability.",
            getQuote: "Get a Quote",
            seeSolutions: "See Solutions",
            trustedBy: "Trusted by global market leaders",

            // Section 1: Superior Experience
            section1Title: "Leverage last mile leaders.",
            section1Subtitle: "Superior customer experience",
            section1Desc: "LogisticsHub Last Mile is the largest heavy goods last mile provider in North America. We use our massive network of carriers and top-tier technology to provide superior customer satisfaction.",
            section1Bullet1: "Industry-leading customer satisfaction scores",
            section1Bullet2: "Unrivaled scalability and capacity",
            section1Bullet3: "Cutting-edge tracking technology",
            ctaShip: "Ship with us →",

            // Section 2: Carrier
            section2Title: "Keep your business moving.",
            section2Subtitle: "For Independent Operators",
            section2Desc: "Join our network of independent contract carriers. Access thousands of loads daily, get paid fast, and grow your business with our proprietary technology.",
            section2Bullet1: "Transparent rates & fast payment",
            section2Bullet2: "Dedicated support team",
            section2Bullet3: "Mobile app for easy booking",
            ctaDrive: "Haul with us →",

            // Stats
            stat1: "Freight under management",
            stat2: "Users in the network",
            stat3: "Loads available annually",

            footer: {
                solutions: "Solutions",
                company: "Company",
                legal: "Legal",
                rights: "LogisticsHub Clone Technologies Inc."
            }
        },
        tr: {
            heroTitle: "Sizinle hareket eden lojistik.",
            heroSubtitle: "LogisticsHub teknolojisi, ölçeklenebilirliği ve yetenekleri ile desteklenen Son Kilometre Teslimatı ile tüketici deneyimine öncelik verin.",
            getQuote: "Fiyat Alın",
            seeSolutions: "Çözümleri Gör",
            trustedBy: "Küresel pazar liderleri tarafından güveniliyor",

            // Section 1: Superior Experience
            section1Title: "Son kilometre liderlerinden yararlanın.",
            section1Subtitle: "Üstün müşteri deneyimi",
            section1Desc: "LogisticsHub Last Mile, Kuzey Amerika'daki en büyük ağır yük son kilometre sağlayıcısıdır. Üstün müşteri memnuniyeti sağlamak için devasa taşıyıcı ağımızı ve üst düzey teknolojimizi kullanıyoruz.",
            section1Bullet1: "Sektör lideri müşteri memnuniyeti puanları",
            section1Bullet2: "Rakipsiz ölçeklenebilirlik ve kapasite",
            section1Bullet3: "Son teknoloji takip sistemleri",
            ctaShip: "Bizimle Gönderin →",

            // Section 2: Carrier
            section2Title: "İşinizi hareket halinde tutun.",
            section2Subtitle: "Bağımsız Operatörler İçin",
            section2Desc: "Bağımsız sözleşmeli taşıyıcı ağımıza katılın. Günlük binlerce yüke erişin, hızlı ödeme alın ve özel teknolojimizle işinizi büyütün.",
            section2Bullet1: "Şeffaf fiyatlar & hızlı ödeme",
            section2Bullet2: "Özel destek ekibi",
            section2Bullet3: "Kolay rezervasyon için mobil uygulama",
            ctaDrive: "Bizimle Taşıyın →",

            // Stats
            stat1: "Yönetilen Navlun",
            stat2: "Ağdaki Kullanıcılar",
            stat3: "Yıllık Yük Fırsatı",

            footer: {
                solutions: "Çözümler",
                company: "Şirket",
                legal: "Yasal",
                rights: "LogisticsHub Clone Teknolojileri A.Ş."
            }
        }
    };

    const t = text[language];
    const partners = ['LG', 'Nestle', 'Anheuser-Busch', 'Costco', 'Procter & Gamble'];

    return (
        <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-[#384BE7] selection:text-white">

            {/* HERO SECTION */}
            <div className="relative h-[90vh] flex items-center overflow-hidden border-b border-gray-800">
                <div className="absolute inset-0 z-0 bg-[#0A0A0A]">
                    <img
                        src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2670&q=80"
                        alt="Logistics Truck"
                        className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 pt-20">
                    <div className="max-w-4xl animate-fade-in-up">
                        <h1 className="text-5xl md:text-7xl font-medium tracking-tight mb-8 leading-[1.1]">
                            {t.heroTitle}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-10 font-normal max-w-2xl leading-relaxed opacity-90">
                            {t.heroSubtitle}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/register" className="bg-[#384BE7] text-white px-8 py-4 rounded-[6px] font-medium text-lg hover:bg-blue-600 transition flex items-center justify-center">
                                {t.getQuote}
                            </Link>
                            <Link to="/how-it-works" className="bg-white text-black px-8 py-4 rounded-[6px] font-medium text-lg hover:bg-gray-100 transition flex items-center justify-center">
                                {t.seeSolutions}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* TRUST BANNER */}
            <div className="bg-[#0A0A0A] py-16 border-b border-gray-800">
                <div className="container mx-auto px-6">
                    <p className="text-gray-500 text-sm font-medium mb-8 uppercase tracking-widest text-center">{t.trustedBy}</p>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60 grayscale">
                        {partners.map(p => (
                            <span key={p} className="text-xl md:text-2xl font-bold text-gray-400">{p.toUpperCase()}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* SPLIT SECTION 1: SHIPPERS (RXO Style Content) */}
            <div className="grid md:grid-cols-2 min-h-[600px]">
                <div className="p-12 md:p-24 flex flex-col justify-center bg-white text-black order-2 md:order-1">
                    <div className="max-w-lg">
                        <span className="block text-[#384BE7] font-medium mb-4 text-lg">{t.section1Subtitle}</span>
                        <h2 className="text-4xl md:text-5xl font-medium mb-6 leading-tight">{t.section1Title}</h2>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            {t.section1Desc}
                        </p>
                        <ul className="space-y-4 mb-10">
                            <li className="flex items-center text-lg"><span className="w-2 h-2 bg-[#384BE7] rounded-full mr-4"></span>{t.section1Bullet1}</li>
                            <li className="flex items-center text-lg"><span className="w-2 h-2 bg-[#384BE7] rounded-full mr-4"></span>{t.section1Bullet2}</li>
                            <li className="flex items-center text-lg"><span className="w-2 h-2 bg-[#384BE7] rounded-full mr-4"></span>{t.section1Bullet3}</li>
                        </ul>
                        <Link to="/register" className="text-black font-medium border-b-2 border-black inline-block pb-1 hover:text-[#384BE7] hover:border-[#384BE7] transition text-lg w-max">
                            {t.ctaShip}
                        </Link>
                    </div>
                </div>
                <div className="bg-gray-200 order-1 md:order-2 h-[400px] md:h-auto overflow-hidden group">
                    <img src="https://images.unsplash.com/photo-1566576912902-1d6faeb9056d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2670&q=80" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Warehouse Ops" />
                </div>
            </div>

            {/* SPLIT SECTION 2: CARRIERS */}
            <div className="grid md:grid-cols-2 min-h-[600px]">
                <div className="bg-gray-900 h-[400px] md:h-auto overflow-hidden group">
                    <img src="https://images.unsplash.com/photo-1591241106670-3665bc7c47d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2670&q=80" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Truck Driver" />
                </div>
                <div className="p-12 md:p-24 flex flex-col justify-center bg-[#0A0A0A] text-white">
                    <div className="max-w-lg">
                        <span className="block text-[#384BE7] font-medium mb-4 text-lg">{t.section2Subtitle}</span>
                        <h2 className="text-4xl md:text-5xl font-medium mb-6 leading-tight">{t.section2Title}</h2>
                        <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                            {t.section2Desc}
                        </p>
                        <ul className="space-y-4 mb-10">
                            <li className="flex items-center text-lg text-gray-300"><span className="w-2 h-2 bg-white rounded-full mr-4"></span>{t.section2Bullet1}</li>
                            <li className="flex items-center text-lg text-gray-300"><span className="w-2 h-2 bg-white rounded-full mr-4"></span>{t.section2Bullet2}</li>
                            <li className="flex items-center text-lg text-gray-300"><span className="w-2 h-2 bg-white rounded-full mr-4"></span>{t.section2Bullet3}</li>
                        </ul>
                        <Link to="/register" className="text-white font-medium border-b-2 border-white inline-block pb-1 hover:text-[#384BE7] hover:border-[#384BE7] transition text-lg w-max">
                            {t.ctaDrive}
                        </Link>
                    </div>
                </div>
            </div>

            {/* MARKETPLACE STATS */}
            <div className="py-24 bg-[#F3F3F3] text-black">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <div>
                            <h3 className="text-6xl font-medium mb-4 text-[#0A0A0A]">$16B+</h3>
                            <p className="text-gray-600 text-lg">{t.stat1}</p>
                        </div>
                        <div>
                            <h3 className="text-6xl font-medium mb-4 text-[#0A0A0A]">200k+</h3>
                            <p className="text-gray-600 text-lg">{t.stat2}</p>
                        </div>
                        <div>
                            <h3 className="text-6xl font-medium mb-4 text-[#0A0A0A]">2M+</h3>
                            <p className="text-gray-600 text-lg">{t.stat3}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="bg-[#0A0A0A] text-white py-20 border-t border-gray-800 text-sm">
                <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-2xl font-bold mb-6 block">Uber Freight Clone</Link>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-gray-400 uppercase tracking-widest text-xs">{t.footer.solutions}</h4>
                        <ul className="space-y-4">
                            <li><Link to="/how-it-works" className="hover:text-[#384BE7] transition">For Shippers</Link></li>
                            <li><Link to="/how-it-works" className="hover:text-[#384BE7] transition">For Carriers</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-gray-400 uppercase tracking-widest text-xs">{t.footer.company}</h4>
                        <ul className="space-y-4">
                            <li><Link to="/about" className="hover:text-[#384BE7] transition">About Us</Link></li>
                            <li><Link to="/careers" className="hover:text-[#384BE7] transition">Careers</Link></li>
                            <li><Link to="/contact" className="hover:text-[#384BE7] transition">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-gray-400 uppercase tracking-widest text-xs">{t.footer.legal}</h4>
                        <ul className="space-y-4">
                            <li><Link to="/trust-safety" className="hover:text-[#384BE7] transition">Privacy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="container mx-auto px-6 mt-16 pt-8 border-t border-gray-900 flex justify-between text-gray-500">
                    <p>© 2026 {t.footer.rights}</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
