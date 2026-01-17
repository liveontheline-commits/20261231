import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Careers = () => {
    const { language } = useLanguage();

    const text = {
        en: {
            title: "Careers",
            heroTitle: "Do your best work here.",
            heroDesc: "We're solving the hardest problems in the physical world with code. Join us.",

            // Values
            val1Title: "Ownership",
            val1Desc: "We don't just write code; we own the outcome. Every team member has a stake in our success.",
            val2Title: "Transparency",
            val2Desc: "Information flows freely here. We believe that context empowers better decision-making.",
            val3Title: "Customer Obsession",
            val3Desc: "We start with the customer and work backward. Their success is our only metric.",

            // Listings
            openPosTitle: "Open Positions",
            applyBtn: "Apply",

            // Job Data (Example static data translation - normally from DB)
            jobs: [
                { title: 'Senior Backend Engineer', dept: 'Engineering', loc: 'Berlin, DE' },
                { title: 'Product Designer (UI/UX)', dept: 'Design', loc: 'Remote' },
                { title: 'Enterprise Sales Manager', dept: 'Sales', loc: 'New York, US' },
                { title: 'Logistics Operations Lead', dept: 'Operations', loc: 'Istanbul, TR' },
            ]
        },
        tr: {
            title: "Kariyer",
            heroTitle: "En iyi işinizi burada yapın.",
            heroDesc: "Fiziksel dünyanın en zor problemlerini kodla çözüyoruz. Bize katılın.",

            // Values
            val1Title: "Sahiplenme",
            val1Desc: "Sadece kod yazmıyoruz; sonuca sahip çıkıyoruz. Her takım üyesinin başarımızda payı vardır.",
            val2Title: "Şeffaflık",
            val2Desc: "Burada bilgi serbestçe akar. Bağlamın daha iyi karar vermeyi güçlendirdiğine inanıyoruz.",
            val3Title: "Müşteri Takıntısı",
            val3Desc: "Müşteriden başlar ve geriye doğru çalışırız. Onların başarısı bizim tek ölçütümüzdür.",

            // Listings
            openPosTitle: "Açık Pozisyonlar",
            applyBtn: "Başvur",

            // Job Data
            jobs: [
                { title: 'Kıdemli Backend Mühendisi', dept: 'Mühendislik', loc: 'Berlin, DE' },
                { title: 'Ürün Tasarımcısı (UI/UX)', dept: 'Tasarım', loc: 'Uzaktan' },
                { title: 'Kurumsal Satış Müdürü', dept: 'Satış', loc: 'New York, US' },
                { title: 'Lojistik Operasyon Lideri', dept: 'Operasyon', loc: 'İstanbul, TR' },
            ]
        }
    };

    const t = text[language];

    return (
        <div className="min-h-screen bg-white text-black font-sans">
            {/* Header */}
            <div className="py-32 bg-[#F3F3F3] text-center px-6">
                <h1 className="text-5xl md:text-7xl font-medium mb-6">{t.heroTitle}</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    {t.heroDesc}
                </p>
            </div>

            {/* Values */}
            <div className="container mx-auto px-6 py-20 border-b border-gray-200">
                <div className="grid md:grid-cols-3 gap-12">
                    <div>
                        <h3 className="text-xl font-bold mb-4">{t.val1Title}</h3>
                        <p className="text-gray-600">{t.val1Desc}</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">{t.val2Title}</h3>
                        <p className="text-gray-600">{t.val2Desc}</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">{t.val3Title}</h3>
                        <p className="text-gray-600">{t.val3Desc}</p>
                    </div>
                </div>
            </div>

            {/* Listings */}
            <div className="container mx-auto px-6 py-20 max-w-4xl">
                <h2 className="text-3xl font-bold mb-12">{t.openPosTitle}</h2>
                <div className="space-y-4">
                    {t.jobs.map((job, idx) => (
                        <div key={idx} className="flex flex-col md:flex-row justify-between items-center p-6 border border-gray-200 rounded hover:border-[#384BE7] hover:shadow-lg transition cursor-pointer group">
                            <div className="mb-4 md:mb-0 text-center md:text-left">
                                <h3 className="text-xl font-bold group-hover:text-[#384BE7] transition">{job.title}</h3>
                                <div className="text-sm text-gray-500 mt-1">
                                    <span className="mr-4">{job.dept}</span>
                                    <span>{job.loc}</span>
                                </div>
                            </div>
                            <button className="text-[#384BE7] font-bold text-sm uppercase tracking-wide">{t.applyBtn} &rarr;</button>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Careers;
