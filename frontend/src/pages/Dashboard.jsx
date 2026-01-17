import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const user = JSON.parse(localStorage.getItem('user'));
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const isShipper = user?.role?.startsWith('RCV');
    const isCarrier = user?.role?.startsWith('TRANS');

    const text = {
        en: {
            dashboard: "Control Tower",
            welcome: "Command Center Overview",
            logout: "Logout",
            loading: "Synchronizing operational data...",
            marketTrends: "Market Intelligence",
            freightIndex: "European Freight Index",
            insights: "Operational Insights",
            onTime: "On-Time Dispatch",
            emptyKm: "Empty Mile Ratio",
            riskScore: "Carrier Network Risk",
            activeShipments: "Live Shipment Map",
            recentActivity: "Recent Activity",
            viewAll: "View All",
            stats: {
                totalBids: "Active Bids",
                pendingBids: "Pending Response",
                jobsWon: "Assignments Won",
                totalRevenue: "Gross Revenue",
                totalShipments: "Total Orders",
                activeShipments: "In-Transit",
                totalSpent: "Freight Spend",
                loadStatus: "Order Pipeline",
                fleetStatus: "Asset Utilization",
                noData: "No data available",
                noVehicles: "Optimize your fleet"
            },
            quickActions: {
                title: "Operational Workflows",
                findLoads: { title: "Spot Marketplace", subtitle: "Find high-yield freight" },
                myJobs: { title: "Dispatch Management", subtitle: "Active operations" },
                myTeam: { title: "Human Capital", subtitle: "Manage workforce" },
                smartPost: { title: "AI Quote Wizard", subtitle: "Smart pricing engine" },
                emptyReturn: { title: "Backhaul Optimization", subtitle: "Reduce empty miles" },
                myFleet: { title: "Asset Management", subtitle: "Track vehicle health" },
                postLoad: { title: "Source Capacity", subtitle: "Post load to network" },
                myShipments: { title: "Visibility Hub", subtitle: "Track all shipments" },
                addressBook: { title: "Location Master", subtitle: "Port & facility data" },
                financials: { title: "Finance HQ", subtitle: "Billing & Invoices" },
                reports: { title: "Analytics", subtitle: "Performance & Carbon" },
                adminPanel: { title: "System HQ", subtitle: "Platform governance" }
            },
            seo: {
                shipper: "Optimize your supply chain with our online logistics platform. Source the best transport quotes and compare freight prices instantly.",
                carrier: "Find loads, reduce empty miles, and maximize your truck's revenue with our digital carrier dashboard. The ultimate tool for modern road transport."
            }
        },
        tr: {
            dashboard: "Kontrol Kulesi",
            welcome: "Operasyonel Merkeze Hoş Geldiniz",
            logout: "Güvenli Çıkış",
            loading: "Operasyonel veriler senkronize ediliyor...",
            marketTrends: "Piyasa İstihbaratı",
            freightIndex: "Avrupa Navlun Endeksi",
            insights: "Operasyonel Görüler",
            onTime: "Zamanında Sevkiyat",
            emptyKm: "Boş Kilometre Oranı",
            riskScore: "Taşıyıcı Ağ Riski",
            activeShipments: "Canlı Sevkiyat Haritası",
            recentActivity: "Son İşlemler",
            viewAll: "Tümünü Gör",
            stats: {
                totalBids: "Aktif Teklifler",
                pendingBids: "Yanıt Bekleyen",
                jobsWon: "Kazanılan İşler",
                totalRevenue: "Brüt Gelir",
                totalShipments: "Toplam Sipariş",
                activeShipments: "Transit Halinde",
                totalSpent: "Lojistik Harcama",
                loadStatus: "Sipariş Akışı",
                fleetStatus: "Varlık Kullanımı",
                noData: "Veri bulunamadı",
                noVehicles: "Filonu optimize et"
            },
            quickActions: {
                title: "Operasyonel İş Akışları",
                findLoads: { title: "Spot Pazaryeri", subtitle: "Yüksek verimli yükler bul" },
                myJobs: { title: "Sevk Yönetimi", subtitle: "Aktif operasyonlar" },
                myTeam: { title: "İnsan Kaynakları", subtitle: "İş gücünü yönet" },
                smartPost: { title: "AI Fiyat Sihirbazı", subtitle: "Akıllı fiyatlandırma" },
                emptyReturn: { title: "Dönüş Optimizasyonu", subtitle: "Boş km'yi azalt" },
                myFleet: { title: "Varlık Yönetimi", subtitle: "Araç sağlığını izle" },
                postLoad: { title: "Kapasite Tedariği", subtitle: "Ağa yük ilanı ver" },
                myShipments: { title: "Görünürlük Merkezi", subtitle: "Tüm sevkiyatları izle" },
                addressBook: { title: "Konum Rehberi", subtitle: "Liman ve tesis verileri" },
                financials: { title: "Finans Merkezi", subtitle: "Faturalar ve Ödemeler" },
                reports: { title: "Analizler", subtitle: "Performans ve Karbon" },
                adminPanel: { title: "Sistem Merkezi", subtitle: "Platform yönetimi" }
            },
            seo: {
                shipper: "Online lojistik platformumuzla tedarik zincirinizi optimize edin. En iyi taşıma tekliflerini bulun ve nakliye fiyatlarını anında karşılaştırın.",
                carrier: "Yük bulun, boş kilometreyi azaltın ve dijital taşıyıcı panelimizle kamyonunuzun gelirini maksimize edin. Modern karayolu taşımacılığı için nihai araç."
            }
        }
    };

    const t = text[language];

    useEffect(() => {
        if (user) fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/dashboard');
            setStats(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const renderBar = (label, value, total, colorClass) => {
        const percentage = total > 0 ? (value / total) * 100 : 0;
        return (
            <div className="mb-3">
                <div className="flex justify-between text-xs mb-1 uppercase tracking-tighter font-bold text-gray-400">
                    <span>{label}</span>
                    <span>{value}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className={`${colorClass} h-1.5 rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
                </div>
            </div>
        );
    };

    if (!user) return <div className="p-8 text-center">Unauthorized. Please login.</div>;

    return (
        <div className="bg-[#F8F9FB] min-h-screen font-sans pb-20">

            {/* TOP BAR / NAVIGATION PLACEHOLDER FEEL */}
            <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-30">
                <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">{t.dashboard}</h2>
                    <span className="h-6 w-px bg-gray-200"></span>
                    <p className="text-sm text-gray-500 font-medium">{t.welcome}, <span className="text-gray-900 font-bold">{user.username}</span></p>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="hidden md:flex flex-col text-right">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Status</span>
                        <span className="text-xs text-green-500 font-bold flex items-center justify-end"><span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span> Operational</span>
                    </div>
                    <button onClick={handleLogout} className="text-sm font-bold text-gray-400 hover:text-red-500 transition uppercase tracking-widest">{t.logout}</button>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto p-6 lg:p-10">

                {/* KPI HEADER - BOLD RAKAMLAR */}
                {loading ? (
                    <div className="animate-pulse space-y-4">
                        <div className="h-32 bg-gray-200 rounded-xl"></div>
                        <div className="grid grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>)}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            {isCarrier && (
                                <>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:border-[#384BE7] transition duration-300">
                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{t.stats.totalBids}</p>
                                        <h3 className="text-4xl font-black text-gray-900">{stats?.total_bids || 0}</h3>
                                        <div className="mt-2 text-xs text-blue-600 font-bold bg-blue-50 inline-block px-2 py-0.5 rounded">Active Marketplace</div>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{t.stats.jobsWon}</p>
                                        <h3 className="text-4xl font-black text-green-600">{stats?.won_jobs || 0}</h3>
                                        <p className="mt-2 text-xs text-gray-400 font-medium">98.2% Success Rate</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{t.stats.totalRevenue}</p>
                                        <h3 className="text-4xl font-black text-gray-900">€{stats?.total_revenue?.toLocaleString() || 0}</h3>
                                        <div className="mt-2 flex items-center text-xs text-green-500 font-bold">↑ 12.5% <span className="text-gray-400 ml-1">vs last month</span></div>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{t.emptyKm}</p>
                                        <h3 className="text-4xl font-black text-orange-500">14%</h3>
                                        <p className="mt-2 text-xs text-gray-400 font-medium">Industry Avg: 22%</p>
                                    </div>
                                </>
                            )}

                            {isShipper && (
                                <>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{t.stats.totalShipments}</p>
                                        <h3 className="text-4xl font-black text-gray-900">{stats?.total_loads || 0}</h3>
                                        <p className="mt-2 text-xs text-gray-400 font-medium">Orders Source: API/Web</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{t.stats.activeShipments}</p>
                                        <h3 className="text-4xl font-black text-[#384BE7]">{stats?.active_loads || 0}</h3>
                                        <div className="mt-2 text-xs text-green-600 font-bold bg-green-50 inline-block px-2 py-0.5 rounded">Real-time tracking</div>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{t.stats.totalSpent}</p>
                                        <h3 className="text-4xl font-black text-gray-900">€{stats?.total_spent?.toLocaleString() || 0}</h3>
                                        <p className="mt-2 text-xs text-gray-400 font-medium">Avg €1.84 / km</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{t.onTime}</p>
                                        <h3 className="text-4xl font-black text-green-600">96%</h3>
                                        <p className="mt-2 text-xs text-gray-400 font-medium">KPI Target: 95%</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* MIDDLE SECTION: MAP & INSIGHTS */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

                            {/* LIVE VIEW / MAP */}
                            <div className="lg:col-span-2 bg-gray-900 rounded-3xl overflow-hidden relative min-h-[400px] shadow-2xl border-4 border-white">
                                <div className="absolute inset-0 opacity-40 bg-[url('https://upload.wikimedia.org/wikipedia/commons/b/b5/World_Map_1689.jpg')] bg-cover grayscale"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>

                                <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-white text-xl font-black uppercase tracking-tight">{t.activeShipments}</h4>
                                        <p className="text-gray-400 text-sm font-medium">Visualizing global logistics flow</p>
                                    </div>

                                    {/* MOCK MAP MARKERS */}
                                    <div className="flex-1 relative">
                                        <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-[#384BE7] rounded-full shadow-[0_0_15px_#384BE7]"></div>
                                        <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-[#384BE7] rounded-full shadow-[0_0_15px_#384BE7]"></div>
                                        <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_15px_orange]"></div>
                                    </div>

                                    <div className="flex items-center space-x-6 text-white bg-black/50 backdrop-blur-md p-4 rounded-2xl">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-gray-600"></div>)}
                                        </div>
                                        <div className="text-xs">
                                            <p className="font-bold">12 Active Drivers</p>
                                            <p className="text-gray-400">Average ETA: 45m</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SIDEBAR: MARKET & STATUS */}
                            <div className="space-y-6">
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                    <h4 className="text-gray-900 text-lg font-black uppercase tracking-tight mb-6">{t.insights}</h4>

                                    {isShipper && (
                                        <>
                                            {stats?.load_distribution?.length > 0 ? (
                                                stats.load_distribution.map(d =>
                                                    renderBar(d.status, d.count, stats.total_loads, d.status === 'OPEN' ? 'bg-[#384BE7]' : 'bg-gray-400')
                                                )
                                            ) : <p className="text-gray-400 text-xs">{t.stats.noData}</p>}
                                            <div className="mt-8 pt-6 border-t border-gray-50">
                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">{t.riskScore}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-gray-500">Low Risk Portfolio</span>
                                                    <span className="text-lg font-black text-green-500">A+</span>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {isCarrier && (
                                        <>
                                            {stats?.fleet_status?.length > 0 ? (
                                                stats.fleet_status.map(d =>
                                                    renderBar(d.status, d.count, stats.fleet_status.reduce((a, b) => a + b.count, 0), d.status === 'EMPTY' ? 'bg-green-500' : 'bg-[#384BE7]')
                                                )
                                            ) : <p className="text-gray-400 text-xs">{t.stats.noVehicles}</p>}
                                            <div className="mt-8 pt-6 border-t border-gray-50">
                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">{t.marketTrends}</p>
                                                <div className="bg-blue-50 p-4 rounded-xl">
                                                    <p className="text-xs text-[#384BE7] font-bold leading-relaxed">Demand is 18% higher in Central Europe today. Consider repositioning empty assets.</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="bg-gradient-to-br from-[#384BE7] to-[#1A2ABF] p-8 rounded-3xl text-white shadow-lg overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
                                    <h4 className="text-sm font-black uppercase tracking-widest mb-4">{t.freightIndex}</h4>
                                    <div className="flex items-baseline space-x-2">
                                        <span className="text-3xl font-black">1.14</span>
                                        <span className="text-green-300 text-xs font-bold">↑ 2.4%</span>
                                    </div>
                                    <p className="text-[10px] text-blue-200 mt-2 font-medium">Real-time market volatility data integrated.</p>
                                </div>

                                {isShipper && stats?.recent_loads?.length > 0 && (
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mt-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h4 className="text-gray-900 text-xs font-black uppercase tracking-widest">{t.recentActivity}</h4>
                                            <button onClick={() => navigate('/my-shipments')} className="text-[#384BE7] text-[10px] font-black uppercase tracking-widest hover:underline">{t.viewAll}</button>
                                        </div>
                                        <div className="space-y-4">
                                            {stats.recent_loads.map(load => (
                                                <div key={load.id} className="flex justify-between items-center group cursor-pointer" onClick={() => navigate('/my-shipments')}>
                                                    <div>
                                                        <p className="text-xs font-black text-gray-900 leading-none mb-1 uppercase tracking-tighter">
                                                            {load.origin_city} &rarr; {load.destination_city}
                                                        </p>
                                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{new Date(load.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${load.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        {load.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* QUICK ACTIONS */}
                        <div className="mb-20">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">{t.quickActions.title}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                {isCarrier && (
                                    <>
                                        <ActionCard onClick={() => navigate('/find-loads')} icon="🎯" title={t.quickActions.findLoads.title} subtitle={t.quickActions.findLoads.subtitle} color="blue" />
                                        <ActionCard onClick={() => navigate('/my-jobs')} icon="⚡" title={t.quickActions.myJobs.title} subtitle={t.quickActions.myJobs.subtitle} color="green" />
                                        <ActionCard onClick={() => navigate('/empty-vehicle')} icon="🛡️" title={t.quickActions.emptyReturn.title} subtitle={t.quickActions.emptyReturn.subtitle} color="orange" />
                                        <ActionCard onClick={() => navigate('/my-fleet')} icon="🚛" title={t.quickActions.myFleet.title} subtitle={t.quickActions.myFleet.subtitle} color="yellow" />
                                        <ActionCard onClick={() => navigate('/team')} icon="🤝" title={t.quickActions.myTeam.title} subtitle={t.quickActions.myTeam.subtitle} color="purple" />
                                        <ActionCard onClick={() => navigate('/financials')} icon="💳" title={t.quickActions.financials.title} subtitle={t.quickActions.financials.subtitle} color="red" />
                                        <ActionCard onClick={() => navigate('/reports')} icon="📈" title={t.quickActions.reports.title} subtitle={t.quickActions.reports.subtitle} color="teal" />
                                        <ActionCard onClick={() => navigate('/create-job-wizard')} icon="🧪" title={t.quickActions.smartPost.title} subtitle={t.quickActions.smartPost.subtitle} color="indigo" />
                                    </>
                                )}

                                {isShipper && (
                                    <>
                                        <ActionCard onClick={() => navigate('/create-job-wizard')} icon="🪄" title={t.quickActions.postLoad.title} subtitle={t.quickActions.postLoad.subtitle} color="green" />
                                        <ActionCard onClick={() => navigate('/my-shipments')} icon="📡" title={t.quickActions.myShipments.title} subtitle={t.quickActions.myShipments.subtitle} color="blue" />
                                        <ActionCard onClick={() => navigate('/address-book')} icon="📔" title={t.quickActions.addressBook.title} subtitle={t.quickActions.addressBook.subtitle} color="orange" />
                                        <ActionCard onClick={() => navigate('/financials')} icon="💳" title={t.quickActions.financials.title} subtitle={t.quickActions.financials.subtitle} color="red" />
                                        <ActionCard onClick={() => navigate('/reports')} icon="📈" title={t.quickActions.reports.title} subtitle={t.quickActions.reports.subtitle} color="teal" />
                                    </>
                                )}

                                {user.role === 'ADMIN' && (
                                    <ActionCard onClick={() => navigate('/admin')} icon="⚙️" title={t.quickActions.adminPanel.title} subtitle={t.quickActions.adminPanel.subtitle} color="black" />
                                )}
                            </div>
                        </div>

                        {/* SEO FOOTER SECTION */}
                        <div className="bg-white p-10 rounded-3xl border border-gray-100 mt-20">
                            <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Industry Authority</h4>
                            <p className="text-sm text-gray-500 leading-relaxed max-w-4xl">
                                {isShipper ? t.seo.shipper : t.seo.carrier}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const ActionCard = ({ onClick, icon, title, subtitle, color }) => {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        orange: "bg-orange-50 text-orange-600",
        yellow: "bg-yellow-50 text-yellow-600",
        purple: "bg-purple-50 text-purple-600",
        indigo: "bg-indigo-50 text-indigo-600",
        black: "bg-gray-100 text-gray-900"
    };

    return (
        <div
            onClick={onClick}
            className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-[#384BE7] hover:shadow-xl transition duration-300 cursor-pointer flex items-center space-x-5"
        >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition duration-300 group-hover:scale-110 ${colors[color] || colors.blue}`}>
                {icon}
            </div>
            <div>
                <h4 className="text-md font-black text-gray-900 uppercase tracking-tight">{title}</h4>
                <p className="text-xs font-medium text-gray-400">{subtitle}</p>
            </div>
        </div>
    );
};

export default Dashboard;
