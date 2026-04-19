import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// 1. [IMPORTANT] Yahan apna Firebase Config paste karein
const firebaseConfig = {
  apiKey: "AIzaSyCTgT37AvGJ6amhxR59DWfyReTh5pHzcdQ",
  authDomain: "gs-vault.firebaseapp.com",
  projectId: "gs-vault",
  storageBucket: "gs-vault.firebasestorage.app",
  messagingSenderId: "966759040569",
  appId: "1:966759040569:web:dd79917e80786abbd1efe8",
  measurementId: "G-N7N61D3PMB"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Logout Function
window.logout = () => {
    signOut(auth).then(() => { window.location.href = "index.html"; });
};

// File Upload Logic
document.getElementById('uploadFileBtn').addEventListener('click', async () => {
    const file = document.getElementById('fileInput').files[0];
    const status = document.getElementById('statusMsg');
    if(!file) return alert("Pehle file select karein!");

    status.innerText = "Uploading... Please wait.";
    const storageRef = ref(storage, 'vault/' + file.name);

    try {
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        
        await addDoc(collection(db, "resources"), {
            name: file.name,
            url: url,
            type: "file",
            time: new Date()
        });
        status.innerText = "Success! File Upload ho gayi.";
    } catch (e) {
        status.innerText = "Error! Check Firebase Rules.";
        console.error(e);
    }
});

// Link Upload Logic
document.getElementById('uploadLinkBtn').addEventListener('click', async () => {
    const title = document.getElementById('linkTitle').value;
    const url = document.getElementById('linkUrl').value;
    if(!title || !url) return alert("Donon field bhariye!");

    try {
        await addDoc(collection(db, "resources"), {
            name: title,
            url: url,
            type: "link",
            time: new Date()
        });
        alert("Link Saved!");
        location.reload();
    } catch (e) {
        alert("Error saving link.");
    }
});
