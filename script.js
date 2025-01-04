// Firebase imports
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore, collection, addDoc, Timestamp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA6qWJZ-p5gUpJI_h8TfU5WYg1ACoYcT6g",
    authDomain: "frigoo-4b31c.firebaseapp.com",
    projectId: "frigoo-4b31c",
    storageBucket: "frigoo-4b31c.firebasestorage.app",
    messagingSenderId: "429881150999",
    appId: "1:429881150999:web:edc24070c394b4f7811652",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerOffset = 80;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // CTA section'a scroll edildiğinde email input'una focus ol
        if (sectionId === 'join') {
            // Scroll tamamlandıktan sonra focus ol
            setTimeout(() => {
                const emailInput = document.getElementById('emailInput');
                if (emailInput) {
                    emailInput.focus();
                }
            }, 800); // Scroll animasyonunun bitmesini bekle
        }
    }
}

// Logo click handler
function handleLogoClick(event) {
    // Eğer ana sayfadaysak
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        event.preventDefault();
        
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    // Diğer sayfalarda normal link davranışı
}

// Make scrollToSection and handleLogoClick available globally
window.scrollToSection = scrollToSection;
window.handleLogoClick = handleLogoClick;

// Slider functionality
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let slideIndex = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
                dots[i].classList.add('active');
                
                // Dil kontrolü ve resim görünürlüğü
                const currentLang = localStorage.getItem('preferredLanguage') || 'tr';
                const trImage = slide.querySelector('.tr-image');
                const enImage = slide.querySelector('.en-image');
                
                if (currentLang === 'en') {
                    if (trImage) trImage.style.display = 'none';
                    if (enImage) enImage.style.display = 'block';
                } else {
                    if (trImage) trImage.style.display = 'block';
                    if (enImage) enImage.style.display = 'none';
                }
            } else {
                slide.classList.remove('active');
                dots[i].classList.remove('active');
            }
        });
    }

    function nextSlide() {
        slideIndex = (slideIndex + 1) % slides.length;
        showSlide(slideIndex);
    }

    setInterval(nextSlide, 5000);
    showSlide(slideIndex);

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            slideIndex = i;
            showSlide(slideIndex);
        });
    });
}

// Hero image switcher
function initHeroImageSwitcher() {
    const images = document.querySelectorAll('.hero-img');
    let currentIndex = 0;

    function switchImage() {
        // Tüm görsellerin active sınıfını kaldır
        images.forEach(img => img.classList.remove('active'));
        
        // Sıradaki görsele active sınıfını ekle
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
    }

    // İlk görseli aktif et
    images[0].classList.add('active');
    
    // Her 5 saniyede bir görsel değiştir
    setInterval(switchImage, 5000);
}

