import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://tystqlfkhuigbfceuthu.supabase.co' 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5c3RxbGZraHVpZ2JmY2V1dGh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MTQ4NTQsImV4cCI6MjA5MjE5MDg1NH0.p6o0zviRFrLOQb4OkRpKq7GTq_2TNngr0_ld1sLyvFQ'
const BUCKET_NAME = 'Vaults';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ================= SYTEM FUNCTIONS =================

// 1. FILE UPLOAD & RENAME LOGIC
window.uploadFile = async () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) return alert("Pehle file select karein!");
    const fileName = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, file);
    if (error) alert("Error: " + error.message);
    else { alert("File Uploaded!"); loadAdminFiles(); }
}

window.renameFile = async (oldName) => {
    const newName = prompt("Naya naam (with extension):", oldName);
    if (!newName || newName === oldName) return;
    const { error } = await supabase.storage.from(BUCKET_NAME).move(oldName, newName);
    if (error) alert(error.message);
    else loadAdminFiles();
}

window.deleteFile = async (fileName) => {
    if (!confirm("File delete karein?")) return;
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([fileName]);
    if (error) alert(error.message);
    else loadAdminFiles();
}

// 2. DATABASE LINKS LOGIC
window.addLink = async () => {
    const title = document.getElementById('linkTitle').value;
    const url = document.getElementById('linkURL').value;
    if (!title || !url) return alert("Title aur URL dono bhariye!");

    const { error } = await supabase.from('important_links').insert([{ title, url }]);
    if (error) alert("Error: " + error.message);
    else {
        alert("Link Saved!");
        document.getElementById('linkTitle').value = "";
        document.getElementById('linkURL').value = "";
        loadLinks();
    }
}

window.deleteLink = async (id) => {
    if (!confirm("Link delete karein?")) return;
    const { error } = await supabase.from('important_links').delete().eq('id', id);
    if (error) alert(error.message);
    else loadLinks();
}

// ================= DISPLAY FUNCTIONS =================

async function loadAdminFiles() {
    const listDiv = document.getElementById('admin-file-list');
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list();
    if (error) return;

    listDiv.innerHTML = "<h4>Files in Storage:</h4>";
    data.forEach(file => {
        const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(file.name);
        const el = document.createElement('div');
        el.className = "file-list-item";
        el.innerHTML = `
            <div><strong style="color:white">${file.name}</strong><br><small style="color:gray">${urlData.publicUrl}</small></div>
            <div>
                <button onclick="navigator.clipboard.writeText('${urlData.publicUrl}');alert('Link Copied!')" style="padding:5px; font-size:10px">Copy</button>
                <button onclick="renameFile('${file.name}')" style="padding:5px; font-size:10px; background:orange">Rename</button>
                <button onclick="deleteFile('${file.name}')" style="padding:5px; font-size:10px; background:red; color:white">X</button>
            </div>`;
        listDiv.appendChild(el);
    });
}

async function loadLinks() {
    const linksDiv = document.getElementById('admin-links-list');
    const { data, error } = await supabase.from('important_links').select('*');
    if (error) return;

    linksDiv.innerHTML = "<h4>Saved URLs:</h4>";
    data.forEach(item => {
        const el = document.createElement('div');
        el.className = "file-list-item";
        el.style.borderLeft = "4px solid #007bff";
        el.innerHTML = `
            <div><strong style="color:white">${item.title}</strong><br><a href="${item.url}" target="_blank" style="color:#00d4ff; font-size:12px">${item.url}</a></div>
            <button onclick="deleteLink(${item.id})" style="background:red; color:white; border:none; padding:5px 10px; border-radius:4px">Delete</button>`;
        linksDiv.appendChild(el);
    });
}

window.logout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.href = 'index.html';
}

// Initial Load
loadAdminFiles();
loadLinks();
