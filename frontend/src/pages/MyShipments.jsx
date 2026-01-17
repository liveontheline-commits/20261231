import React, { useEffect, useState } from 'react';
import api from '../api';
import TrackingView from '../components/TrackingView';
import { useLanguage } from '../context/LanguageContext';

const MyShipments = () => {
    const { language } = useLanguage();
    const [loads, setLoads] = useState([]);
    const [selectedLoadBids, setSelectedLoadBids] = useState(null); // Load ID for bids modal
    const [bids, setBids] = useState([]);

    // Tracking State
    const [trackingLoadId, setTrackingLoadId] = useState(null);
    const [activeTab, setActiveTab] = useState('ALL'); // ALL, OPEN, IN_TRANSIT, DELIVERED
    const [deleteConfirm, setDeleteConfirm] = useState(null); // Load ID to confirm delete

    const text = {
        en: {
            title: "Shipment Visibility Hub",
            pickup: "Pickup",
            status: "Status",
            viewBids: "View Bids",
            track: "Track Shipment",
            bidsFor: "Bids for Load",
            noBids: "No bids yet.",
            transporter: "Transporter",
            accept: "Accept",
            reject: "Reject",
            risk: "Carrier Risk",
            eta: "Estimated Arrival",
            bidAction: (action) => `Bid ${action}ed`,
            all: "All",
            open: "Open",
            inTransit: "On the Way",
            delivered: "Delivered",
            noLoads: "No shipments found in this category.",
            offers: "Offers Received",
            delete: "Delete",
            deleteConfirm: "Are you sure you want to delete this shipment? This action cannot be undone.",
            confirm: "Confirm",
            cancel: "Cancel"
        },
        tr: {
            title: "Sevkiyat Görünürlük Merkezi",
            pickup: "Alım Tarihi",
            status: "Durum",
            viewBids: "Teklifleri Gör",
            track: "Kargo Takibi",
            bidsFor: "Yük Teklifleri",
            noBids: "Henüz teklif yok.",
            transporter: "Taşıyıcı",
            accept: "Kabul Et",
            reject: "Reddet",
            risk: "Taşıyıcı Riski",
            eta: "Tahmini Varış",
            bidAction: (action) => `Teklif ${action === 'accept' ? 'kabul edildi' : 'reddedildi'}`,
            all: "Tümü",
            open: "Açık",
            inTransit: "Yolda",
            delivered: "Tamamlandı",
            noLoads: "Bu kategoride sevkiyat bulunamadı.",
            offers: "Gelen Teklifler",
            delete: "Sil",
            deleteConfirm: "Bu sevkiyatı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
            confirm: "Onayla",
            cancel: "İptal Et"
        }
    };

    const t = text[language];

    const getRiskBadge = (score) => {
        if (score > 90) return <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded uppercase tracking-tighter">Low Risk</span>;
        if (score > 70) return <span className="text-[10px] font-black text-yellow-600 bg-yellow-50 px-2 py-1 rounded uppercase tracking-tighter">Medium Risk</span>;
        return <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded uppercase tracking-tighter">High Risk</span>;
    };

    useEffect(() => {
        fetchLoads();
    }, []);

    const fetchLoads = async () => {
        try {
            const res = await api.get('/loads/my-loads');
            setLoads(res.data);
        } catch (err) {
            console.error('Failed to fetch loads');
        }
    };

    const handleViewBids = async (loadId) => {
        setSelectedLoadBids(loadId);
        try {
            const res = await api.get(`/bids/${loadId}`);
            setBids(res.data);
        } catch (err) {
            console.error('Failed to fetch bids');
        }
    };

    const handleActionBid = async (bidId, action) => {
        try {
            await api.post(`/bids/${bidId}/${action}`);
            alert(t.bidAction(action));
            handleViewBids(selectedLoadBids); // Refresh bids
            fetchLoads(); // Refresh loads to show status
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteLoad = async (loadId) => {
        try {
            await api.delete(`/loads/${loadId}`);
            setDeleteConfirm(null);
            alert('Shipment deleted successfully');
            fetchLoads(); // Refresh loads
        } catch (err) {
            console.error(err);
            alert('Failed to delete shipment');
        }
    };

    return (
        <div className="p-8 bg-white min-h-screen">
            <h2 className="text-3xl font-black mb-10 text-black uppercase tracking-tight">{t.title}</h2>

            {/* Tabs */}
            <div className="flex space-x-2 mb-8 bg-gray-50 p-1 rounded-2xl w-fit">
                {['ALL', 'OPEN', 'IN_TRANSIT', 'DELIVERED'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === tab
                            ? 'bg-black text-white shadow-lg'
                            : 'text-gray-400 hover:text-black'
                            }`}
                    >
                        {tab === 'ALL' ? t.all : tab === 'OPEN' ? t.open : tab === 'IN_TRANSIT' ? t.inTransit : t.delivered}
                    </button>
                ))}
            </div>

            <div className="grid gap-8">
                {loads.filter(l => activeTab === 'ALL' || l.status === activeTab).length === 0 ? (
                    <div className="bg-gray-50 rounded-[2rem] p-20 text-center border-2 border-dashed border-gray-100">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">{t.noLoads}</p>
                    </div>
                ) : (
                    loads
                        .filter(l => activeTab === 'ALL' || l.status === activeTab)
                        .map(load => {
                            // Mock Risk and ETA
                            const mockRiskScore = 95 - (load.id % 20);
                            const mockETA = new Date(new Date(load.pickup_date).getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString();

                            return (
                                <div key={load.id} className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-50 flex flex-col md:flex-row justify-between relative overflow-hidden group hover:scale-[1.01] transition-transform">
                                    <div className={`absolute top-0 left-0 w-1.5 h-full ${load.status === 'OPEN' ? 'bg-green-500' :
                                        load.status === 'IN_TRANSIT' ? 'bg-[#384BE7]' : 'bg-gray-400'
                                        }`}></div>

                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <h3 className="text-2xl font-black text-black uppercase tracking-tighter">{load.origin_city} &rarr; {load.destination_city}</h3>
                                            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${load.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                                                load.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {load.status === 'IN_TRANSIT' ? t.inTransit : load.status === 'OPEN' ? t.open : load.status === 'DELIVERED' ? t.delivered : load.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.pickup}</p>
                                                <p className="text-sm font-black text-black">{new Date(load.pickup_date).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.eta}</p>
                                                <p className="text-sm font-black text-[#384BE7]">{mockETA}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.risk}</p>
                                                {getRiskBadge(mockRiskScore)}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.offers}</p>
                                                <p className={`text-sm font-black ${load.bid_count > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                                                    {load.bid_count} {language === 'tr' ? 'Teklif' : 'Bids'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 md:mt-0 md:ml-8 flex flex-col space-y-3 justify-center">
                                        <button
                                            onClick={() => handleViewBids(load.id)}
                                            className="px-6 py-3 bg-black text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-[#384BE7] transition shadow-lg"
                                        >
                                            {t.viewBids}
                                        </button>
                                        {load.status !== 'OPEN' && (
                                            <button
                                                onClick={() => setTrackingLoadId(load.id)}
                                                className="px-6 py-3 bg-gray-100 text-black rounded-xl font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition"
                                            >
                                                {t.track}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setDeleteConfirm(load.id)}
                                            className="px-6 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-red-100 transition"
                                        >
                                            {t.delete}
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                )}
            </div>

            {/* Bids Modal (Updated Styling) */}
            {selectedLoadBids && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-2xl relative animate-fade-in-up">
                        <button onClick={() => setSelectedLoadBids(null)} className="absolute top-6 right-6 text-gray-400 hover:text-black transition text-2xl">✕</button>
                        <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter">{t.bidsFor} <span className="text-[#384BE7]">#{selectedLoadBids}</span></h3>

                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            {bids.length === 0 ? <p className="text-center py-10 text-gray-400 font-bold uppercase tracking-widest text-xs">{t.noBids}</p> : bids.map(bid => (
                                <div key={bid.id} className="p-6 rounded-2xl border border-gray-100 flex justify-between items-center bg-gray-50/50 hover:bg-blue-50/50 transition-colors">
                                    <div>
                                        <p className="text-2xl font-black text-black">€{bid.amount.toLocaleString()}</p>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{t.transporter}: {bid.transporter_id}</p>
                                    </div>
                                    <div className="space-x-3">
                                        {bid.status === 'PENDING' && (
                                            <>
                                                <button onClick={() => handleActionBid(bid.id, 'accept')} className="bg-[#384BE7] text-white px-5 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 shadow-md">{t.accept}</button>
                                                <button onClick={() => handleActionBid(bid.id, 'reject')} className="bg-white text-red-500 border border-red-100 px-5 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-50">{t.reject}</button>
                                            </>
                                        )}
                                        {bid.status !== 'PENDING' && <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{bid.status}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Tracking Modal */}
            {trackingLoadId && <TrackingView loadId={trackingLoadId} onClose={() => setTrackingLoadId(null)} />}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md animate-fade-in-up">
                        <h3 className="text-2xl font-black mb-4 text-black uppercase tracking-tight">{t.delete}</h3>
                        <p className="text-gray-600 mb-8 font-semibold text-sm leading-relaxed">{t.deleteConfirm}</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-6 py-3 bg-gray-100 text-black rounded-xl font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition"
                            >
                                {t.cancel}
                            </button>
                            <button
                                onClick={() => handleDeleteLoad(deleteConfirm)}
                                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-red-700 transition"
                            >
                                {t.confirm}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default MyShipments;
