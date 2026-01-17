import React, { useEffect, useState } from 'react';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';

const AddressBook = () => {
    const { language } = useLanguage();
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({ title: '', address: '', city: '', country: '' });

    const [searchTerm, setSearchTerm] = useState('');

    const text = {
        en: {
            title: "Address Book",
            addNew: "Add New Location",
            locTitle: "Location Title (e.g. Warehouse A)",
            fullAddress: "Full Address",
            city: "City",
            country: "Country",
            save: "Save Location",
            alertSaved: "Address Saved",
            alertFail: "Failed to save address",
            search: "Search locations...",
            noMatch: "No locations match your search."
        },
        tr: {
            title: "Adres Defteri",
            addNew: "Yeni Konum Ekle",
            locTitle: "Konum Başlığı (örn. Depo A)",
            fullAddress: "Tam Adres",
            city: "Şehir",
            country: "Ülke",
            save: "Konumu Kaydet",
            alertSaved: "Adres Kaydedildi",
            alertFail: "Adres kaydedilemedi",
            search: "Konumlarda ara...",
            noMatch: "Aramanızla eşleşen konum bulunamadı."
        }
    };

    const t = text[language];

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            console.log('AddressBook.jsx: Fetching addresses from /features/address-book');
            const res = await api.get('/features/address-book');
            console.log('AddressBook.jsx: Fetched:', res.data);
            setAddresses(res.data);
        } catch (err) {
            console.error('Failed to fetch addresses', err);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            console.log('AddressBook.jsx: Adding address to /features/address-book', newAddress);
            await api.post('/features/address-book', newAddress);
            alert(t.alertSaved);
            fetchAddresses();
            setNewAddress({ title: '', address: '', city: '', country: '' });
        } catch (err) {
            console.error('AddressBook.jsx: Failed to save', err);
            alert(t.alertFail + ': ' + (err.response?.data?.error || err.message));
        }
    };

    const filteredAddresses = addresses.filter(addr =>
        addr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        addr.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        addr.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        addr.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-black mb-8 text-black uppercase tracking-tight">{t.title}</h2>

            {/* NEW: Search Bar */}
            <div className="mb-10 flex items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 max-w-xl">
                <span className="text-xl mr-3 text-gray-400">🔍</span>
                <input
                    type="text"
                    placeholder={t.search}
                    className="w-full bg-transparent outline-none font-bold text-gray-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-10">
                <h3 className="text-xl font-black mb-6 flex items-center">
                    <span className="w-2 h-8 bg-[#384BE7] rounded-full mr-3"></span>
                    {t.addNew}
                </h3>
                <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                        placeholder={t.locTitle}
                        className="bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-[#384BE7] outline-none font-bold md:col-span-2"
                        value={newAddress.title}
                        onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
                        required
                    />
                    <input
                        placeholder={t.fullAddress}
                        className="bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-[#384BE7] outline-none font-bold md:col-span-2"
                        value={newAddress.address}
                        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                        required
                    />
                    <input
                        placeholder={t.city}
                        className="bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-[#384BE7] outline-none font-bold"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        required
                    />
                    <input
                        placeholder={t.country}
                        className="bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-[#384BE7] outline-none font-bold"
                        value={newAddress.country}
                        onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                        required
                    />
                    <button type="submit" className="md:col-span-2 bg-black text-white p-4 rounded-xl font-black uppercase tracking-widest hover:bg-gray-800 transition shadow-xl mt-2">
                        {t.save}
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAddresses.length === 0 ? (
                    <div className="md:col-span-2 lg:col-span-3 text-center py-20 bg-gray-100 rounded-[2rem] border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">{t.noMatch}</p>
                    </div>
                ) : (
                    filteredAddresses.map(addr => (
                        <div key={addr.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="bg-blue-50 text-[#384BE7] p-2 rounded-xl group-hover:bg-[#384BE7] group-hover:text-white transition-colors">
                                    📍
                                </div>
                                <h4 className="font-black text-xl text-black uppercase tracking-tight">{addr.title}</h4>
                            </div>
                            <p className="text-gray-400 font-bold text-sm mb-1">{addr.address}</p>
                            <p className="text-[#384BE7] font-black uppercase text-xs tracking-widest">{addr.city}, {addr.country}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AddressBook;
