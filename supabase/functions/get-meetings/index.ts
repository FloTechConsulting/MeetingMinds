const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Simple in-memory storage for demo purposes
// In production, this would be a proper database
let storedMeetings: any[] = [];

// Initialize with some debug info
console.log('get-meetings function initialized, stored meetings:', storedMeetings.length);

Deno.serve(async (req: Request) => {
  console.log('get-meetings function called with method:', req.method);
  console.log('Current stored meetings count:', storedMeetings.length);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method === "GET") {
      console.log('GET request - returning stored meetings:', storedMeetings);
      // Return stored meetings
      return new Response(
        JSON.stringify({ 
          success: true,
          meetings: storedMeetings,
          count: storedMeetings.length,
          timestamp: new Date().toISOString()
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    if (req.method === "POST") {
      // Store meetings (called by webhook-receiver)
      const body = await req.json();
      console.log('POST request - received body:', body);
      
      if (body.meetings && Array.isArray(body.meetings)) {
        storedMeetings = body.meetings;
        console.log('Stored meetings updated. New count:', storedMeetings.length);
        console.log('Stored meetings data:', JSON.stringify(storedMeetings, null, 2));
      } else {
        console.log('Invalid meetings data received:', body);
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          message: "Meetings stored successfully",
          count: storedMeetings.length,
          stored: storedMeetings
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

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

  } catch (error) {
    console.error('Error in get-meetings function:', error);
    
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