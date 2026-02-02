// ===================================
// MAKEPLUS PORTFOLIO - MAIN JAVASCRIPT
// ===================================

// API Configuration
const API_BASE_URL = 'https://makeplus-portfolio-backend.vercel.app/api';

// Client logos data - all SVG files from "Ils Nous Fais Confiance"
// Will be replaced by API data if available
const clientLogos = [
    'AAAIC.svg',
    'ANOL.svg',
    'AOPA.svg',
    'ARAAAI.svg',
    'ASOphthalmo.svg',
    'Biopharm.svg',
    'Club Nephro.svg',
    'Derma Educ.svg',
    'Hikma.svg',
    'IMC.svg',
    'IMO Clinic.svg',
    'NOVO NORDISK.svg',
    'SADEC.svg',
    'SAME.svg',
    'SANDT.svg',
    'Sanofi.svg',
    'SAOPED.svg',
    'SAPBIOL.svg',
    'SAPediaterie.svg',
    'SAPH.svg',
    'SAPM.svg',
    'SAPneumo.svg',
    'SAPsy.svg',
    'SAR CBEC.svg',
    'SARM.svg',
    'SAVOER.svg',
    'Service Endocrino Diabet.svg',
    'Tabib Info.svg',
    'Tiktoph.svg'
];

// Store partner data from API
let partnersData = [];

// ===================================
// LANGUAGE SWITCHER
// ===================================
let currentLanguage = 'fr';

// Detect browser language on initialization
function detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.toLowerCase().split('-')[0];
    
    // Set language based on browser: fr for French, en for English/Arabic/others
    if (langCode === 'fr') {
        return 'fr';
    } else {
        return 'en';
    }
}

function initializeLanguageSwitcher() {
    // Set initial language based on browser
    currentLanguage = detectBrowserLanguage();
    document.documentElement.setAttribute('data-lang', currentLanguage);

    // Bind language switch buttons
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLanguage);
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang || 'fr';
            currentLanguage = lang;
            document.documentElement.setAttribute('data-lang', currentLanguage);
            langButtons.forEach(b => b.classList.toggle('active', b === btn));
            // Update all translatable text
            switchLanguage(currentLanguage);
        });
    });

    // Apply initial language to text
    switchLanguage(currentLanguage);
}

// Switch all translatable UI text between FR/EN
function switchLanguage(lang) {
    const langCode = lang === 'fr' ? 'fr' : 'en';
    document.documentElement.setAttribute('data-lang', langCode);

    // Text nodes
    const translatable = document.querySelectorAll('[data-fr],[data-en]');
    translatable.forEach(el => {
        const text = langCode === 'fr' ? el.dataset.fr : el.dataset.en;
        if (text) {
            el.textContent = text;
        }
    });

    // Placeholders
    const placeholderEls = document.querySelectorAll('[data-fr-placeholder],[data-en-placeholder]');
    placeholderEls.forEach(el => {
        const placeholder = langCode === 'fr' ? el.dataset.frPlaceholder : el.dataset.enPlaceholder;
        if (placeholder) {
            el.placeholder = placeholder;
        }
    });

    // Update video titles if videos loaded
    if (videos.length > 0) {
        updateVideoDisplay();
    }
}

// Preload key images (partner logos) to avoid flicker
function preloadImages() {
    const logoPaths = clientLogos.map(logo => `/assets/ui-components/Les SVG/Ils Nous Fais Confiance/${logo}`);
    logoPaths.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Populate and animate the partner logo scroller
function initializeInfiniteScroll() {
    const scrollEl = document.querySelector('.clients-scroll');
    if (!scrollEl) return;

    // Clear existing content
    scrollEl.innerHTML = '';

    const sources = (partnersData && partnersData.length > 0)
        ? partnersData.map(p => p.logoUrl || p.logo || p.image || p.src || p)
        : clientLogos.map(logo => `/assets/ui-components/Les SVG/Ils Nous Fais Confiance/${logo}`);

    if (sources.length === 0) return;

    // Duplicate list for seamless scroll
    const items = [...sources, ...sources];

    items.forEach((src, idx) => {
        const img = document.createElement('img');
        img.className = 'client-logo';
        img.src = src.startsWith('http') ? src : src;
        img.alt = `Partner logo ${idx + 1}`;
        img.loading = 'lazy';
        scrollEl.appendChild(img);
    });
}

// Minor hover effects for service cards (safe no-op if not present)
function initializeServiceCards() {
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => card.classList.add('hover'));
        card.addEventListener('mouseleave', () => card.classList.remove('hover'));
    });
}

