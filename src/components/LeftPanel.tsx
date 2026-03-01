'use client';

import React, { useState } from 'react';
import { ResearchParams, IndustryCategory, OutputType } from '@/types';
import { Rocket, ChevronRight, Globe, BarChart3, Clock, Layers } from 'lucide-react';

interface LeftPanelProps {
    onGenerate: (params: ResearchParams) => void;
    isLoading: boolean;
}

const INDUSTRIES: IndustryCategory[] = [
    'Technology', 'Healthcare', 'Energy', 'Financial Services',
    'Manufacturing', 'Consumer Goods', 'Automotive', 'Telecom', 'Agriculture', 'Custom'
];

const OUTPUT_TYPES: OutputType[] = [
    'Full Industry Report', 'Executive Summary Only', 'Financial Model Only',
    'Segmentation Deep Dive', 'Tech Intelligence Only'
];

export const LeftPanel: React.FC<LeftPanelProps> = ({ onGenerate, isLoading }) => {
    const [params, setParams] = useState<ResearchParams>({
        industry: 'Technology',
        subIndustry: '',
        geography: 'Global',
        historicalYears: 5,
        forecastYears: 5,
        outputType: 'Full Industry Report',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate(params);
    };

    return (
        <div className="w-80 h-screen sticky top-0 bg-slate-900 text-slate-100 p-6 flex flex-col border-r border-slate-800 shrink-0">
            <div className="flex items-center gap-2 mb-8">
                <div className="p-2 bg-blue-600 rounded-lg">
                    <BarChart3 size={20} className="text-white" />
                </div>
                <h1 className="text-lg font-bold tracking-tight">Market Intelligence</h1>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 space-y-6 overflow-y-auto pr-1">
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        1. Main Industry
                    </label>
                    <select
                        value={params.industry}
                        onChange={(e) => setParams({ ...params, industry: e.target.value as IndustryCategory })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                    {params.industry === 'Custom' && (
                        <input
                            type="text"
                            placeholder="Enter Custom Industry"
                            value={params.customIndustry || ''}
                            onChange={(e) => setParams({ ...params, customIndustry: e.target.value })}
                            className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        2. Sub-Industry / Product
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. EV Batteries, Cloud Computing"
                        value={params.subIndustry}
                        onChange={(e) => setParams({ ...params, subIndustry: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                        <Globe size={14} /> 3. Geography
                    </label>
                    <select
                        value={params.geography}
                        onChange={(e) => setParams({ ...params, geography: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="Global">Global</option>
                        <option value="North America">North America</option>
                        <option value="Europe">Europe</option>
                        <option value="Asia-Pacific">Asia-Pacific</option>
                        <option value="Middle East & Africa">Middle East & Africa</option>
                        <option value="Latin America">Latin America</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                        <Clock size={14} /> 4. Time Horizon
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <span className="text-[10px] text-slate-500 uppercase">Historical</span>
                            <input
                                type="number"
                                value={params.historicalYears}
                                onChange={(e) => setParams({ ...params, historicalYears: parseInt(e.target.value) })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-500 uppercase">Forecast</span>
                            <input
                                type="number"
                                value={params.forecastYears}
                                onChange={(e) => setParams({ ...params, forecastYears: parseInt(e.target.value) })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                        <Layers size={14} /> 5. Output Type
                    </label>
                    <select
                        value={params.outputType}
                        onChange={(e) => setParams({ ...params, outputType: e.target.value as OutputType })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        {OUTPUT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-900/20"
                >
                    {isLoading ? (
                        <div className="h-5 w-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                    ) : (
                        <>
                            <Rocket size={18} />
                            <span>Generate Report</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};
