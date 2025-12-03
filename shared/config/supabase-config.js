// إعدادات اتصال Supabase
const SUPABASE_CONFIG = {
    url: 'https://mrrzopcnwrnyrbvdmcse.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycnpvcGNud3JueXJidmRtY3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NzIzMDIsImV4cCI6MjA4MDM0ODMwMn0.NTlbO4revl4Yyb2B_o2SX1w4jgbohr3VDuGz1xM-kYQ',
    serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycnpvcGNud3JueXJidmRtY3NlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDc3MjMwMiwiZXhwIjoyMDgwMzQ4MzAyfQ.I7YyRzQ4Av2jUAoPQA_7_r-8kphuLNEXKzNEsKTgJ48'
};

// تهيئة عميل Supabase
const supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: localStorage,
        storageKey: 'supabase.auth.token'
    }
});

// تهيئة عميل الإدارة
const supabaseAdmin = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.serviceKey);

// دالة للتحقق من الاتصال
async function checkSupabaseConnection() {
    try {
        const { data, error } = await supabaseClient
            .from('categories')
            .select('count')
            .limit(1)
            .single();

        if (error) {
            return {
                connected: false,
                error: error.message
            };
        }

        return {
            connected: true,
            timestamp: new Date().toISOString(),
            url: SUPABASE_CONFIG.url
        };
    } catch (error) {
        return {
            connected: false,
            error: error.message
        };
    }
}

// تصدير الوظائف
window.supabaseConfig = SUPABASE_CONFIG;
window.supabaseClient = supabaseClient;
window.supabaseAdmin = supabaseAdmin;
window.checkSupabaseConnection = checkSupabaseConnection;

console.log('✅ Supabase configured successfully');
console.log('📊 Project URL:', SUPABASE_CONFIG.url);

// التحقق التلقائي من الاتصال
window.addEventListener('DOMContentLoaded', async () => {
    const connection = await checkSupabaseConnection();
    if (connection.connected) {
        console.log('✅ Supabase connection established');
    } else {
        console.warn('⚠️ Supabase connection issue:', connection.error);
    }
});
