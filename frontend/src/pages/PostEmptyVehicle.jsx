import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const PostEmptyVehicle = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { language } = useLanguage();
    const [vehicles, setVehicles] = useState([]);
    const [form, setForm] = useState({ vehicle_id: '', available_city: '', available_date: '', preferred_destination: '', min_price: '' });
    const [matches, setMatches] = useState([]);
    const [biddingId, setBiddingId] = useState(null);
    const [trends, setTrends] = useState(null);

    const text = {
        en: {
            title: "Smart Capacity Posting",
            subtitle: "Optimize your backhaul and reduce empty miles with AI-driven matching.",
            selectVehicle: "Select Vehicle",
            availableCity: "Available City",
            cityPlaceholder: "e.g. Berlin",
            date: "Availability Date",
            dest: "Preferred Destination (Backhaul)",
            destPlaceholder: "e.g. Warsaw",
            findMatches: "Publish & Find Matches",
            matchedLoads: "AI-Suggested Opportunities",
            noMatchesYet: "Enter your vehicle's availability to unlock smart matching.",
            viewBid: "View & Bid",
            quickBid: "One-Click Bid",
            bidSuccess: "Bid Sent Successfully!",
            alertSuccess: "Availability Posted. We are searching for backhaul opportunities.",
            alertFail: "Failed to post availability",
            smartMatch: "Smart Match",
            highRelevance: "High Relevance",
            backhaul: "Backhaul Opportunity",
            noVehicleTitle: "No Registered Vehicles Found",
            noVehicleDesc: "You need to add a vehicle to your fleet before you can post availability and find smart matches.",
            addVehicleAction: "Go to My Fleet"
        },
        tr: {
            title: "Akıllı Kapasite Bildirimi",
            subtitle: "Yapay zeka destekli eşleşme ile geri dönüş yüklerinizi optimize edin.",
            selectVehicle: "Araç Seçin",
            availableCity: "Müsait Şehir",
            cityPlaceholder: "örn. İstanbul",
            date: "Müsaitlik Tarihi",
            dest: "Tercih Edilen Varış (Geri Dönüş)",
            destPlaceholder: "örn. Ankara",
            findMatches: "Yayınla ve Eşleşme Bul",
            matchedLoads: "Yapay Zeka Önerileri",
            noMatchesYet: "Akıllı eşleşmeleri görmek için aracınızın müsaitliğini girin.",
            viewBid: "İncele & Teklif Ver",
            quickBid: "Hızlı Teklif Ver",
            bidSuccess: "Teklif Başarıyla Gönderildi!",
            alertSuccess: "Müsaitlik Bildirildi. Dönüş yükleri aranıyor.",
            alertFail: "Bildirim başarısız",
            smartMatch: "Akıllı Eşleşme",
            highRelevance: "Yüksek Uyumluluk",
            backhaul: "Geri Dönüş Fırsatı",
            noVehicleTitle: "Kayıtlı Araç Bulunamadı",
            noVehicleDesc: "Müsaitlik bildirimi yapabilmek ve akıllı eşleşmeleri görmek için önce filonuza bir araç eklemelisiniz.",
            addVehicleAction: "Araçlarıma Git"
        }
    };

    const t = text[language];

    useEffect(() => {
        const fetchFleet = async () => {
            try {
                const res = await api.get('/vehicles'); // Changed from /vehicles/my-vehicles to just /vehicles
                setVehicles(res.data);
                if (res.data.length > 0) setForm(f => ({ ...f, vehicle_id: res.data[0].id }));
            } catch (err) { }
        };
        fetchFleet();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Post availability
            await api.post('/enterprise/empty-vehicle', form);

            // 2. Fetch matches
            const resMatches = await api.get(`/enterprise/matches?city=${form.available_city}&date=${form.available_date}`);

            // 3. Fetch trends if preferred destination is set
            if (form.preferred_destination) {
                const resTrends = await api.get(`/enterprise/market-trends?origin=${form.available_city}&destination=${form.preferred_destination}`);
                setTrends(resTrends.data);
            }

            // Add some "Smart Match" meta info for UI
            const enhancedMatches = resMatches.data.map((m, idx) => ({
                ...m,
                relevance: idx === 0 ? 98 : 85,
                isSmart: idx === 0
            }));

            setMatches(enhancedMatches);
            if (resMatches.data.length === 0) alert(t.alertSuccess);
        } catch (err) {
            alert(t.alertFail);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickBid = async (loadId, estimatedPrice) => {
        setBiddingId(loadId);
        try {
            const bidAmount = trends ? trends.average_price : (estimatedPrice || 1200);
            await api.post('/enterprise/smart-bid', { load_id: loadId, amount: bidAmount });
            alert(t.bidSuccess);
        } catch (err) {
            alert(t.alertFail);
        } finally {
            setBiddingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-black text-white pt-16 pb-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tight">{t.title}</h1>
                    <p className="text-gray-400 text-lg max-w-2xl">{t.subtitle}</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 -mt-12 mb-20">
                {vehicles.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] shadow-2xl p-16 text-center border border-gray-100 flex flex-col items-center">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-8">
                            <span className="text-5xl">🚛</span>
                        </div>
                        <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter text-black">{t.noVehicleTitle}</h2>
                        <p className="text-gray-500 font-bold max-w-lg mx-auto mb-10 text-lg">
                            {t.noVehicleDesc}
                        </p>
                        <button
                            onClick={() => navigate('/my-fleet')}
                            className="bg-[#384BE7] text-white font-black px-10 py-5 rounded-2xl uppercase tracking-widest hover:bg-blue-700 transition shadow-2xl transform hover:-translate-y-1"
                        >
                            {t.addVehicleAction}
                        </button>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-5 gap-10">
                        {/* Input Panel */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 sticky top-10">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">{t.selectVehicle}</label>
                                        <select
                                            className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl font-bold focus:ring-2 focus:ring-[#384BE7] outline-none transition"
                                            value={form.vehicle_id}
                                            onChange={e => setForm({ ...form, vehicle_id: e.target.value })}
                                        >
                                            {vehicles.map(v => <option key={v.id} value={v.id}>{v.plate_number} ({v.type})</option>)}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">{t.availableCity}</label>
                                            <input
                                                className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl font-bold focus:ring-2 focus:ring-[#384BE7] outline-none transition"
                                                placeholder={t.cityPlaceholder}
                                                value={form.available_city}
                                                onChange={e => setForm({ ...form, available_city: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">{t.date}</label>
                                            <input
                                                type="date"
                                                className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl font-bold focus:ring-2 focus:ring-[#384BE7] outline-none transition"
                                                value={form.available_date}
                                                onChange={e => setForm({ ...form, available_date: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">{t.dest}</label>
                                        <input
                                            className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl font-bold focus:ring-2 focus:ring-[#384BE7] outline-none transition"
                                            placeholder={t.destPlaceholder}
                                            value={form.preferred_destination}
                                            onChange={e => setForm({ ...form, preferred_destination: e.target.value })}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full bg-[#384BE7] text-white font-black py-5 rounded-xl uppercase tracking-widest hover:bg-blue-700 transition shadow-xl transform hover:-translate-y-1 ${loading ? 'opacity-70' : ''}`}
                                    >
                                        {loading ? '...' : t.findMatches}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Results Panel */}
                        <div className="lg:col-span-3">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black uppercase tracking-tight">{t.matchedLoads}</h3>
                                {matches.length > 0 && <span className="bg-blue-100 text-[#384BE7] font-black text-[10px] px-3 py-1 rounded-full uppercase">{matches.length} {t.matchedLoads}</span>}
                            </div>

                            {matches.length === 0 ? (
                                <div className="bg-gray-50 rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
                                    <div className="text-5xl mb-4">🔍</div>
                                    <p className="text-gray-500 font-bold max-w-xs mx-auto">
                                        {t.noMatchesYet}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {matches.map(load => (
                                        <div
                                            key={load.id}
                                            className={`bg-white p-8 rounded-3xl shadow-lg border-2 transition hover:border-[#384BE7] ${load.isSmart ? 'border-[#384BE7] bg-blue-50/30' : 'border-gray-50'}`}
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    {load.isSmart && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-blue-600 text-white uppercase tracking-tighter mb-2">
                                                            ⚡ {t.smartMatch}
                                                        </span>
                                                    )}
                                                    <h4 className="text-2xl font-black text-black">
                                                        {load.origin_city} <span className="text-[#384BE7]">→</span> {load.destination_city}
                                                    </h4>
                                                    <p className="text-gray-400 font-bold text-sm uppercase mt-1">
                                                        {new Date(load.pickup_date).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs font-black text-gray-400 uppercase">{t.highRelevance}</div>
                                                    <div className="text-2xl font-black text-[#384BE7]">{load.relevance}%</div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:flex-row gap-4">
                                                <button
                                                    onClick={() => handleQuickBid(load.id, load.estimated_price)}
                                                    disabled={biddingId === load.id}
                                                    className={`flex-1 ${biddingId === load.id ? 'bg-green-500' : 'bg-black'} text-white font-black py-4 rounded-xl uppercase tracking-widest text-sm transition transform active:scale-95`}
                                                >
                                                    {biddingId === load.id ? '✓ SENT' : t.quickBid}
                                                </button>
                                                <button
                                                    onClick={() => navigate('/find-loads')}
                                                    className="flex-1 border-2 border-gray-100 text-black font-black py-4 rounded-xl uppercase tracking-widest text-sm hover:bg-gray-50 transition"
                                                >
                                                    {t.viewBid}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostEmptyVehicle;
