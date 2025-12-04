// خدمة قاعدة البيانات المحدثة
class DatabaseService {
    constructor() {
        this.supabase = window.supabaseClient;
        this.adminSupabase = window.supabaseAdmin;
        this.cache = {};
    }
    
    // وظائف التسجيل والإدارة
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
                        full_name_en: 'System Administrator',
                        role: 'admin',
                        avatar: 'م'
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
    
    // وظائف الإدارة
    async getAllMenuItems() {
        try {
            const { data, error } = await this.adminSupabase
                .from('menu_items')
                .select('*')
                .order('created_at', { ascending: false });
            
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
    
    async addMenuItem(itemData) {
        try {
            const { data, error } = await this.adminSupabase
                .from('menu_items')
                .insert([itemData])
                .select()
                .single();
            
            if (error) throw error;
            
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async updateMenuItem(id, updates) {
        try {
            const { data, error } = await this.adminSupabase
                .from('menu_items')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async deleteMenuItem(id) {
        try {
            const { error } = await this.adminSupabase
                .from('menu_items')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            
            return {
                success: true
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // وظائف الفئات
    async getAllCategories() {
        try {
            const { data, error } = await this.supabase
                .from('categories')
                .select('*')
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
    
    async addCategory(categoryData) {
        try {
            const { data, error } = await this.adminSupabase
                .from('categories')
                .insert([categoryData])
                .select()
                .single();
            
            if (error) throw error;
            
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // وظائف الطلبات
    async getAllOrders() {
        try {
            const { data, error } = await this.adminSupabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });
            
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
    
    async updateOrderStatus(id, status) {
        try {
            const { data, error } = await this.adminSupabase
                .from('orders')
                .update({ status: status })
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // وظائف الإحصائيات
    async getDashboardStats() {
        try {
            // إحصائيات الأصناف
            const { count: totalItems } = await this.supabase
                .from('menu_items')
                .select('*', { count: 'exact', head: true });
            
            // إحصائيات الفئات
            const { count: totalCategories } = await this.supabase
                .from('categories')
                .select('*', { count: 'exact', head: true });
            
            // إحصائيات الطلبات
            const { count: totalOrders } = await this.supabase
                .from('orders')
                .select('*', { count: 'exact', head: true });
            
            return {
                success: true,
                stats: {
                    totalItems: totalItems || 0,
                    totalCategories: totalCategories || 0,
                    totalOrders: totalOrders || 0,
                    revenue: 0 // يمكن حسابها من الطلبات
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                stats: {}
            };
        }
    }
}

// إنشاء نسخة واحدة من الخدمة
const databaseService = new DatabaseService();
window.databaseService = databaseService;
console.log('✅ Database Service ready');
