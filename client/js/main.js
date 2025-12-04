<<<<<<< HEAD
﻿
=======
// ============================================
// ملف JavaScript الرئيسي للتصميم المتقدم
// ============================================

class CafeMenuUI {
    constructor() {
        this.currentCategory = null;
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.isFabOpen = false;
        this.initialize();
    }
    
    async initialize() {
        await this.setupTheme();
        await this.loadInitialData();
        this.setupEventListeners();
        this.setupAnimations();
        this.hideLoadingScreen();
        console.log('✅ UI System Initialized');
    }
    
    async setupTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeButtons();
    }
    
    async loadInitialData() {
        // تحميل الإعدادات
        await this.loadSettings();
        
        // تحميل الفئات
        await this.loadCategories();
        
        // تحميل الأصناف
        await this.loadMenuItems();
    }
    
    async loadSettings() {
        try {
            const result = await window.databaseService.getSettings();
            if (result.success) {
                this.applySettings(result.settings);
            }
        } catch (error) {
            console.error('Settings error:', error);
        }
    }
    
    applySettings(settings) {
        // تطبيق إعدادات المطعم
        if (settings.restaurant_name) {
            document.querySelectorAll('#restaurantName, #restaurantNameFooter').forEach(el => {
                el.textContent = settings.restaurant_name;
            });
        }
        
        if (settings.restaurant_tagline) {
            document.getElementById('restaurantTagline').textContent = settings.restaurant_tagline;
        }
        
        if (settings.contact_phone) {
            document.querySelectorAll('#phone, #contactPhone').forEach(el => {
                el.textContent = settings.contact_phone;
            });
        }
        
        if (settings.contact_address) {
            document.querySelectorAll('#address, #contactAddress').forEach(el => {
                el.textContent = settings.contact_address;
            });
        }
        
        if (settings.working_hours) {
            document.getElementById('workingHours').textContent = settings.working_hours;
        }
        
        if (settings.contact_email) {
            document.getElementById('contactEmail').textContent = settings.contact_email;
        }
    }
    
    async loadCategories() {
        try {
            const nav = document.getElementById('categoriesNav');
            nav.innerHTML = '<div class="loading-state"><i class="fas fa-spinner fa-spin fa-2x"></i></div>';
            
            const result = await window.databaseService.getCategories();
            if (result.success && result.data.length > 0) {
                this.renderCategories(result.data);
            } else {
                nav.innerHTML = '<div class="empty-state">لا توجد فئات متاحة</div>';
            }
        } catch (error) {
            console.error('Categories error:', error);
        }
    }
    
    renderCategories(categories) {
        const nav = document.getElementById('categoriesNav');
        nav.innerHTML = '';
        
        // زر عرض الكل
        const allBtn = document.createElement('button');
        allBtn.className = 'category-btn active';
        allBtn.innerHTML = '<i class="fas fa-th-large"></i> عرض الكل';
        allBtn.addEventListener('click', () => this.handleCategoryClick(null));
        nav.appendChild(allBtn);
        
        // عرض الفئات
        categories.forEach(category => {
            const btn = document.createElement('button');
            btn.className = 'category-btn';
            btn.innerHTML = `<i class="${category.icon || 'fas fa-utensils'}"></i> ${category.name_ar}`;
            btn.style.borderLeftColor = category.color;
            btn.addEventListener('click', () => this.handleCategoryClick(category.id));
            nav.appendChild(btn);
        });
    }
    
    async handleCategoryClick(categoryId) {
        // تحديد الزر النشط
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
        
        // تحميل الأصناف
        this.currentCategory = categoryId;
        await this.loadMenuItems(categoryId);
    }
    
    async loadMenuItems(categoryId = null) {
        try {
            const grid = document.getElementById('menuGrid');
            grid.innerHTML = `
                <div class="loading-state">
                    <div class="skeleton-image skeleton"></div>
                    <div class="skeleton-text skeleton"></div>
                    <div class="skeleton-text skeleton"></div>
                    <div class="skeleton-text skeleton"></div>
                </div>
            `;
            
            const result = await window.databaseService.getMenuItems(categoryId);
            if (result.success && result.data.length > 0) {
                this.renderMenuItems(result.data);
            } else {
                grid.innerHTML = '<div class="empty-state"><i class="fas fa-coffee fa-3x"></i><h3>لا توجد أصناف متاحة في هذه الفئة</h3></div>';
            }
        } catch (error) {
            console.error('Menu items error:', error);
        }
    }
    
    renderMenuItems(items) {
        const grid = document.getElementById('menuGrid');
        grid.innerHTML = '';
        
        items.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'menu-item hover-lift';
            card.style.animationDelay = `${index * 0.1}s`;
            
            // إنشاء البادجات
            let badges = '';
            if (item.is_popular) badges += '<span class="badge popular">الأكثر طلباً</span>';
            if (item.is_new) badges += '<span class="badge new">جديد</span>';
            if (item.is_vegetarian) badges += '<span class="badge vegetarian">نباتي</span>';
            if (item.is_spicy) badges += '<span class="badge spicy">حار</span>';
            
            card.innerHTML = `
                <div class="item-image-container">
                    <img src="${item.image_url || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&auto=format&fit=crop'}" 
                         alt="${item.name_ar}" 
                         class="item-image"
                         onerror="this.src='https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&auto=format&fit=crop'">
                    <div class="item-badges">${badges}</div>
                </div>
                <div class="item-content">
                    <div class="item-header">
                        <h3 class="item-title">${item.name_ar}</h3>
                        <span class="item-price">${item.price} ر.س</span>
                    </div>
                    <p class="item-description">${item.description_ar || 'وصف لذيذ وجذاب للصنف...'}</p>
                    <div class="item-footer">
                        <div class="item-info">
                            ${item.preparation_time ? `<span><i class="far fa-clock"></i> ${item.preparation_time} دقيقة</span>` : ''}
                            ${item.calories ? `<span><i class="fas fa-fire"></i> ${item.calories} سعر</span>` : ''}
                        </div>
                        <button class="add-to-cart" onclick="event.stopPropagation(); window.cafeMenuUI.addToCart(${item.id})">
                            <i class="fas fa-plus"></i> أضف للسلة
                        </button>
                    </div>
                </div>
            `;
            
            card.addEventListener('click', () => this.showItemDetails(item));
            grid.appendChild(card);
        });
    }
    
    showItemDetails(item) {
        const modal = document.getElementById('itemModal');
        const body = document.getElementById('modalBody');
        
        // إنشاء محتوى مفصّل للصنف
        body.innerHTML = `
            <div class="item-detail">
                <div class="detail-image">
                    <img src="${item.image_url || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136'}" 
                         alt="${item.name_ar}">
                </div>
                <div class="detail-content">
                    <h2>${item.name_ar}</h2>
                    <div class="detail-price">${item.price} ر.س</div>
                    
                    <div class="detail-description">
                        <h3><i class="fas fa-info-circle"></i> الوصف</h3>
                        <p>${item.description_ar || 'لا يوجد وصف تفصيلي لهذا الصنف.'}</p>
                    </div>
                    
                    ${item.preparation_time || item.calories ? `
                    <div class="detail-info">
                        <h3><i class="fas fa-utensils"></i> المعلومات الغذائية</h3>
                        <div class="info-grid">
                            ${item.preparation_time ? `<div><i class="far fa-clock"></i> وقت التحضير: <span>${item.preparation_time} دقيقة</span></div>` : ''}
                            ${item.calories ? `<div><i class="fas fa-fire"></i> السعرات: <span>${item.calories} سعرة</span></div>` : ''}
                            ${item.is_vegetarian ? `<div><i class="fas fa-leaf"></i> <span>نباتي</span></div>` : ''}
                            ${item.is_spicy ? `<div><i class="fas fa-pepper-hot"></i> <span>حار</span></div>` : ''}
                        </div>
                    </div>` : ''}
                    
                    <div class="detail-actions">
                        <button class="btn-primary" onclick="window.cafeMenuUI.addToCart(${item.id})">
                            <i class="fas fa-cart-plus"></i> إضافة للسلة - ${item.price} ر.س
                        </button>
                        <button class="btn-secondary" onclick="window.cafeMenuUI.closeModal()">
                            <i class="fas fa-times"></i> إغلاق
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        const modal = document.getElementById('itemModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1500);
    }
    
    setupEventListeners() {
        // أزرار الثيم
        document.getElementById('darkThemeBtn').addEventListener('click', () => this.setTheme('dark'));
        document.getElementById('lightThemeBtn').addEventListener('click', () => this.setTheme('light'));
        
        // البحث
        document.getElementById('searchBtn').addEventListener('click', () => this.toggleSearch());
        document.getElementById('closeSearchBtn').addEventListener('click', () => this.toggleSearch());
        document.getElementById('searchInput').addEventListener('input', (e) => this.handleSearch(e.target.value));
        
        // الفاب باتون
        document.getElementById('mainFab').addEventListener('click', () => this.toggleFabMenu());
        document.getElementById('scrollTopBtn').addEventListener('click', () => this.scrollToTop());
        document.getElementById('refreshBtn').addEventListener('click', () => this.refreshMenu());
        document.getElementById('shareBtn').addEventListener('click', () => this.shareMenu());
        document.getElementById('contactBtn').addEventListener('click', () => this.showContactModal());
        
        // إغلاق المودال
        document.getElementById('closeModalBtn').addEventListener('click', () => this.closeModal());
        
        // نسخ العام
        document.querySelector('.close-contact').addEventListener('click', () => {
            document.getElementById('contactModal').style.display = 'none';
        });
        
        // الريبل إفكت
        this.setupRippleEffect();
        
        // سكرول للعناصر
        this.setupScrollReveal();
    }
    
    setupRippleEffect() {
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('btn-ripple') || target.closest('.btn-ripple')) {
                const btn = target.classList.contains('btn-ripple') ? target : target.closest('.btn-ripple');
                this.createRipple(btn, e);
            }
        });
    }
    
    createRipple(element, event) {
        const circle = document.createElement('span');
        const diameter = Math.max(element.clientWidth, element.clientHeight);
        const radius = diameter / 2;
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - element.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${event.clientY - element.getBoundingClientRect().top - radius}px`;
        circle.classList.add('ripple-effect');
        
        element.appendChild(circle);
        
        setTimeout(() => {
            circle.remove();
        }, 600);
    }
    
    setupScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }
    
    setupAnimations() {
        // إضافة أنماط للعناصر
        document.querySelectorAll('.menu-header, .categories-nav').forEach(el => {
            el.classList.add('scroll-reveal');
        });
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateThemeButtons();
    }
    
    updateThemeButtons() {
        const darkBtn = document.getElementById('darkThemeBtn');
        const lightBtn = document.getElementById('lightThemeBtn');
        
        darkBtn.classList.toggle('active', this.currentTheme === 'dark');
        lightBtn.classList.toggle('active', this.currentTheme === 'light');
    }
    
    toggleSearch() {
        const searchOverlay = document.getElementById('searchOverlay');
        searchOverlay.style.display = searchOverlay.style.display === 'flex' ? 'none' : 'flex';
        
        if (searchOverlay.style.display === 'flex') {
            document.getElementById('searchInput').focus();
        }
    }
    
    async handleSearch(query) {
        if (query.length < 2) {
            document.getElementById('searchResults').innerHTML = '';
            return;
        }
        
        try {
            const result = await window.databaseService.searchMenuItems(query);
            this.displaySearchResults(result.data);
        } catch (error) {
            console.error('Search error:', error);
        }
    }
    
    displaySearchResults(items) {
        const resultsContainer = document.getElementById('searchResults');
        
        if (!items || items.length === 0) {
            resultsContainer.innerHTML = '<div class="empty-state">لا توجد نتائج</div>';
            return;
        }
        
        resultsContainer.innerHTML = items.map(item => `
            <div class="search-result-item" onclick="window.cafeMenuUI.showItemDetails(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                <img src="${item.image_url || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136'}" alt="${item.name_ar}">
                <div>
                    <h4>${item.name_ar}</h4>
                    <p>${item.price} ر.س</p>
                </div>
            </div>
        `).join('');
    }
    
    toggleFabMenu() {
        this.isFabOpen = !this.isFabOpen;
        const fabMenu = document.querySelector('.fab-menu');
        fabMenu.classList.toggle('show', this.isFabOpen);
        document.getElementById('mainFab').innerHTML = this.isFabOpen ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    }
    
    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.toggleFabMenu();
    }
    
    refreshMenu() {
        this.loadMenuItems(this.currentCategory);
        this.showNotification('تم تحديث القائمة', 'success');
        this.toggleFabMenu();
    }
    
    shareMenu() {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                text: 'اطلع على قائمة كافيتنا الرقمية',
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            this.showNotification('تم نسخ الرابط', 'success');
        }
        this.toggleFabMenu();
    }
    
    showContactModal() {
        document.getElementById('contactModal').style.display = 'flex';
        this.toggleFabMenu();
    }
    
    showNotification(message, type = 'info') {
        // إنشاء عنصر الإشعار
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        // إضافة الأنماط
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                left: 20px;
                background: var(--card-bg);
                border-radius: var(--border-radius);
                padding: 15px 20px;
                box-shadow: var(--shadow-lg);
                display: flex;
                align-items: center;
                gap: 15px;
                z-index: 1000;
                border-right: 4px solid ${type === 'success' ? '#27AE60' : '#3498DB'};
            }
            .notification i {
                font-size: 1.5rem;
                color: ${type === 'success' ? '#27AE60' : '#3498DB'};
            }
        `;
        document.head.appendChild(style);
        
        // إضافة الإشعار إلى الصفحة
        document.body.appendChild(notification);
        
        // إزالة الإشعار بعد 3 ثوانٍ
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 3000);
    }
    
    addToCart(itemId) {
        // هنا يمكنك إضافة منطق السلة
        this.showNotification('تمت الإضافة إلى السلة', 'success');
        console.log('Added to cart:', itemId);
    }
}

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', () => {
    window.cafeMenuUI = new CafeMenuUI();
    
    // إعداد السنة الحالية
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // تحميل الصور عند ظهورها
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
});
>>>>>>> 1efff2c4cf75746d12c3f537105db111fe8b47b9
