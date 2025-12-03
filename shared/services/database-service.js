// خدمة قاعدة البيانات
class DatabaseService {
    constructor() {
        this.supabase = window.supabaseClient;
        this.cache = {};
    }
    
    async getCategories() {
        try {
            const { data, error } = await this.supabase
                .from('categories')
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true });
            
            if (error) throw error;
            
            return {
                success: true,
                data: data || []
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    }
    
    async getMenuItems(categoryId = null) {
        try {
            let query = this.supabase
                .from('menu_items')
                .select('*')
                .eq('is_available', true)
                .order('sort_order', { ascending: true });
            
            if (categoryId) {
                query = query.eq('category_id', categoryId);
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            
            return {
                success: true,
                data: data || []
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    }
    
    async searchMenuItems(query) {
        try {
            const { data, error } = await this.supabase
                .from('menu_items')
                .select('*')
                .or(`name_ar.ilike.%${query}%,description_ar.ilike.%${query}%`)
                .eq('is_available', true)
                .limit(20);
            
            if (error) throw error;
            
            return {
                success: true,
                data: data || []
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    }
    
    async getSettings() {
        try {
            const { data, error } = await this.supabase
                .from('settings')
                .select('*');
            
            if (error) throw error;
            
            const settings = {};
            data.forEach(setting => {
                settings[setting.setting_key] = setting.setting_value;
            });
            
            return {
                success: true,
                settings: settings
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                settings: {}
            };
        }
    }
    
    async adminLogin(credentials) {
        try {
            const { email, password } = credentials;
            
            // في التطبيق الحقيقي، استخدم Supabase Auth
            // هذا للاختبار فقط
            if (email === 'admin' && password === 'admin123') {
                return {
                    success: true,
                    data: {
                        id: 1,
                        email: 'admin@cafe.com',
                        full_name_ar: 'مدير النظام',
                        role: 'admin'
                    },
                    token: 'temp-token'
                };
            } else {
                return {
                    success: false,
                    error: 'بيانات الدخول غير صحيحة'
                };
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// إنشاء نسخة واحدة من الخدمة
const databaseService = new DatabaseService();
window.databaseService = databaseService;
console.log('✅ Database Service ready');
