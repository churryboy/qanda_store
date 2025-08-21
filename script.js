// Mobile App Navigation System
console.log('Script.js loaded');

// Test if functions are accessible globally
window.addEventListener('load', function() {
    console.log('Window loaded - checking functions:');
    console.log('filterWidgetsByCategory exists?', typeof window.filterWidgetsByCategory);
    console.log('testFilter exists?', typeof window.testFilter);
    console.log('showAll exists?', typeof window.showAll);
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    const dashboard = document.querySelector('.dashboard');
    const widgetCards = document.querySelectorAll('.widget-card');
    const categoryCards = document.querySelectorAll('.category-card');
    const navItems = document.querySelectorAll('.nav-item');
    const bottomNav = document.querySelector('.bottom-nav');
    
    console.log('=== Initial Element Count ===');
    console.log('Found category cards:', categoryCards.length);
    console.log('Found widget cards (all):', widgetCards.length);
    console.log('Found widgets in general-tools-section:', document.querySelectorAll('.general-tools-section .widget-card').length);
    console.log('General tools section exists?', !!document.querySelector('.general-tools-section'));
    
    // Debug: Show all category data attributes
    categoryCards.forEach((card, index) => {
        console.log(`Category card ${index}:`, card.getAttribute('data-category'));
    });
    
    // Widget filtering function - make it globally accessible
    window.filterWidgetsByCategory = function(category) {
        console.log('=== filterWidgetsByCategory called ===');
        console.log('Category:', category);
        
        const allWidgets = document.querySelectorAll('.general-tools-section .widget-card');
        console.log('Found widgets to filter:', allWidgets.length);
        
        if (allWidgets.length === 0) {
            console.error('No widgets found! Check selector: .general-tools-section .widget-card');
            return;
        }
        
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
        
        allWidgets.forEach((widget, index) => {
            const widgetPage = widget.getAttribute('data-page');
            const widgetTitle = widget.querySelector('.widget-title')?.textContent;
            console.log(`Widget ${index}: data-page="${widgetPage}", title="${widgetTitle}"`);
            
            if (targetWidgets.includes(widgetPage)) {
                // Show widget
                widget.style.display = 'flex';
                widget.style.opacity = '1';
                widget.style.visibility = 'visible';
                widget.style.position = 'relative';
                widget.classList.remove('hidden');
                widget.classList.add('visible');
                visibleCount++;
                console.log('✓ Showing widget:', widgetPage);
            } else {
                // Hide widget
                widget.style.display = 'none';
                widget.style.opacity = '0';
                widget.style.visibility = 'hidden';
                widget.style.position = 'absolute';
                widget.classList.add('hidden');
                widget.classList.remove('visible');
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
    };
    
    // Category click handlers
    categoryCards.forEach((card, index) => {
        const dataCategory = card.getAttribute('data-category');
        console.log(`Setting up category card ${index}: data-category="${dataCategory}"`);
        
        card.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('=== Category Card Clicked ===');
            const categoryId = this.getAttribute('data-category');
            console.log('Category ID:', categoryId);
            console.log('This element:', this);
            
            // Add haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            
            // Filter widgets in the main section
            console.log('About to call filterWidgetsByCategory with:', categoryId);
            try {
                window.filterWidgetsByCategory(categoryId);
            } catch (error) {
                console.error('Error calling filterWidgetsByCategory:', error);
            }
            
            // Scroll to widgets section
            const widgetsSection = document.querySelector('.general-tools-section');
            if (widgetsSection) {
                widgetsSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Mark this category as active
            categoryCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Widget descriptions
    const widgetDescriptions = {
        'exam-summary': '📚 시험 범위의 핵심 내용을 자동으로 요약하여 효율적인 복습을 도와주는 똑똑한 도구입니다! 교과서와 강의 내용을 꼼꼼히 분석하여 중요한 개념들만 골라서 정리해드려요. 시험 전날 밤샘 공부는 이제 그만! ✨ 핵심만 콕콕 집어서 공부 시간을 단축시켜보세요.',
        'english-essay': '✍️ 영어 에세이의 문법, 구조, 표현력을 종합적으로 분석하고 개선점을 제안하는 전문 첨삭 도구입니다! 원어민처럼 자연스러운 표현을 위한 팁부터 논리적인 글 구성까지 모든 것을 도와드려요. 🎯 영어 글쓰기 실력이 눈에 띄게 향상될 거예요!',
        'math-helper': '🧮 수학 문제를 단계별로 풀어주고 각 과정을 상세히 설명하는 든든한 도우미입니다! 복잡한 계산 과정도 이해하기 쉽게 차근차근 설명해드려요. 💡 "아하!" 하는 순간이 연속으로 찾아올 거예요. 수학이 이렇게 재미있었나 싶을 정도로요!',
        'flashcard': '🎴 학습 내용을 예쁜 암기카드로 만들어 효과적인 반복학습을 도와주는 스마트한 도구입니다! 지루한 암기는 이제 안녕~ 게임하듯 재미있게 외워보세요. 🌟 뇌과학에 기반한 최적의 반복 주기로 장기기억까지 완벽하게 만들어드릴게요!',
        'club-report': '📝 동아리 활동 보고서 작성을 위한 완벽한 구조와 알찬 내용을 제안하는 도구입니다! 뭘 써야 할지 막막했던 순간은 이제 끝이에요. 🚀 선생님들이 감탄할 만한 체계적이고 임팩트 있는 보고서를 작성해보세요!',
        'personal-statement': '💼 자기소개서 작성을 위한 전문적인 가이드라인과 합격 예시를 제공하는 필수 도구입니다! 나만의 스토리를 어떻게 어필할지 고민이셨나요? ✨ 입학사정관들의 마음을 사로잡는 매력적인 자소서를 완성해보세요!',
        'interview-practice': '🎤 면접에서 자주 나오는 핵심 질문들과 모범 답안을 실전처럼 연습할 수 있는 도구입니다! 떨리는 마음을 자신감으로 바꿔드려요. 💪 면접관 앞에서도 당당하게 자신을 어필할 수 있도록 완벽하게 준비해보세요!',
        'career-explorer': '🌈 다양한 진로와 직업에 대한 생생한 정보를 탐색하고 나만의 적성을 정확히 분석하는 도구입니다! 미래가 막막하게 느껴지시나요? 🔍 숨겨진 나의 재능을 발견하고 꿈의 직업을 찾아보세요!',
        'class-notice': '📢 학급 공지사항을 깔끔하게 요약하고 중요한 내용만 쏙쏙 정리해주는 똑똑한 도구입니다! 긴 공지문을 읽기 귀찮으셨죠? 🎯 핵심만 빠르게 파악하고 놓치는 일정 없이 학교생활을 완벽하게 관리해보세요!',
        'conversation-practice': '💬 친구들과의 대화 상황을 다양하게 연습하고 소통 능력을 자연스럽게 기를 수 있는 도구입니다! 어색한 침묵이 무서우셨나요? 😊 재미있는 대화 주제부터 깊이 있는 토론까지, 인싸가 되는 비법을 알려드릴게요!',
        'study-scheduler': '📅 개인 맞춤형 학습 일정을 체계적으로 계획하고 스마트하게 관리하는 AI 스케줄러입니다! 계획은 세웠는데 지키기 어려우셨죠? ⚡ 나만의 학습 패턴을 분석해서 실현 가능한 완벽한 스케줄을 만들어드려요!',
        'mental-care': '🧘‍♀️ 학습 스트레스 관리와 정신건강 케어를 위한 힐링 도구입니다! 공부 때문에 마음이 답답하고 지치셨나요? 💚 전문적인 멘탈 케어 방법부터 간단한 힐링 활동까지, 건강한 마음으로 공부할 수 있도록 도와드려요!',
        'webtoon-ideas': '🎨 창작 웹툰을 위한 기발한 스토리와 매력적인 캐릭터 아이디어를 무한 생성하는 도구입니다! 그림은 잘 그리는데 스토리가 막막하셨나요? 💫 독자들이 열광할 만한 창의적인 아이디어들을 쏟아내드릴게요!',
        'video-script': '영상 제작을 위한 시나리오 작성을 도와주는 도구입니다.',
        'rap-lyrics': '랩 가사 창작을 위한 운율과 리듬을 분석하고 제안하는 도구입니다.',
        'art-design': '그림과 디자인 작업을 위한 아이디어와 기법을 제안하는 도구입니다.',
        'school-record': '생활기록부 관리와 작성을 도와주는 도구입니다.',
        'performance-assessment': '수행평가 과제 수행을 체계적으로 지원하는 도구입니다.',
        'math-formula-cards': '수학 공식들을 카드 형태로 정리하여 효과적으로 암기할 수 있는 도구입니다.',
        'graph-visualizer': '수학 함수의 그래프를 시각화하여 이해를 돕는 도구입니다.',
        'wrong-answer-generator': '틀린 문제들을 자동으로 정리하고 복습 계획을 세우는 도구입니다.',
        'essay-helper': '영어 에세이 작성을 위한 구조와 표현을 개선해주는 도구입니다.',
        'pronunciation-trainer': '정확한 영어 발음을 연습하고 교정받을 수 있는 도구입니다.',
        'reading-summarizer': '영어 지문을 읽고 핵심 내용을 요약하는 연습을 도와주는 도구입니다.',
        'conversation-chatbot': 'AI와 영어로 대화하며 회화 실력을 향상시키는 도구입니다.',
        'text-summarizer': '비문학 지문의 긴 내용을 핵심만 추려서 요약해주는 도구입니다.',
        'literature-analyzer': '문학작품을 분석하고 해석하는 방법을 가르쳐주는 도구입니다.',
        'vocabulary-cards': '국어 어휘력 향상을 위한 단어카드 학습 도구입니다.',
        'writing-corrector': '국어 작문 실력 향상을 위한 첨삭 도구입니다.',
        'classical-literature': '고전 문학 작품을 이해하기 쉽게 해석해주는 도구입니다.',
        'sentence-analyzer': '문장의 구조와 문법을 분석하여 이해를 돕는 도구입니다.',
        'timeline-generator': '역사적 사건들을 시간순으로 정리한 연표를 자동으로 생성하는 도구입니다.',
        'concept-comparator': '사회과목의 다양한 개념들을 비교 분석하여 정리해주는 도구입니다.',
        'real-world-connector': '이론적 개념을 현실 세계의 사례와 연결하여 이해를 돕는 도구입니다.',
        'map-interpreter': '지리 지도를 해석하고 분석하는 방법을 가르쳐주는 도구입니다.',
        'law-simulator': '과학 법칙들을 시뮬레이션으로 체험하고 이해할 수 있는 도구입니다.',
        'virtual-experiment': '실험실에서 직접 할 수 없는 실험들을 가상으로 체험하는 도구입니다.',
        'birthday-reminder': '친구들의 생일을 기억하고 관리하는 도구입니다.',
        'emotion-diary': '하루의 감정 상태를 기록하고 분석하는 다이어리입니다.',
        'motivation-messages': '학습 동기를 부여하는 격려 메시지를 매일 제공하는 도구입니다.',
        'stress-relief': '학습 스트레스를 해소하는 다양한 활동을 제안하는 도구입니다.',
        'integral-graph': '📈 적분 함수의 아름다운 그래프를 실시간으로 시각화하여 어려운 적분 개념을 한눈에 이해할 수 있게 도와주는 마법 같은 도구입니다! 복잡한 수식이 눈앞에서 생동감 있는 그래프로 변신해요. 🎯 이제 적분이 이렇게 직관적이었나 싶을 거예요!',
        'limit-simulator': '♾️ 극한값 계산의 신비로운 과정을 생생한 시뮬레이션으로 보여주는 혁신적인 도구입니다! 무한대로 다가가는 과정을 눈으로 직접 확인할 수 있어요. 🔍 추상적이었던 극한 개념이 concrete하게 이해될 거예요!',
        'probability-simulator': '🎲 확률과 통계의 흥미진진한 세계를 다양한 시뮬레이션으로 체험할 수 있는 재미있는 도구입니다! 주사위 던지기부터 복잡한 확률 계산까지 모든 것을 게임처럼 즐겨보세요. 🎯 확률이 이렇게 재미있었나 새롭게 느끼실 거예요!',
        'normal-distribution': '📊 정규분포의 우아한 종 모양 곡선을 계산하고 아름답게 시각화하는 전문 도구입니다! 통계의 핵심인 정규분포를 완벽하게 마스터해보세요. 📈 데이터 분석의 기초부터 고급 통계까지 모든 것이 명확해질 거예요!',
        'sequence-helper': '🔢 수열의 숨겨진 패턴을 찾아내고 일반항을 구하는 과정을 단계별로 친절하게 도와주는 똑똑한 도구입니다! 복잡해 보이는 수열도 규칙을 찾으면 간단해져요. ✨ 수학적 사고력이 한 단계 업그레이드될 거예요!',
        'set-proposition-quiz': '🧩 집합과 명제의 논리적 세계를 퀴즈로 재미있게 탐험하며 사고력을 기르는 도구입니다! 어려운 논리 문제도 게임하듯 풀어보세요. 🎮 논리적 추론 능력이 놀랍도록 향상될 거예요!',
        'trigonometry-visualizer': '📐 삼각함수의 아름다운 파동을 시각화하여 삼각비 개념을 직관적으로 이해할 수 있게 도와주는 환상적인 도구입니다! 추상적이었던 sin, cos, tan이 생동감 있는 그래프로 살아나요. 🌊 삼각함수가 이렇게 아름다웠나 감탄하실 거예요!',
        'electric-circuit-sim': '전기 회로의 동작 원리를 시뮬레이션으로 체험하는 도구입니다.',
        'optics-simulator': '빛의 반사, 굴절 현상을 시뮬레이션으로 관찰할 수 있는 도구입니다.',
        'celestial-simulator': '천체의 운동과 우주 현상을 시뮬레이션으로 체험하는 도구입니다.',
        'volcano-simulator': '화산 활동과 지질 현상을 시뮬레이션으로 학습하는 도구입니다.',
        'mineral-guide': '다양한 광물의 특성과 분류 방법을 학습하는 도감입니다.',
        'space-exploration-timeline': '인류의 우주 탐사 역사를 연대기로 정리한 도구입니다.',
        'cell-3d-viewer': '세포의 구조를 3D로 시각화하여 관찰할 수 있는 도구입니다.',
        'human-body-simulator': '인체의 다양한 기관 시스템을 시뮬레이션으로 학습하는 도구입니다.',
        'taxonomy-quiz': '생물의 분류 체계를 학습하고 연습하는 퀴즈 도구입니다.',
        'chemical-formula-completer': '화학 반응식의 균형을 자동으로 맞춰주는 도구입니다.',
        'periodic-table-explorer': '주기율표의 원소들을 탐색하고 특성을 학습하는 도구입니다.',
        'person-event-matching': '역사적 인물과 사건을 연결하여 학습하는 퀴즈 도구입니다.',
        'historical-source-interpreter': '역사 사료를 분석하고 해석하는 방법을 가르쳐주는 도구입니다.',
        'cultural-heritage-guide': '시대별 문화재를 분류하고 특징을 학습하는 도감입니다.',
        'ethics-philosopher-cards': '다양한 윤리 사상가들과 그들의 사상을 학습하는 카드 도구입니다.',
        'ideology-comparison': '여러 사상과 이념을 비교 분석하여 정리해주는 도구입니다.',
        'ethics-dilemma-discussion': '윤리적 딜레마 상황을 토론하며 도덕적 판단력을 기르는 도구입니다.',
        'social-constitution-summary-cards': '헌법 조항들을 요약하여 카드 형태로 학습하는 도구입니다.',
        'precedent-learner': '중요한 법적 판례들을 학습하고 분석하는 도구입니다.',
        'political-system-comparison': '다양한 정치제도를 비교하고 분석하는 도구입니다.'
    };

    // Widget click handlers - Show survey modal
    widgetCards.forEach(card => {
        card.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page');
            const title = this.querySelector('.widget-title').textContent;
            const description = widgetDescriptions[pageId] || '이 위젯에 대한 자세한 설명을 준비 중입니다.';
            
            // Add haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Show survey modal
            showSurveyModal(title, description, pageId);
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
            widget.style.display = 'flex';
            widget.style.opacity = '1';
            widget.style.visibility = 'visible';
            widget.style.position = 'relative';
            widget.classList.remove('hidden');
            widget.classList.add('visible');
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
    

    
    // Initialize with all widgets hidden
    function hideAllWidgets() {
        const allWidgets = document.querySelectorAll('.general-tools-section .widget-card');
        allWidgets.forEach((widget) => {
            widget.style.display = 'none';
            widget.style.opacity = '0';
            widget.style.visibility = 'hidden';
            widget.style.position = 'absolute';
            widget.classList.add('hidden');
            widget.classList.remove('visible');
        });
        console.log('All widgets hidden on initial load');
    }
    
    // Survey modal functions
    function showSurveyModal(title, description, pageId) {
        const modal = document.getElementById('survey-modal');
        const modalTitle = document.getElementById('modal-widget-title');
        const modalDescription = document.getElementById('modal-widget-description');
        
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modal.classList.add('show');
        
        // Reset all radio buttons
        const radioButtons = modal.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => radio.checked = false);
        
        console.log(`Survey modal opened for: ${title}`);
    }
    
    function closeSurveyModal() {
        const modal = document.getElementById('survey-modal');
        modal.classList.remove('show');
        console.log('Survey modal closed');
    }
    
    function submitSurvey() {
        const modal = document.getElementById('survey-modal');
        const title = document.getElementById('modal-widget-title').textContent;
        
        // Collect survey responses
        const frequency = modal.querySelector('input[name="frequency"]:checked')?.value;
        const helpfulness = modal.querySelector('input[name="helpfulness"]:checked')?.value;
        const need = modal.querySelector('input[name="need"]:checked')?.value;
        
        if (!frequency || !helpfulness || !need) {
            alert('모든 질문에 답변해주세요.');
            return;
        }
        
        // Log survey results
        console.log('Survey submitted for:', title);
        console.log('Responses:', { frequency, helpfulness, need });
        
        // Show thank you message
        alert('설문에 참여해주셔서 감사합니다! 소중한 의견이 반영될 예정입니다.');
        
        closeSurveyModal();
    }
    
    // Modal event listeners
    const closeModalBtn = document.getElementById('close-modal');
    const submitSurveyBtn = document.getElementById('submit-survey');
    const cancelSurveyBtn = document.getElementById('cancel-survey');
    const modalOverlay = document.getElementById('survey-modal');
    
    closeModalBtn.addEventListener('click', closeSurveyModal);
    submitSurveyBtn.addEventListener('click', submitSurvey);
    cancelSurveyBtn.addEventListener('click', closeSurveyModal);
    
    // Close modal when clicking outside
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeSurveyModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('survey-modal');
            if (modal.classList.contains('show')) {
                closeSurveyModal();
            }
        }
    });

    setTimeout(() => {
        hideAllWidgets();
    }, 500);
});

 