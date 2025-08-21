// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger menu
        const spans = this.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            
            // Reset hamburger menu
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            
            // Reset hamburger menu
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Smooth scrolling for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(15, 15, 35, 0.98)';
        } else {
            header.style.background = 'rgba(15, 15, 35, 0.95)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                showNotification('모든 필드를 입력해주세요', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('유효한 이메일 주소를 입력해주세요', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('메시지가 성공적으로 전송되었습니다!', 'success');
            this.reset();
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .contact-item, .social-link');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add notification styles to CSS
const notificationStyles = `
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Smooth reveal animation for sections
function revealOnScroll() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;
        
        if (scrollTop + windowHeight > sectionTop + sectionHeight * 0.3) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
}

// Initialize section animations
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Trigger initial reveal
    revealOnScroll();
    
    // Listen for scroll events
    window.addEventListener('scroll', revealOnScroll);
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Add CSS for loading state
const loadingStyles = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded)::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    body:not(.loaded)::after {
        content: '';
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50px;
        height: 50px;
        border: 3px solid rgba(100, 255, 218, 0.3);
        border-top: 3px solid #64ffda;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        z-index: 10000;
    }
    
    @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
`;

// Inject loading styles
const loadingStyleSheet = document.createElement('style');
loadingStyleSheet.textContent = loadingStyles;
document.head.appendChild(loadingStyleSheet); 

// Mobile App Navigation System
document.addEventListener('DOMContentLoaded', function() {
    const dashboard = document.querySelector('.dashboard');
    const widgetCards = document.querySelectorAll('.widget-card');
    const categoryCards = document.querySelectorAll('.category-card');
    const backButtons = document.querySelectorAll('.back-btn');
    const backToMainButtons = document.querySelectorAll('.back-to-main');
    const navItems = document.querySelectorAll('.nav-item');
    const bottomNav = document.querySelector('.bottom-nav');
    const categoryWidgets = document.querySelectorAll('.category-widgets');
    
    // Deep link mappings for each widget
    const deepLinks = {
        'exam-summary': {
            ios: 'notion://www.notion.so',
            android: 'intent://www.notion.so#Intent;scheme=https;package=notion.id;end',
            web: 'https://www.notion.so'
        },
        'english-essay': {
            ios: 'grammarly://open',
            android: 'intent://open#Intent;package=com.grammarly.android;end',
            web: 'https://www.grammarly.com'
        },
        'math-helper': {
            ios: 'photomath://scan',
            android: 'intent://scan#Intent;package=com.microblink.photomath;end',
            web: 'https://photomath.net'
        },
        'flashcard': {
            ios: 'anki://deck',
            android: 'intent://deck#Intent;package=com.ichi2.anki;end',
            web: 'https://apps.ankiweb.net'
        },
        'club-report': {
            ios: 'googledocs://docs.google.com',
            android: 'intent://docs.google.com#Intent;scheme=https;package=com.google.android.apps.docs.editors.docs;end',
            web: 'https://docs.google.com'
        },
        'personal-statement': {
            ios: 'googledocs://docs.google.com',
            android: 'intent://docs.google.com#Intent;scheme=https;package=com.google.android.apps.docs.editors.docs;end',
            web: 'https://docs.google.com'
        },
        'interview-practice': {
            ios: 'pramp://interview',
            android: 'intent://interview#Intent;package=com.pramp;end',
            web: 'https://www.pramp.com'
        },
        'career-explorer': {
            ios: 'linkedin://profile',
            android: 'intent://profile#Intent;package=com.linkedin.android;end',
            web: 'https://www.linkedin.com'
        },
        'class-notice': {
            ios: 'googledocs://docs.google.com',
            android: 'intent://docs.google.com#Intent;scheme=https;package=com.google.android.apps.docs.editors.docs;end',
            web: 'https://docs.google.com'
        },
        'conversation-practice': {
            ios: 'duolingo://course',
            android: 'intent://course#Intent;package=com.duolingo;end',
            web: 'https://www.duolingo.com'
        },
        'study-scheduler': {
            ios: 'todoist://task',
            android: 'intent://task#Intent;package=com.todoist;end',
            web: 'https://todoist.com'
        },
        'mental-care': {
            ios: 'headspace://meditate',
            android: 'intent://meditate#Intent;package=com.headspace.android;end',
            web: 'https://www.headspace.com'
        },
        'webtoon-ideas': {
            ios: 'procreate://create',
            android: 'intent://create#Intent;package=com.adobe.creativeapps.draw;end',
            web: 'https://www.adobe.com/products/fresco.html'
        },
        'video-script': {
            ios: 'finalcut://project',
            android: 'intent://project#Intent;package=com.adobe.premierepro;end',
            web: 'https://www.adobe.com/products/premiere.html'
        },
        'rap-lyrics': {
            ios: 'garageband://create',
            android: 'intent://create#Intent;package=com.bandlab.bandlab;end',
            web: 'https://www.bandlab.com'
        },
        'art-design': {
            ios: 'procreate://create',
            android: 'intent://create#Intent;package=com.adobe.creativeapps.draw;end',
            web: 'https://www.adobe.com/products/fresco.html'
        },
        'school-record': {
            ios: 'googledocs://docs.google.com',
            android: 'intent://docs.google.com#Intent;scheme=https;package=com.google.android.apps.docs.editors.docs;end',
            web: 'https://docs.google.com'
        },
        'performance-assessment': {
            ios: 'googledocs://docs.google.com',
            android: 'intent://docs.google.com#Intent;scheme=https;package=com.google.android.apps.docs.editors.docs;end',
            web: 'https://docs.google.com'
        }
    };

    // Function to detect device type
    function getDeviceType() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return 'ios';
        } else if (/android/i.test(userAgent)) {
            return 'android';
        } else {
            return 'web';
        }
    }

    // Function to attempt deep link with fallback
    function attemptDeepLink(pageId) {
        const links = deepLinks[pageId];
        if (!links) {
            showNotification('해당 기능을 준비 중입니다.', 'info');
            return;
        }

        const deviceType = getDeviceType();
        const deepLinkUrl = links[deviceType] || links.web;

        if (deviceType === 'ios' || deviceType === 'android') {
            // Try to open the app
            const startTime = Date.now();
            
            // Create a hidden iframe to attempt the deep link
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = deepLinkUrl;
            document.body.appendChild(iframe);
            
            // Clean up the iframe after a short delay
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
            
            // Check if the app opened (rough detection)
            setTimeout(() => {
                const endTime = Date.now();
                // If less than 2 seconds passed, likely the app didn't open
                if (endTime - startTime < 2000) {
                    // Fallback to web version
                    window.open(links.web, '_blank');
                    showNotification('웹 버전으로 연결됩니다.', 'info');
                } else {
                    showNotification('앱으로 연결되었습니다.', 'success');
                }
            }, 1500);
        } else {
            // Desktop - open web version directly
            window.open(deepLinkUrl, '_blank');
            showNotification('웹 버전으로 연결됩니다.', 'info');
        }
    }
    
    // Category click handlers - Updated to filter widgets instead of showing separate pages
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const categoryId = this.getAttribute('data-category');
            
            // Add haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            
            // Filter widgets in the main section
            filterWidgetsByCategory(categoryId);
            
            // Scroll to widgets section
            const widgetsSection = document.querySelector('.general-tools-section');
            widgetsSection.scrollIntoView({ behavior: 'smooth' });
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Widget filtering function
    function filterWidgetsByCategory(category) {
        const allWidgets = document.querySelectorAll('.general-tools-section .widget-card');
        
        // Define specific widgets for each category
        const categoryWidgets = {
            'math': [
                'math-helper',           // 수학풀이 도우미
                'math-formula-cards',    // 공식암기 카드
                'graph-visualizer',      // 그래프 시각화
                'wrong-answer-generator' // 오답노트 자동 생성기
            ],
            'english': [
                'english-essay',         // 영어 에세이 첨삭
                'essay-helper',          // 에세이 첨삭 도우미
                'pronunciation-trainer', // 발음 교정기
                'reading-summarizer',    // 독해 요약 훈련
                'conversation-chatbot'   // 영어 회화 챗봇
            ],
            'korean': [
                'text-summarizer',       // 비문학 지문 요약기
                'literature-analyzer',   // 문학작품 해석
                'vocabulary-cards',      // 어휘 학습 카드
                'writing-corrector',     // 작문 첨삭
                'classical-literature',  // 고전 문학 풀이
                'sentence-analyzer'      // 구문 분석기
            ],
            'social': [
                'timeline-generator',    // 연표 생성기
                'concept-comparator',    // 개념 비교표
                'real-world-connector',  // 현실세계 개념 연동
                'map-interpreter'        // 지도 해석 훈련
            ],
            'science': [
                'law-simulator',         // 법칙 시뮬레이터
                'virtual-experiment'     // 가상 실험 체험
            ],
            'etc': [
                'conversation-practice', // 친구와 대화 연습하기
                'mental-care',          // 멘탈케어 위젯
                'webtoon-ideas',        // 웹툰 아이디어 봇
                'video-script',         // 영상 시나리오 작성기
                'rap-lyrics',           // 랩 가사 도우미
                'art-design',           // 그림 디자인 봇
                'birthday-reminder',    // 친구 생일 알림
                'emotion-diary',        // 감정기록 다이어리
                'motivation-messages',  // 동기부여 메시지
                'stress-relief'         // 스트레스 해소 챌린지
            ]
        };
        
        const targetWidgets = categoryWidgets[category];
        
        if (!targetWidgets) {
            console.log('Category not found:', category);
            return;
        }
        
        console.log('Filtering for category:', category, 'Target widgets:', targetWidgets);
        
        let visibleCount = 0;
        allWidgets.forEach((widget) => {
            const widgetPage = widget.getAttribute('data-page');
            
            if (targetWidgets.includes(widgetPage)) {
                // Show widget
                widget.style.display = 'flex';
                widget.classList.remove('hidden');
                widget.classList.add('show');
                visibleCount++;
                console.log('Showing widget:', widgetPage);
            } else {
                // Hide widget
                widget.style.display = 'none';
                widget.classList.add('hidden');
                widget.classList.remove('show');
                console.log('Hiding widget:', widgetPage);
            }
        });
        
        // Show notification
        const categoryNames = {
            'math': '수학',
            'english': '영어', 
            'korean': '국어',
            'social': '사탐',
            'science': '과탐',
            'etc': '학교 생활'
        };
        
        const categoryName = categoryNames[category];
        showNotification(`${categoryName} 관련 도구 ${visibleCount}개를 표시합니다.`, 'info');
        console.log(`Filtered to show ${visibleCount} widgets for ${categoryName}`);
    }
    
    // Add a function to show all widgets
    function showAllWidgets() {
        const allWidgets = document.querySelectorAll('.general-tools-section .widget-card');
        allWidgets.forEach((widget) => {
            widget.style.display = 'flex';
            widget.classList.remove('hidden');
            widget.classList.add('show');
        });
    }
    
    // Initialize with all widgets visible
    setTimeout(() => {
        showAllWidgets();
    }, 1000);
    
    // Widget click handlers with deep link functionality
    widgetCards.forEach(card => {
        card.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page');
            
            // Add haptic feedback (if available)
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Attempt deep link
            attemptDeepLink(pageId);
        });
    });
    
    // Back button handlers
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentPage = this.closest('.page');
            hidePage(currentPage);
        });
    });
    
    // Back to main handlers
    backToMainButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentSection = this.closest('.category-widgets');
            hideCategoryWidgets(currentSection);
        });
    });
    
    // Bottom navigation handlers
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Handle navigation
            const href = this.getAttribute('href');
            handleBottomNavigation(href);
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(30);
            }
        });
    });
    
    // Show category widgets function
    function showCategoryWidgets(section) {
        // Hide dashboard
        dashboard.style.transform = 'translateX(-100%)';
        dashboard.style.opacity = '0';
        
        // Hide bottom navigation
        bottomNav.style.transform = 'translateY(100%)';
        
        setTimeout(() => {
            dashboard.style.display = 'none';
            section.classList.remove('hidden');
            section.classList.add('show');
            
            // Reset scroll position
            section.scrollTop = 0;
        }, 300);
    }
    
    // Hide category widgets function
    function hideCategoryWidgets(section) {
        section.classList.remove('show');
        
        setTimeout(() => {
            section.classList.add('hidden');
            dashboard.style.display = 'block';
            
            // Show dashboard with animation
            setTimeout(() => {
                dashboard.style.transform = 'translateX(0)';
                dashboard.style.opacity = '1';
                
                // Show bottom navigation
                bottomNav.style.transform = 'translateY(0)';
            }, 50);
        }, 300);
    }
    
    // Page transition functions (kept for other navigation)
    function showPage(page) {
        // Hide dashboard
        dashboard.style.transform = 'translateX(-100%)';
        dashboard.style.opacity = '0';
        
        // Hide bottom navigation
        bottomNav.style.transform = 'translateY(100%)';
        
        setTimeout(() => {
            dashboard.style.display = 'none';
            page.classList.remove('hidden');
            page.classList.add('show');
            
            // Reset page scroll position
            page.scrollTop = 0;
        }, 300);
    }
    
    function hidePage(page) {
        page.classList.remove('show');
        
        setTimeout(() => {
            page.classList.add('hidden');
            dashboard.style.display = 'block';
            
            // Show dashboard with animation
            setTimeout(() => {
                dashboard.style.transform = 'translateX(0)';
                dashboard.style.opacity = '1';
                
                // Show bottom navigation
                bottomNav.style.transform = 'translateY(0)';
            }, 50);
        }, 300);
    }
    
    function handleBottomNavigation(href) {
        switch(href) {
            case '#dashboard':
                // Already on dashboard - scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
            case '#search':
                showSearchOverlay();
                break;
            case '#add':
                showAddModal();
                break;
            case '#notifications':
                showNotificationsPanel();
                break;
            case '#profile':
                showProfilePage();
                break;
        }
    }
    
    // Search overlay
    function showSearchOverlay() {
        const searchOverlay = createSearchOverlay();
        document.body.appendChild(searchOverlay);
        
        setTimeout(() => {
            searchOverlay.classList.add('show');
            searchOverlay.querySelector('.search-input').focus();
        }, 50);
    }
    
    function createSearchOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'search-overlay';
        overlay.innerHTML = `
            <div class="search-container">
                <div class="search-header">
                    <button class="search-close"><i class="fas fa-times"></i></button>
                    <input type="text" class="search-input" placeholder="질문, 답변, 주제 검색...">
                </div>
                <div class="search-results">
                    <div class="search-suggestions">
                        <h4>인기 검색어</h4>
                        <div class="suggestion-tags">
                            <span class="suggestion-tag">React 훅</span>
                            <span class="suggestion-tag">JavaScript</span>
                            <span class="suggestion-tag">CSS Grid</span>
                            <span class="suggestion-tag">Node.js</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Close overlay handlers
        const closeBtn = overlay.querySelector('.search-close');
        closeBtn.addEventListener('click', () => closeSearchOverlay(overlay));
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeSearchOverlay(overlay);
            }
        });
        
        return overlay;
    }
    
    function closeSearchOverlay(overlay) {
        overlay.classList.remove('show');
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
    
    // Add modal
    function showAddModal() {
        const addModal = createAddModal();
        document.body.appendChild(addModal);
        
        setTimeout(() => {
            addModal.classList.add('show');
        }, 50);
    }
    
    function createAddModal() {
        const modal = document.createElement('div');
        modal.className = 'add-modal';
        modal.innerHTML = `
            <div class="modal-container">
                <div class="modal-header">
                    <h3>무엇을 추가하시겠어요?</h3>
                    <button class="modal-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-content">
                    <div class="add-options">
                        <button class="add-option" data-type="question">
                            <i class="fas fa-question-circle"></i>
                            <span>질문하기</span>
                        </button>
                        <button class="add-option" data-type="answer">
                            <i class="fas fa-lightbulb"></i>
                            <span>답변 공유</span>
                        </button>
                        <button class="add-option" data-type="topic">
                            <i class="fas fa-plus-circle"></i>
                            <span>주제 생성</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Close modal handlers
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => closeAddModal(modal));
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAddModal(modal);
            }
        });
        
        // Add option handlers
        const addOptions = modal.querySelectorAll('.add-option');
        addOptions.forEach(option => {
            option.addEventListener('click', () => {
                const type = option.getAttribute('data-type');
                const typeNames = {
                    'question': '질문',
                    'answer': '답변',
                    'topic': '주제'
                };
                showNotification(`${typeNames[type]} 작성 페이지를 여는 중...`, 'info');
                closeAddModal(modal);
            });
        });
        
        return modal;
    }
    
    function closeAddModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    // Notifications panel
    function showNotificationsPanel() {
        const notificationsPanel = createNotificationsPanel();
        document.body.appendChild(notificationsPanel);
        
        setTimeout(() => {
            notificationsPanel.classList.add('show');
        }, 50);
    }
    
    function createNotificationsPanel() {
        const panel = document.createElement('div');
        panel.className = 'notifications-panel';
        panel.innerHTML = `
            <div class="panel-container">
                <div class="panel-header">
                    <h3>알림</h3>
                    <button class="panel-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="panel-content">
                    <div class="notification-item">
                        <div class="notification-icon">
                            <i class="fas fa-star"></i>
                        </div>
                        <div class="notification-content">
                            <p>내 답변이 5개의 새로운 추천을 받았습니다</p>
                            <span class="notification-time">2시간 전</span>
                        </div>
                    </div>
                    <div class="notification-item">
                        <div class="notification-icon">
                            <i class="fas fa-comment"></i>
                        </div>
                        <div class="notification-content">
                            <p>내 질문에 새로운 댓글이 달렸습니다</p>
                            <span class="notification-time">4시간 전</span>
                        </div>
                    </div>
                    <div class="notification-item">
                        <div class="notification-icon">
                            <i class="fas fa-user-plus"></i>
                        </div>
                        <div class="notification-content">
                            <p>새로운 팔로워 3명</p>
                            <span class="notification-time">1일 전</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Close panel handlers
        const closeBtn = panel.querySelector('.panel-close');
        closeBtn.addEventListener('click', () => closeNotificationsPanel(panel));
        
        panel.addEventListener('click', (e) => {
            if (e.target === panel) {
                closeNotificationsPanel(panel);
            }
        });
        
        return panel;
    }
    
    function closeNotificationsPanel(panel) {
        panel.classList.remove('show');
        setTimeout(() => {
            panel.remove();
        }, 300);
    }
    
    // Profile page
    function showProfilePage() {
        showNotification('프로필 페이지를 여는 중...', 'info');
    }
    
    // Header action handlers
    const notificationBtn = document.querySelector('.notification-btn');
    const profileBtn = document.querySelector('.profile-btn');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', showNotificationsPanel);
    }
    
    if (profileBtn) {
        profileBtn.addEventListener('click', showProfilePage);
    }
    
    // Swipe gestures for mobile
    let startX = 0;
    let startY = 0;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        // Check if it's a horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            const currentPage = document.querySelector('.page.show');
            
            // Swipe right to go back
            if (deltaX > 0 && currentPage) {
                const backBtn = currentPage.querySelector('.back-btn');
                if (backBtn) {
                    backBtn.click();
                }
            }
        }
    }, { passive: true });
    
    // Initialize animations
    setTimeout(() => {
        const animatedElements = document.querySelectorAll('.widget-card');
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 500);
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.toast-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `toast-notification toast-${type}`;
    notification.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}"></i>
            </div>
            <span class="toast-message">${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// Add dynamic styles for overlays and modals
const dynamicStyles = `
    /* Search Overlay */
    .search-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        z-index: 3000;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .search-overlay.show {
        opacity: 1;
    }
    
    .search-container {
        max-width: 400px;
        margin: 0 auto;
        padding: 20px;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    
    .search-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 24px;
        margin-top: 60px;
    }
    
    .search-close {
        background: rgba(255, 85, 0, 0.1);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FF5500;
        cursor: pointer;
    }
    
    .search-input {
        flex: 1;
        background: rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 12px;
        padding: 12px 16px;
        color: #333333;
        font-size: 1rem;
    }
    
    .search-input::placeholder {
        color: #999999;
    }
    
    .search-input:focus {
        outline: none;
        border-color: #FF5500;
    }
    
    .search-suggestions h4 {
        color: #333333;
        margin-bottom: 12px;
        font-size: 1rem;
    }
    
    .suggestion-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }
    
    .suggestion-tag {
        background: rgba(255, 85, 0, 0.1);
        color: #FF5500;
        padding: 6px 12px;
        border-radius: 16px;
        font-size: 0.85rem;
        cursor: pointer;
        border: 1px solid rgba(255, 85, 0, 0.2);
    }
    
    .suggestion-tag:hover {
        background: rgba(255, 85, 0, 0.2);
    }
    
    /* Add Modal */
    .add-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(20px);
        z-index: 3000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .add-modal.show {
        opacity: 1;
    }
    
    .modal-container {
        background: #ffffff;
        border-radius: 20px;
        padding: 24px;
        max-width: 320px;
        width: 90%;
        border: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .modal-header h3 {
        color: #333333;
        font-size: 1.25rem;
    }
    
    .modal-close {
        background: none;
        border: none;
        color: #999999;
        font-size: 1.2rem;
        cursor: pointer;
    }
    
    .modal-close:hover {
        color: #FF5500;
    }
    
    .add-options {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    .add-option {
        background: rgba(255, 85, 0, 0.05);
        border: 1px solid rgba(255, 85, 0, 0.1);
        border-radius: 12px;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        color: #333333;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .add-option:hover {
        background: rgba(255, 85, 0, 0.1);
        border-color: rgba(255, 85, 0, 0.3);
    }
    
    .add-option i {
        color: #FF5500;
        font-size: 1.2rem;
    }
    
    /* Notifications Panel */
    .notifications-panel {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        max-width: 400px;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        border-left: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);
    }
    
    .notifications-panel.show {
        transform: translateX(0);
    }
    
    .panel-container {
        padding: 20px;
        height: 100%;
        overflow-y: auto;
    }
    
    .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        margin-top: 40px;
    }
    
    .panel-header h3 {
        color: #333333;
        font-size: 1.5rem;
    }
    
    .panel-close {
        background: rgba(255, 85, 0, 0.1);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FF5500;
        cursor: pointer;
    }
    
    .panel-close:hover {
        background: rgba(255, 85, 0, 0.2);
    }
    
    .notification-item {
        display: flex;
        align-items: center;
        gap: 12px;
        background: #ffffff;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 12px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    
    .notification-icon {
        width: 36px;
        height: 36px;
        background: rgba(255, 85, 0, 0.1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FF5500;
        flex-shrink: 0;
    }
    
    .notification-content p {
        color: #333333;
        font-size: 0.9rem;
        margin-bottom: 2px;
    }
    
    .notification-time {
        color: #999999;
        font-size: 0.75rem;
    }
    
    /* Toast Notifications */
    .toast-notification {
        position: fixed;
        top: 80px;
        right: 20px;
        background: #ffffff;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 12px;
        padding: 12px 16px;
        z-index: 4000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        backdrop-filter: blur(20px);
        max-width: 300px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .toast-notification.show {
        transform: translateX(0);
    }
    
    .toast-content {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .toast-icon {
        color: #FF5500;
    }
    
    .toast-message {
        color: #333333;
        font-size: 0.85rem;
        line-height: 1.3;
    }
    
    .toast-success {
        border-color: rgba(76, 175, 80, 0.3);
        background: rgba(76, 175, 80, 0.05);
    }
    
    .toast-error {
        border-color: rgba(244, 67, 54, 0.3);
        background: rgba(244, 67, 54, 0.05);
    }
    
    .toast-success .toast-icon {
        color: #4CAF50;
    }
    
    .toast-error .toast-icon {
        color: #f44336;
    }
`;

// Inject dynamic styles
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet); 