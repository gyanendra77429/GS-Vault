// Supabase Library Import
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// YAHAN APNI SUPABASE DETAILS DAALO
const SUPABASE_URL = 'https://your-project-url.supabase.co'
const SUPABASE_KEY = 'your-anon-key'
const ADMIN_EMAIL = 'aapki_email@gmail.com'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Google Login Function
window.loginWithGoogle = async (roleType) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin // Aapki GitHub link par wapas layega
        }
    })

    if (error) alert("Login Error: " + error.message)
}

// Check User Session (Ye check karega ki kaun login hai)
async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
        if (user.email === ADMIN_EMAIL) {
            window.location.href = "admin.html"
        } else {
            window.location.href = "viewer.html"
        }
    }
  }
