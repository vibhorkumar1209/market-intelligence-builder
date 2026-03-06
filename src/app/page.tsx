'use client';

import React, { useState } from 'react';
import { LeftPanel } from '@/components/LeftPanel';
import { RightPanel } from '@/components/RightPanel';
import { ResearchParams, AgentStatus } from '@/types';
import { Orchestrator } from '@/services/orchestrator';

const INITIAL_AGENTS: AgentStatus[] = [
  { id: 'resolver', name: 'Industry Resolver & Scope Definer', status: 'idle', progress: 0 },
  { id: 'taxonomy', name: 'Market Taxonomy Builder', status: 'idle', progress: 0 },
  { id: 'sourcing', name: 'Data Sourcing & Anchors', status: 'idle', progress: 0 },
  { id: 'sizing', name: 'Market Sizing Engine', status: 'idle', progress: 0 },
  { id: 'methodology', name: 'Estimation Methodology', status: 'idle', progress: 0 },
  { id: 'synthesis', name: 'Final Report Synthesis', status: 'idle', progress: 0 },
];

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [agents, setAgents] = useState<AgentStatus[]>(INITIAL_AGENTS);
  const [reportData, setReportData] = useState<{ content: string; qualityScore: number; data: any; params?: ResearchParams }>({
    content: '',
    qualityScore: 0,
    data: {}
  });

  const handleGenerate = async (params: ResearchParams) => {
    setIsGenerating(true);
    setReportData({ content: '', qualityScore: 0, data: {}, params });
    setAgents(INITIAL_AGENTS.map(a => ({ ...a, status: 'running', progress: 5 })));

    const orch = new Orchestrator();
    const result = await orch.generateReport(params, (agentId, progress) => {
      setAgents(prev => {
        if (!prev.find(a => a.id === agentId)) return prev;
        return prev.map(a =>
          a.id === agentId ? { ...a, progress, status: progress === 100 ? 'completed' : 'running' } : a
        );
      });
    });

    setReportData({ ...result, params });
    setIsGenerating(false);
  };

  return (
    <main className="flex min-h-screen bg-slate-900">
      <LeftPanel onGenerate={handleGenerate} isLoading={isGenerating} />
      <RightPanel
        isGenerating={isGenerating}
        agents={agents}
        reportContent={reportData.content}
        qualityScore={reportData.qualityScore}
        agentResults={reportData.data}
        params={reportData.params || {}}
      />
    </main>
  );
}
