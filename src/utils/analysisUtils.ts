import { AnalysisResult } from '../types';
import { mockAnalysisData } from '../data/mockData';

export const generateMockAnalysisResult = (
  meetingId: string,
  meetingTitle: string,
  agentId: string,
  agentName: string
): AnalysisResult => {
  const agentKey = agentId as keyof typeof mockAnalysisData.summaries;
  
  return {
    meetingId,
    meetingTitle,
    agentName,
    summary: mockAnalysisData.summaries[agentKey] || mockAnalysisData.summaries.summarizer,
    insights: mockAnalysisData.insights[agentKey] || mockAnalysisData.insights.summarizer,
    recommendations: mockAnalysisData.recommendations[agentKey] || mockAnalysisData.recommendations.summarizer
  };
};

export const simulateAnalysisProcessing = (duration: number = 3000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, duration));
};

export const formatAnalysisForExport = (result: AnalysisResult): string => {
  return `
Meeting: ${result.meetingTitle}
Analysis: ${result.agentName}

SUMMARY:
${result.summary}

INSIGHTS:
${result.insights.map((insight, i) => `${i + 1}. ${insight}`).join('\n')}

RECOMMENDATIONS:
${result.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}
  `.trim();
};