import { useState, useEffect } from 'react';
import { Meeting } from '../types';
import { mockMeetings } from '../data/mockData';
import { fetchMeetingsFromFirebase } from '../api/webhooks';
import { useAuth } from './useAuth';

export const useMeetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadMeetings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('=== LOADING MEETINGS ===');
      console.log('👤 Current user:', user?.uid);
      
      if (!user?.uid) {
        console.log('❌ No authenticated user, using mock data');
        setMeetings(mockMeetings);
        return;
      }

      // Fetch meetings from Firebase for the current user
      console.log('🔍 Fetching meetings from Firebase...');
      const firebaseMeetings = await fetchMeetingsFromFirebase(user.uid);
      
      if (firebaseMeetings.length > 0) {
        console.log('✅ Using Firebase meetings:', firebaseMeetings.length);
        setMeetings(firebaseMeetings);
      } else {
        console.log('❌ No Firebase meetings found, using mock data');
        // Simulate loading time for mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMeetings(mockMeetings);
      }
    } catch (err) {
      console.error('❌ Error loading meetings:', err);
      console.log('🔄 Falling back to mock data');
      setError('Failed to load meetings');
      setMeetings(mockMeetings);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, [user?.uid]); // Reload when user changes

  const refreshMeetings = () => {
    console.log('🔄 Manually refreshing meetings...');
    loadMeetings();
  };

  return { meetings, isLoading, error, refreshMeetings };
};