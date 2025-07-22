import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Book, Video } from 'lucide-react';
import Navigation from '../components/Navigation';
import Chatbot from '../components/Chatbot';

const HelpPage: React.FC = () => {
  const faqItems = [
    {
      question: 'How do I connect my Fireflies account?',
      answer: 'Go to Settings and enter your Fireflies API key. You can find this in your Fireflies.ai account under Settings > Integrations > API.'
    },
    {
      question: 'Which AI agents should I use for different meeting types?',
      answer: 'Use Stakeholder Meeting Summariser for general meetings, Requirements Drafting for project planning, Question Generator for follow-ups, Task Breakdown for implementation planning, and Impact Estimator for decision-making meetings.'
    },
    {
      question: 'How accurate are the AI analysis results?',
      answer: 'Our AI agents are trained on professional meeting data and provide high-quality insights. However, always review the results and use your judgment for critical decisions.'
    },
    {
      question: 'Can I export the analysis results?',
      answer: 'Yes, you can copy the results to clipboard or download them as a text file from the results page.'
    }
  ];

  const resources = [
    {
      title: 'Getting Started Guide',
      description: 'Learn how to set up and use MeetingMind effectively',
      icon: Book,
      link: '#'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step tutorials for each AI agent',
      icon: Video,
      link: '#'
    },
    {
      title: 'API Documentation',
      description: 'Technical documentation for developers',
      icon: ExternalLink,
      link: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-medium text-gray-800 mb-4">Help & Support</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions and get the most out of MeetingMind
            </p>
          </motion.div>

          {/* Resources */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resources.map((resource, index) => {
                const IconComponent = resource.icon;
                return (
                  <motion.a
                    key={index}
                    href={resource.link}
                    className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  >
                    <div className="w-12 h-12 bg-green-50 group-hover:bg-green-100 rounded-xl flex items-center justify-center mb-4 transition-colors">
                      <IconComponent className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 group-hover:text-green-900 transition-colors mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-gray-600">{resource.description}</p>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            id="faq"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                >
                  <h3 className="font-medium text-gray-900 mb-3">{item.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      
      <Chatbot />
    </div>
  );
};

export default HelpPage;