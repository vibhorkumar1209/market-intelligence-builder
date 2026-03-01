'use client';

import React from 'react';
import { AgentStatus } from '@/types';
import { Download, FileText, BarChart, Printer } from 'lucide-react';

interface RightPanelProps {
    reportContent: string;
    agents: AgentStatus[];
    isGenerating: boolean;
}

export const RightPanel: React.FC<RightPanelProps> = ({ reportContent, agents, isGenerating }) => {
    return (
        <div className="flex-1 h-screen overflow-y-auto bg-white p-12 scroll-smooth">
            {isGenerating && (
                <div className="mb-12 border border-blue-100 bg-blue-50/50 rounded-2xl p-6">
                    <h2 className="text-sm font-semibold text-blue-900 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                        Parallel Research Engine Active
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {agents.map(agent => (
                            <div key={agent.id} className="bg-white/80 border border-blue-100 rounded-xl p-3 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-medium text-slate-700">{agent.name}</span>
                                    <span className="text-[10px] text-slate-500 uppercase font-bold">{agent.status}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className="bg-blue-600 h-full transition-all duration-500"
                                        style={{ width: `${agent.progress}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {reportContent ? (
                <article className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-start mb-12 pb-6 border-b border-slate-100">
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight line-clamp-2">
                                Industry Intelligence Report
                            </h1>
                            <p className="text-slate-500 font-medium">Generated on {new Date().toLocaleDateString()} • Institutional Grade</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors">
                                <Printer size={18} />
                            </button>
                            <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all shadow-md">
                                <Download size={16} />
                                <span>Export DOCX</span>
                            </button>
                        </div>
                    </div>

                    <div className="prose prose-slate max-w-none">
                        {/* Sample Section - This will be replaced by dynamic data */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">1. Executive Summary</h2>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                This comprehensive market intelligence report provides a strategic analysis of the target industry across
                                multiple dimensions including market sizing, competitive landscape, technology intelligence, and future forecasts.
                            </p>
                            <div className="grid grid-cols-3 gap-6 my-8">
                                {[
                                    { label: 'Market Opportunity', value: '$254B', sub: 'by 2028' },
                                    { label: 'Growth Rating', value: 'High', sub: 'Institutional Grade' },
                                    { label: 'CAGR (2023-28)', value: '18.4%', sub: 'Foreasted' },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
                                        <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                                        <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Content areas for table and charts will go here */}
                        {reportContent}
                    </div>
                </article>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <div className="p-6 bg-slate-50 rounded-full mb-6">
                        <FileText size={64} className="text-slate-300" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">Ready to Generate</h2>
                    <p className="text-slate-500 max-w-xs mt-2">
                        Configure the research parameters on the left to build your institutional-grade report.
                    </p>
                </div>
            )}
        </div>
    );
};
