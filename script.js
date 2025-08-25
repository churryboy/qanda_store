// User Session Management System
class UserSession {
    constructor() {
        this.userData = null;
        this.sessionKey = 'qanda_user_session';
        this.init();
    }
    
    init() {
        // Load user data from localStorage on page load
        this.loadUserData();
        console.log('🔧 UserSession initialized:', this.userData);
    }
    
    setUser(name, grade, phone = '') {
        // Generate unique user ID
        const uniqueUserId = this.generateUniqueUserId(name, grade);
        
        this.userData = {
            userId: uniqueUserId,
            name: name,
            grade: grade,
            phone: phone,
            timestamp: new Date().toISOString(),
            sessionId: this.generateSessionId()
        };
        
        // Store in multiple places for redundancy
        localStorage.setItem(this.sessionKey, JSON.stringify(this.userData));
        localStorage.setItem('userName', name);
        localStorage.setItem('userGrade', grade);
        localStorage.setItem('userPhone', phone);
        localStorage.setItem('userId', uniqueUserId); // Store unique ID separately
        localStorage.setItem('hasVisited', 'true');
        
        console.log('👤 User session created with unique ID:', this.userData);
        console.log('💾 Stored in localStorage:', {
            sessionData: localStorage.getItem(this.sessionKey),
            userName: localStorage.getItem('userName'),
            userGrade: localStorage.getItem('userGrade'),
            userPhone: localStorage.getItem('userPhone'),
            userId: localStorage.getItem('userId')
        });
        
        return this.userData;
    }
    
    loadUserData() {
        try {
            // Try to load from session first
            const sessionData = localStorage.getItem(this.sessionKey);
            if (sessionData) {
                this.userData = JSON.parse(sessionData);
                
                // Ensure userId exists (backward compatibility)
                if (!this.userData.userId && this.userData.name && this.userData.grade) {
                    this.userData.userId = this.generateUniqueUserId(this.userData.name, this.userData.grade);
                    localStorage.setItem(this.sessionKey, JSON.stringify(this.userData));
                    localStorage.setItem('userId', this.userData.userId);
                    console.log('🔄 Generated missing userId for existing session:', this.userData.userId);
                }
                
                console.log('📖 Loaded user session from localStorage:', this.userData);
                return this.userData;
            }
            
            // Fallback to individual items
            const name = localStorage.getItem('userName');
            const grade = localStorage.getItem('userGrade');
            const phone = localStorage.getItem('userPhone') || '';
            let userId = localStorage.getItem('userId');
            
            if (name && grade) {
                // Generate userId if it doesn't exist
                if (!userId) {
                    userId = this.generateUniqueUserId(name, grade);
                    localStorage.setItem('userId', userId);
                    console.log('🆔 Generated new userId for existing user:', userId);
                }
                
                this.userData = {
                    userId: userId,
                    name: name,
                    grade: grade,
                    phone: phone,
                    timestamp: new Date().toISOString(),
                    sessionId: this.generateSessionId()
                };
                
                console.log('📖 Reconstructed user session with userId:', this.userData);
                // Save the reconstructed session
                localStorage.setItem(this.sessionKey, JSON.stringify(this.userData));
                return this.userData;
            }
            
            console.log('❌ No user session found');
            return null;
        } catch (error) {
            console.error('❌ Error loading user data:', error);
            return null;
        }
    }
    
    getUser() {
        if (!this.userData) {
            this.loadUserData();
        }
        return this.userData;
    }
    
    isLoggedIn() {
        const user = this.getUser();
        const isValid = user && user.name && user.grade;
        console.log('🔍 User session check:', { 
            user: user, 
            isValid: isValid 
        });
        return isValid;
    }
    
