import { Meeting, Agent, AnalysisResult } from '../types';

export const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Product Strategy Review',
    date: '2025-01-15',
    duration: '45 min'
  },
  {
    id: '2',
    title: 'Engineering Planning Session',
    date: '2025-01-14',
    duration: '60 min'
  },
  {
    id: '3',
    title: 'Customer Feedback Review',
    date: '2025-01-13',
    duration: '30 min'
  },
  {
    id: '4',
    title: 'Q1 Budget Discussion',
    date: '2025-01-12',
    duration: '90 min'
  },
  {
    id: '5',
    title: 'Design System Updates',
    date: '2025-01-11',
    duration: '40 min'
  }
];

export const agents: Agent[] = [
  {
    id: 'summarizer',
    name: 'Stakeholder Meeting Summariser',
    description: 'Generate comprehensive meeting summaries with key insights',
    icon: 'FileText'
  },
  {
    id: 'requirements',
    name: 'Requirements Drafting',
    description: 'Extract and structure project requirements from discussions',
    icon: 'Users'
  },
  {
    id: 'questions',
    name: 'Stakeholder Question Generator',
    description: 'Create relevant follow-up questions for stakeholders',
    icon: 'HelpCircle'
  },
  {
    id: 'breakdown',
    name: 'Requirement-to-Task Breakdown',
    description: 'Convert requirements into actionable tasks and milestones',
    icon: 'ListTodo'
  },
  {
    id: 'estimator',
    name: 'Impact & Feasibility Estimator',
    description: 'Assess project impact and implementation feasibility',
    icon: 'BarChart3'
  }
];

export const mockAnalysisData = {
  summaries: {
    summarizer: "This product strategy meeting covered three key areas: market positioning, competitive analysis, and feature prioritization for Q1. The team discussed shifting focus toward mobile-first development and implementing new user onboarding flows. Five stakeholders participated, representing product, engineering, design, marketing, and customer success teams.",
    requirements: "Based on the engineering planning discussion, the following requirements were identified: implement user authentication system, develop responsive design framework, integrate third-party analytics, establish CI/CD pipeline, and create comprehensive testing suite. All requirements align with the Q1 roadmap and technical architecture decisions.",
    questions: "The customer feedback review revealed several areas requiring stakeholder clarification. Key questions emerged around user experience priorities, feature adoption metrics, support escalation processes, and integration requirements with existing systems.",
    breakdown: "The Q1 budget discussion outlined major project initiatives that can be broken down into specific tasks. The conversation covered resource allocation, timeline dependencies, risk assessment, and success metrics for each initiative.",
    estimator: "The design system updates discussion focused on evaluating the impact and feasibility of proposed changes. The team assessed technical complexity, resource requirements, timeline implications, and potential risks for each update."
  },
  insights: {
    summarizer: [
      "Strong alignment between product and engineering teams on technical approach",
      "Customer feedback indicates high demand for mobile optimization",
      "Current user onboarding has a 23% completion rate, indicating improvement opportunities",
      "Competitive analysis reveals feature gaps in analytics and reporting"
    ],
    requirements: [
      "Authentication system requires OAuth 2.0 and multi-factor authentication support",
      "Responsive design must support viewport widths from 320px to 1920px",
      "Analytics integration should include real-time event tracking and custom dashboards",
      "CI/CD pipeline needs automated testing, staging deployment, and rollback capabilities"
    ],
    questions: [
      "What metrics should be prioritized for measuring user engagement success?",
      "How should the support team handle escalations during peak hours?",
      "Which third-party integrations are considered critical for launch?",
      "What accessibility standards must be met for compliance?"
    ],
    breakdown: [
      "User authentication can be divided into 8 development tasks over 3 sprints",
      "Design system implementation requires 12 tasks across design and development teams",
      "Analytics integration involves 6 tasks with dependencies on third-party API setup",
      "Testing infrastructure needs 10 tasks including automated test creation"
    ],
    estimator: [
      "High impact: User authentication system (critical for security and user management)",
      "Medium impact: Responsive design updates (improves user experience across devices)",
      "Low complexity: Analytics dashboard integration (existing tools and APIs available)",
      "High complexity: Real-time data processing (requires new infrastructure and monitoring)"
    ]
  },
  recommendations: {
    summarizer: [
      "Schedule weekly cross-team sync meetings to maintain alignment on priorities",
      "Implement user feedback collection system for continuous product improvement",
      "Create detailed user personas based on current customer feedback",
      "Develop competitive analysis dashboard for ongoing market monitoring"
    ],
    requirements: [
      "Begin with authentication system implementation as it blocks other features",
      "Create design system documentation before starting responsive design work",
      "Set up analytics tracking in staging environment for testing",
      "Establish code review process as part of CI/CD implementation"
    ],
    questions: [
      "Conduct stakeholder interviews to gather detailed responses to key questions",
      "Create survey for existing users to understand feature preferences",
      "Schedule technical review meeting to address integration concerns",
      "Document decision-making process for future reference"
    ],
    breakdown: [
      "Use project management tools to track task dependencies and progress",
      "Assign task ownership and establish clear deadlines for each sprint",
      "Create risk mitigation plans for complex technical implementations",
      "Set up regular checkpoint meetings to review progress and adjust timelines"
    ],
    estimator: [
      "Prioritize high-impact, low-complexity items for quick wins",
      "Create detailed technical specifications for complex features",
      "Allocate additional time buffers for high-complexity items",
      "Consider phased rollout for features with uncertain impact"
    ]
  }
};