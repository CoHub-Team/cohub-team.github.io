// Firebase konfigürasyon dosyası
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; 
