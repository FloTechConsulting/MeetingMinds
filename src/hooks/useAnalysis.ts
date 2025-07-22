import { useState, useEffect } from 'react';
import { AnalysisResult } from '../types';
import { generateMockAnalysisResult, simulateAnalysisProcessing } from '../utils/analysisUtils';

interface UseAnalysisProps {
  meetingId?: string;
  meetingTitle?: string;
  agentId?: string;
  agentName?: string;
}

export const useAnalysis = ({ meetingId, meetingTitle, agentId, agentName }: UseAnalysisProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!meetingId || !agentId || !meetingTitle || !agentName) {
      setIsLoading(false);
      return;
    }

    const processAnalysis = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        await simulateAnalysisProcessing();
        
        const analysisResult = generateMockAnalysisResult(
          meetingId,
          meetingTitle,
          agentId,
          agentName
        );
        
        setResult(analysisResult);
      } catch (err) {
        setError('Failed to process analysis');
        console.error('Analysis error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    processAnalysis();
  }, [meetingId, agentId, meetingTitle, agentName]);

  return { isLoading, result, error };
};