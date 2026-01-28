import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { mockSpots } from '../data/mockSpots';

// Collection name in Firestore
const COLLECTION_NAME = 'foodSpots';

export const getSpots = async () => {
  try {
    // Attempt to fetch from Firestore
    console.log("Fetching spots from Firebase...");
    
    // Check if we have valid config (simple check if API key is the placeholder)
    // This prevents errors if the user hasn't set up Firebase yet
    const isConfigured = db.app.options.apiKey !== "YOUR_API_KEY";
    
    if (!isConfigured) {
      console.warn("Firebase not configured. Using mock data.");
      return mockSpots;
    }

    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    
    if (querySnapshot.empty) {
      console.log("No spots found in Firebase. Using mock data.");
      return mockSpots;
    }

    const spots = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`Loaded ${spots.length} spots from Firebase.`);
    return spots;

  } catch (error) {
    console.error("Error fetching from Firebase:", error);
    console.log("Falling back to mock data.");
    return mockSpots;
  }
};
