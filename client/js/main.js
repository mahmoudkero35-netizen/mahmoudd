// تحسينات UI/UX إضافية
class UIEhnhancer {
    constructor() {
        this.setupSmoothScroll();
        this.setupParallax();
        this.setupStickyHeader();
        this.setupImageLazyLoad();
        this.setupTooltips();
    }
    
    setupSmoothScroll() {
        // تمرير سلس للروابط الداخلية
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    setupParallax() {
        // تأثير بارالاكس للخلفية
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
    
    setupStickyHeader() {
        // شريط تثبيت عند التمرير
        const header = document.querySelector('.menu-header');
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                header.classList.remove('scroll-up');
                return;
            }
            
            if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
                header.classList.remove('scroll-up');
                header.classList.add('scroll-down');
            } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
                header.classList.remove('scroll-down');
                header.classList.add('scroll-up');
            }
            
            lastScroll = currentScroll;
        });
    }
    
    setupImageLazyLoad() {
        // تحميل الصور عند الظهور فقط
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    setupTooltips() {
        // أدوات تلميحية
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = e.target.dataset.tooltip;
                document.body.appendChild(tooltip);
                
                const rect = e.target.getBoundingClientRect();
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
                tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
            });
            
            element.addEventListener('mouseleave', () => {
                const tooltip = document.querySelector('.tooltip');
                if (tooltip) tooltip.remove();
            });
        });
    }
}

// تحميل الخطوط بشكل غير متزامن
function loadFonts() {
    if ('fonts' in document) {
        document.fonts.load('1rem "Tajawal"').then(() => {
            document.body.classList.add('fonts-loaded');
        });
    }
}

// إضافة مؤشرات تقدم للصفحة
function setupProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.innerHTML = '<div class="progress"></div>';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        const progress = progressBar.querySelector('.progress');
        progress.style.width = `${scrolled}%`;
    });
}

// إضافة تأثيرات إضافية
function addEnhancements() {
    // تأثيرات لصور المنتجات
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.querySelector('.item-image').style.filter = 'brightness(1.1)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.querySelector('.item-image').style.filter = 'brightness(1)';
        });
    });
    
    // تأثيرات للأزرار
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = '';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
}

// تهيئة جميع التحسينات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تهيئة محسن الواجهة
    window.uiEnhancer = new UIEhnhancer();
    
    // تحميل الخطوط
    loadFonts();
    
    // إضافة مؤشر التقدم
    setupProgressIndicator();
    
    // إضافة تأثيرات إضافية
    addEnhancements();
    
    // تحديث سنة الحقوق
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // إضافة فئة للجهاز
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    } else {
        document.body.classList.add('mouse-device');
    }
});
