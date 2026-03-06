'use client';

import React, { useState } from 'react';
import { ResearchParams } from '@/types';
import { Rocket, Globe, BarChart3, Settings2, ChevronDown, ChevronUp, Info } from 'lucide-react';

interface LeftPanelProps {
    onGenerate: (params: ResearchParams) => void;
    isLoading: boolean;
}

const INDUSTRY_OPTIONS = [
    "Power Generation Equipment",
    "Construction Equipment",
    "Specialty Chemicals",
    "Industrial Engines",
    "Automotive Components",
    "Agrochemicals & Crop Protection",
    "Paints & Coatings",
    "Packaging Materials",
    "Water & Wastewater Treatment",
    "Electric Motors & Drives",
    "Pumps & Valves",
    "Industrial Automation",
    "Building Materials",
    "Lubricants & Greases",
    "Adhesives & Sealants",
    "Personal Protective Equipment",
    "Medical Devices",
    "Renewable Energy Components",
    "Material Handling Equipment",
    "Mining Equipment",
    "Food Processing Machinery",
    "Textile Machinery",
    "Plastics & Polymers",
    "Steel & Metal Products",
    "Consumer Electronics Components"
];

const GEOGRAPHY_OPTIONS = [
    "India",
    "United States",
    "China",
    "Global (Top 15 Markets)",
    "ASEAN-6",
    "EU-27",
    "GCC",
    "Sub-Saharan Africa",
    "Latin America (Top 5)",
    "Japan",
    "South Korea",
    "United Kingdom",
    "Germany",
    "Brazil",
    "Mexico",
    "Indonesia",
    "Vietnam",
    "Thailand",
    "Turkey",
    "Saudi Arabia",
    "Nigeria",
    "South Africa",
    "Australia"
];

export const LeftPanel: React.FC<LeftPanelProps> = ({ onGenerate, isLoading }) => {
    const [params, setParams] = useState<ResearchParams>({
        industry: INDUSTRY_OPTIONS[0],
        subCategory: '',
        geography: 'India',
        geographicGranularity: 'State / Province',
        supplierDetail: 'Top 8 + Others',
        dualCurrency: true,
        excludeSyndicatedSources: true,
        forecastQuarters: 4
    });

    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate(params);
    };

    return (
        <div className="w-80 h-screen sticky top-0 bg-[#0f172a] text-slate-100 p-6 flex flex-col border-r border-slate-800/50 shrink-0 shadow-2xl z-10">
            <div className="flex items-center gap-3 mb-10">
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 ring-1 ring-white/10 uppercase font-black text-xs">
                    MDG
                </div>
                <div>
                    <h1 className="text-sm font-bold tracking-tight text-white leading-tight">MARKET DATAPACK</h1>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-blue-400 font-bold tracking-widest uppercase">Generator v2.0</span>
                        <div className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 space-y-6 overflow-y-auto pr-2 -mr-2 custom-scrollbar pb-6 contents-none">
                <div className="space-y-4">
                    {/* Primary Inputs Section */}
                    <div className="space-y-4 bg-slate-800/20 p-4 rounded-2xl border border-white/5">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2.5 ml-1">
                                Industry Area
                            </label>
                            <div className="relative group">
                                <select
                                    value={params.industry}
                                    onChange={(e) => setParams({ ...params, industry: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700/50 rounded-xl py-2.5 px-3.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                                >
                                    {INDUSTRY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    <option value="custom">Custom Industry...</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-slate-300 transition-colors" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2.5 ml-1 flex items-center justify-between">
                                Sub-Category <span className="text-[8px] text-slate-500 lowercase font-normal italic">Optional</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Diesel Gensets, Epoxy Resins"
                                value={params.subCategory}
                                onChange={(e) => setParams({ ...params, subCategory: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700/50 rounded-xl py-2.5 px-3.5 text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600 focus:bg-slate-900/50"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2.5 ml-1 flex items-center gap-1.5">
                                <Globe size={10} className="text-blue-500" /> Geography
                            </label>
                            <div className="relative group">
                                <select
                                    value={params.geography}
                                    onChange={(e) => setParams({ ...params, geography: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700/50 rounded-xl py-2.5 px-3.5 text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                                >
                                    {GEOGRAPHY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Advanced Settings Collapsible */}
                    <div className="bg-slate-800/20 rounded-2xl border border-white/5 overflow-hidden transition-all duration-300">
                        <button
                            type="button"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group"
                        >
                            <div className="flex items-center gap-2 text-slate-300 group-hover:text-blue-400 transition-colors">
                                <Settings2 size={16} />
                                <span className="text-xs font-semibold">Advanced Config</span>
                            </div>
                            {showAdvanced ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                        </button>

                        {showAdvanced && (
                            <div className="p-4 pt-0 space-y-4 border-t border-white/5 mt-2 transition-all">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                                        Forecast Quarters
                                    </label>
                                    <input
                                        type="range"
                                        min="2"
                                        max="12"
                                        value={params.forecastQuarters}
                                        onChange={(e) => setParams({ ...params, forecastQuarters: parseInt(e.target.value) })}
                                        className="w-full accent-blue-500"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                        <span>2Q</span>
                                        <span className="text-blue-400 font-bold">{params.forecastQuarters} Quarters</span>
                                        <span>12Q</span>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs text-slate-300">Dual Currency</span>
                                            <Info size={10} className="text-slate-600" />
                                        </div>
                                        <div
                                            onClick={() => setParams({ ...params, dualCurrency: !params.dualCurrency })}
                                            className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${params.dualCurrency ? 'bg-blue-600' : 'bg-slate-700'}`}
                                        >
                                            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${params.dualCurrency ? 'left-4.5' : 'left-0.5'}`} />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs text-slate-300">Exclude Syndicated</span>
                                            <Info size={10} className="text-slate-600" />
                                        </div>
                                        <div
                                            onClick={() => setParams({ ...params, excludeSyndicatedSources: !params.excludeSyndicatedSources })}
                                            className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${params.excludeSyndicatedSources ? 'bg-blue-600' : 'bg-slate-700'}`}
                                        >
                                            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${params.excludeSyndicatedSources ? 'left-4.5' : 'left-0.5'}`} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-500/10 ring-1 ring-white/10"
                    >
                        {isLoading ? (
                            <div className="h-5 w-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                        ) : (
                            <>
                                <Rocket size={18} />
                                <span className="tracking-tight">Generate Datapack</span>
                            </>
                        )}
                    </button>
                    <p className="text-[10px] text-center text-slate-500 mt-4 leading-relaxed px-2">
                        Institutional-grade bottom-up build. Citations included. Built for strategic execution.
                    </p>
                </div>
            </form>
        </div>
    );
};