// Add simple fade-in when elements enter viewport
function initializeScrollAnimations() {
    const elements = document.querySelectorAll('.glass-card, .service-card, .section-title, .brand-description');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.2 });

    elements.forEach(el => observer.observe(el));
}

// Ensure the zelij pattern has enough items for the marquee
function initializeZelijScroll() {
    const scrollEl = document.querySelector('.zelij-scroll');
    if (!scrollEl) return;
    const children = Array.from(scrollEl.children);
    // Duplicate once to prevent gaps
    children.forEach(child => scrollEl.appendChild(child.cloneNode(true)));
}

// ===================================
// SMOOTH SCROLL FOR NAVIGATION
// ===================================
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const targetId = this.getAttribute('href');
                const scrollOptions = {
                    behavior: 'smooth',
                    block: targetId === '#partners' ? 'center' : 'start'
                };
                target.scrollIntoView(scrollOptions);
            }
        });
    });
}

// ===================================
// SCROLL SPY FOR NAVIGATION
// ===================================
function initializeScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

// ===================================
// VIDEO SECTION - HORIZONTAL GRID
// ===================================

let videos = [];

// Fetch videos from API
async function fetchVideos() {
    try {
        console.log('📡 Fetching videos...');
        const response = await fetch(`${API_BASE_URL}/content/videos`);
        if (!response.ok) throw new Error('Failed to fetch videos');
        const result = await response.json();
        
        if (!result.success || !result.data || result.data.length === 0) {
            console.log('⚠️ No videos found');
            return;
        }

        // Sort by order ascending (order 1 first, then 2, 3...)
        const sorted = [...result.data].sort((a, b) => (a.order || 999) - (b.order || 999));

        // Store videos
        videos = sorted.map(v => ({
            youtubeId: v.youtubeVideoId,
            title: v.titleEn || 'Video',
            titleFr: v.titleFr || 'Vidéo',
            order: v.order || 0
        }));

        console.log('✅ Loaded ' + videos.length + ' videos from API');
        videos.forEach((v, i) => console.log(`  Video ${i + 1}: ${v.youtubeId} - ${v.title}`));
        
        // Build the video grid
        console.log('📹 About to call buildVideoGrid...');
        try {
            buildVideoGrid();
        } catch (gridError) {
            console.error('❌ Error in buildVideoGrid:', gridError);
        }
    } catch (err) {
        console.error('❌ Error fetching videos:', err);
    }
}

// Build horizontal video grid
function buildVideoGrid() {
    console.log('🔧 Building video grid...');
    
    const grid = document.getElementById('video-grid');
    console.log('📍 Grid element:', grid);
    
    if (!grid) {
        console.error('❌ Video grid container not found');
        return;
    }
    
    if (videos.length === 0) {
        console.log('⚠️ No videos to display');
        return;
    }

    console.log('📹 Creating cards for', videos.length, 'videos');

    // Clear existing content
    grid.innerHTML = '';

    // Create video cards
    videos.forEach((video, index) => {
        console.log(`  Creating card ${index + 1}: ${video.youtubeId}`);
        
        const title = currentLanguage === 'fr' ? video.titleFr : video.title;
        
        const card = document.createElement('div');
        card.className = 'video-card';
        card.dataset.index = index;
        
        card.innerHTML = `
            <div class="video-card-inner">
                <div class="video-wrapper">
                    <iframe 
                        src="https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1"
                        title="${title}"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen
                    ></iframe>
                </div>
                <div class="video-title">${title}</div>
            </div>
        `;
        
        grid.appendChild(card);
    });

    console.log('✅ Video grid built with ' + videos.length + ' videos');
    console.log('📍 Grid children count:', grid.children.length);
}

// Update video titles when language changes
function updateVideoDisplay() {
    if (videos.length === 0) return;
    
    const cards = document.querySelectorAll('.video-card');
    cards.forEach((card, index) => {
        const video = videos[index];
        if (video) {
            const titleEl = card.querySelector('.video-title');
            const iframe = card.querySelector('iframe');
            const title = currentLanguage === 'fr' ? video.titleFr : video.title;
            
            if (titleEl) titleEl.textContent = title;
            if (iframe) iframe.title = title;
        }
    });
}

