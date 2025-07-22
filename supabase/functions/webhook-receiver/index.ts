const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface WebhookPayload {
  body: {
    FireFlies_API_KEY: string;
    transcripts: Array<{
      title: string;
      id: string;
      date: string;
    }>;
  };
  [key: string]: any;
}

interface UserRecord {
  userId: string;
  email: string;
  displayName: string;
  firefliesApiKey: string;
  registrationStatus: string;
  webhookRegistered: boolean;
}

// Firebase configuration
const FIREBASE_PROJECT_ID = "flotech-ec621";
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

/**
 * Find user by Fireflies API key
 */
async function findUserByApiKey(apiKey: string): Promise<UserRecord | null> {
  try {
    console.log('🔍 Searching for user with API key:', apiKey ? 'provided' : 'missing');
    
    if (!apiKey) {
      console.log('❌ No API key provided');
      return null;
    }

    // Query users collection by firefliesApiKey
    const query = {
      structuredQuery: {
        from: [{ collectionId: "users" }],
        where: {
          fieldFilter: {
            field: { fieldPath: "firefliesApiKey" },
            op: "EQUAL",
            value: { stringValue: apiKey }
          }
        },
        limit: 1
      }
    };

    const response = await fetch(`${FIRESTORE_BASE_URL}:runQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query)
    });

    if (!response.ok) {
      console.error('❌ Firestore query failed:', response.status, await response.text());
      return null;
    }

    const result = await response.json();
    console.log('🔍 Firestore query result:', JSON.stringify(result, null, 2));

    if (result && result.length > 0 && result[0].document) {
      const userDoc = result[0].document;
      const userId = userDoc.name.split('/').pop();
      const fields = userDoc.fields;
      
      const userRecord: UserRecord = {
        userId,
        email: fields.email?.stringValue || '',
        displayName: fields.displayName?.stringValue || '',
        firefliesApiKey: fields.firefliesApiKey?.stringValue || '',
        registrationStatus: fields.registrationStatus?.stringValue || 'unknown',
        webhookRegistered: fields.webhookRegistered?.booleanValue || false
      };
      
      console.log('✅ Found user:', userRecord);
      return userRecord;
    }

    console.log('❌ No user found with API key');
    return null;
  } catch (error) {
    console.error('❌ Error finding user by API key:', error);
    return null;
  }
}

/**
 * Store meetings in user's subcollection
 */
async function storeMeetingsForUser(userId: string, meetings: any[]): Promise<boolean> {
  try {
    console.log('💾 Storing meetings for user:', userId);
    console.log('📊 Meetings to store:', meetings.length);

    if (meetings.length === 0) {
      console.log('⚠️ No meetings to store');
      return true;
    }

    // Create batch write operations for all meetings
    const writes = meetings.map(meeting => ({
      update: {
        name: `${FIRESTORE_BASE_URL}/users/${userId}/meetings/${meeting.id}`,
        fields: {
          id: { stringValue: meeting.id },
          title: { stringValue: meeting.title },
          date: { stringValue: meeting.date },
          duration: { stringValue: meeting.duration || 'N/A' },
          source: { stringValue: 'webhook' },
          createdAt: { timestampValue: new Date().toISOString() },
          updatedAt: { timestampValue: new Date().toISOString() }
        }
      },
      updateMask: {
        fieldPaths: ['id', 'title', 'date', 'duration', 'source', 'createdAt', 'updatedAt']
      }
    }));

    // Execute batch write
    const batchResponse = await fetch(`${FIRESTORE_BASE_URL}:batchWrite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ writes })
    });

    if (!batchResponse.ok) {
      const errorText = await batchResponse.text();
      console.error('❌ Failed to store meetings:', batchResponse.status, errorText);
      return false;
    }

    const batchResult = await batchResponse.json();
    console.log('✅ Successfully stored meetings:', batchResult);

    // Update user's last webhook received timestamp
    await updateUserWebhookStatus(userId, meetings.length);

    return true;
  } catch (error) {
    console.error('❌ Error storing meetings:', error);
    return false;
  }
}

/**
 * Update user's webhook status
 */
