import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Clock, MoreVertical } from 'lucide-react';
import Navigation from '../components/Navigation';
import AgentSelectionModal from '../components/AgentSelectionModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { Meeting } from '../types';
import { useMeetings } from '../hooks/useMeetings';
import { formatDate } from '../utils/dateUtils';
import { LOADING_MESSAGES } from '../constants';

const DashboardPage: React.FC = () => {
  const { meetings, isLoading, refreshMeetings } = useMeetings();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showAgentModal, setShowAgentModal] = useState(false);

  // Listen for webhook data updates
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'fireflies_meetings') {
        refreshMeetings();
      }
    };

    // Also listen for custom webhook events
    const handleWebhookUpdate = () => {
      refreshMeetings();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('webhook-received', handleWebhookUpdate);
    
    return () => window.removeEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('webhook-received', handleWebhookUpdate);
    };
  }, [refreshMeetings]);

  const handleAnalyze = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowAgentModal(true);
  };

  const filteredMeetings = meetings.filter(meeting =>
    meeting.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-24 flex items-center justify-center min-h-[calc(100vh-6rem)]">
          <LoadingSpinner size="lg" text={LOADING_MESSAGES.MEETINGS} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-medium text-gray-800 mb-2">Your Meetings</h2>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Analyze your recorded meetings with AI-powered agents</p>
              <div className="text-sm text-gray-500">
                <div className="space-y-1">
                  <p>Webhook endpoint:</p>
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs block">
                    {import.meta.env.VITE_SUPABASE_URL}/functions/v1/webhook-receiver
                  </code>
                  <p className="text-xs text-gray-600 mt-2">
                    <strong>Required JSON format:</strong>
                  </p>
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs block whitespace-pre">
{`{
  "body": {
    "FireFlies_API_KEY": "your-api-key",
    "transcripts": [
      {
        "title": "Meeting Title",
        "id": "meeting-id",
        "date": "2025-01-15T10:00:00.000Z"
      }
    ]
  }
}`}
                  </code>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        console.log('Refreshing meetings...');
                        refreshMeetings();
                      }}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Refresh Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search meetings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </motion.div>

          {/* Meetings Table */}
          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Meeting Title</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Duration</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMeetings.map((meeting, index) => (
                    <motion.tr
                      key={meeting.id}
                      className="hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{meeting.title}</div>
                        <div className="text-sm text-gray-500">ID: {meeting.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-gray-700">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(meeting.date)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-gray-700">
                          <Clock className="w-4 h-4" />
                          <span>{meeting.duration}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <motion.button
                            onClick={() => handleAnalyze(meeting)}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            🔍 Analyze
                          </motion.button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredMeetings.length === 0 && (
              <div className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No meetings found</h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Try adjusting your search terms' : 'Your meetings will appear here once synced with Fireflies'}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Agent Selection Modal */}
      <AgentSelectionModal
        isOpen={showAgentModal}
        onClose={() => setShowAgentModal(false)}
        meeting={selectedMeeting}
      />
    </div>
  );
};

export default DashboardPage;