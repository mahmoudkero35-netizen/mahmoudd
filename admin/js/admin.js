// الملف الرئيسي لوحة التحكم
class AdminPanel {
    constructor() {
        this.currentUser = null;
        this.initialize();
    }
    
    async initialize() {
        await this.checkLoginStatus();
        
        if (this.currentUser) {
            await this.initializePanel();
        } else {
            this.showLoginForm();
        }
    }
    
    async checkLoginStatus() {
        const userData = localStorage.getItem('adminUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            return true;
        }
        return false;
    }
    
    showLoginForm() {
        const loginContainer = document.getElementById('loginContainer');
        const adminContainer = document.getElementById('adminContainer');
        
        if (loginContainer && adminContainer) {
            loginContainer.style.display = 'flex';
            adminContainer.style.display = 'none';
            this.setupLoginForm();
        }
    }
    
    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) return;
        
        // إظهار/إخفاء كلمة المرور
        document.getElementById('showPasswordBtn')?.addEventListener('click', () => {
            const passwordInput = document.getElementById('password');
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
        });
        
        // تسجيل الدخول
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            await this.handleLogin(username, password);
        });
        
        // بيانات الاختبار
        document.getElementById('username').value = 'admin';
        document.getElementById('password').value = 'admin123';
    }
    
    async handleLogin(username, password) {
        try {
            const db = window.databaseService;
            const result = await db.adminLogin({
                email: username,
                password: password
            });
            
            if (result.success) {
                this.currentUser = result.data;
                localStorage.setItem('adminUser', JSON.stringify(result.data));
                await this.initializePanel();
            } else {
                alert(result.error || 'بيانات الدخول غير صحيحة');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('فشل تسجيل الدخول');
        }
    }
    
    async initializePanel() {
        document.getElementById('loginContainer').style.display = 'none';
        await this.createAdminInterface();
        document.getElementById('adminContainer').style.display = 'block';
    }
    
    async createAdminInterface() {
        const container = document.getElementById('adminContainer');
        
        container.innerHTML = `
            <header class="admin-header">
                <h1><i class="fas fa-cogs"></i> لوحة تحكم مينو الكافيه</h1>
                <div class="user-info">
                    <span>مرحباً، ${this.currentUser?.full_name_ar || 'المدير'}</span>
                    <button id="logoutBtn">تسجيل الخروج</button>
                </div>
            </header>
            
            <div class="admin-main">
                <aside class="admin-sidebar">
                    <nav class="sidebar-menu">
                        <a href="#" class="menu-item active">لوحة التحكم</a>
                        <a href="#" class="menu-item">إدارة الأصناف</a>
                        <a href="#" class="menu-item">إدارة الفئات</a>
                        <a href="#" class="menu-item">الإعدادات</a>
                    </nav>
                </aside>
                
                <main class="admin-content">
                    <div class="content-header">
                        <h2>مرحباً في لوحة التحكم</h2>
                    </div>
                    <div class="content-cards">
                        <div class="content-card">
                            <h3>إجمالي الأصناف</h3>
                            <div class="stat-number">0</div>
                        </div>
                        <div class="content-card">
                            <h3>الفئات النشطة</h3>
                            <div class="stat-number">0</div>
                        </div>
                    </div>
                </main>
            </div>
        `;
        
        // إعداد مستمع الأحداث لتسجيل الخروج
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });
    }
    
    handleLogout() {
        localStorage.removeItem('adminUser');
        this.currentUser = null;
        this.showLoginForm();
    }
}

// تهيئة لوحة التحكم
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});
