import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBkuXQu6LgKvOFM4OHlhgyFBo2eUzN9wKM",
  authDomain: "droplet-4a856.firebaseapp.com",
  databaseURL: "https://droplet-4a856-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "droplet-4a856",
  storageBucket: "droplet-4a856.firebasestorage.app",
  messagingSenderId: "622525231984",
  appId: "1:622525231984:web:f2d08ae39752eafb1dd5b5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const database = getDatabase(app); 