    clearSession() {
        this.userData = null;
        localStorage.removeItem(this.sessionKey);
        localStorage.removeItem('userName');
        localStorage.removeItem('userGrade');
        localStorage.removeItem('userPhone');
        localStorage.removeItem('userId');
        localStorage.removeItem('hasVisited');
        console.log('🗑️ User session cleared');
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateUniqueUserId(name, grade) {
        // Create a more robust unique ID
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        const nameHash = this.simpleHash(name);
        const gradeHash = this.simpleHash(grade);
        
        const userId = `user_${nameHash}_${gradeHash}_${timestamp}_${random}`;
        
        console.log('🆔 Generating unique user ID:');
        console.log('   📝 Name:', name, '→ Hash:', nameHash);
        console.log('   🎓 Grade:', grade, '→ Hash:', gradeHash);
        console.log('   ⏰ Timestamp:', timestamp);
        console.log('   🎲 Random:', random);
        console.log('   ✨ Final UserId:', userId);
        
        return userId;
    }
    
    simpleHash(str) {
        let hash = 0;
        if (str.length === 0) return hash;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    }
    
    // Debug function
    debugSession() {
        console.log('🔍 SESSION DEBUG:');
        console.log('   Current userData:', this.userData);
        console.log('   localStorage session:', localStorage.getItem(this.sessionKey));
        console.log('   localStorage userName:', localStorage.getItem('userName'));
        console.log('   localStorage userGrade:', localStorage.getItem('userGrade'));
        console.log('   localStorage hasVisited:', localStorage.getItem('hasVisited'));
        console.log('   isLoggedIn():', this.isLoggedIn());
        return this.userData;
    }
}

// Create global user session instance
const userSession = new UserSession();

// Make it globally accessible for debugging
window.userSession = userSession;
window.debugSession = () => userSession.debugSession();

// Widget ID Mapping for Survey Tracking - Category-based System
// 1xxx = 수학 관련, 2xxx = 영어 관련, 3xxx = 국어 관련, 4xxx = 사탐 관련, 5xxx = 과탐 관련, 6xxx = 학교생활
const widgetIdMapping = {
    // 수학 관련 (1xxx)
    'math-helper': 1001,                    // 수학풀이 도우미
    'math-formula-cards': 1002,             // 공식암기 카드
    'graph-visualizer': 1003,               // 그래프 시각화
    'wrong-answer-generator': 1004,         // 오답노트 자동 생성기
    'integral-graph': 1005,                 // 적분 그래프 시각화
    'limit-simulator': 1006,                // 극한 시뮬레이터
    'probability-simulator': 1007,          // 확률 시뮬레이터
    'normal-distribution': 1008,            // 정규분포 계산기
    'sequence-helper': 1009,                // 수열 도우미
    'set-proposition-quiz': 1010,           // 집합 명제 퀴즈
    'trigonometry-visualizer': 1011,        // 삼각비 시각화
    
    // 영어 관련 (2xxx)
    'english-essay': 2001,                  // 영어 에세이 첨삭
    'essay-helper': 2002,                   // 에세이 초안 도우미
    'pronunciation-trainer': 2003,          // 발음 교정기
    'reading-summarizer': 2004,             // 독해 요약 훈련
    'conversation-chatbot': 2005,           // 영어 회화 챗봇
    
    // 국어 관련 (3xxx)
    'text-summarizer': 3001,                // 비문학 지문 요약기
    'literature-analyzer': 3002,            // 문학작품 해석
    'vocabulary-cards': 3003,               // 어휘 학습 카드
    'writing-corrector': 3004,              // 작문 첨삭
    'classical-literature': 3005,           // 고전 문학 풀이
    'sentence-analyzer': 3006,              // 구문 분석기
    
    // 사탐 관련 (4xxx)
    'timeline-generator': 4001,             // 연표 생성기
    'concept-comparator': 4002,             // 개념 비교표
    'real-world-connector': 4003,           // 현실세계 개념 연동
    'map-interpreter': 4004,                // 지도 해석 훈련
    'person-event-matching': 4005,          // 인물사건 매칭 퀴즈
    'historical-source-interpreter': 4006,  // 사료 해석기
    'cultural-heritage-guide': 4007,        // 시대별 문화재 도감
    'ethics-philosopher-cards': 4008,       // 윤리 사상가 카드
    'ideology-comparison': 4009,            // 사상 비교표
    'ethics-dilemma-discussion': 4010,      // 윤리 딜레마 토론
    'social-constitution-summary-cards': 4011, // 헌법 요약 카드
    'precedent-learner': 4012,              // 판례 학습기
    'political-system-comparison': 4013,    // 정치제도 비교표
    
    // 과탐 관련 (5xxx)
    'law-simulator': 5001,                  // 법칙 시뮬레이터
    'virtual-experiment': 5002,             // 가상 실험 체험
    'electric-circuit-sim': 5003,           // 전기 회로 시뮬레이터
    'optics-simulator': 5004,               // 광학 시뮬레이터
    'celestial-simulator': 5005,            // 천체 시뮬레이터
    'volcano-simulator': 5006,              // 화산 시뮬레이터
    'mineral-guide': 5007,                  // 광물 도감
    'space-exploration-timeline': 5008,     // 우주 탐사 연대표
    'cell-3d-viewer': 5009,                 // 세포 구조 3D 뷰어
    'human-body-simulator': 5010,           // 인체 시스템 시뮬레이터
    'taxonomy-quiz': 5011,                  // 계통도 퀴즈
    'chemical-formula-completer': 5012,     // 화학식 자동 완성기
    'periodic-table-explorer': 5013,        // 주기율표 탐색기
    
    // 학교생활 (6xxx)
    'conversation-practice': 6001,          // 친구와 대화 연습하기
    'mental-care': 6002,                    // 멘탈케어 위젯
    'webtoon-ideas': 6003,                  // 웹툰 아이디어 봇
    'video-script': 6004,                   // 영상 시나리오 작성기
    'rap-lyrics': 6005,                     // 랩 가사 도우미
    'art-design': 6006,                     // 그림 디자인 봇
    'birthday-reminder': 6007,              // 친구 생일 알림
    'emotion-diary': 6008,                  // 감정기록 다이어리
    'motivation-messages': 6009,            // 동기부여 메시지
    'stress-relief': 6010,                  // 스트레스 해소 챌린지
    
    // 일반 기능 (기존 위젯들 - 카테고리 미분류)
    'exam-summary': 7001,                   // 시험 요약봇
    'flashcard': 7002,                      // 암기 카드 만들기
    'club-report': 7003,                    // 동아리 보고서 초안
    'personal-statement': 7004,             // 자소서 보고서 초안
    'interview-practice': 7005,             // 면접 질문 연습
    'career-explorer': 7006,                // 진로 탐색 도우미
    'class-notice': 7007,                   // 학급 공지 요약
    'study-scheduler': 7008,                // 학습 스케줄러
    'school-record': 7009,                  // 생기부 도우미
    'performance-assessment': 7010          // 수행평가 봇
};

// Function to get widget ID by data-page attribute
function getWidgetId(dataPage) {
    return widgetIdMapping[dataPage] || 9999; // Default fallback ID
}

// Function to check current localStorage status (for debugging)
function checkUserDataStatus() {
    const userName = localStorage.getItem('userName');
    const userGrade = localStorage.getItem('userGrade');
    const hasVisited = localStorage.getItem('hasVisited');
    
    console.log('🔍 Current localStorage status:');
    console.log('   - userName:', userName);
    console.log('   - userGrade:', userGrade);
    console.log('   - hasVisited:', hasVisited);
    console.log('   - All localStorage keys:', Object.keys(localStorage));
    
    return {
        userName,
        userGrade,
        hasVisited,
        isValid: Boolean(userName && userGrade)
    };
}

// Make debugging functions globally accessible
window.checkUserDataStatus = checkUserDataStatus;
window.getWidgetId = getWidgetId;

// Function to randomize widget order to minimize ordering bias
function randomizeWidgetOrder() {
    const generalToolsSection = document.querySelector('.general-tools-section .widgets-grid');
    if (!generalToolsSection) {
        console.log('❌ General tools section not found for randomization');
        return;
    }
    
    // Get all widget cards
    const widgets = Array.from(generalToolsSection.querySelectorAll('.widget-card'));
    console.log('🎲 Randomizing order of', widgets.length, 'widgets to minimize ordering bias');
    
    // Fisher-Yates shuffle algorithm
    for (let i = widgets.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [widgets[i], widgets[j]] = [widgets[j], widgets[i]];
    }
    
    // Re-append widgets in randomized order
    widgets.forEach(widget => {
        generalToolsSection.appendChild(widget);
    });
    
    console.log('✅ Widget order randomized for this session');
    
    // Store randomization state for analytics
    const randomSeed = Date.now();
    sessionStorage.setItem('widgetRandomSeed', randomSeed);
    console.log('🔢 Random seed for this session:', randomSeed);
}

// Make randomization function globally accessible for testing
window.randomizeWidgetOrder = randomizeWidgetOrder;

// Mobile App Navigation System
console.log('Script.js loaded');

// Test if functions are accessible globally
window.addEventListener('load', function() {
    console.log('Window loaded - checking functions:');
    console.log('filterWidgetsByCategory exists?', typeof window.filterWidgetsByCategory);
    console.log('testFilter exists?', typeof window.testFilter);
    console.log('showAll exists?', typeof window.showAll);
});

// Welcome Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up welcome modal');
    
