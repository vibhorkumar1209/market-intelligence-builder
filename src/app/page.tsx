'use client';

import React, { useState } from 'react';
import { LeftPanel } from '@/components/LeftPanel';
import { RightPanel } from '@/components/RightPanel';
import { ResearchParams, AgentStatus } from '@/types';
import { Orchestrator } from '@/services/orchestrator';

const INITIAL_AGENTS: AgentStatus[] = [
  { id: 'sizing', name: 'Market Sizing Agent', status: 'idle', progress: 0 },
  { id: 'segmentation', name: 'Segmentation Agent', status: 'idle', progress: 0 },
  { id: 'trends', name: 'Trends Agent', status: 'idle', progress: 0 },
  { id: 'tech', name: 'Technology Intelligence', status: 'idle', progress: 0 },
  { id: 'competitive', name: 'Competitive Landscape', status: 'idle', progress: 0 },
  { id: 'financial', name: 'Financial Model Agent', status: 'idle', progress: 0 },
];

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [agents, setAgents] = useState<AgentStatus[]>(INITIAL_AGENTS);
  const [reportContent, setReportContent] = useState<string>('');

  const handleGenerate = async (params: ResearchParams) => {
    setIsGenerating(true);
    setReportContent('');
    setAgents(INITIAL_AGENTS.map(a => ({ ...a, status: 'running', progress: 5 })));

    const orch = new Orchestrator();
    const result = await orch.generateReport(params, (agentId, progress) => {
      setAgents(prev => prev.map(a =>
        a.id === agentId ? { ...a, progress, status: progress === 100 ? 'completed' : 'running' } : a
      ));
    });

    setReportContent(result);
    setIsGenerating(false);
  };

  return (
    <main className="flex min-h-screen bg-slate-900">
      <LeftPanel onGenerate={handleGenerate} isLoading={isGenerating} />
      <RightPanel
        isGenerating={isGenerating}
        agents={agents}
        reportContent={reportContent}
      />
    </main>
  );
}
