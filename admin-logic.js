import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://tystqlfkhuigbfceuthu.supabase.co' 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5c3RxbGZraHVpZ2JmY2V1dGh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MTQ4NTQsImV4cCI6MjA5MjE5MDg1NH0.p6o0zviRFrLOQb4OkRpKq7GTq_2TNngr0_ld1sLyvFQ'
const BUCKET_NAME = 'Vaults';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// 1. File Rename Function
window.renameFile = async (oldName) => {
    const newName = prompt("Naya naam likhein (extension ke saath, e.g. photo.jpg):", oldName);
    
    if (!newName || newName === oldName) return;

    // Logic: Copy then Delete
    const { data, error: copyError } = await supabase.storage
        .from(BUCKET_NAME)
        .move(oldName, newName); // .move() purani file ko rename kar deta hai

    if (copyError) {
        alert("Rename Error: " + copyError.message);
    } else {
        alert("File Rename Ho Gayi!");
        loadAdminFiles();
    }
}

// 2. File Delete Function
window.deleteFile = async (fileName) => {
    const confirmDelete = confirm(`Do You want To Delete "${fileName}"File?`);
    if (!confirmDelete) return;

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([fileName]);
    if (error) alert("Error: " + error.message);
    else {
        alert("File Deleted!");
        loadAdminFiles();
    }
}

// 3. File Upload Function
window.uploadFile = async () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) return alert("Pehle file select karein!");

    const fileName = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, file);

    if (error) alert("Upload Error: " + error.message);
    else {
        alert("Upload Success!");
        loadAdminFiles();
    }
}

// 4. Load Files with Rename Button
async function loadAdminFiles() {
    const listDiv = document.getElementById('admin-file-list');
    if(!listDiv) return;

    const { data, error } = await supabase.storage.from(BUCKET_NAME).list();
    if (error) {
        listDiv.innerHTML = "Error: " + error.message;
        return;
    }

    listDiv.innerHTML = "";
    data.forEach(file => {
        const fileElement = document.createElement('div');
        fileElement.style = "background: #1a1a1a; padding: 15px; margin: 10px 0; border-radius: 8px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; border: 1px solid #333;";
        
        fileElement.innerHTML = `
            <span style="color: white; margin-bottom: 10px; width: 100%; word-break: break-all;">${file.name}</span>
            <div style="display: flex; gap: 10px;">
                <button onclick="renameFile('${file.name}')" style="background: #ffa500; color: black; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">Rename</button>
                <button onclick="deleteFile('${file.name}')" style="background: #ff4d4d; color: white; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">Delete</button>
            </div>
        `;
        listDiv.appendChild(fileElement);
    });
}

window.logout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.href = 'index.html';
}

loadAdminFiles();
