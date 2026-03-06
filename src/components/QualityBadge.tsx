import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export const QualityBadge: React.FC<{ score: number }> = ({ score }) => {
    const isHigh = score >= 85;
    const isMedium = score >= 70;

    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isHigh ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                isMedium ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                    'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}>
            {isHigh ? <ShieldCheck size={14} /> : <AlertCircle size={14} />}
            <span className="text-xs font-bold uppercase tracking-wider">
                Consulting Quality Score: {score}/100
            </span>
        </div>
    );
};
