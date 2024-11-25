// Test kategorileri ve süreleri
const testConfig = {
    trafik: {
        title: 'Trafik ve Çevre Bilgisi',
        duration: 30, // dakika
        questionCount: 25
    },
    motor: {
        title: 'Motor ve Araç Tekniği',
        duration: 20,
        questionCount: 15
    },
    ilkyardim: {
        title: 'İlk Yardım Bilgisi',
        duration: 25,
        questionCount: 20
    },
    karisik: {
        title: 'Karışık Test',
        duration: 60,
        questionCount: 50
    }
};

// Örnek soru veritabanı
const questionDatabase = {
    trafik: [
        {
            question: "Aşağıdakilerden hangisi trafik işaret levhalarının gruplarından değildir?",
            options: [
                "Tehlike uyarı işaretleri",
                "Trafik tanzim işaretleri",
                "Bilgi işaretleri",
                "Yol çizgi işaretleri"
            ],
            correctAnswer: 3,
            explanation: "Yol çizgi işaretleri, trafik işaret levhalarının bir grubu değil, yol işaretlemelerinin bir parçasıdır."
        },
        {
            question: "Trafik görevlisinin hangi hareketi trafiği durdurma işaretidir?",
            options: [
                "Kollarını yanlara açması",
                "Sağ kolunu yukarı kaldırması",
                "Sol kolunu yanda tutması",
                "Her iki kolunu yanda tutması"
            ],
            correctAnswer: 0,
            explanation: "Trafik görevlisinin kollarını yanlara açması, tüm yönlerdeki trafiği durdurma işaretidir."
        }
        // Daha fazla soru eklenebilir
    ],
    motor: [
        {
            question: "Motor soğutma sisteminin görevi aşağıdakilerden hangisidir?",
            options: [
                "Motorun erken ısınmasını sağlamak",
                "Motoru çalışma sıcaklığında tutmak",
                "Motoru yağlamak",
                "Yakıt tüketimini artırmak"
            ],
            correctAnswer: 1,
            explanation: "Motor soğutma sistemi, motoru optimum çalışma sıcaklığında tutarak verimli çalışmasını sağlar."
        }
        // Daha fazla soru eklenebilir
    ],
    ilkyardim: [
        {
            question: "Aşağıdakilerden hangisi ilk yardımın temel uygulamalarından değildir?",
            options: [
                "Koruma",
                "Bildirme",
                "Tedavi etme",
                "Kurtarma"
            ],
            correctAnswer: 2,
            explanation: "Tedavi etme, sağlık personelinin görevidir. İlk yardımın temel uygulamaları Koruma, Bildirme ve Kurtarma'dır (KBK)."
        }
        // Daha fazla soru eklenebilir
    ]
};

let currentTest = null;
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer = null;
let timeLeft = 0;
let answers = [];

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255,255,255,0.98) !important';
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'rgba(255,255,255,0.95) !important';
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const heroSection = document.querySelector('.hero-section');
    const scrolled = window.pageYOffset;
    heroSection.style.backgroundPositionY = (scrolled * 0.5) + 'px';
});

// Button hover effects
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        button.style.setProperty('--x', x + 'px');
        button.style.setProperty('--y', y + 'px');
    });
});

// Feature card tilt effect
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

