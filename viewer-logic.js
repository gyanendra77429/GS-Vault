import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://tystqlfkhuigbfceuthu.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5c3RxbGZraHVpZ2JmY2V1dGh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MTQ4NTQsImV4cCI6MjA5MjE5MDg1NH0.p6o0zviRFrLOQb4OkRpKq7GTq_2TNngr0_ld1sLyvFQ'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Files ko fetch karne ka function
async function loadResources() {
    const list = document.getElementById('resourceList');
    const loader = document.getElementById('loader');

    const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
    } else {
        loader.style.display = "none";
        list.innerHTML = "";
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = "resource-card";
            card.innerHTML = `
                <h3>${item.name}</h3>
                <p>Type: ${item.type.toUpperCase()}</p>
                <a href="${item.url}" target="_blank" class="btn btn-blue">Open / Download</a>
            `;
            list.appendChild(card);
        });
    }
}

window.logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "index.html";
};

loadResources();
