import React from 'react';

const TrendWidget = ({ trends }) => {
    if (!trends) return null;

    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-6 overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#384BE7] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Market Intel</h4>
                    <p className="text-3xl font-black text-black">€{trends.average_price.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-[#384BE7] uppercase tracking-tighter mt-1">Avg Market Rate</p>
                </div>
                <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${trends.demand_level === 'HIGH' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {trends.demand_level} Demand
                    </span>
                </div>
            </div>

            {/* Mock Sparkline */}
            <div className="flex items-end space-x-1 h-8 mb-4">
                {(trends.price_history || [40, 60, 45, 80, 70]).map((v, i) => {
                    const height = typeof v === 'number' ? (v / 2000) * 100 : v; // simple norm
                    return <div key={i} className="flex-1 bg-gray-100 rounded-sm hover:bg-[#384BE7] transition-colors" style={{ height: `${height}%` }}></div>;
                })}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50 text-[10px] font-black uppercase tracking-widest">
                <div className="text-gray-400">Low: <span className="text-black ml-1">€{trends.lowest_bid_last_week.toLocaleString()}</span></div>
                <div className="text-gray-400 text-right">High: <span className="text-black ml-1">€{trends.highest_bid_last_week.toLocaleString()}</span></div>
            </div>
        </div>
    );
};

export default TrendWidget;
