import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://tystqlfkhuigbfceuthu.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5c3RxbGZraHVpZ2JmY2V1dGh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MTQ4NTQsImV4cCI6MjA5MjE5MDg1NH0.p6o0zviRFrLOQb4OkRpKq7GTq_2TNngr0_ld1sLyvFQ'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// File Upload Logic
document.getElementById('uploadFileBtn').onclick = async () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) return alert("Pehle file select karein!");

    const status = document.getElementById('statusMsg');
    status.innerText = "Uploading... Thoda intezar karein.";

    // 1. Supabase Storage mein file bhejna
    const fileName = Date.now() + "_" + file.name;
    const { data, error } = await supabase.storage
        .from('Vaults')
        .upload(fileName, file);

    if (error) {
        alert("Upload Error: " + error.message);
    } else {
        // 2. Public URL nikalna
        const { data: urlData } = supabase.storage.from('Vaults').getPublicUrl(fileName);
        
        // 3. Database mein entry save karna
        await supabase.from('resources').insert([
            { name: file.name, url: urlData.publicUrl, type: 'file' }
        ]);

        status.innerText = "Success! File upload ho gayi.";
        fileInput.value = ""; // Input saaf karein
    }
};

window.logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "index.html";
};
