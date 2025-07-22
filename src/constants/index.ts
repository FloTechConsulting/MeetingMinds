export const APP_CONFIG = {
  name: 'MeetingMind',
  description: 'AI-powered meeting analysis platform',
  version: '1.0.0'
} as const;

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  RESULTS: '/results',
  SETTINGS: '/settings',
  HELP: '/help'
} as const;

export const ANIMATION_DELAYS = {
  FAST: 0.1,
  MEDIUM: 0.2,
  SLOW: 0.3,
  EXTRA_SLOW: 0.5
} as const;

export const LOADING_MESSAGES = {
  MEETINGS: 'Loading your meetings...',
  ANALYSIS: 'Our AI agent is processing your meeting data...',
  SIGNIN: 'Signing you in...'
} as const;

export const API_ENDPOINTS = {
  WEBHOOK_RECEIVER: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/webhook-receiver`
} as const;