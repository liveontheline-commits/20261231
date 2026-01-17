import React, { useState, useEffect } from 'react';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';

const Reports = () => {
    const { language } = useLanguage();

    const text = {
        en: {
            title: "Performance & Analytics",
            carbon: "Carbon Footprint",
            costKm: "Average Cost / KM",
            onTime: "On-Time Dispatch",
            volume: "Total Volume (m³)",
            month: "This Month",
            vsLast: "vs Last Month",
            insights: "AI Logistics Insights",
            insight1: "Route optimization saved 14% fuel this week.",
            insight2: "High demand expected in Central Europe next period.",
            noData: "Insufficient data for detailed reporting."
        },
        tr: {
            title: "Performans ve Analiz",
            carbon: "Karbon Ayak İzi",
            costKm: "Ortalama Maliyet / KM",
            onTime: "Zamanında Sevkiyat",
            volume: "Toplam Hacim (m³)",
            month: "Bu Ay",
            vsLast: "Geçen Aya Göre",
            insights: "AI Lojistik Öngörüleri",
            insight1: "Rota optimizasyonu bu hafta %14 yakıt tasarrufu sağladı.",
            insight2: "Gelecek dönemde Orta Avrupa'da yüksek talep bekleniyor.",
            noData: "Detaylı raporlama için yetersiz veri."
        }
    };

    const t = text[language];
    const [performance, setPerformance] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [perfRes, histRes] = await Promise.all([
                api.get('/enterprise/reports/performance'),
                api.get('/enterprise/reports/history')
            ]);
            setPerformance(perfRes.data);
            setHistory(histRes.data);
        } catch (err) {
            console.error('Failed to fetch report data');
        }
    };

    const handleExportCSV = () => {
        if (!performance) return;
        let csvContent = "data:text/csv;charset=utf-8,Metric,Value,Trend\n";
        csvContent += `Carbon Footprint,${performance.carbon},↓ 5%\n`;
        csvContent += `Avg Cost per KM,${performance.avgCostKm || performance.revenuePerKm},↑ 2%\n`;
        csvContent += `On-Time Dispatch,${performance.onTime},↑ 1.5%\n`;
        csvContent += `Volume,${performance.volume || performance.utilization},↑ 12%\n\n`;

        csvContent += "History Month,Volume Level %\n";
        history.forEach(h => {
            csvContent += `${h.label},${h.value}%\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "Performance_Report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!performance) return <div className="p-8 text-center text-gray-400 font-bold uppercase tracking-widest">{t.loading}...</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-black uppercase tracking-tight">{t.title}</h2>
                <button
                    onClick={handleExportCSV}
                    className="bg-black text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#384BE7] transition shadow-lg flex items-center space-x-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>CSV EXPORT</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <ReportCard title={t.carbon} value={performance.carbon} trend="↓ 5%" positive={true} subtitle={t.vsLast} />
                <ReportCard title={t.costKm} value={performance.avgCostKm || performance.revenuePerKm} trend="↑ 2%" positive={false} subtitle={t.vsLast} />
                <ReportCard title={t.onTime} value={performance.onTime} trend="↑ 1.5%" positive={true} subtitle={t.vsLast} />
                <ReportCard title={t.volume} value={performance.volume || performance.utilization} trend="↑ 12%" positive={true} subtitle={t.vsLast} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[400px]">
                    <h4 className="font-black text-black uppercase tracking-widest text-sm mb-8">{t.volume} (6 Months)</h4>
                    {/* Dynamic Bar Chart */}
                    <div className="flex items-end justify-between h-48 px-4">
                        {history.map((item, i) => (
                            <div key={i} className="w-12 bg-[#384BE7] rounded-t-xl transition-all hover:opacity-80" style={{ height: `${item.value}%` }}></div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">
                        {history.map((item, i) => <span key={i}>{item.label}</span>)}
                    </div>
                </div>

                <div className="bg-black p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#384BE7] opacity-20 rounded-full -mr-16 -mt-16"></div>
                    <h4 className="font-black uppercase tracking-widest text-xs mb-6 text-blue-400">{t.insights}</h4>
                    <div className="space-y-6 relative z-10">
                        <div className="flex space-x-4">
                            <span className="text-2xl">🌱</span>
                            <p className="text-sm font-bold leading-relaxed">{t.insight1}</p>
                        </div>
                        <div className="flex space-x-4">
                            <span className="text-2xl">📈</span>
                            <p className="text-sm font-bold leading-relaxed">{t.insight2}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ReportCard = ({ title, value, trend, positive, subtitle }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black text-black">{value}</h3>
        <div className="mt-2 flex items-center text-[10px] font-bold">
            <span className={positive ? 'text-green-500' : 'text-red-500'}>{trend}</span>
            <span className="text-gray-400 ml-1 uppercase tracking-tighter">{subtitle}</span>
        </div>
    </div>
);

export default Reports;
