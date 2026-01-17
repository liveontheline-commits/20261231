import React, { useEffect, useState } from 'react';
import api from '../api';
import TrendWidget from '../components/TrendWidget';
import { useLanguage } from '../context/LanguageContext';

const FindLoads = () => {
    const { language } = useLanguage();
    const [loads, setLoads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLoad, setSelectedLoad] = useState(null); // Load object to bid on
    const [bidAmount, setBidAmount] = useState('');
    const [trends, setTrends] = useState(null);

    const text = {
        en: {
            title: "Available Loads",
            loading: "Loading available loads...",
            pickup: "Pickup",
            weight: "Weight",
            goods: "Goods",
            postedBy: "Posted by",
            estPrice: "Est. Price",
            placeBid: "Place Bid",
            noLoads: "No available loads at the moment.",
            modalTitle: "Place Bid",
            bidAmountLabel: "Bid Amount (EUR)",
            cancel: "Cancel",
            submit: "Submit Bid",
            bidSuccess: "Bid Placed Successfully",
            bidFail: "Failed to place bid",
            loadLabel: "Load"
        },
        tr: {
            title: "Mevcut Yükler",
            loading: "Yükler yükleniyor...",
            pickup: "Alım Tarihi",
            weight: "Ağırlık",
            goods: "Yük Tipi",
            postedBy: "İlan Sahibi",
            estPrice: "Tahmini Fiyat",
            placeBid: "Teklif Ver",
            noLoads: "Şu anda uygun yük bulunmamaktadır.",
            modalTitle: "Teklif Ver",
            bidAmountLabel: "Teklif Tutarı (EUR)",
            cancel: "İptal",
            submit: "Teklifi Gönder",
            bidSuccess: "Teklif Başarıyla Verildi",
            bidFail: "Teklif verilemedi",
            loadLabel: "Yük"
        }
    };

    const t = text[language];

    useEffect(() => {
        fetchLoads();
    }, []);

    const fetchLoads = async () => {
        try {
            const res = await api.get('/loads');
            setLoads(res.data);
        } catch (err) {
            console.error("Failed to fetch loads", err);
            alert("Hata (Yükler): " + (err.response?.status || err.message));
        }
        finally {
            setLoading(false);
        }
    };

    const handleOpenBidModal = async (load) => {
        setSelectedLoad(load);
        // Fetch Trends
        try {
            const res = await api.get(`/enterprise/trends?origin=${load.origin_city}&destination=${load.destination_city}`);
            setTrends(res.data);
        } catch (err) {
            console.error("Failed to fetch trends", err);
            setTrends(null);
        }
    };

    const handleCloseModal = () => {
        setSelectedLoad(null);
        setTrends(null);
        setBidAmount('');
    };

    const handleSubmitBid = async (e) => {
        e.preventDefault();
        if (!selectedLoad) return;

        try {
            await api.post('/bids', {
                load_id: selectedLoad.id,
                amount: bidAmount,
                message: 'Standard Bid' // Keeping this for now, as it was in the original code
            });
            alert(t.bidSuccess);
            handleCloseModal();
        } catch (err) {
            alert(err.response?.data?.error || t.bidFail);
        }
    };

    if (loading) return <div className="p-8">{t.loading}</div>;

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{t.title}</h2>

            <div className="grid gap-4">
                {loads.map(load => (
                    <div key={load.id} className="bg-white p-6 rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <div className="flex items-center space-x-2 text-lg font-bold text-primary">
                                <span>{load.origin_city}, {load.origin_country}</span>
                                <span className="text-gray-400">→</span>
                                <span>{load.destination_city}, {load.destination_country}</span>
                            </div>
                            <p className="text-gray-600 mt-1">
                                {t.pickup}: {new Date(load.pickup_date).toLocaleDateString()} |
                                {t.weight}: {load.weight_kg}kg |
                                {t.goods}: {load.goods_type}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">{t.postedBy}: {load.owner_company}</p>
                            {load.estimated_price && (
                                <p className="text-sm font-semibold text-green-600 mt-1">{t.estPrice}: €{load.estimated_price}</p>
                            )}
                        </div>

                        <div className="mt-4 md:mt-0">
                            <button
                                onClick={() => handleOpenBidModal(load)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                {t.placeBid}
                            </button>
                        </div>
                    </div>
                ))}
                {loads.length === 0 && <p className="text-gray-500">{t.noLoads}</p>}
            </div>

            {/* Simple Modal for Bidding */}
            {selectedLoad && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96 relative">
                        <button onClick={handleCloseModal} className="absolute top-2 right-2 text-gray-500">✖</button>
                        <h3 className="text-xl font-bold mb-4">{t.modalTitle}</h3>

                        <TrendWidget trends={trends} />

                        <p className="mb-4">{t.loadLabel}: {selectedLoad.origin_city} → {selectedLoad.destination_city}</p>
                        <form onSubmit={handleSubmitBid}>
                            <label className="block text-sm text-gray-700 mb-1">{t.bidAmountLabel}</label>
                            <input
                                type="number"
                                required
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                className="w-full border p-2 rounded mb-4"
                                placeholder="Your Offer"
                            />
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">{t.cancel}</button>
                                <button type="submit" className="px-4 py-2 bg-[#384BE7] text-white rounded hover:bg-blue-700">{t.submit}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindLoads;
