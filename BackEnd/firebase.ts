// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyCy4pygigr8uTVGnlU5vN_MZcrFvYYD02U",
	authDomain: "testproject-e9158.firebaseapp.com",
	projectId: "testproject-e9158",
	storageBucket: "testproject-e9158.appspot.com",
	messagingSenderId: "370811757441",
	appId: "1:370811757441:web:1bd07275b1e64b7fb0fe80",
	measurementId: "G-3E19ZVKJNV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
