'use client';

import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend
} from 'recharts';

interface MarketChartProps {
    data: { name: string, value: number }[];
    title: string;
    type?: 'bar' | 'line';
}

export const MarketChart: React.FC<MarketChartProps> = ({ data, title, type = 'bar' }) => {
    return (
        <div className="my-8 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">{title}</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {type === 'bar' ? (
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    ) : (
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-50">
                <p className="text-xs font-bold text-slate-400 uppercase mb-3 px-1">Key Insights</p>
                <ul className="space-y-2">
                    <li className="text-sm text-slate-600 flex gap-2">
                        <span className="text-blue-500 font-bold">•</span>
                        Significant growth acceleration observed in the forecast period.
                    </li>
                    <li className="text-sm text-slate-600 flex gap-2">
                        <span className="text-blue-500 font-bold">•</span>
                        Market leader maintain strong position while new entrants gain traction.
                    </li>
                </ul>
            </div>
        </div>
    );
};
