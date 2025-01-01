// Firebase konfigürasyon dosyası
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyA6qWJZ-p5gUpJI_h8TfU5WYg1ACoYcT6g",
    authDomain: "frigoo-4b31c.firebaseapp.com",
    projectId: "frigoo-4b31c",
    storageBucket: "frigoo-4b31c.firebasestorage.app",
    messagingSenderId: "429881150999",
    appId: "1:429881150999:web:edc24070c394b4f7811652",
    measurementId: "G-KG4BNCW4X0"
  };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; 
