// ملف الرسوم المتحركة
class AnimationManager {
    constructor() {
        this.initialize();
    }
    
    initialize() {
        this.createFloatingElements();
        console.log('✅ Animation Manager initialized');
    }
    
    createFloatingElements() {
        const bgAnimation = document.querySelector('.bg-animation');
        if (!bgAnimation) return;
        
        // إنشاء عناصر عائمة
        for (let i = 0; i < 10; i++) {
            const element = document.createElement('div');
            element.className = 'floating-element';
            
            element.style.cssText = `
                position: absolute;
                width: ${Math.random() * 30 + 10}px;
                height: ${Math.random() * 30 + 10}px;
                background: rgba(139, 69, 19, 0.1);
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.2 + 0.1};
                animation: floatElement ${Math.random() * 20 + 10}s linear infinite;
            `;
            
            bgAnimation.appendChild(element);
        }
    }
}

// تهيئة مدير الرسوم المتحركة
document.addEventListener('DOMContentLoaded', () => {
    window.animationManager = new AnimationManager();
});

// إضافة أنماط CSS للرسوم المتحركة
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes floatElement {
        0%, 100% {
            transform: translate(0, 0) rotate(0deg);
        }
        50% {
            transform: translate(20px, -30px) rotate(180deg);
        }
    }
`;
document.head.appendChild(animationStyles);