async function updateUserWebhookStatus(userId: string, meetingCount: number): Promise<void> {
  try {
    const updateResponse = await fetch(`${FIRESTORE_BASE_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          lastWebhookReceived: { timestampValue: new Date().toISOString() },
          totalMeetingsReceived: { integerValue: meetingCount.toString() },
          webhookStatus: { stringValue: 'active' },
          updatedAt: { timestampValue: new Date().toISOString() }
        },
        updateMask: {
          fieldPaths: ['lastWebhookReceived', 'totalMeetingsReceived', 'webhookStatus', 'updatedAt']
        }
      })
    });

    if (updateResponse.ok) {
      console.log('✅ Updated user webhook status');
    } else {
      console.error('❌ Failed to update user webhook status');
    }
  } catch (error) {
    console.error('❌ Error updating user webhook status:', error);
  }
}

/**
 * Validate webhook payload structure
 */
function validateWebhookPayload(payload: any): { isValid: boolean; error?: string } {
  if (!payload) {
    return { isValid: false, error: 'Empty payload' };
  }

  if (!payload.body) {
    return { isValid: false, error: 'Missing body in payload' };
  }

  if (!payload.body.FireFlies_API_KEY) {
    return { isValid: false, error: 'Missing FireFlies_API_KEY in payload.body' };
  }

  if (!payload.body.transcripts) {
    return { isValid: false, error: 'Missing transcripts in payload.body' };
  }

  if (!Array.isArray(payload.body.transcripts)) {
    return { isValid: false, error: 'Transcripts must be an array' };
  }

  // Validate each transcript
  for (let i = 0; i < payload.body.transcripts.length; i++) {
    const transcript = payload.body.transcripts[i];
    if (!transcript.id || !transcript.title || !transcript.date) {
      return { 
        isValid: false, 
        error: `Invalid transcript at index ${i}: missing required fields (id, title, date)` 
      };
    }
  }

  return { isValid: true };
}

/**
 * Transform transcripts to meeting format
 */
function transformTranscriptsToMeetings(transcripts: any[]): any[] {
  return transcripts.map(transcript => ({
    id: transcript.id,
    title: transcript.title,
    date: new Date(transcript.date).toISOString().split('T')[0], // Convert to YYYY-MM-DD
    duration: transcript.duration || 'N/A',
    originalDate: transcript.date
  }));
}

/**
 * Main webhook handler
 */
Deno.serve(async (req: Request) => {
  console.log('🚀 Webhook receiver started');
  console.log('📡 Method:', req.method);
  console.log('🌐 URL:', req.url);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log('✅ Handling CORS preflight');
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    console.log('❌ Method not allowed:', req.method);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: "Method not allowed",
        allowedMethods: ["POST"]
      }),
      { 
        status: 405, 
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }

  try {
    // Parse request body
    const rawBody = await req.text();
    console.log('📄 Raw body length:', rawBody.length);
    
    if (!rawBody || rawBody.trim() === '') {
      console.log('❌ Empty request body');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Empty request body" 
        }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    let payload: WebhookPayload;
    try {
      payload = JSON.parse(rawBody.trim());
      console.log('✅ Successfully parsed JSON payload');
      console.log('📊 Payload keys:', Object.keys(payload));
    } catch (parseError) {
      console.error('❌ JSON parsing error:', parseError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Invalid JSON format",
          details: parseError.message
        }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    // Validate payload structure
    const validation = validateWebhookPayload(payload);
    if (!validation.isValid) {
      console.error('❌ Payload validation failed:', validation.error);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Invalid payload structure",
          details: validation.error
        }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    // Extract API key and transcripts
    const apiKey = payload.body.FireFlies_API_KEY;
    const transcripts = payload.body.transcripts;
    
    console.log('🔑 API Key:', apiKey ? 'provided' : 'missing');
    console.log('📋 Transcripts count:', transcripts.length);

    // Find user by API key
    const user = await findUserByApiKey(apiKey);
    if (!user) {
      console.error('❌ User not found for API key');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "User not found",
          details: "No user found with the provided FireFlies_API_KEY"
        }),
        { 
          status: 404, 
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    console.log('👤 Found user:', user.userId, user.email);

    // Transform transcripts to meetings
    const meetings = transformTranscriptsToMeetings(transcripts);
    console.log('🔄 Transformed meetings:', meetings.length);

    // Store meetings for user
    const stored = await storeMeetingsForUser(user.userId, meetings);
    
    if (!stored) {
      console.error('❌ Failed to store meetings');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Storage failed",
          details: "Could not save meetings to database"
        }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    // Success response
    const response = {
      success: true,
      message: "Webhook processed successfully",
      data: {
        userId: user.userId,
        userEmail: user.email,
        meetingsProcessed: meetings.length,
        timestamp: new Date().toISOString()
      },
      meetings: meetings
    };

    console.log('✅ Webhook processing completed successfully');
    console.log('📊 Response:', response);

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );

  } catch (error) {
    console.error('❌ Unexpected error processing webhook:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: "Internal server error",
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
});