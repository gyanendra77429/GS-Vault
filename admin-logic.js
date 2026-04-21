import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 1. Supabase Connection
const SUPABASE_URL = 'https://tystqlfkhuigbfceuthu.supabase.co' 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5c3RxbGZraHVpZ2JmY2V1dGh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MTQ4NTQsImV4cCI6MjA5MjE5MDg1NH0.p6o0zviRFrLOQb4OkRpKq7GTq_2TNngr0_ld1sLyvFQ'
const BUCKET_NAME = 'Vaults'; // Check karein ki ye naam sahi hai na?

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// 2. File Upload Function (Jo pehle se tha)
window.uploadFile = async () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) return alert("Pehle file select karein!");

    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, file);

    if (error) {
        alert("Upload Error: " + error.message);
    } else {
        alert("File Successful Upload!");
        loadAdminFiles(); // Upload ke baad list refresh karein
    }
}

// 3. Delete Function
window.deleteFile = async (fileName) => {
    const confirmDelete = confirm(`Kya aap "${fileName}" ko hamesha ke liye delete karna chahte hain?`);
    if (!confirmDelete) return;

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([fileName]);

    if (error) {
        alert("Delete Error: " + error.message);
    } else {
        alert("File Deleted!");
        loadAdminFiles(); // Delete ke baad list refresh karein
    }
}

// 4. Admin Dashboard par files dikhane ke liye
async function loadAdminFiles() {
    const listDiv = document.getElementById('admin-file-list');
    if(!listDiv) return; // Agar HTML mein ye ID nahi hai toh skip karein

    const { data, error } = await supabase.storage.from(BUCKET_NAME).list();

    if (error) {
        listDiv.innerHTML = "Error loading files: " + error.message;
        return;
    }

    listDiv.innerHTML = ""; // Purani list saaf karein
    data.forEach(file => {
        const fileElement = document.createElement('div');
        fileElement.style = "background: #1a1a1a; padding: 10px; margin: 5px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #333;";
        
        fileElement.innerHTML = `
            <span style="color: white;">${file.name}</span>
            <button onclick="deleteFile('${file.name}')" style="background: #ff4d4d; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Delete</button>
        `;
        listDiv.appendChild(fileElement);
    });
}

// Logout function
window.logout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.href = 'index.html';
}

// Page load hote hi files dikhao
loadAdminFiles();
