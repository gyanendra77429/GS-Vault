import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://tystqlfkhuigbfceuthu.supabase.co' 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5c3RxbGZraHVpZ2JmY2V1dGh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MTQ4NTQsImV4cCI6MjA5MjE5MDg1NH0.p6o0zviRFrLOQb4OkRpKq7GTq_2TNngr0_ld1sLyvFQ'
const BUCKET_NAME = 'Vaults';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// --- RENAME FUNCTION ---
window.renameFile = async (oldName) => {
    const newName = prompt("Naya naam extension ke sath (e.g. notes.pdf):", oldName);
    if (!newName || newName === oldName) return;
    const { error } = await supabase.storage.from(BUCKET_NAME).move(oldName, newName);
    if (error) alert("Error: " + error.message);
    else loadAdminFiles();
}

// --- DELETE FUNCTION ---
window.deleteFile = async (fileName) => {
    if (!confirm("Delete karein?")) return;
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([fileName]);
    if (error) alert("Error: " + error.message);
    else loadAdminFiles();
}

// --- UPLOAD FUNCTION ---
window.uploadFile = async () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) return alert("File select karein!");
    const fileName = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, file);
    if (error) alert("Error: " + error.message);
    else { alert("Uploaded!"); loadAdminFiles(); }
}

// --- LOAD FILES WITH LINKS (NEW LOGIC) ---
async function loadAdminFiles() {
    const listDiv = document.getElementById('admin-file-list');
    if(!listDiv) return;

    const { data, error } = await supabase.storage.from(BUCKET_NAME).list();
    if (error) { listDiv.innerHTML = "Error: " + error.message; return; }

    listDiv.innerHTML = ""; 
    data.forEach(file => {
        // Har file ka public URL nikaalna
        const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(file.name);
        const publicUrl = urlData.publicUrl;

        const fileElement = document.createElement('div');
        fileElement.className = "file-list-item"; // CSS class use karega
        fileElement.style = "background: #1a1a1a; padding: 15px; margin: 10px 0; border-radius: 8px; border: 1px solid #333;";
        
        fileElement.innerHTML = `
            <div style="margin-bottom: 10px;">
                <strong style="color: white; display: block;">${file.name}</strong>
                <a href="${publicUrl}" target="_blank" style="color: #00d4ff; font-size: 12px; word-break: break-all;">${publicUrl}</a>
            </div>
            <div style="display: flex; gap: 10px;">
                <button onclick="navigator.clipboard.writeText('${publicUrl}'); alert('Link Copied!')" style="background: #eee; color: black; padding: 5px 10px; border-radius: 4px; cursor: pointer; border:none; font-size: 12px;">Copy Link</button>
                <button onclick="renameFile('${file.name}')" style="background: #ffa500; color: black; padding: 5px 10px; border-radius: 4px; cursor: pointer; border:none; font-size: 12px;">Rename</button>
                <button onclick="deleteFile('${file.name}')" style="background: #ff4d4d; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer; border:none; font-size: 12px;">Delete</button>
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
