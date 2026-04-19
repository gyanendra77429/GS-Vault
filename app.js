import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// ---------------------------------------------------------
// STEP 1: Yahan apni Supabase details bhariye
// ---------------------------------------------------------
const SUPABASE_URL = 'https://tystqlfkhuigbfceuthu.supabase.co' 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5c3RxbGZraHVpZ2JmY2V1dGh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MTQ4NTQsImV4cCI6MjA5MjE5MDg1NH0.p6o0zviRFrLOQb4OkRpKq7GTq_2TNngr0_ld1sLyvFQ'
const ADMIN_EMAIL = 'gyanendsingh24@gmail.com' 
// ---------------------------------------------------------

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Google Login Function
window.loginWithGoogle = async (role) => {
    // Role ko thodi der ke liye yaad rakhte hain (Admin ya Viewer)
    localStorage.setItem('selectedRole', role);

    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            // Login ke baad wapas isi website par aana hai
            redirectTo: window.location.origin + window.location.pathname
        }
    })
    if (error) alert("Login Error: " + error.message)
}

// Ye function check karega ki login success hua ya nahi
async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    const role = localStorage.getItem('selectedRole');

    if (user) {
        // Agar login ho gaya hai, toh check karo kahan bhejna hai
        if (user.email === ADMIN_EMAIL) {
            window.location.href = "admin.html";
        } else {
            window.location.href = "viewer.html";
        }
    }
}

// Page load hote hi check karo
checkUser();
