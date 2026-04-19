/ Firebase SDKs ko link kar rahe hain (Latest Version)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// 1. [IMPORTANT] Yahan apna Firebase Config wala poora box paste karein
const firebaseConfig = {
  apiKey: "AIzaSyCTgT37AvGJ6amhxR59DWfyReTh5pHzcdQ",
  authDomain: "gs-vault.firebaseapp.com",
  projectId: "gs-vault",
  storageBucket: "gs-vault.firebasestorage.app",
  messagingSenderId: "966759040569",
  appId: "1:966759040569:web:dd79917e80786abbd1efe8",
  measurementId: "G-N7N61D3PMB"
};

// 2. [IMPORTANT] Yahan apni Admin Gmail ID likhein
const ADMIN_EMAIL = "gyanendsingh24@gmail.com"; 

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Login Function jo buttons par kaam karega
window.loginWithGoogle = function(roleType) {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log("Logged in user:", user.email);

            if (roleType === 'admin') {
                // Check agar login karne wala Admin hi hai
                if (user.email === ADMIN_EMAIL) {
                    alert("Access Granted! Welcome Boss.");
                    window.location.href = "admin.html"; // Admin Dashboard par bhejo
                } else {
                    alert("Unauthorized! Aap Admin nahi hain.");
                    signOut(auth); // Galat bande ko log out kar do
                }
            } else {
                // Viewer login logic
                alert("Welcome " + user.displayName + "! Viewer Portal khul raha hai.");
                window.location.href = "viewer.html"; // Viewer Dashboard par bhejo
            }
        })
        .catch((error) => {
            console.error("Login Failed:", error);
            alert("Login fail ho gaya. Domain authorize kiya kya?");
        });
};
