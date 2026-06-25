// 頁面加載時的初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('頁面已加載');
    initializeEventListeners();
    addScrollAnimation();
});

// 初始化事件監聽器
function initializeEventListeners() {
    // CTA 按鈕
    const ctaBtn = document.getElementById('ctaBtn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', handleCTAClick);
    }

    // 聯絡表單
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // 導航連結平滑滾動
    setupSmoothScroll();
}

// CTA 按鈕點擊處理
function handleCTAClick() {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// 表單提交處理
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = e.target.elements[0].value;
    const email = e.target.elements[1].value;
    const message = e.target.elements[2].value;

    // 驗證表單
    if (!name || !email || !message) {
        showNotification('請填寫所有欄位', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('請輸入有效的電子郵件', 'error');
        return;
    }

    // 模擬提交
    console.log('表單數據:', { name, email, message });
    showNotification('感謝您的訊息！我們將盡快與您聯絡。', 'success');
    
    // 清空表單
    e.target.reset();
}

// 電子郵件驗證
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 顯示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 添加樣式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;

    document.body.appendChild(notification);

    // 3 秒後移除通知
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 添加滑入動畫
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(styleSheet);

// 平滑滾動導航
function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// 滾動動畫效果
function addScrollAnimation() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 監察所有的部分和卡片
    const elementsToObserve = document.querySelectorAll(
        '.service-card, .about-content'
    );
    elementsToObserve.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 頁面卸載清理
window.addEventListener('beforeunload', function() {
    console.log('頁面即將卸載');
});

// 控制台歡迎信息
console.log('%c歡迎使用我的網站！', 'color: #3498db; font-size: 20px; font-weight: bold;');
console.log('%c這個網站使用純 HTML、CSS 和 JavaScript 構建', 'color: #2c3e50; font-size: 14px;');
