import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBC7ugXLMuSA0SSaJVvmzk4JaBJn0uyD30',
  authDomain: 'arzinja-26448.firebaseapp.com',
  databaseURL: 'https://arzinja-26448.firebaseio.com',
  projectId: 'arzinja-26448',
  storageBucket: 'arzinja-26448.appspot.com',
  messagingSenderId: '626216157560',
  appId: '1:626216157560:web:9af1aa608eb6c0f70b888d',
  measurementId: 'G-K5Z2F0TMGF',
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