// Scroll animasyonları için Intersection Observer
function initScrollAnimations() {
    const sections = document.querySelectorAll('.features-section, .how-it-works, .slider-container, .cta-section, .mission-section, .values-section, .contact-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '-50px'
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}

// About hero animasyonları için
function initAboutHeroAnimations() {
    const elements = document.querySelectorAll('.about-hero-content, .about-badge, .about-hero h1, .about-hero p');
    
    elements.forEach(element => {
        element.classList.add('visible');
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);
    
    // Her sayfada scroll animasyonlarını başlat
    initScrollAnimations();
    
    // Diğer init fonksiyonları
    if (document.querySelector('.slider-container')) {
        initSlider();
    }
    if (document.querySelector('.hero-image')) {
        initHeroImageSwitcher();
    }
    
    // Email form handler
    document.getElementById('emailForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const button = document.getElementById('submitButton');
        const messageContainer = document.getElementById('messageContainer');
        const emailInput = document.getElementById('emailInput');
        const email = emailInput.value;

        if (!email) {
            messageContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>Lütfen email adresinizi girin.</span>
                </div>
            `;
            return;
        }

        button.classList.add('loading');
        messageContainer.innerHTML = '';

        try {
            await addDoc(collection(db, 'subscribers'), {
                email: email,
                timestamp: Timestamp.now()
            });

            messageContainer.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <span>Başarıyla kaydoldun!</span>
                </div>
            `;
            emailInput.value = '';

        } catch (error) {
            console.error('Error:', error);
            messageContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>Bir hata oluştu, lütfen tekrar dene.</span>
                </div>
            `;
        } finally {
            button.classList.remove('loading');
        }
    });

    // Eğer about sayfasındaysak
    if (document.querySelector('.about-hero')) {
        initAboutHeroAnimations();

        // Footer Links
        const footerNav = document.querySelector('.footer-nav');
        if (footerNav) {
            const footerLinks = footerNav.querySelectorAll('a');
            footerLinks[0].textContent = texts.footerFeatures;
            footerLinks[1].textContent = texts.footerHowItWorks;
            footerLinks[2].textContent = texts.footerAboutUs;
        }

        // Contact Info
        const contactInfo = document.querySelector('.contact-info');
        if (contactInfo) {
            const contactLinks = contactInfo.querySelectorAll('a');
            contactLinks[0].innerHTML = `<i class="far fa-envelope"></i> ${texts.contactEmail}`;
            contactLinks[1].innerHTML = `<i class="fas fa-map-marker-alt"></i> ${texts.contactLocation}`;
        }

        // Footer (her sayfada ortak)
        document.querySelector('.footer-desc').textContent = texts.footerDesc;
        document.querySelector('.footer-links-group h4').textContent = texts.explore;
        document.querySelectorAll('.footer-links-group h4')[1].textContent = texts.contact;
        document.querySelector('.copyright').textContent = texts.copyright;
        document.querySelectorAll('.legal-links a')[0].textContent = texts.privacyPolicy;
        document.querySelectorAll('.legal-links a')[1].textContent = texts.terms;

        // Values Section
        if (document.querySelector('.values-section')) {
            document.querySelector('.values-section h2').textContent = texts.ourValues;
            const valueCards = document.querySelectorAll('.value-card');
            valueCards[0].querySelector('h3').textContent = texts.innovation;
            valueCards[0].querySelector('p').textContent = texts.innovationDesc;
            valueCards[1].querySelector('h3').textContent = texts.community;
            valueCards[1].querySelector('p').textContent = texts.communityDesc;
            valueCards[2].querySelector('h3').textContent = texts.trust;
            valueCards[2].querySelector('p').textContent = texts.trustDesc;
        }

        // Contact Section
        if (document.querySelector('.contact-section')) {
            document.querySelector('.contact-section h2').textContent = texts.contactUs;
            document.querySelector('.contact-section p').textContent = texts.contactDesc;
            document.querySelector('.contact-section .primary-btn span').textContent = texts.getInTouch;
        }

        // Mission & Vision Section
        const missionSection = document.querySelector('.mission-section');
        if (missionSection) {
            missionSection.querySelector('h2').textContent = texts.missionVisionTitle;
            const missionCards = document.querySelectorAll('.mission-card');
            missionCards[0].querySelector('h3').textContent = texts.ourMission;
            missionCards[0].querySelector('p').textContent = texts.missionText;
            missionCards[1].querySelector('h3').textContent = texts.ourVision;
            missionCards[1].querySelector('p').textContent = texts.visionText;
        }
    }

    // Hero başlığını yükle
    const heroTitle = document.querySelector('.hero-content h1');
    heroTitle.classList.remove('loading');
});

// Add these functions to your script.js
function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const overlay = document.querySelector('.menu-overlay');
    
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const overlay = document.querySelector('.menu-overlay');
    
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Add event listeners
document.querySelector('.hamburger-menu').addEventListener('click', toggleMobileMenu);
document.querySelector('.menu-overlay').addEventListener('click', closeMobileMenu);
document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Dil verilerini tutacak obje
const translations = {
    tr: {
        // Navigation
        features: "Özellikler",
        howItWorks: "Nasıl Çalışır",
        aboutUs: "Hakkımızda",

        // Hero Section
        heroTitle: "Hedeflerinize Giden Yolda<br>Yalnız Değilsiniz",
        heroText: "Frigoo ile benzer hedeflere sahip insanlarla tanışın, birlikte büyüyün ve başarıya ulaşın.",
        joinBeta: "Beta'ya Katıl",
        learnMore: "Daha Fazla Bilgi",

        // Features Section
        whyFrigoo: "Neden Frigoo?",
        featuresSubtitle: "Hedeflerinize ulaşmanın en etkili yolu, aynı yolda yürüyen insanlarla tanışmaktır.",
        
        // Feature Cards
        smartMatching: "Akıllı Eşleştirme",
        smartMatchingDesc: "Yapay zeka destekli sistemimiz, hedeflerinize ve ilgi alanlarınıza göre size en uygun arkadaşları bulur.",
        networkDev: "Network Geliştirme",
        networkDevDesc: "Spor, dil öğrenme, girişimcilik gibi ortak hedeflere sahip kişilerle tanışın ve birlikte başarıya ulaşın.",
        workspaces: "Work Space Alanları",
        workspacesDesc: "Girişimciler, sporcular ve öğrenciler için özelleştirilmiş çalışma alanlarında iş birliği yapın.",

        // How It Works Section
        howItWorksTitle: "Nasıl Çalışır?",
        setGoal: "Hedefini Belirle",
        setGoalDesc: "Dil öğrenme, spor yapma veya yeni bir hobi edinme gibi hedeflerini seç.",
        findMatch: "Eşini Bul",
        findMatchDesc: "Yapay zeka destekli eşleştirme sistemiyle sana en uygun arkadaşları keşfet.",
        progressTogether: "Birlikte İlerle",
        progressTogetherDesc: "Özel çalışma alanlarında iletişim kur ve hedefine doğru birlikte ilerle.",

        // Slider Section
        entrepreneurMatch: "Girişimci Eşleştirme",
        entrepreneurDesc: "Girişimcilik hedefleri olan ve becerileri senin ihtiyacınla ölçüşen kişilerle tanış. Hayalini kurduğun girişimi beraber kurabileceğin co-founder'ını bul ve birlikte başarıya ulaşın.",
        runningPartner: "Koşu Partneri",
        runningDesc: "Seviyene uygun bir koşu arkadaşı bul ve motivasyonunu yüksek tut. Birlikte koşarak hedeflerine daha hızlı ulaş.",
        languagePractice: "Dil Pratiği",
        languageDesc: "İster yeni başlamış ol, ister ilerliyor ol - hedefindeki dil için mükemmel bir pratik arkadaşı bul. Gerçek konuşmalarla dil öğrenimini turbo hızda ilerlet ve akıcı konuşmaya başla!.",
        pilatesYoga: "Pilates & Yoga",
        pilatesDesc: "Pilates veya yoga pratiklerini birlikte yapabileceğin bir partner bul. Düzenli egzersiz yaparak hem zihinsel hem de fiziksel sağlığını iyileştir.",

        // CTA Section
        startJourney: "Hedefine Giden Yolculuğa Başla",
        betaDesc: "Beta sürecinde ilk kullanıcılarımızdan biri ol ve özel avantajlardan yararlan!",
        emailPlaceholder: "E-posta adresin",
        joinBetaButton: "Beta'ya Katıl",

        // Footer
        footerDesc: "Hedeflerinize giden yolda size eşlik edecek arkadaşlar bulun.",
        explore: "Keşfet",
        contact: "İletişim",
        location: "İstanbul, Türkiye",
        privacyPolicy: "Gizlilik Politikası",
        terms: "Kullanım Koşulları",
        copyright: "© 2025 Frigoo. Tüm hakları saklıdır.",

        // About Page
        ourStory: "Hikayemiz",
        aboutHeroTitle: "Hedeflerinize Giden Yolda<br>Yanınızdayız",
        aboutHeroText: "Frigoo, ortak hedefleri olan insanları bir araya getirerek birlikte büyümeyi ve gelişmeyi amaçlayan yenilikçi bir platformdur.",
        
        // Mission & Vision
        missionVisionTitle: "Misyon ve Vizyonumuz",
        ourMission: "Misyonumuz",
        missionText: "İnsanların hedeflerine ulaşma yolculuğunda yalnız olmadıklarını hissettirmek ve bu yolculukta onlara en uygun yol arkadaşlarını bulmalarını sağlamak.",
        ourVision: "Vizyonumuz",
        visionText: "Hedef odaklı sosyal bağlantılar kurarak, insanların potansiyellerini maksimuma çıkarmalarına yardımcı olan global bir platform olmak.",

        // Footer Links
        footerFeatures: "Özellikler",
        footerHowItWorks: "Nasıl Çalışır",
        footerAboutUs: "Hakkımızda",
        contactEmail: "info@frigoo.app",
        contactLocation: "İstanbul, Türkiye",

        // Values Section
        ourValues: "Değerlerimiz",
        innovation: "İnovasyon",
        innovationDesc: "Sürekli gelişim ve yenilikçi çözümler ile kullanıcılarımıza en iyi deneyimi sunmayı hedefliyoruz.",
        community: "Topluluk",
        communityDesc: "Güvenli ve destekleyici bir ortam oluşturarak, insanların birlikte büyümesini ve gelişmesini sağlıyoruz.",
        trust: "Güven",
        trustDesc: "Şeffaf ve güvenilir bir platform olarak, kullanıcılarımızın güvenliğini ve gizliliğini en üst düzeyde tutuyoruz.",

        // Contact Section
        contactUs: "Bize Ulaşın",
        contactDesc: "Sorularınız veya önerileriniz için bizimle iletişime geçin.",
        getInTouch: "İletişime Geç",

        missionVisionTitle: "Misyon ve Vizyonumuz"
    },
    en: {
        // Navigation
        features: "Features",
        howItWorks: "How It Works",
        aboutUs: "About Us",

        // Hero Section
        heroTitle: "You're Not Alone on Your<br>Journey to Success",
        heroText: "Meet people with similar goals through Frigoo, grow together and achieve success.",
        joinBeta: "Join Beta",
        learnMore: "Learn More",

        // Features Section
        whyFrigoo: "Why Frigoo?",
        featuresSubtitle: "The most effective way to reach your goals is to meet people walking the same path.",
        
        // Feature Cards
        smartMatching: "Smart Matching",
        smartMatchingDesc: "Our AI-powered system finds you the most suitable friends based on your goals and interests.",
        networkDev: "Network Development",
        networkDevDesc: "Meet people with common goals in sports, language learning, entrepreneurship, and succeed together.",
        workspaces: "Work Spaces",
        workspacesDesc: "Collaborate in customized workspaces designed for entrepreneurs, athletes, and students.",

        // How It Works Section
        howItWorksTitle: "How It Works?",
        setGoal: "Set Your Goal",
        setGoalDesc: "Choose your goals like learning a language, doing sports, or picking up a new hobby.",
        findMatch: "Find Your Match",
        findMatchDesc: "Discover the most suitable friends through our AI-powered matching system.",
        progressTogether: "Progress Together",
        progressTogetherDesc: "Communicate in dedicated spaces and progress together towards your goal.",

        // Slider Section
        entrepreneurMatch: "Entrepreneur Matching",
        entrepreneurDesc: "Meet people with entrepreneurial goals and skills that match your needs. Find your co-founder to build the startup you dream of and succeed together.",
        runningPartner: "Running Partner",
        runningDesc: "Find a running buddy at your level and stay motivated. Reach your goals faster by running together.",
        languagePractice: "Language Practice",
        languageDesc: "Whether you're just starting out or making progress - find the perfect practice partner for your target language. Accelerate your language learning through real conversations and start speaking fluently!",
        pilatesYoga: "Pilates & Yoga",
        pilatesDesc: "Find a partner to practice pilates or yoga together. Improve both your mental and physical health through regular exercise.",

        // CTA Section
        startJourney: "Start Your Journey to Success",
        betaDesc: "Be one of our first users in the beta phase and enjoy special benefits!",
        emailPlaceholder: "Your email address",
        joinBetaButton: "Join Beta",

        // Footer
        footerDesc: "Find friends to accompany you on your journey to your goals.",
        explore: "Explore",
        contact: "Contact",
        location: "Istanbul, Turkey",
        privacyPolicy: "Privacy Policy",
        terms: "Terms of Use",
        copyright: "© 2025 Frigoo. All rights reserved.",

        // About Page
        ourStory: "Our Story",
        aboutHeroTitle: "We're With You on Your<br>Journey to Your Goals",
        aboutHeroText: "Frigoo is an innovative platform that aims to bring together people with common goals and help them grow and develop together.",
        
        // Mission & Vision
        missionVisionTitle: "Our Mission and Vision",
        ourMission: "Our Mission",
        missionText: "To make people feel that they are not alone in their journey to achieve their goals and help them find the most suitable companions on this journey.",
        ourVision: "Our Vision",
        visionText: "To become a global platform that helps people maximize their potential by establishing goal-oriented social connections.",

        // Footer Links
        footerFeatures: "Features",
        footerHowItWorks: "How It Works",
        footerAboutUs: "About Us",
        contactEmail: "info@frigoo.app",
        contactLocation: "Istanbul, Turkey",

        // Values Section
        ourValues: "Our Values",
        innovation: "Innovation",
        innovationDesc: "We aim to provide the best experience to our users through continuous development and innovative solutions.",
        community: "Community",
        communityDesc: "By creating a safe and supportive environment, we enable people to grow and develop together.",
        trust: "Trust",
        trustDesc: "As a transparent and reliable platform, we maintain the highest level of security and privacy for our users.",

        // Contact Section
        contactUs: "Contact Us",
        contactDesc: "Get in touch with us for your questions or suggestions.",
        getInTouch: "Get in Touch",

        missionVisionTitle: "Our Mission and Vision"
    }
};

// Dil menüsü fonksiyonlarını global yap
window.toggleLanguageMenu = toggleLanguageMenu;
window.changeLanguage = changeLanguage;

// Dil menüsünü aç/kapa
function toggleLanguageMenu() {
    const dropdown = document.querySelector('.lang-dropdown');
    dropdown.classList.toggle('active');
}

// Dili değiştir
function changeLanguage(lang) {
    // Dil tercihini localStorage'a kaydet
    localStorage.setItem('preferredLanguage', lang);
    
    // Sayfadaki metinleri güncelle
    updatePageContent(lang);
    
    // Dropdown'ı kapat
    document.querySelector('.lang-dropdown').classList.remove('active');
    
    // Current lang göstergesini güncelle
    updateCurrentLangDisplay(lang);

    // Aktif slide'ı bul ve resimlerini güncelle
    const activeSlide = document.querySelector('.slide.active');
    if (activeSlide) {
        const trImage = activeSlide.querySelector('.tr-image');
        const enImage = activeSlide.querySelector('.en-image');
        
        if (lang === 'en') {
            if (trImage) trImage.style.display = 'none';
            if (enImage) enImage.style.display = 'block';
        } else {
            if (trImage) trImage.style.display = 'block';
            if (enImage) enImage.style.display = 'none';
        }
    }
}

// Dışarı tıklandığında dropdown'ı kapat
document.addEventListener('click', (e) => {
    const langSelector = document.querySelector('.language-selector');
    const dropdown = document.querySelector('.lang-dropdown');
    
    if (!langSelector.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});

// Sayfa yüklendiğinde tercih edilen dili kontrol et ve resimleri ayarla
document.addEventListener('DOMContentLoaded', () => {
    const preferredLanguage = localStorage.getItem('preferredLanguage') || 'tr';
    updatePageContent(preferredLanguage);
    updateCurrentLangDisplay(preferredLanguage);

    // Sayfa yüklendiğinde de resimleri kontrol et
    const trImages = document.querySelectorAll('.tr-image');
    const enImages = document.querySelectorAll('.en-image');

    if (preferredLanguage === 'en') {
        trImages.forEach(img => {
            img.style.display = 'none';
        });
        enImages.forEach(img => {
            img.style.display = 'block';
        });
    } else {
        trImages.forEach(img => {
            img.style.display = 'block';
        });
        enImages.forEach(img => {
            img.style.display = 'none';
        });
    }
});

// Sayfadaki metinleri güncelle
function updatePageContent(lang) {
    const texts = translations[lang];
    
    // Nav linkleri ve dil göstergesi (her sayfada ortak)
    document.querySelectorAll('nav a, .mobile-nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#features' || href === '/#features') link.textContent = texts.features;
        if (href === '#how-it-works' || href === '/#how-it-works') link.textContent = texts.howItWorks;
        if (href === 'about.html') link.textContent = texts.aboutUs;
    });

    // Dil göstergesini güncelle (her sayfada ortak)
    const currentLang = document.querySelector('.current-lang span');
    const flagImg = document.querySelector('.current-lang img');
    if (currentLang && flagImg) {
        currentLang.textContent = lang.toUpperCase();
        flagImg.src = `assets/${lang}-flag.png`;
        flagImg.alt = lang === 'tr' ? 'Türkçe' : 'English';
    }

    // About sayfası içeriği
    if (document.querySelector('.about-hero')) {
        // About Hero Section
        document.querySelector('.about-badge').textContent = texts.ourStory;
        document.querySelector('.about-hero-content h1').innerHTML = texts.aboutHeroTitle;
        document.querySelector('.about-hero-content p').textContent = texts.aboutHeroText;

        // Mission & Vision Section
        const missionSection = document.querySelector('.mission-section');
        if (missionSection) {
            missionSection.querySelector('h2').textContent = texts.missionVisionTitle;
            const missionCards = document.querySelectorAll('.mission-card');
            missionCards[0].querySelector('h3').textContent = texts.ourMission;
            missionCards[0].querySelector('p').textContent = texts.missionText;
            missionCards[1].querySelector('h3').textContent = texts.ourVision;
            missionCards[1].querySelector('p').textContent = texts.visionText;
        }

        // Values Section
        if (document.querySelector('.values-section')) {
            document.querySelector('.values-section h2').textContent = texts.ourValues;
            const valueCards = document.querySelectorAll('.value-card');
            valueCards[0].querySelector('h3').textContent = texts.innovation;
            valueCards[0].querySelector('p').textContent = texts.innovationDesc;
            valueCards[1].querySelector('h3').textContent = texts.community;
            valueCards[1].querySelector('p').textContent = texts.communityDesc;
            valueCards[2].querySelector('h3').textContent = texts.trust;
            valueCards[2].querySelector('p').textContent = texts.trustDesc;
        }

        // Contact Section
        if (document.querySelector('.contact-section')) {
            document.querySelector('.contact-section h2').textContent = texts.contactUs;
            document.querySelector('.contact-section p').textContent = texts.contactDesc;
            document.querySelector('.contact-section .primary-btn span').textContent = texts.getInTouch;
        }

        // Mission & Vision başlığı
        document.querySelector('.mission-section h2').textContent = texts.missionVisionTitle;
    }

    // Ana sayfa içeriği
    if (document.querySelector('.hero-section')) {
        // Hero section
        document.querySelector('.hero-content h1').innerHTML = texts.heroTitle;
        document.querySelector('.hero-text').textContent = texts.heroText;
        document.querySelector('.primary-btn span').textContent = texts.joinBeta;
        document.querySelector('.secondary-btn span').textContent = texts.learnMore;

        // Features section
        document.querySelector('.features-section h2').textContent = texts.whyFrigoo;
        document.querySelector('.features-subtitle').textContent = texts.featuresSubtitle;
        
        // Feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards[0].querySelector('h3').textContent = texts.smartMatching;
        featureCards[0].querySelector('p').textContent = texts.smartMatchingDesc;
        featureCards[1].querySelector('h3').textContent = texts.networkDev;
        featureCards[1].querySelector('p').textContent = texts.networkDevDesc;
        featureCards[2].querySelector('h3').textContent = texts.workspaces;
        featureCards[2].querySelector('p').textContent = texts.workspacesDesc;

        // How It Works section
        document.querySelector('.how-it-works h2').textContent = texts.howItWorksTitle;
        const steps = document.querySelectorAll('.step');
        steps[0].querySelector('h3').textContent = texts.setGoal;
        steps[0].querySelector('p').textContent = texts.setGoalDesc;
        steps[1].querySelector('h3').textContent = texts.findMatch;
        steps[1].querySelector('p').textContent = texts.findMatchDesc;
        steps[2].querySelector('h3').textContent = texts.progressTogether;
        steps[2].querySelector('p').textContent = texts.progressTogetherDesc;

        // Slider section
        const slides = document.querySelectorAll('.slide');
        slides[0].querySelector('h2').textContent = texts.entrepreneurMatch;
        slides[0].querySelector('p').textContent = texts.entrepreneurDesc;
        slides[1].querySelector('h2').textContent = texts.runningPartner;
        slides[1].querySelector('p').textContent = texts.runningDesc;
        slides[2].querySelector('h2').textContent = texts.languagePractice;
        slides[2].querySelector('p').textContent = texts.languageDesc;
        slides[3].querySelector('h2').textContent = texts.pilatesYoga;
        slides[3].querySelector('p').textContent = texts.pilatesDesc;

        // CTA section
        document.querySelector('.cta-content h2').textContent = texts.startJourney;
        document.querySelector('.cta-content p').textContent = texts.betaDesc;
        document.querySelector('#emailInput').placeholder = texts.emailPlaceholder;
        document.querySelector('.subscribe-btn .btn-text').textContent = texts.joinBetaButton;
    }

    // Footer kısmı (her sayfada ortak)
    if (document.querySelector('.footer')) {
        // Footer brand description
        document.querySelector('.footer-desc').textContent = texts.footerDesc;
        
        // Footer navigation başlığı ve linkleri
        document.querySelectorAll('.footer-links-group').forEach(group => {
            const heading = group.querySelector('h4');
            if (heading.textContent.includes('Keşfet')) {
                heading.textContent = texts.explore;
                const links = group.querySelectorAll('.footer-nav a');
                links[0].textContent = texts.features;
                links[1].textContent = texts.howItWorks;
                links[2].textContent = texts.aboutUs;
            }
            if (heading.textContent.includes('İletişim')) {
                heading.textContent = texts.contact;
                const contactLinks = group.querySelectorAll('.contact-info a');
                contactLinks[0].innerHTML = `<i class="far fa-envelope"></i> ${texts.contactEmail}`;
                contactLinks[1].innerHTML = `<i class="fas fa-map-marker-alt"></i> ${texts.contactLocation}`;
            }
        });

        // Footer bottom
        document.querySelector('.copyright').textContent = texts.copyright;
        const legalLinks = document.querySelectorAll('.legal-links a');
        legalLinks[0].textContent = texts.privacyPolicy;
        legalLinks[1].textContent = texts.terms;
    }
}

// Current lang göstergesini güncelle
function updateCurrentLangDisplay(lang) {
    const currentLang = document.querySelector('.current-lang span');
    const flagImg = document.querySelector('.current-lang img');
    
    // Container'daki dil göstergesini aktif dile göre güncelle
    currentLang.textContent = lang.toUpperCase();
    
    // Container'daki bayrağı aktif dile göre güncelle
    if (flagImg) {
        flagImg.src = `assets/${lang}-flag.png`;
        flagImg.alt = lang === 'tr' ? 'Türkçe' : 'English';
    }

    // Dropdown'daki tüm seçenekleri göster
    const dropdownOptions = document.querySelectorAll('.lang-option');
    dropdownOptions.forEach(option => {
        option.style.display = 'flex';
    });
}

// Görsel yönetimi için fonksiyon
function handleResponsiveImages() {
    const isMobile = window.innerWidth <= 600;
    const images = document.querySelectorAll('img[data-src-mobile]');
    
    images.forEach(img => {
        const mobileSrc = img.getAttribute('data-src-mobile');
        const desktopSrc = img.getAttribute('data-src-desktop');
        
        if (isMobile && mobileSrc) {
            img.src = mobileSrc;
        } else if (desktopSrc) {
            img.src = desktopSrc;
        }
    });
}

// Sayfa yüklendiğinde ve ekran boyutu değiştiğinde çalıştır
window.addEventListener('load', handleResponsiveImages);
window.addEventListener('resize', handleResponsiveImages);