    const welcomeModal = document.getElementById('welcome-modal');
    const welcomeForm = document.getElementById('welcome-form');
    
    if (!welcomeModal) {
        console.error('Welcome modal not found!');
        return;
    }
    
    if (!welcomeForm) {
        console.error('Welcome form not found!');
        return;
    }
    
    console.log('Welcome modal and form found');
    
    // Check if user has visited before
    const hasVisited = localStorage.getItem('hasVisited');
    const isLoggedIn = userSession.isLoggedIn();
    
    console.log('🔍 Welcome modal check:');
    console.log('   hasVisited:', hasVisited);
    console.log('   isLoggedIn:', isLoggedIn);
    console.log('   Current user:', userSession.getUser());
    
    if (!hasVisited || !isLoggedIn) {
        // Show welcome modal on first visit or if no valid session
        console.log('🎉 First visit or invalid session detected, showing welcome modal');
        welcomeModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
        // Hide modal if user has visited before and has valid session
        console.log('👋 Returning user with valid session, hiding welcome modal');
        welcomeModal.style.display = 'none';
    }
    
    // Handle form submission
    welcomeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted - preventing default');
        
        const userName = document.getElementById('user-name').value;
        const userGrade = document.getElementById('user-grade').value;
        const userPhone = document.getElementById('user-phone').value;
        
