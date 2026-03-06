import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AgentStatus } from '@/types';
import { Download, FileText, Printer } from 'lucide-react';

import { MarketChart } from './MarketChart';
import { parseMarkdownTableToChartData } from '@/utils/chart-parser';
import { QualityBadge } from './QualityBadge';
import { DocxBuilder } from '@/services/docxBuilder';
import { InsightBlock } from './InsightBlock';

interface RightPanelProps {
    reportContent: string;
    qualityScore: number;
    agentResults: any;
    agents: AgentStatus[];
    isGenerating: boolean;
    params: any;
}

const getTableContent = (children: any): string => {
    let text = "";
    React.Children.forEach(children, (child) => {
        if (typeof child === "string" || typeof child === "number") {
            text += child + " ";
        } else if (child?.props?.children) {
            text += getTableContent(child.props.children);
        }

        if (child?.type === 'td' || child?.type === 'th') {
            text += " | ";
        }
        if (child?.type === 'tr') {
            text += "\n";
        }
    });
    return text;
};

const MarkdownTable = ({ children }: any) => {
    const tableString = getTableContent(children);
    const parsedChart = parseMarkdownTableToChartData(tableString);
    const showChart = parsedChart.data.length >= 3 && parsedChart.keys.length > 0;

    return (
        <div className="my-8">
            <div className="overflow-x-auto border border-slate-200 rounded-xl mb-6">
                <table className="min-w-full divide-y divide-slate-200">
                    {children}
                </table>
            </div>
            {showChart && (
                <MarketChart
                    data={parsedChart.data}
                    keys={parsedChart.keys}
                    title="Data Visualization"
                    type={parsedChart.data.length > 5 ? 'line' : 'bar'}
                />
            )}
        </div>
    );
};

export const RightPanel: React.FC<RightPanelProps> = ({
    reportContent,
    qualityScore,
    agentResults,
    agents,
    isGenerating,
    params
}) => {
    const handleExport = async () => {
        const builder = new DocxBuilder();
        await builder.generate({ content: reportContent, qualityScore, data: agentResults }, params);
    };

    return (
        <div className="flex-1 h-screen overflow-y-auto bg-white p-12 scroll-smooth">
            {isGenerating && (
                <div className="mb-12 border border-blue-500/10 bg-blue-50/30 rounded-2xl p-6 backdrop-blur-sm">
                    <h2 className="text-xs font-bold text-blue-900 mb-6 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                        Parallel Intelligence Engine Active
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {agents.map(agent => (
                            <div key={agent.id} className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-bold text-slate-800 uppercase tracking-tight truncate max-w-[80%]">{agent.name}</span>
                                    <span className={`text-[8px] px-1 rounded font-bold uppercase ${agent.progress === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {agent.progress}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-700 ${agent.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                                            }`}
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
                    <div className="flex justify-between items-center mb-10 pb-8 border-b border-slate-100">
                        <div className="space-y-3">
                            <QualityBadge score={qualityScore} />
                            <h1 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">
                                {params.industry || 'Market'} <span className="text-slate-400 font-light">{params.subCategory ? params.subCategory : 'Industry Intelligence'}</span>
                            </h1>
                            <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 uppercase text-[10px] font-bold tracking-wider">{params.geography || 'Global'}</span>
                                <span>Generated on {new Date().toLocaleDateString()} • {params.insightDepth || 'Standard'} Level</span>
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95 group"
                            >
                                <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                                <span>EXPORT WORD (.DOCX)</span>
                            </button>
                        </div>
                    </div>

                    <div className="prose prose-slate max-w-none 
                        prose-headings:text-slate-900 
                        prose-p:text-slate-700 
                        prose-p:leading-relaxed
                        prose-strong:text-slate-900 
                        prose-ul:list-disc prose-ul:pl-5">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                table: MarkdownTable
                            }}
                        >
                            {reportContent}
                        </ReactMarkdown>
                    </div>

                    {agentResults && Object.keys(agentResults).length > 0 && (
                        <div className="mt-20 pt-10 border-t border-slate-100">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Detailed Analyst Enrichment Pass</h3>
                            <div className="space-y-6">
                                {Object.entries(agentResults).map(([id, res]: any) => (
                                    <InsightBlock key={id} insights={res.insights} />
                                ))}
                            </div>
                        </div>
                    )}
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
