import React, { useEffect, useState } from 'react';
import api from '../api';
import TrackingView from '../components/TrackingView';
import { useLanguage } from '../context/LanguageContext';

const MyJobs = () => {
    const { language } = useLanguage();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedJobId, setSelectedJobId] = useState(null);
    const [statusFrom, setStatusForm] = useState({ status: 'IN_TRANSIT', location: '', note: '' });

    const [viewHistoryId, setViewHistoryId] = useState(null);

    const text = {
        en: {
            title: "My Active Jobs",
            loading: "Loading...",
            noJobs: "No active jobs found. Start bidding!",
            history: "View History",
            update: "Update Status",
            modalTitle: "Update Shipment Status",
            status: "New Status",
            location: "Current Location",
            locPlaceholder: "e.g. Belgrade, Serbia",
            note: "Note (Optional)",
            submit: "Submit Update",
            alertSuccess: "Update Sent",
            alertFail: "Failed to update",
            sPickedUp: "Picked Up",
            sInTransit: "In Transit",
            sDelayed: "Delayed",
            sArrived: "Arrived at Destination",
            sDelivered: "Delivered",
            viewOrder: "View Details"
        },
        tr: {
            title: "Aktif İşlerim",
            loading: "Yükleniyor...",
            noJobs: "Aktif iş bulunamadı. Hemen teklif vermeye başlayın!",
            history: "Geçmişi Gör",
            update: "Durum Güncelle",
            modalTitle: "Sevkiyat Durumunu Güncelle",
            status: "Yeni Durum",
            location: "Mevcut Konum",
            locPlaceholder: "örn. İstanbul, Türkiye",
            note: "Not (Opsiyonel)",
            submit: "Güncellemeyi Gönder",
            alertSuccess: "Güncelleme Gönderildi",
            alertFail: "Güncelleme başarısız",
            sPickedUp: "Yük Alındı",
            sInTransit: "Yolda",
            sDelayed: "Gecikmeli",
            sArrived: "Varış Noktasına Ulaştı",
            sDelivered: "Teslim Edildi",
            viewOrder: "Detayları Gör"
        }
    };

    const t = text[language];

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await api.get('/tracking/my-jobs');
            setJobs(res.data);
        } catch (err) {
            console.error('Failed to fetch jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tracking/update', { loadId: selectedJobId, ...statusFrom });
            alert(t.alertSuccess);
            setSelectedJobId(null);
            setStatusForm({ status: 'IN_TRANSIT', location: '', note: '' });
            fetchJobs();
        } catch (err) {
            alert(t.alertFail);
        }
    };

    const formatStatus = (s) => {
        const map = {
            'PICKED_UP': t.sPickedUp,
            'IN_TRANSIT': t.sInTransit,
            'DELAYED': t.sDelayed,
            'ARRIVED_AT_DESTINATION': t.sArrived,
            'DELIVERED': t.sDelivered
        };
        return map[s] || s;
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-black mb-6 text-black uppercase tracking-tight">{t.title}</h2>

            {loading ? <p className="font-bold text-gray-400">{t.loading}</p> : (
                <div className="space-y-4">
                    {jobs.length === 0 && <p className="text-gray-500 font-medium">{t.noJobs}</p>}
                    {jobs.map(job => (
                        <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center transition hover:shadow-md">
                            <div className="mb-4 md:mb-0">
                                <h3 className="font-black text-xl text-black">{job.origin_city} <span className="text-[#384BE7]">→</span> {job.destination_city}</h3>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">ID: #{job.id} • <span className="text-[#384BE7]">{formatStatus(job.status)}</span></p>
                                <p className="text-xs text-gray-500 mt-2 font-medium">{job.goods_type} • {job.weight_kg}kg</p>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setViewHistoryId(job.id)}
                                    className="px-6 py-2 bg-gray-100 text-black rounded-xl font-bold hover:bg-gray-200 transition"
                                >
                                    {t.history}
                                </button>
                                <button
                                    onClick={() => setSelectedJobId(job.id)}
                                    className="px-6 py-2 bg-[#384BE7] text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg"
                                >
                                    {t.update}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Update Modal */}
            {selectedJobId && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 transition-all">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md relative animate-fade-in-up">
                        <button onClick={() => setSelectedJobId(null)} className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl">✖</button>
                        <h3 className="font-black text-2xl mb-6 uppercase tracking-tight">{t.modalTitle}</h3>
                        <form onSubmit={handleUpdateSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">{t.status}</label>
                                <select
                                    value={statusFrom.status}
                                    onChange={(e) => setStatusForm({ ...statusFrom, status: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl font-bold focus:ring-2 focus:ring-[#384BE7] outline-none transition"
                                >
                                    <option value="PICKED_UP">{t.sPickedUp}</option>
                                    <option value="IN_TRANSIT">{t.sInTransit}</option>
                                    <option value="DELAYED">{t.sDelayed}</option>
                                    <option value="ARRIVED_AT_DESTINATION">{t.sArrived}</option>
                                    <option value="DELIVERED">{t.sDelivered}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">{t.location}</label>
                                <input
                                    required
                                    value={statusFrom.location}
                                    onChange={(e) => setStatusForm({ ...statusFrom, location: e.target.value })}
                                    placeholder={t.locPlaceholder}
                                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl font-bold focus:ring-2 focus:ring-[#384BE7] outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">{t.note}</label>
                                <textarea
                                    value={statusFrom.note}
                                    onChange={(e) => setStatusForm({ ...statusFrom, note: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl font-bold focus:ring-2 focus:ring-[#384BE7] outline-none transition"
                                    rows="2"
                                />
                            </div>
                            <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-gray-800 transition shadow-xl mt-4">
                                {t.submit}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* History Modal */}
            {viewHistoryId && <TrackingView loadId={viewHistoryId} onClose={() => setViewHistoryId(null)} />}

        </div>
    );
};

export default MyJobs;
