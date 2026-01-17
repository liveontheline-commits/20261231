import React, { useEffect, useState } from 'react';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';

const MyFleet = () => {
    const { language } = useLanguage();
    const [tab, setTab] = useState('vehicles'); // 'vehicles' or 'drivers'
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([
        { id: 1, name: 'Ahmet Yılmaz', phone: '+90 532 000 0001', src_expiry: '2025-06-12', psycho_expiry: '2025-08-20', status: 'ACTIVE' },
        { id: 2, name: 'Mehmet Demir', phone: '+90 532 000 0002', src_expiry: '2025-02-15', psycho_expiry: '2025-11-10', status: 'ACTIVE' },
    ]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newVehicle, setNewVehicle] = useState({
        plate_number: '',
        type: 'Truck',
        capacity_kg: '',
        current_location: ''
    });

    const [newDriver, setNewDriver] = useState({
        name: '', phone: '', src_expiry: '', psycho_expiry: ''
    });

    const text = {
        en: {
            title: "Asset & Personnel Management",
            tabVehicles: "Vehicles",
            tabDrivers: "Drivers",
            addVehicle: "Add Vehicle",
            addDriver: "Add Driver",
            cancel: "Cancel",
            saveVehicle: "Save Vehicle",
            saveDriver: "Save Driver",
            addNewVehicle: "Add New Vehicle",
            addNewDriver: "Add New Driver Profile",
            plate: "Plate Number",
            capacity: "Capacity (kg)",
            city: "Current City",
            location: "Location",
            truck: "Truck",
            van: "Van",
            trailer: "Trailer",
            alertAdded: "Added successfully",
            alertFail: "Failed to add",
            driverName: "Full Name",
            phone: "Phone Number",
            src: "SRC Document Expiry",
            psycho: "Psychotechnic Expiry",
            expiresSoon: "Expires Soon!",
            expired: "EXPIRED!",
            safe: "Valid"
        },
        tr: {
            title: "Varlık ve Personel Yönetimi",
            tabVehicles: "Araçlar",
            tabDrivers: "Sürücüler",
            addVehicle: "Araç Ekle",
            addDriver: "Sürücü Ekle",
            cancel: "İptal",
            saveVehicle: "Aracı Kaydet",
            saveDriver: "Sürücüyü Kaydet",
            addNewVehicle: "Yeni Araç Ekle",
            addNewDriver: "Yeni Sürücü Profili Ekle",
            plate: "Plaka",
            capacity: "Kapasite (kg)",
            city: "Mevcut Şehir",
            location: "Konum",
            truck: "Kamyon",
            van: "Kamyonet",
            trailer: "Tır",
            alertAdded: "Başarıyla eklendi",
            alertFail: "Ekleme başarısız",
            driverName: "Ad Soyad",
            phone: "Telefon",
            src: "SRC Belge Bitiş",
            psycho: "Psikoteknik Bitiş",
            expiresSoon: "Yakında Doluyor!",
            expired: "SÜRESİ DOLDU!",
            safe: "Geçerli"
        }
    };

    const t = text[language];

    useEffect(() => {
        fetchVehicles();
        if (tab === 'drivers') fetchDrivers();
    }, [tab]);

    const fetchVehicles = async () => {
        try {
            const res = await api.get('/vehicles');
            setVehicles(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchDrivers = async () => {
        try {
            const res = await api.get('/enterprise/drivers');
            setDrivers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        try {
            await api.post('/vehicles', newVehicle);
            alert(t.alertAdded);
            setShowAddForm(false);
            fetchVehicles();
            setNewVehicle({ plate_number: '', type: 'Truck', capacity_kg: '', current_location: '' });
        } catch (err) {
            alert(t.alertFail);
        }
    };

    const handleAddDriver = async (e) => {
        e.preventDefault();
        try {
            await api.post('/enterprise/drivers', {
                full_name: newDriver.name,
                phone: newDriver.phone,
                src_expiry_date: newDriver.src_expiry,
                psychotechnic_expiry_date: newDriver.psycho_expiry
            });
            alert(t.alertAdded);
            setShowAddForm(false);
            fetchDrivers();
            setNewDriver({ name: '', phone: '', src_expiry: '', psycho_expiry: '' });
        } catch (err) {
            alert(t.alertFail);
        }
    };

    const getExpiryStatus = (date) => {
        const now = new Date();
        const expiry = new Date(date);
        const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return { label: t.expired, color: 'text-red-600 bg-red-50 border-red-200' };
        if (diffDays < 30) return { label: t.expiresSoon, color: 'text-orange-600 bg-orange-50 border-orange-200' };
        return { label: t.safe, color: 'text-green-600 bg-green-50 border-green-200' };
    };

    return (
        <div className="min-h-screen bg-gray-50 border-t border-gray-100 selection:bg-[#384BE7] selection:text-white">
            <div className="max-w-7xl mx-auto p-6 md:p-10">
                {/* Header & Tabs */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-black tracking-tight mb-2 uppercase">{t.title}</h1>
                        <div className="flex space-x-1 bg-gray-200 p-1 rounded-xl w-fit">
                            <button
                                onClick={() => { setTab('vehicles'); setShowAddForm(false); }}
                                className={`px-6 py-2 rounded-lg font-bold text-sm transition ${tab === 'vehicles' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                            >
                                {t.tabVehicles}
                            </button>
                            <button
                                onClick={() => { setTab('drivers'); setShowAddForm(false); }}
                                className={`px-6 py-2 rounded-lg font-bold text-sm transition ${tab === 'drivers' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                            >
                                {t.tabDrivers}
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-[#384BE7] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg transform hover:-translate-y-0.5 active:scale-95"
                    >
                        {showAddForm ? t.cancel : (tab === 'vehicles' ? t.addVehicle : t.addDriver)}
                    </button>
                </div>

                {/* Add Forms */}
                {showAddForm && tab === 'vehicles' && (
                    <div className="bg-white p-8 rounded-2xl shadow-xl mb-10 border border-gray-100 animate-fade-in-up">
                        <h3 className="text-xl font-bold mb-6 flex items-center">
                            <span className="w-2 h-8 bg-[#384BE7] rounded-full mr-3"></span>
                            {t.addNewVehicle}
                        </h3>
                        <form onSubmit={handleAddVehicle} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">{t.plate}</label>
                                <input
                                    placeholder="34 ABC 123"
                                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#384BE7] font-bold"
                                    required
                                    value={newVehicle.plate_number}
                                    onChange={e => setNewVehicle({ ...newVehicle, plate_number: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">{t.location}</label>
                                <input
                                    placeholder="City"
                                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#384BE7] font-bold"
                                    required
                                    value={newVehicle.current_location}
                                    onChange={e => setNewVehicle({ ...newVehicle, current_location: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">{t.capacity}</label>
                                <input
                                    placeholder="24000"
                                    type="number"
                                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#384BE7] font-bold"
                                    required
                                    value={newVehicle.capacity_kg}
                                    onChange={e => setNewVehicle({ ...newVehicle, capacity_kg: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Type</label>
                                <select
                                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#384BE7] font-bold appearance-none"
                                    value={newVehicle.type}
                                    onChange={e => setNewVehicle({ ...newVehicle, type: e.target.value })}
                                >
                                    <option value="Truck">{t.truck}</option>
                                    <option value="Van">{t.van}</option>
                                    <option value="Trailer">{t.trailer}</option>
                                </select>
                            </div>
                            <button type="submit" className="md:col-span-2 lg:col-span-4 bg-black text-white p-4 rounded-xl hover:bg-gray-800 transition font-black uppercase tracking-widest mt-2 shadow-lg">
                                {t.saveVehicle}
                            </button>
                        </form>
                    </div>
                )}

                {showAddForm && tab === 'drivers' && (
                    <div className="bg-white p-8 rounded-2xl shadow-xl mb-10 border border-gray-100 animate-fade-in-up">
                        <h3 className="text-xl font-bold mb-6 flex items-center">
                            <span className="w-2 h-8 bg-green-500 rounded-full mr-3"></span>
                            {t.addNewDriver}
                        </h3>
                        <form onSubmit={handleAddDriver} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">{t.driverName}</label>
                                <input
                                    placeholder="John Doe"
                                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 font-bold"
                                    required
                                    value={newDriver.name}
                                    onChange={e => setNewDriver({ ...newDriver, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">{t.phone}</label>
                                <input
                                    placeholder="+90 5XX"
                                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 font-bold"
                                    required
                                    value={newDriver.phone}
                                    onChange={e => setNewDriver({ ...newDriver, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">{t.src}</label>
                                <input
                                    type="date"
                                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 font-bold"
                                    required
                                    value={newDriver.src_expiry}
                                    onChange={e => setNewDriver({ ...newDriver, src_expiry: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">{t.psycho}</label>
                                <input
                                    type="date"
                                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 font-bold"
                                    required
                                    value={newDriver.psycho_expiry}
                                    onChange={e => setNewDriver({ ...newDriver, psycho_expiry: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="md:col-span-2 lg:col-span-4 bg-black text-white p-4 rounded-xl hover:bg-gray-800 transition font-black uppercase tracking-widest mt-2 shadow-lg">
                                {t.saveDriver}
                            </button>
                        </form>
                    </div>
                )}

                {/* Lists */}
                {tab === 'vehicles' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {vehicles.map(v => (
                            <div key={v.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-gray-900 text-white px-3 py-1 rounded-lg text-sm font-black tracking-wider uppercase">{v.plate_number}</div>
                                    <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full tracking-widest ${v.status === 'EMPTY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {v.status}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="text-gray-400 text-sm font-bold">{t.tabVehicles}</span>
                                        <span className="text-black font-black uppercase text-sm">
                                            {v.type === 'Truck' ? t.truck : v.type === 'Van' ? t.van : v.type === 'Trailer' ? t.trailer : v.type}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="text-gray-400 text-sm font-bold">{t.capacity}</span>
                                        <span className="text-black font-black uppercase text-sm">{v.capacity_kg.toLocaleString()} KG</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl mt-4">
                                        <div className="flex items-center space-x-2">
                                            <span className="w-2 h-2 bg-[#384BE7] rounded-full animate-pulse"></span>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.location}</span>
                                        </div>
                                        <span className="text-black font-black uppercase text-xs tracking-tight">{v.current_location}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {drivers.map(d => {
                            const srcStatus = getExpiryStatus(d.src_expiry_date || d.src_expiry);
                            const psychoStatus = getExpiryStatus(d.psychotechnic_expiry_date || d.psycho_expiry);
                            return (
                                <div key={d.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-xl">👤</div>
                                            <div>
                                                <h4 className="font-black text-black uppercase leading-tight">{d.full_name || d.name}</h4>
                                                <p className="text-gray-400 text-xs font-bold">{d.phone}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                if (window.confirm('Are you sure?')) {
                                                    await api.delete(`/enterprise/drivers/${d.id}`);
                                                    fetchDrivers();
                                                }
                                            }}
                                            className="text-gray-300 hover:text-red-500 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-3 rounded-xl border border-gray-50 flex flex-col space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{t.src}</span>
                                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${srcStatus.color}`}>
                                                    {srcStatus.label}
                                                </span>
                                            </div>
                                            <span className="text-sm font-black">{d.src_expiry_date || d.src_expiry}</span>
                                        </div>

                                        <div className="p-3 rounded-xl border border-gray-50 flex flex-col space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{t.psycho}</span>
                                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${psychoStatus.color}`}>
                                                    {psychoStatus.label}
                                                </span>
                                            </div>
                                            <span className="text-sm font-black">{d.psychotechnic_expiry_date || d.psycho_expiry}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyFleet;
