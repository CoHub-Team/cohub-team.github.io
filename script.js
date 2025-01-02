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
        if (sectionId === 'cta') {
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
            slide.classList.toggle('active', i === index);
            dots[i].classList.toggle('active', i === index);
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
    }
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