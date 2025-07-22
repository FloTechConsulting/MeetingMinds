const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface WebhookData {
  body: {
    transcripts: Array<{
      title: string;
      id: string;
      dateString: string;
    }>;
  };
  headers?: any;
  method?: string;
  uri?: string;
  FireFlies_API_KEY?: string; // API key from webhook
  [key: string]: any;
}

// Firebase Admin SDK setup
const firebaseConfig = {
  apiKey: "AIzaSyASq3D3aqE3s3btLByc9qBIOYLunHX5hnY",
  authDomain: "flotech-ec621.firebaseapp.com",
  projectId: "flotech-ec621",
  storageBucket: "flotech-ec621.firebasestorage.app",
  messagingSenderId: "230547277917",
  appId: "1:230547277917:web:06f2b256bd05f6725ba5b4",
  measurementId: "G-PTXWLZZ9ZX"
};

// Initialize Firebase Admin (using REST API since we can't use Admin SDK in edge functions)
const FIREBASE_PROJECT_ID = "flotech-ec621";

async function findUserByApiKey(apiKey: string) {
  try {
    console.log('🔍 Searching for user with API key:', apiKey ? 'provided' : 'missing');
    
    // Use Firestore REST API to query users by firefliesApiKey
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

    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents:runQuery`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query)
      }
    );

    if (!response.ok) {
      console.error('❌ Firestore query failed:', response.status, await response.text());
      return null;
    }

    const result = await response.json();
    console.log('🔍 Firestore query result:', JSON.stringify(result, null, 2));

    if (result && result.length > 0 && result[0].document) {
      const userDoc = result[0].document;
      const userId = userDoc.name.split('/').pop();
      console.log('✅ Found user:', userId);
      return userId;
    }

    console.log('❌ No user found with API key');
    return null;
  } catch (error) {
    console.error('❌ Error finding user by API key:', error);
    return null;
  }
}

async function storeMeetingsForUser(userId: string, meetings: any[]) {
  try {
    console.log('💾 Storing meetings for user:', userId);
    console.log('📊 Meetings to store:', meetings.length);

    // Store meetings in user's subcollection
    const batch = {
      writes: meetings.map(meeting => ({
        update: {
          name: `projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${userId}/meetings/${meeting.id}`,
          fields: {
            id: { stringValue: meeting.id },
            title: { stringValue: meeting.title },
            date: { stringValue: meeting.date },
            duration: { stringValue: meeting.duration },
            createdAt: { timestampValue: new Date().toISOString() },
            updatedAt: { timestampValue: new Date().toISOString() }
          }
        },
        updateMask: {
          fieldPaths: ['id', 'title', 'date', 'duration', 'createdAt', 'updatedAt']
        }
      }))
    };

    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents:batchWrite`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batch)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to store meetings:', response.status, errorText);
      return false;
    }

    const result = await response.json();
    console.log('✅ Successfully stored meetings:', result);
    return true;
  } catch (error) {
    console.error('❌ Error storing meetings:', error);
    return false;
  }
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log('📨 Received webhook request');
    console.log('🔧 Method:', req.method);

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Get the raw body
    const rawBody = await req.text();
    console.log('📄 Raw body length:', rawBody.length);

    if (!rawBody || rawBody.trim() === '') {
      return new Response(
        JSON.stringify({ error: "Empty request body" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Parse the JSON
    let webhookData: WebhookData | WebhookData[];
    try {
      webhookData = JSON.parse(rawBody.trim());
    } catch (parseError) {
      console.error('❌ JSON parsing error:', parseError);
      return new Response(
        JSON.stringify({ 
          error: "Invalid JSON format",
          message: parseError.message
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }
    
    console.log('📊 Parsed webhook data keys:', Object.keys(webhookData));

    // Handle both single object and array formats
    let dataObject: WebhookData;
    if (Array.isArray(webhookData)) {
      if (webhookData.length === 0) {
        return new Response(
          JSON.stringify({ error: "Empty webhook data array" }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }
      dataObject = webhookData[0];
    } else {
      dataObject = webhookData;
    }

    // Extract API key from webhook data
    const apiKey = dataObject.FireFlies_API_KEY;
    console.log('🔑 API key in webhook:', apiKey ? 'provided' : 'missing');

    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          error: "Missing FireFlies_API_KEY in webhook data",
          message: "The webhook must include the FireFlies_API_KEY to identify the user"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Find user by API key
    const userId = await findUserByApiKey(apiKey);
    if (!userId) {
      return new Response(
        JSON.stringify({ 
          error: "User not found",
          message: "No user found with the provided FireFlies_API_KEY"
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Extract transcripts
    let transcripts;
    if (dataObject.body && dataObject.body.transcripts) {
      transcripts = dataObject.body.transcripts;
    } else if (dataObject.transcripts) {
      transcripts = dataObject.transcripts;
    } else {
      return new Response(
        JSON.stringify({ 
          error: "Missing transcripts data in webhook payload"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    if (!Array.isArray(transcripts)) {
      return new Response(
        JSON.stringify({ error: "Transcripts must be an array" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Transform transcripts to meetings format
    const meetings = transcripts.map((transcript) => ({
      id: transcript.id,
      title: transcript.title,
      date: new Date(transcript.dateString).toISOString().split('T')[0],
      duration: 'N/A'
    }));

    console.log('📋 Transformed meetings:', meetings.length);

    // Store meetings for the user
    const stored = await storeMeetingsForUser(userId, meetings);
    
    if (!stored) {
      return new Response(
        JSON.stringify({ 
          error: "Failed to store meetings",
          message: "Could not save meetings to database"
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Webhook data processed and stored successfully",
        userId: userId,
        meetingsCount: meetings.length,
        meetings: meetings
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        message: error.message
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});