        console.log('User data:', { userName, userGrade, userPhone });
        
        if (userName && userGrade) {
            // Store user info using UserSession
            const userData = userSession.setUser(userName, userGrade, userPhone);
            
            console.log('💾 User data stored via UserSession:', userData);
            
            // Verify session immediately
            const verificationUser = userSession.getUser();
            console.log('✅ Session verification:', verificationUser);
            
            if (!verificationUser || verificationUser.name !== userName || verificationUser.grade !== userGrade) {
                console.error('❌ SESSION STORAGE FAILED!');
                console.error('   Expected:', { userName, userGrade });
                console.error('   Stored:', verificationUser);
                alert('세션 저장에 실패했습니다. 페이지를 새로고침하고 다시 시도해주세요.');
                return;
            } else {
                console.log('🎉 UserSession storage SUCCESS!');
            }
            
            // Send data to Google Sheets
            sendToGoogleSheets(userName, userGrade, userPhone);
            
            // Hide modal immediately using multiple methods
            console.log('Hiding modal...');
            welcomeModal.style.display = 'none';
            welcomeModal.style.visibility = 'hidden';
            welcomeModal.style.opacity = '0';
            welcomeModal.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scrolling
            
            console.log('Modal should be hidden now');
            
            // Remove the welcome message - no more orange tooltip
            // setTimeout(() => {
            //     showWelcomeMessage(userName, userGrade);
            // }, 100);
        } else {
            console.log('Form validation failed');
            alert('이름과 학년을 모두 입력해주세요.');
        }
    });
    
    // Also handle button click directly as backup
    const submitButton = welcomeForm.querySelector('.btn-primary');
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            console.log('Submit button clicked directly');
            // The form submit event should handle this, but just in case
        });
    }
});

// Function to reset for testing - call this in console: resetWelcomeModal()
function resetWelcomeModal() {
    localStorage.removeItem('hasVisited');
    localStorage.removeItem('userName');
    localStorage.removeItem('userGrade');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userId');
    userSession.clearSession();
    location.reload();
}

// Make reset function globally accessible for testing
window.resetWelcomeModal = resetWelcomeModal;

