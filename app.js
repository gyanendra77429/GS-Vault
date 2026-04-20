import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 1. Supabase Details
const SUPABASE_URL = 'https://tystqlfkhuigbfceuthu.supabase.co' 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5c3RxbGZraHVpZ2JmY2V1dGh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MTQ4NTQsImV4cCI6MjA5MjE5MDg1NH0.p6o0zviRFrLOQb4OkRpKq7GTq_2TNngr0_ld1sLyvFQ'
const ADMIN_EMAIL = 'gyanendsingh24@gmail.com' 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// 2. Google Login Function
window.loginWithGoogle = async (role) => {
    // Role ko save karte hain (admin ya viewer)
    localStorage.setItem('selectedRole', role);

    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + window.location.pathname
        }
    })
    if (error) alert("Login Error: " + error.message)
}

// 3. Ye function decide karega user kahan jayega (REPLACED LOGIC)
async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    const role = localStorage.getItem('selectedRole'); 

    if (user) {
        // Agar admin email hai AUR admin button click kiya tha, tabhi dashboard bhejो
        if (user.email === ADMIN_EMAIL && role === 'admin') {
            window.location.href = "admin.html";
        } 
        // Baaki sab ke liye ya Viewer button click karne par viewer.html
        else {
            window.location.href = "viewer.html";
        }
    }
}

// 4. Page load hote hi check karo
checkUser();
