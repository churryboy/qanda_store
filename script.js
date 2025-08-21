// Mobile App Navigation System
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    const dashboard = document.querySelector('.dashboard');
    const widgetCards = document.querySelectorAll('.widget-card');
    const categoryCards = document.querySelectorAll('.category-card');
    const navItems = document.querySelectorAll('.nav-item');
    const bottomNav = document.querySelector('.bottom-nav');
    
    console.log('Found category cards:', categoryCards.length);
    console.log('Found widget cards:', widgetCards.length);
    
    // Widget filtering function
    function filterWidgetsByCategory(category) {
        console.log('Starting filter for category:', category);
        
        const allWidgets = document.querySelectorAll('.general-tools-section .widget-card');
        console.log('Found widgets to filter:', allWidgets.length);
        
        // Define specific widgets for each category
        const categoryWidgets = {
            'math': [
                'math-helper',           // 수학풀이 도우미
                'math-formula-cards',    // 공식암기 카드
                'graph-visualizer',      // 그래프 시각화
                'wrong-answer-generator', // 오답노트 자동 생성기
                'integral-graph',        // 적분 그래프 시각화
                'limit-simulator',       // 극한 시뮬레이터
                'probability-simulator', // 확률 시뮬레이터
                'normal-distribution',   // 정규분포 계산기
                'sequence-helper',       // 수열 도우미
                'set-proposition-quiz',  // 집합 명제 퀴즈
                'trigonometry-visualizer' // 삼각비 시각화
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
                'map-interpreter',       // 지도 해석 훈련
                'person-event-matching', // 인물사건 매칭 퀴즈
                'historical-source-interpreter', // 사료 해석기
                'cultural-heritage-guide', // 시대별 문화재 도감
                'ethics-philosopher-cards', // 윤리 사상가 카드
                'ideology-comparison',   // 사상 비교표
                'ethics-dilemma-discussion', // 윤리 딜레마 토론
                'social-constitution-summary-cards', // 헌법 요약 카드
                'precedent-learner',     // 판례 학습기
                'political-system-comparison' // 정치제도 비교표
            ],
            'science': [
                'law-simulator',         // 법칙 시뮬레이터
                'virtual-experiment',    // 가상 실험 체험
                'electric-circuit-sim',  // 전기 회로 시뮬레이터
                'optics-simulator',      // 광학 시뮬레이터
                'celestial-simulator',   // 천체 시뮬레이터
                'volcano-simulator',     // 화산 시뮬레이터
                'mineral-guide',         // 광물 도감
                'space-exploration-timeline', // 우주 탐사 연대표
                'cell-3d-viewer',        // 세포 구조 3D 뷰어
                'human-body-simulator',  // 인체 시스템 시뮬레이터
                'taxonomy-quiz',         // 계통도 퀴즈
                'chemical-formula-completer', // 화학식 자동 완성기
                'periodic-table-explorer' // 주기율표 탐색기
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
        console.log('Target widgets for', category, ':', targetWidgets);
        
        if (!targetWidgets) {
            console.log('No widgets found for category:', category);
            return;
        }
        
        let visibleCount = 0;
        let hiddenCount = 0;
        
        allWidgets.forEach((widget) => {
            const widgetPage = widget.getAttribute('data-page');
            console.log('Checking widget:', widgetPage);
            
            if (targetWidgets.includes(widgetPage)) {
                // Show widget
                widget.style.display = '';
                widget.style.opacity = '1';
                visibleCount++;
                console.log('✓ Showing widget:', widgetPage);
            } else {
                // Hide widget
                widget.style.display = 'none';
                widget.style.opacity = '0';
                hiddenCount++;
                console.log('✗ Hiding widget:', widgetPage);
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
        console.log(`Filter complete: ${visibleCount} shown, ${hiddenCount} hidden for ${categoryName}`);
    }
    
    // Category click handlers
    categoryCards.forEach((card, index) => {
        console.log(`Setting up category card ${index}:`, card.getAttribute('data-category'));
        
        card.addEventListener('click', function() {
            const categoryId = this.getAttribute('data-category');
            console.log('Category clicked:', categoryId);
            
            // Add haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            
            // Filter widgets in the main section
            filterWidgetsByCategory(categoryId);
            
            // Scroll to widgets section
            const widgetsSection = document.querySelector('.general-tools-section');
            if (widgetsSection) {
                widgetsSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Widget click handlers
    widgetCards.forEach(card => {
        card.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page');
            const title = this.querySelector('.widget-title').textContent;
            
            // Add haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Log action
            console.log(`${title} 기능을 실행합니다.`);
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
    
    function handleBottomNavigation(href) {
        switch(href) {
            case '#dashboard':
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
            case '#search':
                console.log('검색 기능을 준비 중입니다.');
                break;
            case '#add':
                console.log('추가 기능을 준비 중입니다.');
                break;
            case '#notifications':
                console.log('알림 기능을 준비 중입니다.');
                break;
            case '#profile':
                console.log('프로필 페이지를 여는 중...');
                break;
        }
    }
    
    // Reset function to show all widgets
    function showAllWidgets() {
        const allWidgets = document.querySelectorAll('.general-tools-section .widget-card');
        allWidgets.forEach((widget) => {
            widget.style.display = '';
            widget.style.opacity = '1';
        });
        console.log('All widgets shown');
    }
    
    // Make functions available globally for testing
    window.testFilter = function(category) {
        console.log('Testing filter for:', category);
        filterWidgetsByCategory(category);
    };
    
    window.showAll = function() {
        showAllWidgets();
    };
    
    // Initialize with all widgets visible
    setTimeout(() => {
        showAllWidgets();
    }, 500);
});

 