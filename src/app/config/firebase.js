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
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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

/** 🔹 Login with Email */
export const logIn = async (email, password) => {
  try {
    console.log(`🔑 Logging in user: ${email}`);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ Login successful!");
    return userCredential.user;
  } catch (error) {
    console.error("❌ Login failed:", error.message);
    throw error;
  }
};

/** 🔹 Google Sign-In */
export const googleSignIn = async () => {
  try {
    console.log("🔵 Signing in with Google...");
    const result = await signInWithPopup(auth, provider);

    // Store user in Firestore if not already there
    const userRef = doc(db, "users", result.user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, { 
        userName: result.user.displayName, 
        email: result.user.email,
        profilePicture: result.user.photoURL || "", // Store profile pic if available
      });
    }

    console.log("✅ Google Sign-in successful!");
    return result.user;
  } catch (error) {
    console.error("❌ Google sign-in failed:", error.message);
    throw error;
  }
};

/** 🔹 Sign-Up with Email (Stores userName, Full Name, DOB) */
export const signUp = async (email, password, userName, fullName, dateOfBirth) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update Firebase Auth Profile
    await updateProfile(userCredential.user, { displayName: userName });

    // Store user data in Firestore
    const userRef = doc(db, "users", userCredential.user.uid);
    await setDoc(userRef, { 
      userName, 
      fullName, 
      email, 
      dateOfBirth, 
      profilePicture: "" // Placeholder for profile picture
    });

    console.log("✅ Sign-up successful!");
    return userCredential.user;
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

/** 🔹 Update User Profile (userName, Full Name, DOB, Profile Picture) */
export const updateUserProfile = async (userName, fullName, dateOfBirth) => {
  try {
    if (!auth.currentUser) throw new Error("No user is signed in.");

    // Update Firebase Auth Profile
    await updateProfile(auth.currentUser, { displayName: userName });

    // Ensure Firestore document exists before updating
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, { userName, fullName, dateOfBirth, profilePicture: "" });
    } else {
      await updateDoc(userRef, { userName, fullName, dateOfBirth });
    }

    console.log("✅ Profile updated successfully!");
    return "Profile updated successfully!";
  } catch (error) {
    console.error("❌ Error updating profile:", error.message);
    throw error;
  }
};

/** 🔹 Upload Profile Picture */
export const uploadProfilePicture = async (file) => {
  try {
    if (!auth.currentUser) throw new Error("No user is signed in.");

    console.log(`📤 Uploading profile picture for ${auth.currentUser.uid}...`);

    const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateProfile(auth.currentUser, { photoURL: downloadURL });

          // Update Firestore profile picture URL
          const userRef = doc(db, "users", auth.currentUser.uid);
          await updateDoc(userRef, { profilePicture: downloadURL });

          console.log("✅ Profile picture uploaded successfully!");
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error("❌ Profile picture upload failed:", error.message);
    throw error;
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
