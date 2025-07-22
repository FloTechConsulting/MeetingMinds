import React, { useEffect } from 'react';
import { handleWebhookData } from '../api/webhooks';

// Component to handle incoming webhook data
const WebhookReceiver: React.FC = () => {
  useEffect(() => {
    // In a real application, this would be handled by a backend server
    // For demonstration, we'll listen for custom events or simulate webhook reception
    
    const handleCustomWebhookEvent = (event: CustomEvent) => {
      handleWebhookData(event.detail);
    };

    // Listen for custom webhook events
    window.addEventListener('webhook-received', handleCustomWebhookEvent as EventListener);

    return () => {
      window.removeEventListener('webhook-received', handleCustomWebhookEvent as EventListener);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default WebhookReceiver;

// Function to trigger webhook reception (for testing)
export const triggerWebhookReception = (data: any) => {
  const event = new CustomEvent('webhook-received', { detail: data });
  window.dispatchEvent(event);
};