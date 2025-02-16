import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  updateProfile
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc 
} from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { format } from "date-fns"; // Ensure date-fns is installed

// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
const provider = new GoogleAuthProvider();

/** 🔹 Function to Generate Realistic Credit History */
const generateCreditHistory = () => {
    const history = [];
    let baseScore = 500; // Start with a base score

    for (let i = 5; i >= 0; i--) { // Generate past 6 months' history
        let fluctuation = Math.floor(Math.random() * 20 - 10); // Simulate small score changes
        baseScore = Math.max(300, Math.min(710, baseScore + fluctuation)); // Keep within range
        history.push({
            date: format(new Date(new Date().setMonth(new Date().getMonth() - i)), "dd-MM-yyyy"), // Format date
            score: baseScore
        });
    }
    return history;
};

/** 🔹 Sign-Up with Email (Stores User + Credit History) */
export const signUp = async (email, password, userName, fullName, dateOfBirth) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Format DOB before saving
    const formattedDOB = format(new Date(dateOfBirth), "dd-MM-yyyy");

    // Update Firebase Auth Profile
    await updateProfile(user, { displayName: userName });

    // Store user data in Firestore
    const userRef = doc(db, "users", user.uid);
    const creditHistory = generateCreditHistory();

    await setDoc(userRef, { 
      userName, 
      fullName, 
      email, 
      dateOfBirth: formattedDOB, // Ensure consistent format
      creditScore: creditHistory[creditHistory.length - 1].score, // Latest score
      lastUpdated: new Date().toISOString(),
      profilePicture: "" // Placeholder for profile picture
    });

    // Store credit history in a subcollection
    const historyRef = collection(userRef, "creditHistory");
    for (const entry of creditHistory) {
        await addDoc(historyRef, entry);
    }

    console.log("✅ Sign-up successful! Credit history stored.");
    return user;
  } catch (error) {
    console.error("❌ Sign-up failed:", error.message);
    throw error;
  }
};

/** 🔹 Fetch User Data from Firestore */
export const getUserData = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  } catch (error) {
    console.error("❌ Error fetching user data:", error.message);
    return null;
  }
};

/** 🔹 Logout */
export const logOut = async () => {
  try {
    console.log("🚪 Logging out...");
    await signOut(auth);
    console.log("✅ Logged out successfully!");
  } catch (error) {
    console.error("❌ Error logging out:", error.message);
  }
};

/** 🔹 Listen for Authentication Changes */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
