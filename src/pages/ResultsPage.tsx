import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Copy, CheckCircle, Lightbulb, FileText } from 'lucide-react';
import Navigation from '../components/Navigation';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAnalysis } from '../hooks/useAnalysis';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { formatAnalysisForExport } from '../utils/analysisUtils';
import { ROUTES, LOADING_MESSAGES } from '../constants';

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { copy, copySuccess } = useCopyToClipboard();

  const { meetingId, meetingTitle, agentId, agentName } = location.state || {};
  const { isLoading, result } = useAnalysis({ meetingId, meetingTitle, agentId, agentName });

  // Redirect if missing required data
  if (!meetingId || !agentId) {
    navigate(ROUTES.DASHBOARD);
    return null;
  }

  const copyToClipboard = async () => {
    if (result) {
      const content = formatAnalysisForExport(result);
      await copy(content);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-24 flex items-center justify-center min-h-[calc(100vh-6rem)]">
          <div className="text-center space-y-4">
            <LoadingSpinner size="lg" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Analyzing Meeting</h3>
              <p className="text-gray-600">{LOADING_MESSAGES.ANALYSIS}</p>
              <div className="text-sm text-gray-500">
                {meetingTitle} • {agentName}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-32 flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600 mb-4">Unable to load analysis results</p>
            <button
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">{result.meetingTitle}</h1>
                <p className="text-gray-600 flex items-center space-x-2">
                  <span>Analysis by</span>
                  <span className="font-semibold text-blue-600">{result.agentName}</span>
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {copySuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy All</span>
                    </>
                  )}
                </motion.button>
                
                <motion.button
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Results Content */}
          <div className="space-y-8">
            {/* Summary Section */}
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-medium text-gray-900">Summary</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">{result.summary}</p>
            </motion.div>

            {/* Insights Section */}
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-medium text-gray-900">Key Insights</h2>
              </div>
              <div className="space-y-4">
                {result.insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-sm font-medium text-purple-600 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{insight}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recommendations Section */}
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-medium text-gray-900">Recommendations</h2>
              </div>
              <div className="space-y-4">
                {result.recommendations.map((recommendation, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-600 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{recommendation}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;