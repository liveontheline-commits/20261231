import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';

const JobWizard = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [step, setStep] = useState(1);
    const [data, setData] = useState({
        origin_city: '', origin_country: 'Turkey',
        destination_city: '', destination_country: 'Turkey',
        pickup_date: '',
        weight_kg: '', vehicle_type_required: 'Truck', goods_type: '',
        estimated_price: '',
        load_type: 'Full', // Full, Partial, Reefer, ADR
        unit_count: '',
        unit_type: 'Pallet', // Pallet, Box, etc.
        instructions: '',
        price_strategy: 'FIXED' // FIXED, AUCTION, NEGOTIATION
    });
    const [estimation, setEstimation] = useState(null);
    const [errors, setErrors] = useState({});
    const [addressBook, setAddressBook] = useState([]);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [activeTarget, setActiveTarget] = useState(null); // { type: 'origin'|'destination'|'stop', index: number }
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchAddressBook();
    }, []);

    const fetchAddressBook = async () => {
        // Retrieve address book to populate dropdown
        try {
            const res = await api.get('/features/address-book');
            console.log('Fetched Address Book:', res.data);
            setAddressBook(res.data);
        } catch (err) {
            console.error('Failed to fetch address book', err);
        }
    };

    const handleAddressSelect = (addr) => {
        if (activeTarget.type === 'origin') {
            setData({ ...data, origin_city: addr.city, origin_country: addr.country });
        } else if (activeTarget.type === 'destination') {
            setData({ ...data, destination_city: addr.city, destination_country: addr.country });
        } else if (activeTarget.type === 'stop') {
            handleStopChange(activeTarget.index, 'city', addr.city);
        }
        setIsAddressModalOpen(false);
        console.log('Address selected and modal closed. Active target:', activeTarget, 'Selected address:', addr); // Debug info for modal
    };

    const handleSaveToBook = async (city, country) => {
        console.log('Initiating save to book for:', { city, country });
        if (!city) return;
        const title = prompt(language === 'tr' ? 'Adres Başlığı (örn. Bursa Depo):' : 'Address Title (e.g. London HQ):');
        console.log('Prompt title:', title);
        if (!title) return;

        try {
            const payload = {
                title,
                city,
                country,
                address: city // Defaulting address to city
            };
            console.log('Posting to /features/address-book:', payload);
            const res = await api.post('/features/address-book', payload);
            console.log('Save response:', res.data);
            alert(t.addrSaved);
            fetchAddressBook();
        } catch (err) {
            console.error('Failed to save address', err);
            alert('Failed to save address: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const validateStep = (s) => {
        const newErrors = {};
        if (s === 1) {
            if (!data.origin_city) newErrors.origin_city = true;
            if (!data.destination_city) newErrors.destination_city = true;
            if (!data.pickup_date) newErrors.pickup_date = true;
        } else if (s === 2) {
            if (!data.goods_type) newErrors.goods_type = true;
            if (!data.weight_kg) newErrors.weight_kg = true;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Multi-Stop Logic
    const [stops, setStops] = useState([]);

    const addStop = () => {
        setStops([...stops, { type: 'DROP', city: '', weight_kg: '' }]);
    };

    const removeStop = (index) => {
        const newStops = stops.filter((_, i) => i !== index);
        setStops(newStops);
    };

    const handleStopChange = (index, field, value) => {
        const newStops = [...stops];
        newStops[index][field] = value;
        setStops(newStops);
    };

    // Mode Toggle Logic for Style
    const [selectedService, setSelectedService] = useState('FTL'); // FTL, LTL, Intermodal

    const text = {
        en: {
            heroTitle: "Get a Freight Quote",
            heroDesc: "Fast, reliable pricing for your logistics needs.",
            step1: "Route & Mode",
            step2: "Cargo Details",
            step3: "AI Estimate",
            selectService: "Select Service Mode",
            ftl: "Full Truckload",
            ltl: "LTL (Partial)",
            intermodal: "Intermodal",
            routeVis: "Route Visualization (Map)",
            origin: "Origin",
            destination: "Destination",
            pickupLoc: "Pickup Location (Origin)",
            finalDest: "Final Destination",
            cityPlaceholder: "City or Zip Code",
            stopCity: "Stop City",
            stopType: "Type",
            stopWeight: "Kg",
            drop: "Drop-off",
            pickup: "Pick-up",
            addStop: "+ Add Stop (Loading/Delivery Point)",
            pickupDate: "Pickup Date",
            saveContinue: "Save & Continue",
            freightInfo: "Freight Information",
            commodity: "Commodity Type",
            commodityPlaceholder: "e.g. Machinery, Electronics",
            totalWeight: "Total Weight (kg)",
            equipType: "Equipment Type",
            dryVan: "Dry Van / Truck",
            reefer: "Reefer (Temp Controlled)",
            flatbed: "Open / Flatbed",
            back: "Back",
            viewEstimate: "Generate AI Estimate",
            estMarketRate: "Estimated Market Rate",
            basedOnData: "Based on current lane data",
            calculating: "Calculating...",
            finalizeOffer: "Finalize Your Strategy",
            offerPrice: "Your Price (€)",
            submitInfo: "By submitting this quote, your load will be instantly visible to over <strong>150,000+</strong> active carriers in our network.",
            editDetails: "Edit Details",
            submit: "Submit Quote Request",
            alertSuccess: "Quote Request Submitted!",
            alertFail: "Failed: ",
            range: "Range",
            loadType: "Load Type",
            full: "Full Load",
            partial: "Partial (Parsiyel)",
            adr: "Hazardous (ADR)",
            packaging: "Packaging Info",
            units: "Units",
            unitType: "Type",
            pallet: "Pallet",
            box: "Box",
            instructions: "Special Instructions",
            instrPlaceholder: "e.g. Forklift required, call before arrival...",
            negotiation: "Negotiable",
            fixed: "Fixed Price",
            auction: "Spot Auction",
            req: "This field is required",
            addressBook: "Address Book",
            selectAddr: "Select an Address",
            noAddr: "No addresses saved yet.",
            useAddr: "Use Saved Address",
            saveToBook: "Save to Address Book",
            addrSaved: "Address saved to book!",
            searchAddr: "Search by title, city..."
        },
        tr: {
            heroTitle: "Navlun Teklifi Alın",
            heroDesc: "Lojistik ihtiyaçlarınız için hızlı, güvenilir fiyatlandırma.",
            step1: "Rota ve Tür",
            step2: "Yük Detayları",
            step3: "AI Tahmini",
            selectService: "Hizmet Türünü Seçin",
            ftl: "Tam Kamyon Yükü (FTL)",
            ltl: "Parsiyel (LTL)",
            intermodal: "İntermodal",
            routeVis: "Rota Görselleştirme (Harita)",
            origin: "Kalkış",
            destination: "Varış",
            pickupLoc: "Alım Noktası (Kalkış)",
            finalDest: "Son Varış Noktası",
            cityPlaceholder: "Şehir veya Posta Kodu",
            stopCity: "Durak Şehri",
            stopType: "Tip",
            stopWeight: "Kg",
            drop: "Teslimat",
            pickup: "Alım",
            addStop: "+ Durak Ekle (Yükleme/Boşaltma)",
            pickupDate: "Alım Tarihi",
            saveContinue: "Kaydet & Devam Et",
            freightInfo: "Yük Bilgileri",
            commodity: "Emtia Türü",
            commodityPlaceholder: "örn. Makro, Elektronik",
            totalWeight: "Toplam Ağırlık (kg)",
            equipType: "Ekipman Tipi",
            dryVan: "Kuru Yük / Kamyon",
            reefer: "Frigo (Sıcaklık Kontrollü)",
            flatbed: "Açık / Sal Kasa",
            back: "Geri",
            viewEstimate: "AI Tahmini Oluştur",
            estMarketRate: "Tahmini Piyasa Fiyatı",
            basedOnData: "Güncel hat verilerine dayanmaktadır",
            calculating: "Hesaplanıyor...",
            finalizeOffer: "Stratejinizi Belirleyin",
            offerPrice: "Teklif Fiyatınız (€)",
            submitInfo: "Bu teklifi göndererek, yükünüz ağımızdaki <strong>150.000+</strong> aktif taşıyıcıya anında görünür olacaktır.",
            editDetails: "Detayları Düzenle",
            submit: "Teklif İsteğini Gönder",
            alertSuccess: "Teklif İsteği Gönderildi!",
            alertFail: "Başarısız: ",
            range: "Aralık",
            loadType: "Yük Tipi",
            full: "Komple Yük",
            partial: "Parsiyel Yük",
            adr: "Tehlikeli Madde (ADR)",
            packaging: "Paketleme Bilgisi",
            units: "Adet",
            unitType: "Tip",
            pallet: "Palet",
            box: "Koli/Kutu",
            instructions: "Özel Talimatlar",
            instrPlaceholder: "örn. Forklift gerekli, varmadan ara...",
            negotiation: "Pazarlığa Açık",
            fixed: "Sabit Fiyat",
            auction: "Spot İhale",
            req: "Bu alan zorunludur",
            addressBook: "Adres Defteri",
            selectAddr: "Bir Adres Seçin",
            noAddr: "Henüz kayıtlı adres yok.",
            useAddr: "Kayıtlı Adres Kullan",
            saveToBook: "Adres Defterine Kaydet",
            addrSaved: "Adres defterine kaydedildi!",
            searchAddr: "Başlık, şehir ara..."
        }
    };

    const t = text[language];

    const getEstimation = async () => {
        if (!validateStep(2)) return;
        try {
            const res = await api.post('/enterprise/price-estimate', {
                weight_kg: data.weight_kg,
                vehicle_type: data.vehicle_type_required,
                distance_km: 600
            });
            setEstimation(res.data);
            setData(prev => ({ ...prev, estimated_price: res.data.suggested }));
            setStep(3);
        } catch (err) {
            console.error(err);
            setStep(3);
        }
    };

    const handlePublish = async () => {
        try {
            await api.post('/loads', { ...data, stops });
            alert(t.alertSuccess);
            navigate('/dashboard');
        } catch (err) {
            alert(t.alertFail + (err.response?.data?.error || 'Unknown error'));
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans selection:bg-[#384BE7] selection:text-white">

            {/* HERO HEADER - RXO Style */}
            <div className="bg-[#050505] text-white py-12 md:py-20 px-6">
                <div className="container mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">{t.heroTitle}</h1>
                    <p className="text-gray-400 text-lg">{t.heroDesc}</p>
                </div>
            </div>

            {/* MAIN FORM CONTAINER */}
            <div className="container mx-auto px-4 -mt-10 mb-20 relative z-10">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-5xl mx-auto border-t-4 border-[#384BE7]">

                    {/* PROGRESS STEPS (Visual) */}
                    <div className="flex border-b border-gray-100">
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`flex-1 py-4 text-center text-sm font-bold uppercase tracking-wider ${step >= s ? 'text-[#384BE7] border-b-2 border-[#384BE7]' : 'text-gray-400'}`}>
                                {s === 1 ? t.step1 : s === 2 ? t.step2 : t.step3}
                            </div>
                        ))}
                    </div>

                    <div className="p-8 md:p-12">

                        {/* STEP 1: SERVICE & ROUTE */}
                        {step === 1 && (
                            <div className="animate-fade-in-up">
                                <div className="mb-10">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                        <span className="bg-[#384BE7] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                                        {t.selectService}
                                    </h2>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {['FTL', 'LTL', 'Intermodal'].map(mode => (
                                            <div
                                                key={mode}
                                                onClick={() => setSelectedService(mode)}
                                                className={`cursor-pointer border-2 rounded-xl p-6 text-center transition-all duration-200 hover:shadow-lg ${selectedService === mode ? 'border-[#384BE7] bg-blue-50' : 'border-gray-100 hover:border-gray-300'}`}
                                            >
                                                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4 ${selectedService === mode ? 'bg-[#384BE7] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                    🚛
                                                </div>
                                                <p className={`font-bold ${selectedService === mode ? 'text-black' : 'text-gray-500'}`}>
                                                    {mode === 'FTL' ? t.ftl : mode === 'LTL' ? t.ltl : t.intermodal}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                        <span className="bg-[#384BE7] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                                        {t.routeVis}
                                    </h2>

                                    {/* MOCK MAP / ROUTE VISUALIZER */}
                                    <div className="bg-gray-900 rounded-xl p-6 mb-8 relative overflow-hidden min-h-[300px] flex items-center justify-center">
                                        {/* Background Map Placeholder */}
                                        <div className="absolute inset-0 opacity-30 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center"></div>

                                        {/* Visual Path */}
                                        <div className="relative z-10 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full justify-center">

                                            {/* Origin */}
                                            <div className="flex flex-col items-center">
                                                <div className="w-4 h-4 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                                                <div className="bg-white px-3 py-1 rounded mt-2 text-xs font-bold shadow">{data.origin_city || t.origin}</div>
                                            </div>

                                            {/* Line Segment 1 */}
                                            <div className="h-10 w-1 md:w-20 md:h-1 bg-gray-600"></div>

                                            {/* Stops */}
                                            {stops.map((stop, idx) => (
                                                <React.Fragment key={idx}>
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]"></div>
                                                        <div className="bg-white px-3 py-1 rounded mt-2 text-xs font-bold shadow max-w-[100px] truncate">{stop.city || `Stop ${idx + 1}`}</div>
                                                        <div className="text-[10px] text-white bg-black px-1 rounded mt-1">{stop.type}</div>
                                                    </div>
                                                    <div className="h-10 w-1 md:w-20 md:h-1 bg-gray-600"></div>
                                                </React.Fragment>
                                            ))}

                                            {/* Destination */}
                                            <div className="flex flex-col items-center">
                                                <div className="w-4 h-4 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                                                <div className="bg-white px-3 py-1 rounded mt-2 text-xs font-bold shadow">{data.destination_city || t.destination}</div>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8 mb-6">
                                        <div>
                                            <div className="flex gap-4 mb-4 items-end">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide flex justify-between">
                                                        <span>{t.origin} (City)</span>
                                                        <button
                                                            onClick={() => { setActiveTarget({ type: 'origin' }); setIsAddressModalOpen(true); }}
                                                            className="text-[10px] text-[#384BE7] hover:underline"
                                                        >
                                                            {t.addressBook}
                                                        </button>
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            name="origin_city"
                                                            value={data.origin_city}
                                                            placeholder={t.cityPlaceholder}
                                                            onChange={handleChange}
                                                            className={`w-full bg-gray-50 border ${errors.origin_city ? 'border-red-500' : 'border-gray-200'} rounded-lg p-4 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#384BE7] transition`}
                                                        />
                                                        {data.origin_city && (
                                                            <button
                                                                onClick={() => handleSaveToBook(data.origin_city, data.origin_country)}
                                                                className="absolute right-4 top-4 text-gray-300 hover:text-[#384BE7] transition"
                                                                title={t.saveToBook}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="w-1/3">
                                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                                        Country
                                                    </label>
                                                    <input
                                                        name="origin_country"
                                                        value={data.origin_country}
                                                        onChange={handleChange}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#384BE7] transition"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex gap-4 items-end">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide flex justify-between">
                                                        <span>{t.destination} (City)</span>
                                                        <button
                                                            onClick={() => { setActiveTarget({ type: 'destination' }); setIsAddressModalOpen(true); }}
                                                            className="text-[10px] text-[#384BE7] hover:underline"
                                                        >
                                                            {t.addressBook}
                                                        </button>
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            name="destination_city"
                                                            value={data.destination_city}
                                                            placeholder={t.cityPlaceholder}
                                                            onChange={handleChange}
                                                            className={`w-full bg-gray-50 border ${errors.destination_city ? 'border-red-500' : 'border-gray-200'} rounded-lg p-4 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#384BE7] transition`}
                                                        />
                                                        {data.destination_city && (
                                                            <button
                                                                onClick={() => handleSaveToBook(data.destination_city, data.destination_country)}
                                                                className="absolute right-4 top-4 text-gray-300 hover:text-[#384BE7] transition"
                                                                title={t.saveToBook}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="w-1/3">
                                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                                        Country
                                                    </label>
                                                    <input
                                                        name="destination_country"
                                                        value={data.destination_country}
                                                        onChange={handleChange}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#384BE7] transition"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* DYNAMIC STOPS INPUTS */}
                                    {stops.map((stop, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 flex flex-col md:flex-row gap-4 items-end">
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase flex justify-between">
                                                    <span>{t.stopCity} #{index + 1}</span>
                                                    <button
                                                        onClick={() => { setActiveTarget({ type: 'stop', index }); setIsAddressModalOpen(true); }}
                                                        className="text-[9px] text-[#384BE7] hover:underline"
                                                    >
                                                        {t.addressBook}
                                                    </button>
                                                </label>
                                                <input
                                                    value={stop.city}
                                                    onChange={(e) => handleStopChange(index, 'city', e.target.value)}
                                                    className="w-full bg-white border border-gray-300 rounded p-2 text-sm font-bold"
                                                    placeholder="City"
                                                />
                                            </div>
                                            <div className="w-32">
                                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">{t.stopType}</label>
                                                <select
                                                    value={stop.type}
                                                    onChange={(e) => handleStopChange(index, 'type', e.target.value)}
                                                    className="w-full bg-white border border-gray-300 rounded p-2 text-sm"
                                                >
                                                    <option value="DROP">{t.drop}</option>
                                                    <option value="PICKUP">{t.pickup}</option>
                                                </select>
                                            </div>
                                            <div className="w-24">
                                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">{t.stopWeight}</label>
                                                <input
                                                    type="number"
                                                    value={stop.weight_kg}
                                                    onChange={(e) => handleStopChange(index, 'weight_kg', e.target.value)}
                                                    className="w-full bg-white border border-gray-300 rounded p-2 text-sm"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <button onClick={() => removeStop(index)} className="text-red-500 font-bold hover:bg-red-50 px-3 py-2 rounded">
                                                ×
                                            </button>
                                        </div>
                                    ))}

                                    <button onClick={addStop} className="text-[#384BE7] font-bold text-sm border border-dashed border-[#384BE7] px-4 py-2 rounded hover:bg-blue-50 transition w-full mb-6">
                                        {t.addStop}
                                    </button>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                            {t.pickupDate} {errors.pickup_date && <span className="text-red-500 normal-case font-normal ml-2">({t.req})</span>}
                                        </label>
                                        <input
                                            type="date"
                                            name="pickup_date"
                                            value={data.pickup_date}
                                            onChange={handleChange}
                                            className={`w-full bg-gray-50 border ${errors.pickup_date ? 'border-red-500' : 'border-gray-200'} rounded-lg p-4 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#384BE7] transition`}
                                        />
                                    </div>
                                </div>

                                <div className="mt-12 flex justify-end">
                                    <button onClick={() => validateStep(1) && setStep(2)} className="bg-[#384BE7] text-white text-lg font-bold px-10 py-4 rounded-lg hover:bg-blue-700 transition shadow-lg transform hover:-translate-y-1">
                                        {t.saveContinue} &rarr;
                                    </button>
                                </div>
                            </div>

                        )}

                        {/* STEP 2: CARGO DETAILS */}
                        {step === 2 && (
                            <div className="animate-fade-in-up">
                                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                                    <span className="bg-[#384BE7] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">3</span>
                                    {t.freightInfo}
                                </h2>

                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    <div className="lg:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                            {t.commodity} {errors.goods_type && <span className="text-red-500 normal-case font-normal ml-2">({t.req})</span>}
                                        </label>
                                        <input
                                            name="goods_type"
                                            value={data.goods_type}
                                            placeholder={t.commodityPlaceholder}
                                            onChange={handleChange}
                                            className={`w-full bg-gray-50 border ${errors.goods_type ? 'border-red-500' : 'border-gray-200'} rounded-lg p-4 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#384BE7] transition`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                            {t.totalWeight} {errors.weight_kg && <span className="text-red-500 normal-case font-normal ml-2">({t.req})</span>}
                                        </label>
                                        <input
                                            type="number"
                                            name="weight_kg"
                                            value={data.weight_kg}
                                            placeholder="0"
                                            onChange={handleChange}
                                            className={`w-full bg-gray-50 border ${errors.weight_kg ? 'border-red-500' : 'border-gray-200'} rounded-lg p-4 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#384BE7] transition`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">{t.equipType}</label>
                                        <select
                                            name="vehicle_type_required"
                                            onChange={handleChange}
                                            value={data.vehicle_type_required}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#384BE7] transition appearance-none"
                                        >
                                            <option value="Truck">{t.dryVan}</option>
                                            <option value="Reefer">{t.reefer}</option>
                                            <option value="Flatbed">{t.flatbed}</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 mb-8">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">{t.loadType}</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Full', 'Partial', 'Reefer', 'ADR'].map(type => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setData({ ...data, load_type: type })}
                                                    className={`p-3 text-sm font-bold rounded-lg border-2 transition ${data.load_type === type ? 'border-[#384BE7] bg-blue-50 text-[#384BE7]' : 'border-gray-100 text-gray-400'}`}
                                                >
                                                    {type === 'Full' ? t.full : type === 'Partial' ? t.partial : type === 'Reefer' ? t.reefer : t.adr}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">{t.packaging}</label>
                                        <div className="flex gap-4">
                                            <input
                                                type="number"
                                                name="unit_count"
                                                value={data.unit_count}
                                                onChange={handleChange}
                                                placeholder={t.units}
                                                className="w-24 bg-gray-50 border border-gray-200 rounded-lg p-4 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#384BE7] transition"
                                            />
                                            <select
                                                name="unit_type"
                                                value={data.unit_type}
                                                onChange={handleChange}
                                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-4 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#384BE7] transition"
                                            >
                                                <option value="Pallet">{t.pallet}</option>
                                                <option value="Box">{t.box}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">{t.instructions}</label>
                                    <textarea
                                        name="instructions"
                                        value={data.instructions}
                                        onChange={handleChange}
                                        placeholder={t.instrPlaceholder}
                                        rows="3"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#384BE7] transition"
                                    ></textarea>
                                </div>

                                <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
                                    <button onClick={() => setStep(1)} className="text-gray-500 font-bold hover:text-black transition">
                                        &larr; {t.back}
                                    </button>
                                    <button onClick={getEstimation} className="bg-[#384BE7] text-white text-lg font-bold px-10 py-4 rounded-lg hover:bg-blue-700 transition shadow-lg transform hover:-translate-y-1">
                                        {t.viewEstimate} &rarr;
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: REVIEW & ESTIMATE */}
                        {step === 3 && (
                            <div className="animate-fade-in-up">
                                <div className="bg-gradient-to-r from-gray-900 to-black text-white p-8 rounded-2xl shadow-2xl mb-10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#384BE7] rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>

                                    <h2 className="text-3xl font-black mb-1">{t.estMarketRate}</h2>
                                    <p className="text-gray-400 mb-6 text-sm uppercase tracking-widest">{t.basedOnData}</p>

                                    {estimation ? (
                                        <div className="flex flex-col md:flex-row items-baseline space-y-2 md:space-y-0 md:space-x-8">
                                            <div>
                                                <span className="text-5xl md:text-7xl font-black text-[#384BE7]">€{estimation.suggested}</span>
                                            </div>
                                            <div className="text-gray-400 font-medium">
                                                {t.range}: <span className="text-white">€{estimation.min} - €{estimation.max}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400 italic">{t.calculating}</div>
                                    )}
                                </div>

                                <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 mb-8">
                                    <h3 className="text-xl font-bold text-black mb-6 uppercase tracking-wide">{t.finalizeOffer}</h3>

                                    <div className="mb-8">
                                        <label className="block text-sm font-bold text-gray-500 mb-3 uppercase">{t.priceStrategy}</label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {['FIXED', 'AUCTION', 'NEGOTIATION'].map(strategy => (
                                                <div
                                                    key={strategy}
                                                    onClick={() => setData({ ...data, price_strategy: strategy })}
                                                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${data.price_strategy === strategy ? 'border-[#384BE7] bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                                                >
                                                    <p className={`font-bold ${data.price_strategy === strategy ? 'text-[#384BE7]' : 'text-gray-500'}`}>
                                                        {strategy === 'FIXED' ? t.fixed : strategy === 'AUCTION' ? t.auction : t.negotiation}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8 items-center">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">{t.offerPrice}</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-4 text-gray-400 font-bold">€</span>
                                                <input
                                                    type="number"
                                                    name="estimated_price"
                                                    value={data.estimated_price}
                                                    onChange={handleChange}
                                                    className="w-full bg-white border border-gray-200 rounded-lg pl-10 p-4 font-bold text-gray-900 text-xl focus:outline-none focus:ring-2 focus:ring-[#384BE7] transition"
                                                />
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500" dangerouslySetInnerHTML={{ __html: t.submitInfo }}></div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-8">
                                    <button onClick={() => setStep(2)} className="text-gray-500 font-bold hover:text-black transition">
                                        &larr; {t.editDetails}
                                    </button>
                                    <button onClick={handlePublish} className="bg-black text-white text-lg font-bold px-12 py-4 rounded-lg hover:bg-gray-800 transition shadow-xl transform hover:-translate-y-1">
                                        {t.submit}
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* ADDRESS BOOK MODAL */}
            {isAddressModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-zoom-in">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black text-black uppercase tracking-tight">{t.selectAddr}</h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                                    {t.addressBook} ({addressBook.length})
                                    <button onClick={fetchAddressBook} className="ml-2 text-[#384BE7] hover:underline normal-case font-normal text-[10px] trailing-widest">
                                        (Refresh / Yenile)
                                    </button>
                                </p>
                                <div className="text-[8px] text-gray-300 font-mono mt-1 opacity-50 hover:opacity-100 transition-opacity leading-relaxed">
                                    DB Entry Check: {addressBook.length > 0 ? 'Data Found' : 'No Data Match'} <br />
                                    Local Token: {localStorage.getItem('token') ? (() => {
                                        try {
                                            const token = localStorage.getItem('token');
                                            const payload = JSON.parse(atob(token.split('.')[1]));
                                            return `ID:${payload.id} CoID:${payload.company_id} Role:${payload.role}`;
                                        } catch (e) { return 'ERR_PARSING'; }
                                    })() : 'No Token'}
                                </div>
                            </div>
                            <button onClick={() => { setIsAddressModalOpen(false); setSearchQuery(''); }} className="text-gray-300 hover:text-black transition text-3xl font-light">&times;</button>
                        </div>

                        {/* SEARCH BAR */}
                        <div className="px-8 py-4 border-b border-gray-50">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={t.searchAddr}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#384BE7] transition"
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {addressBook.filter(addr => {
                                const q = searchQuery.trim().toLowerCase();
                                return (addr.title || '').toLowerCase().includes(q) ||
                                    (addr.city || '').toLowerCase().includes(q) ||
                                    (addr.country || '').toLowerCase().includes(q) ||
                                    (addr.address || '').toLowerCase().includes(q);
                            }).length === 0 ? (
                                <div className="py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                    {t.noAddr}
                                </div>
                            ) : (
                                addressBook
                                    .filter(addr => {
                                        const q = searchQuery.trim().toLowerCase();
                                        return (addr.title || '').toLowerCase().includes(q) ||
                                            (addr.city || '').toLowerCase().includes(q) ||
                                            (addr.country || '').toLowerCase().includes(q) ||
                                            (addr.address || '').toLowerCase().includes(q);
                                    })
                                    .map(addr => (
                                        <div
                                            key={addr.id}
                                            onClick={() => { handleAddressSelect(addr); setSearchQuery(''); }}
                                            className="p-5 border border-gray-100 rounded-2xl hover:border-[#384BE7] hover:bg-blue-50/50 cursor-pointer transition-all group"
                                        >
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-black text-black group-hover:text-[#384BE7] transition">{addr.title}</h4>
                                                <span className="text-[9px] font-black uppercase bg-gray-100 px-2 py-1 rounded text-gray-500 tracking-widest">{addr.country}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1 font-medium">{addr.address}</p>
                                            <p className="text-xs text-gray-400 mt-2 font-bold uppercase tracking-widest">{addr.city}</p>
                                        </div>
                                    ))
                            )}
                        </div>
                        <div className="p-6 bg-gray-50 text-center">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Manage your address book in Account Settings</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobWizard;