function sendToGoogleSheets(userName, userGrade, userPhone = '') {
    console.log('Sending to Google Sheets:', { userName, userGrade, userPhone });
    
    // Get current user session to include userId
    const currentUser = userSession.getUser();
    const userId = currentUser ? currentUser.userId : 'unknown_user';
    
    console.log('📋 Including userId in welcome data:', userId);
    
    // UPDATED Google Apps Script URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxkCJEZoUKyEUxdV8eWWvHPpIKlZ_SUJpkYfUgTKU7Ly1rpoTXnHofhSNXkp8LpeMUktw/exec';
    
    const formData = new FormData();
    formData.append('UserId', userId); // Add unique user ID
    formData.append('Name', userName);
    formData.append('Grade', userGrade);
    formData.append('Phone', userPhone);
    
    console.log('Data to be sent:', {
        UserId: userId,
        Name: userName,
        Grade: userGrade,
        Phone: userPhone
    });
    
    // Send data to Google Sheets (temporarily removing no-cors for debugging)
    fetch(scriptURL, {
        method: 'POST',
        // mode: 'no-cors', // Temporarily commented out for debugging
        body: formData
    })
    .then(response => {
        console.log('Response received:', response);
        console.log('Response status:', response.status);
        console.log('Response statusText:', response.statusText);
        return response.text();
    })
    .then(data => {
        console.log('Success! Data sent to Google Sheets:', data);
    })
    .catch(error => {
        console.error('Error sending to Google Sheets:', error);
        // Don't show error to user as data might still be sent
        console.log('Note: Data may still be sent despite error (CORS limitation)');
    });
}

