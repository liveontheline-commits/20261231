import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const StepCard = ({ number, title, desc, image, stepLabel }) => (
    <div className="flex flex-col items-start p-8 bg-white border border-gray-100 rounded-lg transition hover:shadow-xl hover:border-[#384BE7] group h-full">
        <div className="w-full h-48 mb-6 overflow-hidden rounded-[6px]">
            <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
        </div>
        <div className="text-sm font-bold text-[#384BE7] mb-2 uppercase tracking-widest">
            {stepLabel} 0{number}
        </div>
        <h3 className="text-2xl font-medium mb-3 text-[#0A0A0A]">{title}</h3>
        <p className="text-gray-500 leading-relaxed font-normal">{desc}</p>
    </div>
);

const HowItWorks = () => {
    const { language } = useLanguage();

    const t = {
        en: {
            heroTitle: "How the platform",
            heroTitleHighlight: "works for you.",
            heroDesc: "Connecting shippers and carriers through technology. Simplified booking, real-time tracking, and automated payments.",

            // Shippers
            shippersTitle: "For Shippers",
            shippersHeadline: "Ship with confidence and control.",
            startShipping: "Start Shipping Now",
            step1Title: "Post Your Load",
            step1Desc: "Input origin, destination, and cargo details. Our AI instantly analyzes lanes for pricing.",
            step2Title: "Get Instant Quotes",
            step2Desc: "Receive guaranteed price offers from our network of pre-vetted, reliable carriers.",
            step3Title: "Track in Real-Time",
            step3Desc: "Monitor your freight with GPS precision from pickup to final delivery.",
            step4Title: "Automated Pay",
            step4Desc: "Digital proof of delivery triggers release of funds. No paperwork, no headaches.",

            // Carriers
            carriersTitle: "For Carriers",
            carriersHeadline: "Keep your business moving forward.",
            joinNetwork: "Join Carrier Network",
            carrier1Title: "Create Profile",
            carrier1Desc: "Fast compliance checks get you active and booking loads in under 24 hours.",
            carrier2Title: "Book Instantly",
            carrier2Desc: "No phone calls. See a price, click to book, and get the rate confirmation instantly.",
            carrier3Title: "Reloads",
            carrier3Desc: "Our algorithm suggests backhauls to keep your truck full on the return trip.",
            carrier4Title: "7-Day Pay",
            carrier4Desc: "Get paid faster than the industry standard with our QuickPay options.",

            supportTitle: "Need assistance?",
            supportDesc: "Our dedicated logistics experts are available 24/7 to solve problems.",
            contactSupport: "Contact Support",
            stepLabel: "Step"
        },
        tr: {
            heroTitle: "Platform sizin için",
            heroTitleHighlight: "nasıl çalışır?",
            heroDesc: "Teknoloji aracılığıyla göndericileri ve taşıyıcıları birbirine bağlıyoruz. Basitleştirilmiş rezervasyon, gerçek zamanlı takip ve otomatik ödemeler.",

            // Shippers
            shippersTitle: "Göndericiler İçin",
            shippersHeadline: "Güvenle ve kontrolle gönderin.",
            startShipping: "Şimdi Göndermeye Başla",
            step1Title: "Yükünüzü İlan Edin",
            step1Desc: "Çıkış, varış ve yük detaylarını girin. Yapay zekamız fiyatlandırma için rotaları anında analiz eder.",
            step2Title: "Anında Fiyat Alın",
            step2Desc: "Önceden onaylanmış, güvenilir taşıyıcı ağımızdan garantili fiyat teklifleri alın.",
            step3Title: "Gerçek Zamanlı Takip",
            step3Desc: "Yükünüzü alımdan teslimata kadar GPS hassasiyetiyle izleyin.",
            step4Title: "Otomatik Ödeme",
            step4Desc: "Dijital teslimat kanıtı fonların serbest bırakılmasını tetikler. Evrak işi yok, baş ağrısı yok.",

            // Carriers
            carriersTitle: "Taşıyıcılar İçin",
            carriersHeadline: "İşinizi ileriye taşıyın.",
            joinNetwork: "Taşıyıcı Ağına Katıl",
            carrier1Title: "Profil Oluştur",
            carrier1Desc: "Hızlı uyumluluk kontrolleri ile 24 saatten kısa sürede aktif olun ve yük rezervasyonu yapın.",
            carrier2Title: "Anında Rezervasyon",
            carrier2Desc: "Telefon görüşmesi yok. Fiyatı görün, rezervasyon için tıklayın ve anında onay alın.",
            carrier3Title: "Geri Yükler",
            carrier3Desc: "Algoritmamız, dönüş yolunda kamyonunuzu dolu tutmak için geri yükler önerir.",
            carrier4Title: "7 Günde Ödeme",
            carrier4Desc: "QuickPay seçeneklerimizle endüstri standardından daha hızlı ödeme alın.",

            supportTitle: "Yardıma mı ihtiyacınız var?",
            supportDesc: "Uzman lojistik ekibimiz sorunları çözmek için 7/24 hizmetinizdedir.",
            contactSupport: "Destek ile İletişime Geç",
            stepLabel: "Adım"
        }
    };

    const text = t[language];

    return (
        <div className="bg-[#0A0A0A] text-white min-h-screen font-sans selection:bg-[#384BE7] selection:text-white">
            {/* Hero Section */}
            <div className="relative py-24 md:py-32 border-b border-gray-800">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <h1 className="text-5xl md:text-7xl font-medium mb-8 leading-tight">{text.heroTitle} <br /> <span className="text-[#384BE7]">{text.heroTitleHighlight}</span></h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
                        {text.heroDesc}
                    </p>
                </div>
            </div>

            {/* Shippers Section */}
            <div className="py-24 bg-white text-black">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16">
                        <div className="max-w-xl">
                            <span className="text-[#384BE7] font-bold text-sm uppercase tracking-widest mb-4 block">{text.shippersTitle}</span>
                            <h2 className="text-4xl md:text-5xl font-medium leading-tight">{text.shippersHeadline}</h2>
                        </div>
                        <Link to="/register" className="hidden md:inline-flex items-center text-[#384BE7] font-bold border-b border-[#384BE7] pb-1 hover:opacity-80 transition mt-6 md:mt-0">
                            {text.startShipping} &rarr;
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        <StepCard
                            number="1"
                            title={text.step1Title}
                            desc={text.step1Desc}
                            image="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=500&q=80"
                            stepLabel={text.stepLabel}
                        />
                        <StepCard
                            number="2"
                            title={text.step2Title}
                            desc={text.step2Desc}
                            image="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=500&q=80"
                            stepLabel={text.stepLabel}
                        />
                        <StepCard
                            number="3"
                            title={text.step3Title}
                            desc={text.step3Desc}
                            image="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=500&q=80"
                            stepLabel={text.stepLabel}
                        />
                        <StepCard
                            number="4"
                            title={text.step4Title}
                            desc={text.step4Desc}
                            image="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=500&q=80"
                            stepLabel={text.stepLabel}
                        />
                    </div>
                    <div className="mt-12 md:hidden">
                        <Link to="/register" className="inline-block px-8 py-3 bg-[#384BE7] text-white font-bold rounded hover:bg-blue-700 transition w-full text-center">
                            {text.startShipping}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Image Break */}
            <div className="h-[400px] md:h-[600px] w-full relative">
                <img
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2670&q=80"
                    alt="Team collaboration"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Transporters Section */}
            <div className="py-24 bg-[#0A0A0A] text-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16">
                        <div className="max-w-xl">
                            <span className="text-[#384BE7] font-bold text-sm uppercase tracking-widest mb-4 block">{text.carriersTitle}</span>
                            <h2 className="text-4xl md:text-5xl font-medium leading-tight">{text.carriersHeadline}</h2>
                        </div>
                        <Link to="/register" className="hidden md:inline-flex items-center text-white font-bold border-b border-white pb-1 hover:text-[#384BE7] hover:border-[#384BE7] transition mt-6 md:mt-0">
                            {text.joinNetwork} &rarr;
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="p-8 border border-gray-800 rounded bg-gray-900/50 group hover:border-[#384BE7] transition">
                            <div className="w-full h-40 mb-6 overflow-hidden rounded-[6px]">
                                <img src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=500&q=80" alt="Truck" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">{text.carrier1Title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{text.carrier1Desc}</p>
                        </div>
                        <div className="p-8 border border-gray-800 rounded bg-gray-900/50 group hover:border-[#384BE7] transition">
                            <div className="w-full h-40 mb-6 overflow-hidden rounded-[6px]">
                                <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=500&q=80" alt="Mobile App" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">{text.carrier2Title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{text.carrier2Desc}</p>
                        </div>
                        <div className="p-8 border border-gray-800 rounded bg-gray-900/50 group hover:border-[#384BE7] transition">
                            <div className="w-full h-40 mb-6 overflow-hidden rounded-[6px]">
                                <img src="https://images.unsplash.com/photo-1616432043562-3671ea2e5242?auto=format&fit=crop&w=500&q=80" alt="Highway" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">{text.carrier3Title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{text.carrier3Desc}</p>
                        </div>
                        <div className="p-8 border border-gray-800 rounded bg-gray-900/50 group hover:border-[#384BE7] transition">
                            <div className="w-full h-40 mb-6 overflow-hidden rounded-[6px]">
                                <img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=500&q=80" alt="Payment" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">{text.carrier4Title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{text.carrier4Desc}</p>
                        </div>
                    </div>
                    <div className="mt-12 md:hidden">
                        <Link to="/register" className="inline-block px-8 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition w-full text-center">
                            {text.joinNetwork}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Support CTA */}
            <div className="py-24 bg-[#F3F3F3] text-black text-center">
                <div className="container mx-auto px-6 max-w-3xl">
                    <h2 className="text-3xl font-medium mb-6">{text.supportTitle}</h2>
                    <p className="text-gray-600 mb-8 text-lg">{text.supportDesc}</p>
                    <Link to="/contact" className="inline-block px-8 py-4 bg-[#0A0A0A] text-white font-medium rounded hover:bg-gray-800 transition">
                        {text.contactSupport}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
