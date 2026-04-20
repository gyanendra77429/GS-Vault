import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://tystqlfkhuigbfceuthu.supabase.co' 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5c3RxbGZraHVpZ2JmY2V1dGh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MTQ4NTQsImV4cCI6MjA5MjE5MDg1NH0.p6o0zviRFrLOQb4OkRpKq7GTq_2TNngr0_ld1sLyvFQ'
const ADMIN_EMAIL = 'gyanendsingh24@gmail.com' 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// 1. Login Function
window.loginWithGoogle = async (role) => {
    localStorage.setItem('selectedRole', role);
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + window.location.pathname
        }
    })
    if (error) alert("Login Error: " + error.message)
}

// 2. Redirect Logic (FIXED)
async function checkUser() {
    // Ye line check karegi ki kya hum abhi-abhi login karke wapas aaye hain
    const hasHash = window.location.hash.includes('access_token');
    
    const { data: { user } } = await supabase.auth.getUser()
    const role = localStorage.getItem('selectedRole'); 

    if (user && (role || hasHash)) {
        if (user.email === ADMIN_EMAIL && role === 'admin') {
            window.location.href = "admin.html";
        } else {
            window.location.href = "viewer.html";
        }
    }
}

checkUser();
