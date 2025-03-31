import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ✅ Import Authentication
import { getFirestore } from "firebase/firestore"; // ✅ Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfa4raHY3WGKPfT5waj3Qww3HA1J-j6wk",
  authDomain: "chat-app-8e1f7.firebaseapp.com",
  projectId: "chat-app-8e1f7",
  storageBucket: "chat-app-8e1f7.appspot.com", // ✅ Fixed incorrect storageBucket domain
  messagingSenderId: "964480295445",
  appId: "1:964480295445:web:8485f9aac1c84b3c50641c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // ✅ Correctly initialize authentication
export const db = getFirestore(app); // ✅ Correctly initialize Firestore
export default app;
