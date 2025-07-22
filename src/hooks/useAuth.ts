import { useState, useEffect } from 'react'
import { 
  User, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  getAuth
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

// Function to send API key to webhook
const sendApiKeyToWebhook = async (apiKey: string) => {
  try {
    console.log('📡 Sending API key to registration webhook...');
    const response = await fetch('https://flotech123.app.n8n.cloud/webhook/7eed2ed4-73cc-4584-af8c-fd5e1fa8db6f', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        FireFlies_API_KEY: apiKey,
        action: 'user_registration',
        timestamp: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      console.error('❌ Failed to send API key to registration webhook:', response.statusText);
      throw new Error(`Registration webhook failed: ${response.statusText}`);
    } else {
      console.log('✅ API key sent to registration webhook successfully');
      const result = await response.json();
      console.log('📋 Registration webhook response:', result);
    }
  } catch (error) {
    console.error('❌ Error sending API key to registration webhook:', error);
    throw error; // Re-throw to handle in signup flow
  }
};

// Test function to check Firestore connection
const testFirestoreConnection = async () => {
  try {
    console.log('Testing Firestore connection...');
    const testDoc = doc(db, 'test', 'connection');
    await setDoc(testDoc, { test: true, timestamp: new Date() });
    console.log('Firestore connection test successful');
    return true;
  } catch (error) {
    console.error('Firestore connection test failed:', error);
    return false;
  }
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, fullName?: string, firefliesApiKey?: string) => {
    try {
      console.log('Starting signup process...', { email, fullName, firefliesApiKey: firefliesApiKey ? 'provided' : 'not provided' });
      
      if (!firefliesApiKey) {
        throw new Error('Fireflies API key is required for registration');
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      console.log('User created in Auth:', userCredential.user.uid);
      
      // Update user profile with display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: fullName || email.split('@')[0]
        })
        console.log('Profile updated with display name');

        // Store user data in Firestore with comprehensive information
        console.log('📝 Storing user data in Firestore...');
        const userData = {
          firefliesApiKey: firefliesApiKey,
          email: email,
          displayName: fullName || email.split('@')[0],
          userId: userCredential.user.uid,
          registrationStatus: 'pending',
          webhookRegistered: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        console.log('📊 User data to store:', userData);
        
        await setDoc(doc(db, 'users', userCredential.user.uid), userData);
        console.log('✅ User data stored successfully in Firestore');
        
        try {
          // Send API key to registration webhook
          await sendApiKeyToWebhook(firefliesApiKey);
          
          // Update registration status to completed
          await updateDoc(doc(db, 'users', userCredential.user.uid), {
            registrationStatus: 'completed',
            webhookRegistered: true,
            updatedAt: new Date()
          });
          console.log('✅ Registration webhook completed successfully');
        } catch (webhookError) {
          console.error('❌ Registration webhook failed:', webhookError);
          // Update status to failed but don't prevent user creation
          await updateDoc(doc(db, 'users', userCredential.user.uid), {
            registrationStatus: 'webhook_failed',
            webhookError: webhookError.message,
            updatedAt: new Date()
          });
          // Don't throw error - user account is still created
        }
      }
      
      console.log('Signup process completed successfully');
      return { data: userCredential, error: null }
    } catch (error: any) {
      console.error('Signup error:', error);
      return { data: null, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      // Get API key and send to webhook after successful signin
      if (userCredential.user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.firefliesApiKey) {
              await sendApiKeyToWebhook(userData.firefliesApiKey);
            }
          }
        } catch (error) {
          console.error('Error fetching API key for webhook:', error);
        }
      }
      
      return { data: userCredential, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      
      // Get API key and send to webhook after successful Google signin
      if (userCredential.user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.firefliesApiKey) {
              await sendApiKeyToWebhook(userData.firefliesApiKey);
            }
          }
        } catch (error) {
          console.error('Error fetching API key for webhook:', error);
        }
      }
      
      return { data: userCredential, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      return { error: null }
    } catch (error: any) {
      return { error }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
      return { data: null, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  const getFirefliesApiKey = async (): Promise<string | null> => {
    if (!user?.uid) {
      console.log('No authenticated user, cannot fetch API key');
      return null;
    }
    
    try {
      console.log('Fetching Fireflies API key for user:', user.uid);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('User document found:', userData);
        return userData.firefliesApiKey || null;
      }
      console.log('No user document found in Firestore');
      return null;
    } catch (error) {
      console.error('Error fetching Fireflies API key:', error);      
      return null;
    }
  }
  return {
    user,
    session: user ? { user } : null, // For compatibility with existing code
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    getFirefliesApiKey,
    testFirestoreConnection
  }
}