function startTest(testType) {
    // Test türüne göre soruları hazırla
    currentTest = testType;
    if (testType === 'karisik') {
        currentQuestions = [];
        Object.keys(questionDatabase).forEach(category => {
            currentQuestions = currentQuestions.concat(questionDatabase[category]);
        });
    } else {
        currentQuestions = [...questionDatabase[testType]];
    }
    
    // Soruları karıştır
    shuffleArray(currentQuestions);
    
    // Test başlangıç durumunu ayarla
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = testConfig[testType].duration * 60; // Dakikayı saniyeye çevir
    answers = new Array(currentQuestions.length).fill(null);
    
    // Test arayüzünü göster
    showQuestion();
    startTimer();
    
    // Scroll to question
    document.querySelector('.question-card').scrollIntoView({ behavior: 'smooth' });
    
    // Test başlatma animasyonu
    const button = event.currentTarget;
    button.classList.add('clicked');
    
    // Butona tıklandığında dalga efekti
    const circle = document.createElement('div');
    circle.classList.add('circle');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - diameter/2}px`;
    circle.style.top = `${event.clientY - button.offsetTop - diameter/2}px`;
    button.appendChild(circle);
    
    // Animasyon bittikten sonra elementi kaldır
    setTimeout(() => {
        circle.remove();
        button.classList.remove('clicked');
    }, 600);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    const testContainer = document.getElementById('start-test');
    const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    
    const questionHTML = `
        <div class="row">
            <div class="col-lg-8 mx-auto">
                <div class="question-card animate__animated animate__fadeIn">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h5 class="mb-0">Soru ${currentQuestionIndex + 1}/${currentQuestions.length}</h5>
                            <small class="text-muted">${testConfig[currentTest].title}</small>
                        </div>
                        <div class="timer" id="timer"></div>
                    </div>
                    
                    <div class="progress mb-4" style="height: 8px;">
                        <div class="progress-bar" role="progressbar" style="width: ${progress}%" 
                             aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    
                    <h4 class="mb-4">${question.question}</h4>
                    
                    <div class="options">
                        ${question.options.map((option, index) => `
                            <button class="option-btn ${answers[currentQuestionIndex] === index ? 'selected' : ''}" 
                                    onclick="selectAnswer(${index})">
                                <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                                ${option}
                            </button>
                        `).join('')}
                    </div>
                    
                    <div class="mt-4 d-flex justify-content-between">
                        ${currentQuestionIndex > 0 ? 
                            `<button class="btn btn-outline-primary" onclick="previousQuestion()">
                                <i class="bi bi-arrow-left"></i> Önceki Soru
                            </button>` : 
                            `<div></div>`
                        }
                        ${currentQuestionIndex < currentQuestions.length - 1 ? 
                            `<button class="btn btn-primary" onclick="nextQuestion()">
                                Sonraki Soru <i class="bi bi-arrow-right"></i>
                            </button>` :
                            `<button class="btn btn-success" onclick="endTest()">
                                Testi Bitir <i class="bi bi-check-lg"></i>
                            </button>`
                        }
                    </div>
                </div>
            </div>
        </div>
    `;
    
    testContainer.innerHTML = questionHTML;
    updateTimer();
}

function selectAnswer(answerIndex) {
    const options = document.querySelectorAll('.option-btn');
    
    // Önceki seçimleri temizle
    options.forEach(option => option.classList.remove('selected'));
    
    // Seçilen cevabı işaretle
    options[answerIndex].classList.add('selected');
    
    // Cevabı kaydet
    answers[currentQuestionIndex] = answerIndex;
    
    // 1 saniye sonra otomatik olarak sonraki soruya geç
    if (currentQuestionIndex < currentQuestions.length - 1) {
        setTimeout(nextQuestion, 1000);
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
}

function nextQuestion() {
    if (currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    }
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            endTest();
        }
    }, 1000);
}

function updateTimer() {
    const timerElement = document.getElementById('timer');
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    // Son 1 dakika kala kırmızı renk
    if (timeLeft <= 60) {
        timerElement.style.color = '#dc3545';
    }
    
    timerElement.innerHTML = `
        <i class="bi bi-clock"></i>
        ${minutes}:${seconds.toString().padStart(2, '0')}
    `;
}

function calculateScore() {
    score = 0;
    answers.forEach((answer, index) => {
        if (answer === currentQuestions[index].correctAnswer) {
            score++;
        }
    });
    return score;
}

function endTest() {
    clearInterval(timer);
    const score = calculateScore();
    const percentage = Math.round((score / currentQuestions.length) * 100);
    const testContainer = document.getElementById('start-test');
    
    const resultHTML = `
        <div class="row">
            <div class="col-lg-8 mx-auto">
                <div class="card animate__animated animate__fadeIn">
                    <div class="card-body text-center p-5">
                        <div class="mb-4">
                            ${percentage >= 70 ? 
                                '<i class="bi bi-emoji-smile text-success display-1"></i>' : 
                                '<i class="bi bi-emoji-frown text-danger display-1"></i>'
                            }
                        </div>
                        <h2 class="mb-4">Test Sonucu</h2>
                        <div class="display-4 mb-4 ${percentage >= 70 ? 'text-success' : 'text-danger'}">
                            ${percentage}%
                        </div>
                        <p class="lead mb-4">
                            Toplam ${currentQuestions.length} sorudan ${score} doğru cevap verdiniz.
                            ${percentage >= 70 ? 
                                '<br><span class="text-success">Tebrikler! Başarılı oldunuz.</span>' : 
                                '<br><span class="text-danger">Üzgünüz, başarısız oldunuz.</span>'
                            }
                        </p>
                        <div class="d-grid gap-2 col-lg-6 mx-auto">
                            <button class="btn btn-primary btn-lg" onclick="showAnswers()">
                                <i class="bi bi-search"></i> Cevapları Görüntüle
                            </button>
                            <button class="btn btn-outline-primary btn-lg" onclick="location.reload()">
                                <i class="bi bi-arrow-repeat"></i> Yeni Test Başlat
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    testContainer.innerHTML = resultHTML;
}

function showAnswers() {
    const testContainer = document.getElementById('start-test');
    
    const answersHTML = `
        <div class="row">
            <div class="col-lg-8 mx-auto">
                <div class="card animate__animated animate__fadeIn">
                    <div class="card-body p-4">
                        <h3 class="card-title text-center mb-4">Test Sonuçları</h3>
                        ${currentQuestions.map((question, index) => `
                            <div class="question-review mb-4 p-3 rounded ${
                                answers[index] === question.correctAnswer ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'
                            }">
                                <p class="mb-3">
                                    <strong>${index + 1}. ${question.question}</strong>
                                </p>
                                <div class="options">
                                    ${question.options.map((option, optIndex) => `
                                        <div class="option-review ${
                                            optIndex === question.correctAnswer ? 'text-success' : 
                                            optIndex === answers[index] ? 'text-danger' : ''
                                        }">
                                            <i class="bi ${
                                                optIndex === question.correctAnswer ? 'bi-check-circle-fill' : 
                                                optIndex === answers[index] ? 'bi-x-circle-fill' : 'bi-circle'
                                            }"></i>
                                            ${option}
                                        </div>
                                    `).join('')}
                                </div>
                                <div class="mt-3 text-muted">
                                    <small>
                                        <i class="bi bi-info-circle"></i>
                                        ${question.explanation}
                                    </small>
                                </div>
                            </div>
                        `).join('')}
                        <div class="text-center mt-4">
                            <button class="btn btn-primary" onclick="location.reload()">
                                <i class="bi bi-arrow-repeat"></i> Yeni Test Başlat
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    testContainer.innerHTML = answersHTML;
}
