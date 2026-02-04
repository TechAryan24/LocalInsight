import React, { useState } from 'react';
import axios from 'axios';

const StrategyDashboard = () => {
    const [formData, setFormData] = useState({ domain: '', location: '' });
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    const domains = ["food", "shopping", "healthcare", "education", "professional_services", "personal_services", "hospitality"];

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/generate_strategy', formData);
            setData(response.data);
        } catch (error) {
            alert("Error generating plan: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#0b0e14] text-white overflow-hidden font-sans">
            {/* LEFT: Input Sidebar (Inspired by your existing Dashboard) */}
            <div className="w-1/3 p-8 border-r border-gray-800 bg-[#121620] overflow-y-auto shadow-xl">
                <h2 className="text-2xl font-bold mb-8 text-purple-400">LocalInsight Strategy</h2>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-400">Business Domain</label>
                        <select 
                            className="w-full bg-[#1c2230] border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none text-gray-200"
                            onChange={(e) => setFormData({...formData, domain: e.target.value})}
                        >
                            <option value="">Select Domain</option>
                            {domains.map(d => <option key={d} value={d}>{d.replace('_', ' ').toUpperCase()}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-400">Location</label>
                        <input 
                            type="text" 
                            placeholder="Enter city or area..."
                            className="w-full bg-[#1c2230] border border-gray-700 rounded-lg p-3 outline-none"
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                        />
                    </div>

                    <button 
                        onClick={handleGenerate}
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-bold transition-all ${loading ? 'bg-gray-600' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 shadow-lg shadow-purple-900/20'}`}
                    >
                        {loading ? 'AI Analyzing...' : 'Generate Business Plan'}
                    </button>

                    {data && (
                        <div className="mt-8 p-5 rounded-xl bg-[#1c2230] border-l-4 border-green-500 animate-pulse-slow">
                            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Confidence Score</p>
                            <div className="text-4xl font-black text-green-400 my-1">{data.market_gap_score}</div>
                            <p className="text-sm text-gray-300">Target Niche: <span className="text-purple-400 font-bold">{data.best_opportunity}</span></p>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT: PDF Template Preview (White Paper Style) */}
            <div className="w-2/3 p-10 bg-[#0b0e14] overflow-y-auto">
                {!data ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-600 opacity-50 italic">
                        <p>Enter details to visualize your professional roadmap...</p>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto bg-white text-gray-900 p-12 shadow-2xl rounded-sm min-h-[11in] animate-fadeIn">
                        {/* Header Section */}
                        <div className="border-b-8 border-gray-800 pb-6 mb-10">
                            <h1 className="text-5xl font-serif font-bold text-gray-900 leading-tight">{data.business_plan.business_name}</h1>
                            <div className="flex justify-between mt-4 text-sm font-bold text-gray-500 uppercase tracking-widest">
                                <span>Business Plan</span>
                                <span>Location: {data.location}</span>
                            </div>
                        </div>

                        {/* Document Rows (Matching the Template Image) */}
                        <DocRow title="Executive Summary" content={data.business_plan.executive_summary} />
                        <DocRow title="Business Overview" content={data.business_plan.business_overview} />
                        
                        <div className="flex gap-10 border-b py-8">
                            <div className="w-1/3 text-lg font-bold text-gray-800 uppercase tracking-tighter">Market Analysis</div>
                            <div className="w-2/3 space-y-4">
                                <div><p className="font-bold text-gray-800">Target Market:</p><p className="text-gray-600 text-sm">{data.business_plan.target_market}</p></div>
                                <div><p className="font-bold text-gray-800">Location Analysis:</p><p className="text-gray-600 text-sm">{data.business_plan.location_analysis}</p></div>
                            </div>
                        </div>

                        <DocRow title="Product Line" content={data.business_plan.offerings_and_pricing} />

                        <div className="mt-10 pt-10 border-t-2 border-dashed flex justify-between items-center">
                            <p className="text-xs text-gray-400 italic">Plan generated by LocalInsight AI Platform</p>
                            <button className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-black transition-colors uppercase text-xs font-bold tracking-widest">Download PDF</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Sub-component for clean document structure
const DocRow = ({ title, content }) => (
    <div className="flex gap-10 border-b py-8 hover:bg-gray-50 transition-colors">
        <div className="w-1/3 text-lg font-bold text-gray-800 uppercase tracking-tighter leading-none">{title}</div>
        <div className="w-2/3 text-gray-600 text-sm leading-relaxed">{content}</div>
    </div>
);

export default StrategyDashboard;