export interface Meeting {
  id: string;
  title: string;
  date: string;
  duration?: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface AnalysisResult {
  meetingId: string;
  meetingTitle: string;
  agentName: string;
  summary: string;
  insights: string[];
  recommendations: string[];
}