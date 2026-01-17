import React, { useEffect, useState } from 'react';
import api from '../api';

const TrackingView = ({ loadId, onClose }) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get(`/tracking/${loadId}/history`);
                setHistory(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        if (loadId) fetchHistory();
    }, [loadId]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">✖</button>
                <h3 className="text-xl font-bold mb-4 border-b pb-2">Tracking History</h3>

                <div className="space-y-6 max-h-96 overflow-y-auto">
                    {history.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No updates yet.</p>
                    ) : (
                        history.map((h, index) => (
                            <div key={h.id} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className={`w-4 h-4 rounded-full ${index === 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    {index !== history.length - 1 && <div className="w-0.5 h-full bg-gray-200 my-1"></div>}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">{h.status}</p>
                                    <p className="text-sm text-gray-600">📍 {h.location}</p>
                                    {h.note && <p className="text-sm text-gray-500 italic">"{h.note}"</p>}
                                    <p className="text-xs text-gray-400 mt-1">{new Date(h.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackingView;
