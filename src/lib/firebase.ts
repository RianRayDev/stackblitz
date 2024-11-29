import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED,
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAwtJHh3C30-BQZQrmTEeaEZnqwG99tD7E",
  authDomain: "snuli-hub.firebaseapp.com",
  projectId: "snuli-hub",
  storageBucket: "snuli-hub.firebasestorage.app",
  messagingSenderId: "166781891279",
  appId: "1:166781891279:web:043883f2503ce14e823dba",
  measurementId: "G-YBV54D1FLS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with persistence enabled
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    tabManager: persistentSingleTabManager()
  })
});

// Enable offline persistence with proper error handling
const initializePersistence = async () => {
  try {
    await enableIndexedDbPersistence(db);
    console.log('Offline persistence enabled');
  } catch (err: any) {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.warn('Multiple tabs open, persistence enabled in first tab only');
    } else if (err.code === 'unimplemented') {
      // The current browser doesn't support persistence
      console.warn('Browser does not support persistence');
    }
  }
};

// Initialize persistence
initializePersistence().catch(console.error);

export { db };
export default app;