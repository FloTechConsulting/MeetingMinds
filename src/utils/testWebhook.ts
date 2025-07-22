// Utility functions for testing webhook functionality

export const sampleWebhookData = {
  "body": {
    "transcripts": [
      {
        "title": "Lets catch up",
        "id": "01K0HM4JSVA2VFFF5BJ62TCBRX",
        "dateString": "2025-07-19T15:20:00.000Z"
      },
      {
        "title": "Your meeting",
        "id": "01K0HJ3ZQ57WTAFKKVY4Q88WZQ",
        "dateString": "2025-07-19T14:45:00.000Z"
      },
      {
        "title": "Website Catch up",
        "id": "01K0HGQWSAK2SCVKG4CS7CD5ED",
        "dateString": "2025-07-19T14:30:00.000Z"
      }
    ]
  },
  "headers": {
    "accept": "application/json,text/html,application/xhtml+xml,application/xml,text/*;q=0.9, image/*;q=0.8, */*;q=0.7"
  },
  "method": "POST",
  "uri": "https://blpykdsynitzxigdwtgv.supabase.co/functions/v1/webhook-receiver",
  "gzip": true,
  "rejectUnauthorized": true,
  "followRedirect": true,
  "resolveWithFullResponse": true,
  "followAllRedirects": true,
  "timeout": 300000,
  "encoding": null,
  "json": false,
  "useStream": true
};

// Legacy format for backward compatibility
export const legacyWebhookData = [
  {
    "data": {
      "transcripts": [
        {
          "title": "Lets catch up",
          "id": "01K0HM4JSVA2VFFF5BJ62TCBRX",
          "dateString": "2025-07-19T15:20:00.000Z"
        },
        {
          "title": "Your meeting",
          "id": "01K0HJ3ZQ57WTAFKKVY4Q88WZQ",
          "dateString": "2025-07-19T14:45:00.000Z"
        },
        {
          "title": "Website Catch up",
          "id": "01K0HGQWSAK2SCVKG4CS7CD5ED",
          "dateString": "2025-07-19T14:30:00.000Z"
        }
      ]
    }
  }
];

// Your exact new JSON format for testing
export const exactWebhookData = `{
  "body": {
    "transcripts": [
      {
        "title": "Lets catch up",
        "id": "01K0HM4JSVA2VFFF5BJ62TCBRX",
        "dateString": "2025-07-19T15:20:00.000Z"
      },
      {
        "title": "Your meeting",
        "id": "01K0HJ3ZQ57WTAFKKVY4Q88WZQ",
        "dateString": "2025-07-19T14:45:00.000Z"
      },
      {
        "title": "Website Catch up",
        "id": "01K0HGQWSAK2SCVKG4CS7CD5ED",
        "dateString": "2025-07-19T14:30:00.000Z"
      }
    ]
  },
  "headers": {
    "accept": "application/json,text/html,application/xhtml+xml,application/xml,text/*;q=0.9, image/*;q=0.8, */*;q=0.7"
  },
  "method": "POST",
  "uri": "https://blpykdsynitzxigdwtgv.supabase.co/functions/v1/webhook-receiver",
  "gzip": true,
  "rejectUnauthorized": true,
  "followRedirect": true,
  "resolveWithFullResponse": true,
  "followAllRedirects": true,
  "timeout": 300000,
  "encoding": null,
  "json": false,
  "useStream": true
}`;

// Function to test with your exact JSON format
export const testExactWebhookFormat = async () => {
  try {
    const parsed = JSON.parse(exactWebhookData);
    console.log('Exact JSON parsed successfully:', parsed);
    
    // Test the webhook handler
    const event = new CustomEvent('webhook-received', { detail: parsed });
    window.dispatchEvent(event);
    console.log('Test webhook data sent with exact format');
    
    return true;
  } catch (error) {
    console.error('Error parsing exact JSON format:', error);
    return false;
  }
};

// Function to test webhook reception
export const testWebhookReception = () => {
  const event = new CustomEvent('webhook-received', { detail: sampleWebhookData });
  window.dispatchEvent(event);
  console.log('Test webhook data sent:', sampleWebhookData);
};

// Function to clear stored meetings (for testing)
export const clearStoredMeetings = () => {
  localStorage.removeItem('fireflies_meetings');
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'fireflies_meetings',
    newValue: null
  }));
  console.log('Stored meetings cleared');
};