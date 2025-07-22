// API endpoint to receive webhook data from external services
export const createWebhookEndpoint = () => {
  // This would typically be handled by a backend server
  // For now, we'll simulate it with a function that processes the data
  
  const handleWebhookData = async (webhookData: any) => {
    try {
      console.log('Received webhook data:', webhookData);
      
      // Validate the data structure matches the expected format
      if (!Array.isArray(webhookData) || webhookData.length === 0) {
        throw new Error('Invalid webhook data format - expected array');
      }
      
      const dataObject = webhookData[0];
      if (!dataObject.data || !dataObject.data.transcripts) {
        throw new Error('Missing transcripts data in webhook payload');
      }
      
      // Transform the webhook data to our meeting format
      const meetings = dataObject.data.transcripts.map((transcript: any) => ({
        id: transcript.id,
        title: transcript.title,
        date: new Date(transcript.dateString).toISOString().split('T')[0], // Convert to YYYY-MM-DD format
        duration: 'N/A' // Duration not provided in webhook data
      }));
      
      // Store meetings in localStorage (in production, this would go to a database)
      localStorage.setItem('fireflies_meetings', JSON.stringify(meetings));
      
      // Trigger a storage event to update the UI
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'fireflies_meetings',
        newValue: JSON.stringify(meetings)
      }));
      
      return { success: true, meetings };
    } catch (error) {
      console.error('Error processing webhook data:', error);
      throw error;
    }
  };
  
  return { handleWebhookData };
};

// Function to simulate receiving webhook data (for testing)
export const simulateWebhookReceive = (data: any) => {
  const { handleWebhookData } = createWebhookEndpoint();
  return handleWebhookData(data);
};