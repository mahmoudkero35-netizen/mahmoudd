// الملف الرئيسي لواجهة العميل
class CafeMenuApp {
    constructor() {
        this.currentCategory = null;
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.initialize();
    }
    
    async initialize() {
        try {
            this.db = window.databaseService;
            await this.initializeUI();
            await this.loadData();
            this.setupEventListeners();
            console.log('✅ Cafe Menu App initialized');
        } catch (error) {
            console.error('❌ App initialization error:', error);
        }
    }
    
    async initializeUI() {
        document.getElementById('currentYear').textContent = new Date().getFullYear();
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 1500);
    }
    
    async loadData() {
        await this.loadCategories();
        await this.loadMenuItems();
    }
    
    async loadCategories() {
        try {
            const result = await this.db.getCategories();
            if (result.success) {
                this.renderCategories(result.data);
            }
        } catch (error) {
            console.error('Load categories error:', error);
        }
    }
    
    renderCategories(categories) {
        const nav = document.getElementById('categoriesNav');
        if (!nav) return;
        
        nav.innerHTML = '';
        
        const allBtn = document.createElement('button');
        allBtn.className = 'category-btn active';
        allBtn.textContent = 'عرض الكل';
        allBtn.addEventListener('click', () => this.handleCategoryClick(null));
        nav.appendChild(allBtn);
        
        categories.forEach(category => {
            const btn = document.createElement('button');
            btn.className = 'category-btn';
            btn.textContent = category.name_ar;
            btn.addEventListener('click', () => this.handleCategoryClick(category.id));
            nav.appendChild(btn);
        });
    }
    
    async handleCategoryClick(categoryId) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
        
        this.currentCategory = categoryId;
        await this.loadMenuItems(categoryId);
    }
    
    async loadMenuItems(categoryId = null) {
        try {
            const result = await this.db.getMenuItems(categoryId);
            if (result.success) {
                this.renderMenuItems(result.data);
            }
        } catch (error) {
            console.error('Load menu items error:', error);
        }
    }
    
    renderMenuItems(items) {
        const grid = document.getElementById('menuGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        if (!items || items.length === 0) {
            grid.innerHTML = '<div class="empty-state">لا توجد أصناف متاحة</div>';
            return;
        }
        
        items.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'menu-item';
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.innerHTML = `
                <div class="item-image-container">
                    <img src="${item.image_url || 'https://images.unsplash.com/photo-1510707577719-ae7c9b788690'}" 
                         alt="${item.name_ar}" class="item-image">
                </div>
                <div class="item-content">
                    <div class="item-header">
                        <h3 class="item-title">${item.name_ar}</h3>
                        <span class="item-price">${item.price} ريال</span>
                    </div>
                    <p class="item-description">${item.description_ar || 'لا يوجد وصف'}</p>
                </div>
            `;
            
            card.addEventListener('click', () => this.showItemDetails(item));
            grid.appendChild(card);
        });
    }
    
    showItemDetails(item) {
        const modal = document.getElementById('itemModal');
        const body = document.getElementById('modalBody');
        
        if (!modal || !body) return;
        
        body.innerHTML = `
            <h2>${item.name_ar}</h2>
            <div class="modal-price">${item.price} ريال</div>
            <p>${item.description_ar || 'لا يوجد وصف تفصيلي'}</p>
            <button class="close-btn" id="closeDetailsBtn">إغلاق</button>
        `;
        
        modal.style.display = 'flex';
        
        document.getElementById('closeDetailsBtn').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    setupEventListeners() {
        // أزرار الثيم
        document.getElementById('darkThemeBtn').addEventListener('click', () => {
            this.setTheme('dark');
        });
        
        document.getElementById('lightThemeBtn').addEventListener('click', () => {
            this.setTheme('light');
        });
        
        // البحث
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.toggleSearch();
        });
        
        document.getElementById('closeSearchBtn').addEventListener('click', () => {
            this.toggleSearch();
        });
        
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (theme === 'dark') {
            document.getElementById('darkThemeBtn').classList.add('active');
        } else {
            document.getElementById('lightThemeBtn').classList.add('active');
        }
    }
    
    toggleSearch() {
        const searchOverlay = document.getElementById('searchOverlay');
        searchOverlay.style.display = searchOverlay.style.display === 'flex' ? 'none' : 'flex';
        
        if (searchOverlay.style.display === 'flex') {
            document.getElementById('searchInput').focus();
        }
    }
    
    async handleSearch(query) {
        if (query.length < 2) return;
        
        try {
            const result = await this.db.searchMenuItems(query);
            // يمكن عرض نتائج البحث هنا
            console.log('Search results:', result);
        } catch (error) {
            console.error('Search error:', error);
        }
    }
}

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', () => {
    window.cafeMenuApp = new CafeMenuApp();
});
