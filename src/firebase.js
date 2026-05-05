import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBO_a73INPVXzdBIkpAYNFJJCdZWz2nXpw",
  authDomain: "rersonl-website.firebaseapp.com",
  projectId: "rersonl-website",
  storageBucket: "rersonl-website.firebasestorage.app",
  messagingSenderId: "440445982129",
  appId: "1:440445982129:web:f5aee5c824e0a7088ed990",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

export { signInWithEmailAndPassword, signOut, onAuthStateChanged }