// ===================================
// API INTEGRATION
// ===================================

// Fetch and update statistics
async function fetchStatistics() {
    try {
        const response = await fetch(`${API_BASE_URL}/content/stats`);
        if (!response.ok) throw new Error('Failed to fetch statistics');
        
        const result = await response.json();
        if (result.success && result.data) {
            const stats = result.data;
            
            // Update stat numbers in hero section
            const statNumbers = document.querySelectorAll('.stat-number');
            if (statNumbers.length >= 3) {
                statNumbers[0].textContent = `${stats.internationalCongress}+`;
                statNumbers[1].textContent = `${stats.symposium}+`;
                statNumbers[2].textContent = `${stats.satisfiedCompanies}+`;
            }
        }
    } catch (error) {
        console.error('Error fetching statistics:', error);
        // Keep default values if fetch fails
    }
}

// Fetch partner logos from API
async function fetchPartners() {
    try {
        const response = await fetch(`${API_BASE_URL}/content/partners`);
        if (!response.ok) throw new Error('Failed to fetch partners');
        
        const result = await response.json();
        if (result.success && result.data && result.data.length > 0) {
            // Store partners data globally
            partnersData = result.data;
            
            // Reinitialize infinite scroll with new partners
            initializeInfiniteScroll();
            
            console.log(`✅ Loaded ${partnersData.length} partners from API`);
        }
    } catch (error) {
        console.error('Error fetching partners:', error);
        // Keep fallback logos if fetch fails
        console.log('⚠️ Using fallback partner logos');
    }
}

// Submit contact form
async function submitContactForm(formData) {
    try {
        const response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error submitting contact form:', error);
        throw error;
    }
}

// Initialize contact form
function initializeContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.querySelector('span').textContent;
        
        // Get form values
        const fullName = form.querySelector('#name').value.trim();
        const [firstName, ...lastNameParts] = fullName.split(' ');
        const lastName = lastNameParts.join(' ') || firstName;
        
        const formData = {
            firstName: firstName,
            lastName: lastName,
            email: form.querySelector('#email').value.trim(),
            phone: form.querySelector('#phone').value.trim() || undefined,
            companyName: form.querySelector('#company').value.trim() || undefined,
            subject: form.querySelector('#subject').value.trim(),
            message: form.querySelector('#message').value.trim(),
            language: currentLanguage
        };
        
        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = currentLanguage === 'fr' ? 'Envoi en cours...' : 'Sending...';
        
        try {
            const result = await submitContactForm(formData);
            
            if (result.success) {
                // Success message
                submitBtn.querySelector('span').textContent = currentLanguage === 'fr' ? '✓ Message envoyé!' : '✓ Message sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                
                // Reset form after 2 seconds
                setTimeout(() => {
                    form.reset();
                    submitBtn.disabled = false;
                    submitBtn.querySelector('span').textContent = originalText;
                    submitBtn.style.background = '';
                }, 2000);
            } else {
                throw new Error(result.message || 'Failed to send message');
            }
        } catch (error) {
            // Error message
            submitBtn.querySelector('span').textContent = currentLanguage === 'fr' ? '✗ Erreur - Réessayez' : '✗ Error - Try again';
            submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.querySelector('span').textContent = originalText;
                submitBtn.style.background = '';
            }, 3000);
            
            console.error('Contact form error:', error);
        }
    });
}

// ===================================
// INITIALIZE APP
// ===================================
document.addEventListener('DOMContentLoaded', async () => {
    // Preload images first
    preloadImages();
    
    // Initialize all components
    initializeLanguageSwitcher();
    initializeScrollAnimations();
    initializeServiceCards();
    initializeSmoothScroll();
    initializeScrollSpy();
    initializeZelijScroll();
    initializeContactForm();
    
    // Initialize infinite scroll with fallback logos first
    initializeInfiniteScroll();
    
    // Fetch data from API (will update partners if available)
    await Promise.all([
        fetchStatistics(),
        fetchVideos(),
        fetchPartners()
    ]);
    
    console.log('✨ Makeplus Portfolio initialized');
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    const scrollElements = document.querySelectorAll('.clients-scroll, .zelij-scroll');
    
    scrollElements.forEach(el => {
        if (document.hidden) {
            el.style.animationPlayState = 'paused';
        } else {
            el.style.animationPlayState = 'running';
        }
    });
    
});
