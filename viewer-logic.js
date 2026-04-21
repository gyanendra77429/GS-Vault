import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://tystqlfkhuigbfceuthu.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5c3RxbGZraHVpZ2JmY2V1dGh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MTQ4NTQsImV4cCI6MjA5MjE5MDg1NH0.p6o0zviRFrLOQb4OkRpKq7GTq_2TNngr0_ld1sLyvFQ'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const BUCKET_NAME = 'Vaults'; // <--- Yahan wahi naam likho jo admin-logic mein likha tha

async function loadFiles() {
    const fileListDiv = document.getElementById('file-list');
    
    // Supabase se files ki list mangwana
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list();

    if (error) {
        fileListDiv.innerHTML = `<p style="color:red">Error: ${error.message}</p>`;
        return;
    }

    if (data.length === 0) {
        fileListDiv.innerHTML = "<p>Koi files nahi mili.</p>";
        return;
    }

    // Files ko screen par dikhana
    fileListDiv.innerHTML = ""; // Loading text hatane ke liye
    data.forEach(file => {
        const fileUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${file.name}`;
        const fileElement = document.createElement('div');
        fileElement.innerHTML = `
            <div style="margin: 10px; border: 1px solid #ccc; padding: 10px;">
                <p>${file.name}</p>
                <a href="${fileUrl}" target="_blank">Download/View</a>
            </div>
        `;
        fileListDiv.appendChild(fileElement);
    });
}

loadFiles();

// Logout function jo button dabane par chalega
window.logout = async () => {
    // 1. Supabase ko bolo ki session khatam kare
    const { error } = await supabase.auth.signOut();
    
    if (error) {
        alert("Logout fail ho gaya: " + error.message);
    } else {
        // 2. Local storage se purana data saaf karo
        localStorage.clear();
        
        // 3. Ab wapas home page par bhej do
        window.location.href = 'index.html';
    }
}
