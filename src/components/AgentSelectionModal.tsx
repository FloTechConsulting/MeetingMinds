import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, FileText, Users, HelpCircle, ListTodo, BarChart3 } from 'lucide-react';
import { Meeting, Agent } from '../types';
import { agents } from '../data/mockData';
import { ROUTES } from '../constants';

interface AgentSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: Meeting | null;
}

const iconMap = {
  FileText,
  Users,
  HelpCircle,
  ListTodo,
  BarChart3
};

const AgentSelectionModal: React.FC<AgentSelectionModalProps> = ({
  isOpen,
  onClose,
  meeting
}) => {
  const navigate = useNavigate();

  const handleAgentSelect = (agent: Agent) => {
    if (!meeting) return;
    
    // Navigate to results page with meeting and agent data
    navigate(ROUTES.RESULTS, {
      state: {
        meetingId: meeting.id,
        meetingTitle: meeting.title,
        agentId: agent.id,
        agentName: agent.name
      }
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    What would you like to do with this meeting?
                  </h2>
                  <p className="text-gray-600">
                    {meeting?.title} • {meeting?.date}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Agent Grid */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent, index) => {
                  const IconComponent = iconMap[agent.icon as keyof typeof iconMap];
                  
                  return (
                    <motion.button
                      key={agent.id}
                      onClick={() => handleAgentSelect(agent)}
                      className="group p-6 bg-white border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all text-left"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center transition-colors">
                          <IconComponent className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 group-hover:text-blue-900 transition-colors mb-2">
                            {agent.name}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {agent.description}
                          </p>
                        </div>
                      </div>
                      
                      <motion.div
                        className="mt-4 text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={false}
                      >
                        Click to analyze →
                      </motion.div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AgentSelectionModal;