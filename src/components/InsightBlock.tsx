import React from 'react';
import { Lightbulb } from 'lucide-react';

export const InsightBlock: React.FC<{ insights: string[] }> = ({ insights }) => {
    if (!insights || insights.length === 0) return null;

    return (
        <div className="mt-4 p-4 bg-blue-500/5 border-l-4 border-blue-500 rounded-r-xl">
            <div className="flex items-center gap-2 mb-3 text-blue-400">
                <Lightbulb size={16} />
                <h4 className="text-xs font-bold uppercase tracking-widest leading-none">Analyst Strategic Insights</h4>
            </div>
            <ul className="space-y-2">
                {insights.map((insight, idx) => (
                    <li key={idx} className="text-sm text-slate-300 flex gap-2">
                        <span className="text-blue-500 font-bold font-mono text-xs mt-0.5">•</span>
                        <span className="leading-relaxed italic">{insight}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
