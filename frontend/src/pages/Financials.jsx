import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../api';

const Financials = () => {
    const { language } = useLanguage();
    const [transactions, setTransactions] = useState([]);

    const text = {
        en: {
            title: "Financial Center",
            balance: "Balance Due",
            monthly: "Monthly Spend",
            history: "Transaction History",
            id: "Transaction ID",
            amount: "Amount",
            status: "Status",
            invoice: "E-Invoice",
            download: "Download PDF",
            paid: "Paid",
            pending: "Pending",
            noData: "No financial transactions found."
        },
        tr: {
            title: "Finans Merkezi",
            balance: "Kalan Bakiye",
            monthly: "Aylık Harcama",
            history: "İşlem Geçmişi",
            id: "İşlem ID",
            amount: "Tutar",
            status: "Durum",
            invoice: "E-Fatura",
            download: "PDF İndir",
            paid: "Ödendi",
            pending: "Beklemede",
            noData: "Finansal işlem bulunamadı."
        }
    };

    const t = text[language];
    const [summary, setSummary] = useState({ amount: 0, balance_label: t.monthly });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [txRes, sumRes] = await Promise.all([
                api.get('/enterprise/financials/transactions'),
                api.get('/enterprise/financials/summary')
            ]);
            setTransactions(txRes.data);
            setSummary(sumRes.data);
        } catch (err) {
            console.error('Failed to fetch financial data');
        }
    };

    const handleDownload = (tx) => {
        const content = `
            RECEIPT / INVOICE
            -----------------
            Transaction ID: ${tx.id}
            Date: ${new Date(tx.created_at).toLocaleDateString()}
            Amount: €${tx.amount.toLocaleString()}
            Route: ${tx.origin_city} -> ${tx.destination_city}
            Status: PAID
            -----------------
            Thank you for using our Logistics Platform.
        `;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Receipt_${tx.id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-black mb-8 text-black uppercase tracking-tight">{t.title}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{summary.balance_label}</p>
                    <h3 className="text-4xl font-black text-black">€{summary.amount.toLocaleString()}</h3>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{t.balance}</p>
                    <h3 className="text-4xl font-black text-[#384BE7]">€0.00</h3>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                    <h4 className="font-black text-black uppercase tracking-widest text-sm">{t.history}</h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">{t.id}</th>
                                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">{t.amount}</th>
                                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">{t.status}</th>
                                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">{t.invoice}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {transactions.length === 0 ? (
                                <tr><td colSpan="4" className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">{t.noData}</td></tr>
                            ) : transactions.map(tx => (
                                <tr key={tx.id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="p-6">
                                        <p className="font-bold text-black text-sm">#{tx.id}</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-black">{tx.origin_city} &rarr; {tx.destination_city}</p>
                                    </td>
                                    <td className="p-6 text-black font-black">€{tx.amount.toLocaleString()}</td>
                                    <td className="p-6">
                                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded tracking-tighter bg-green-100 text-green-700}`}>
                                            {t.paid}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <button
                                            onClick={() => handleDownload(tx)}
                                            className="text-[#384BE7] font-black text-[10px] uppercase tracking-widest hover:underline"
                                        >
                                            {t.download}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Financials;