function showWelcomeMessage(userName, userGrade) {
    // Create and show a welcome notification
    const notification = document.createElement('div');
    notification.className = 'welcome-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h3>🎉 ${userName}님, 환영합니다!</h3>
            <p>${userGrade}에 맞는 맞춤형 학습 도구를 준비했습니다.</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function sendSurveyToGoogleSheets(surveyData) {
    console.log('📊 Sending survey data to Google Sheets:', surveyData);
    
    return new Promise((resolve, reject) => {
    
    // Get current user session to include userId
    const currentUser = userSession.getUser();
    const userId = currentUser ? currentUser.userId : 'unknown_user';
    
    console.log('📋 Including userId in survey data:', userId);
    
    // UPDATED Google Apps Script URL  
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxkCJEZoUKyEUxdV8eWWvHPpIKlZ_SUJpkYfUgTKU7Ly1rpoTXnHofhSNXkp8LpeMUktw/exec';
    
    const formData = new FormData();
    formData.append('UserId', userId); // Add unique user ID
    formData.append('Type', 'Survey'); // Distinguish from welcome data
    formData.append('WidgetId', surveyData.widgetId);
    formData.append('WidgetTitle', surveyData.widgetTitle);
    formData.append('UserName', surveyData.userName);
    formData.append('UserGrade', surveyData.userGrade);
    formData.append('Frequency', surveyData.frequency);
    formData.append('Helpfulness', surveyData.helpfulness);
    formData.append('Need', surveyData.need);
    formData.append('UtmSource', surveyData.utmSource);
    formData.append('Timestamp', surveyData.timestamp);
    
    console.log('📋 Survey data to be sent to Apps Script:');
    console.log('   🆔 Type: Survey');
    console.log('   👤 UserId:', userId);
    console.log('   🔢 WidgetId:', surveyData.widgetId);
    console.log('   📝 WidgetTitle:', surveyData.widgetTitle);
    console.log('   👤 UserName:', surveyData.userName);
    console.log('   🎓 UserGrade:', surveyData.userGrade);
    console.log('   📊 Frequency:', surveyData.frequency);
    console.log('   💡 Helpfulness:', surveyData.helpfulness);
    console.log('   ⭐ Need:', surveyData.need);
    console.log('   🔗 UtmSource:', surveyData.utmSource);
    
    console.log('🎯 Expected: Apps Script should find user with userId="' + userId + '"');
    console.log('📊 Expected: Should add data to existing row horizontally, not create new row');
    
    // Send survey data to Google Sheets
    fetch(scriptURL, {
        method: 'POST',
        // mode: 'no-cors', // Temporarily commented out for debugging
        body: formData
    })
    .then(response => {
        console.log('📞 Survey response received from Apps Script:', response.status, response.statusText);
        console.log('Survey response status:', response.status);
        console.log('Survey response statusText:', response.statusText);
        return response.text();
    })
    .then(data => {
        console.log('✅ Raw response from Apps Script:', data);
        try {
            const responseData = JSON.parse(data);
            console.log('📋 Parsed Apps Script response:', responseData);
            
            if (responseData.result === 'success') {
                console.log('🎉 SUCCESS! Survey data processed by Apps Script');
                console.log('   📍 User found at row:', responseData.userRow);
                console.log('   🆔 Widget ID:', responseData.widgetId);
                console.log('   📊 Columns used:', responseData.columns);
                resolve(responseData);
            } else if (responseData.result === 'error') {
                console.error('❌ APPS SCRIPT ERROR:', responseData.message);
                console.error('   🔍 This means Apps Script could not process the survey data');
                reject(new Error(responseData.message));
            }
        } catch (e) {
            console.log('⚠️ Response is not JSON (might be HTML error page):', data);
            console.log('💡 This usually means Apps Script has an execution error');
            reject(e);
        }
    })
    .catch(error => {
        console.error('❌ Network error sending survey data to Google Sheets:', error);
        // Don't show error to user as data might still be sent
        console.log('Note: Data may still be sent despite error (CORS limitation)');
        reject(error);
    });
    
    }); // Close the Promise constructor
}

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
                'essay-helper',          // 에세이 초안 도우미
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
        'essay-helper': '영어 에세이 초안 작성을 도와주는 구조와 표현 개선 도구입니다. 📝✨ 아이디어 정리부터 문단 구성까지 체계적으로 지원합니다!',
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
        // First randomize the widget order to minimize ordering bias
        randomizeWidgetOrder();
        
        const allWidgets = document.querySelectorAll('.general-tools-section .widget-card');
        allWidgets.forEach((widget) => {
            widget.style.display = 'none';
            widget.style.opacity = '0';
            widget.style.visibility = 'hidden';
            widget.style.position = 'absolute';
            widget.classList.add('hidden');
            widget.classList.remove('visible');
        });
        console.log('All widgets hidden on initial load (after randomization)');
    }
    
    // Survey modal functions
    let currentWidgetId = null; // Store current widget ID
    
    function showSurveyModal(title, description, pageId) {
        const modal = document.getElementById('survey-modal');
        const modalTitle = document.getElementById('modal-widget-title');
        const modalDescription = document.getElementById('modal-widget-description');
        
        // Get widget ID from mapping
        currentWidgetId = getWidgetId(pageId);
        
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modal.classList.add('show');
        
        // Reset all radio buttons
        const radioButtons = modal.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => radio.checked = false);
        
        console.log(`Survey modal opened for: ${title} (ID: ${currentWidgetId})`);
    }
    
    function closeSurveyModal() {
        const modal = document.getElementById('survey-modal');
        modal.classList.remove('show');
        currentWidgetId = null; // Reset widget ID
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
        
        // Get user info from UserSession with detailed logging
        const currentUser = userSession.getUser();
        
        console.log('🔍 DEBUG: Getting user data from UserSession:');
        console.log('   Current user from session:', currentUser);
        
        if (!currentUser || !currentUser.name || !currentUser.grade) {
            console.error('❌ CRITICAL: No valid user session found!');
            console.error('   Current user:', currentUser);
            console.error('   Session check:', userSession.isLoggedIn());
            
            // Try to debug the session
            userSession.debugSession();
            
            alert('사용자 세션을 찾을 수 없습니다. 페이지를 새로고침하고 처음부터 다시 시작해주세요.');
            return;
        }
        
        const userName = currentUser.name;
        const userGrade = currentUser.grade;
        const userPhone = currentUser.phone || '';
        
        console.log('✅ User data retrieved from session:', { userName, userGrade, userPhone });
        console.log('🆔 Session ID:', currentUser.sessionId);
        
        // Prepare survey data
        const surveyData = {
            widgetId: currentWidgetId,
            widgetTitle: title,
            userName: userName,
            userGrade: userGrade,
            frequency: frequency,
            helpfulness: helpfulness,
            need: need,
            timestamp: new Date().toISOString(),
            utmSource: `widget_${currentWidgetId}` // UTM source with widget ID
        };
        
        // Log survey results
        console.log('📊 Survey submitted for:', title);
        console.log('🆔 Widget ID:', currentWidgetId);
        console.log('👤 User:', userName, '(' + userGrade + ')', userPhone ? `Tel: ${userPhone}` : 'No phone');
        console.log('📋 Full survey data:', surveyData);
        
        // Send to Google Sheets and wait for completion
        sendSurveyToGoogleSheets(surveyData)
            .then(response => {
                console.log('✅ Survey successfully sent and processed:', response);
                closeSurveyModal();
            })
            .catch(error => {
                console.error('❌ Survey submission failed:', error);
                // Still close modal even if there's an error
                closeSurveyModal();
            });
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

 