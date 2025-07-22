import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Function to fetch meetings from Firebase for the current user
export const fetchMeetingsFromFirebase = async (userId: string): Promise<any[]> => {
  try {
    console.log('🔍 Fetching meetings from Firebase for user:', userId);
    
    // Query the user's meetings subcollection
    const meetingsRef = collection(db, 'users', userId, 'meetings');
    const querySnapshot = await getDocs(meetingsRef);
    
    const meetings: any[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      meetings.push({
        id: data.id,
        title: data.title,
        date: data.date,
        duration: data.duration || 'N/A'
      });
    });

    console.log('✅ Fetched meetings from Firebase:', meetings.length);
    console.log('📊 Meetings data:', meetings);
    
    // Sort by date (newest first)
    meetings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return meetings;
  } catch (error) {
    console.error('❌ Error fetching meetings from Firebase:', error);
    return [];
  }
};

// Function to get meetings from stored webhook data (legacy - for fallback)
export const getMeetingsFromWebhook = (): any[] => {
  try {
    const storedMeetings = localStorage.getItem('fireflies_meetings');
    if (storedMeetings) {
      return JSON.parse(storedMeetings);
    }
    return [];
  } catch (error) {
    console.error('Error retrieving meetings from storage:', error);
    return [];
  }
};

// Function to handle webhook data (for local processing - legacy)
export const handleWebhookData = async (data: any) => {
  try {
    // Store the webhook data locally for immediate use
    localStorage.setItem('fireflies_meetings', JSON.stringify(data));
    
    // Trigger a custom event to notify components of new data
    const event = new CustomEvent('webhook-data-updated', { detail: data });
    window.dispatchEvent(event);
    
    return { success: true, data };
  } catch (error) {
    console.error('Error handling webhook data:', error);
    return { success: false, error };
  }
};

// Legacy function - kept for backward compatibility
export const fetchMeetingsFromWebhook = async (): Promise<any[]> => {
  console.log('⚠️ Using legacy webhook fetch - consider migrating to Firebase');
  return getMeetingsFromWebhook();
};