// ===================================
// MAKEPLUS PORTFOLIO - MAIN JAVASCRIPT
// ===================================

// Client logos data - all SVG files from "Ils Nous Fais Confiance"
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
    
    // Update button states
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        if (btn.dataset.lang === currentLanguage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Apply initial language
    switchLanguage(currentLanguage);
    
    // Add click handlers
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            if (lang !== currentLanguage) {
                switchLanguage(lang);
                
                // Update button states
                langButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
        });
    });
}

function switchLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.setAttribute('data-lang', lang);
    
    // Update all elements with data-fr and data-en attributes
    const translatableElements = document.querySelectorAll('[data-fr][data-en]');
    
    translatableElements.forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) {
            // Handle line breaks in service cards
            if (el.parentElement.classList.contains('service-card')) {
                el.innerHTML = text.replace('&', '<br>&');
            } else {
                el.textContent = text;
            }
        }
    });
    
    // Update form input placeholders
    const inputs = document.querySelectorAll('[data-fr-placeholder][data-en-placeholder]');
    inputs.forEach(input => {
        const placeholder = input.getAttribute(`data-${lang}-placeholder`);
        if (placeholder) {
            input.placeholder = placeholder;
        }
    });
    
    // Update video titles in coverflow
    if (typeof updateVideoTitles === 'function') {
        updateVideoTitles();
    }
    
    // Update document language
    document.documentElement.lang = lang;
}

// ===================================
// INFINITE SCROLL ANIMATION FOR LOGOS
// ===================================
function initializeInfiniteScroll() {
    const scrollContainer = document.querySelector('.clients-scroll');
    if (!scrollContainer) return;

    const basePath = '/assets/ui-components/Les SVG/Ils Nous Fais Confiance/';
    
    // Create logos twice for seamless infinite scroll
    const createLogoSet = () => {
        return clientLogos.map(logo => {
            const img = document.createElement('img');
            img.src = `${basePath}${logo}`;
            img.alt = logo.replace('.svg', '');
            img.className = 'client-logo';
            img.loading = 'lazy';
            return img;
        });
    };

    // Add first set
    const firstSet = createLogoSet();
    firstSet.forEach(img => scrollContainer.appendChild(img));

    // Add duplicate set for seamless loop
    const secondSet = createLogoSet();
    secondSet.forEach(img => scrollContainer.appendChild(img));
}

// ===================================
// SCROLL REVEAL ANIMATIONS
// ===================================
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all reveal elements
    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));
}

// ===================================
// SERVICE CARD HOVER EFFECTS
// ===================================
function initializeServiceCards() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add subtle glow effect
            card.style.boxShadow = '0 8px 32px rgba(135, 44, 122, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '';
        });
    });
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
                
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section link
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
// PRELOAD CRITICAL IMAGES
// ===================================
function preloadImages() {
    const criticalImages = [
        '/assets/ui-components/Les SVG/Makeplus Logo Variation/Icon vide - sans adidas.svg',
        '/assets/ui-components/Les SVG/Makeplus Logo Variation/Icon.svg',
        '/assets/ui-components/Les SVG/Zelij.svg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// ===================================
// ZELIJ SCROLL OPTIMIZATION
// ===================================
function initializeZelijScroll() {
    const zelij = document.querySelector('.zelij-scroll');
    if (!zelij) return;
    
    // Check if animation is performing well
    let lastTime = performance.now();
    let frameCount = 0;
    
    function checkPerformance() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            const fps = frameCount;
            frameCount = 0;
            lastTime = currentTime;
            
            // If FPS drops below 30, reduce animation complexity
            if (fps < 30) {
                zelij.style.animationDuration = '120s';
            }
        }
        
        requestAnimationFrame(checkPerformance);
    }
    
    // Start performance monitoring (optional)
    // requestAnimationFrame(checkPerformance);
}

// ===================================
// COVERFLOW VIDEO SHOWCASE
// ===================================

// Videos will be loaded dynamically from the /assets/videos folder
// Place your .mp4 files there and they will auto-appear with their filename as title
let videos = [];

let currentVideoIndex = 0;
let isPlaying = false;
let currentPlayingVideo = null;

// Function to extract clean title from filename
function getVideoTitle(filename) {
    // Remove extension and path
    let name = filename.replace(/\.[^/.]+$/, '').replace(/^.*[\\\/]/, '');
    // Replace underscores and hyphens with spaces
    name = name.replace(/[_-]/g, ' ');
    // Capitalize first letter of each word
    name = name.replace(/\b\w/g, c => c.toUpperCase());
    return name;
}

// Load videos from server
async function loadVideos() {
    try {
        const response = await fetch('/api/videos');
        const videoFiles = await response.json();
        
        videos = videoFiles.map(filename => {
            const title = getVideoTitle(filename);
            return {
                title: title,
                titleFr: title, // Same title for both languages (it's the project name)
                src: `/assets/videos/${filename}`,
                poster: '' // Will use video frame as poster
            };
        });
        
        return videos;
    } catch (error) {
        console.log('Could not load videos from API, using defaults');
        // Fallback videos if API not available
        videos = [
            { title: 'Project 1', titleFr: 'Projet 1', src: '/assets/videos/video1.mp4', poster: '' },
            { title: 'Project 2', titleFr: 'Projet 2', src: '/assets/videos/video2.mp4', poster: '' },
            { title: 'Project 3', titleFr: 'Projet 3', src: '/assets/videos/video3.mp4', poster: '' }
        ];
        return videos;
    }
}

async function initializeCoverflow() {
    const coverflowTrack = document.querySelector('.coverflow-track');
    const prevBtn = document.querySelector('.video-nav-prev');
    const nextBtn = document.querySelector('.video-nav-next');
    const videoTitleEl = document.querySelector('.current-video-title');
    
    if (!coverflowTrack) return;
    
    // Load videos from server
    await loadVideos();
    
    if (videos.length === 0) {
        console.log('No videos found');
        return;
    }
    
    // Create video cards
    videos.forEach((video, index) => {
        const card = createVideoCard(video, index);
        coverflowTrack.appendChild(card);
    });
    
    // Navigation button handlers
    prevBtn?.addEventListener('click', () => navigateTo(currentVideoIndex - 1));
    nextBtn?.addEventListener('click', () => navigateTo(currentVideoIndex + 1));
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const videoSection = document.querySelector('.video-section');
        const rect = videoSection?.getBoundingClientRect();
        
        // Only respond if video section is in view
        if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
            if (e.key === 'ArrowLeft') {
                navigateTo(currentVideoIndex - 1);
            } else if (e.key === 'ArrowRight') {
                navigateTo(currentVideoIndex + 1);
            }
        }
    });
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    coverflowTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    coverflowTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                navigateTo(currentVideoIndex + 1);
            } else {
                navigateTo(currentVideoIndex - 1);
            }
        }
    }
    
    // Mouse wheel support (horizontal scroll)
    coverflowTrack.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
            e.preventDefault();
            if (e.deltaX > 30 || (e.shiftKey && e.deltaY > 30)) {
                navigateTo(currentVideoIndex + 1);
            } else if (e.deltaX < -30 || (e.shiftKey && e.deltaY < -30)) {
                navigateTo(currentVideoIndex - 1);
            }
        }
    }, { passive: false });
    
    // Initialize first position
    updateCoverflow();
    
    // Stop video when user scrolls away from video section
    const videoSection = document.querySelector('.video-section');
    if (videoSection) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && isPlaying) {
                    // User scrolled away, stop the video
                    const activeCard = document.querySelector('.video-card.active');
                    if (activeCard) {
                        pauseVideo(activeCard);
                    }
                }
            });
        }, {
            threshold: 0.3 // Stop when less than 30% of section is visible
        });
        
        sectionObserver.observe(videoSection);
    }
}

function createVideoCard(video, index) {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.dataset.index = index;
    
    const title = currentLanguage === 'fr' ? video.titleFr : video.title;
    
    card.innerHTML = `
        <video 
            preload="auto"
            playsinline
            muted
        >
            <source src="${video.src}" type="video/mp4">
        </video>
        <div class="card-play-overlay">
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
            </svg>
        </div>
        <div class="video-controls-overlay">
            <button class="video-control-btn play-pause-btn">
                <svg class="play-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
                <svg class="pause-icon" viewBox="0 0 24 24" fill="currentColor" style="display:none">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
            </button>
            <button class="video-control-btn fullscreen-btn" title="Fullscreen">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                </svg>
            </button>
        </div>
        <div class="video-progress-bar">
            <div class="video-progress-filled"></div>
        </div>
        <div class="card-title">${title}</div>
        <div class="card-loading">
            <div class="card-loading-spinner"></div>
        </div>
    `;
    
    // Video element
    const videoEl = card.querySelector('video');
    
    // Click on card to navigate or toggle play
    card.addEventListener('click', (e) => {
        // Don't trigger if clicking on controls
        if (e.target.closest('.video-controls-overlay') || e.target.closest('.video-progress-bar')) {
            return;
        }
        handleCardClick(card, index);
    });
    
    // Control button handlers
    const playPauseBtn = card.querySelector('.play-pause-btn');
    const fullscreenBtn = card.querySelector('.fullscreen-btn');
    const progressBar = card.querySelector('.video-progress-bar');
    
    playPauseBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (videoEl.paused) {
            playVideo(card);
        } else {
            pauseVideo(card);
        }
    });
    
    fullscreenBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFullscreen(card);
    });
    
    // Progress bar click to seek
    progressBar?.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        videoEl.currentTime = percent * videoEl.duration;
    });
    
    // Video element event handlers
    videoEl.addEventListener('waiting', () => {
        card.classList.add('loading');
    });
    
    videoEl.addEventListener('canplay', () => {
        card.classList.remove('loading');
    });
    
    videoEl.addEventListener('loadeddata', () => {
        // Ensure first frame is visible when video loads
        if (videoEl.currentTime === 0) {
            videoEl.currentTime = 0.1; // Jump to first visible frame
        }
    });
    
    videoEl.addEventListener('ended', () => {
        // Auto-play next video when current ends
        if (currentVideoIndex < videos.length - 1) {
            navigateTo(currentVideoIndex + 1);
        } else {
            stopVideo(card);
        }
    });
    
    videoEl.addEventListener('timeupdate', () => {
        const progressFilled = card.querySelector('.video-progress-filled');
        if (progressFilled && videoEl.duration) {
            const percent = (videoEl.currentTime / videoEl.duration) * 100;
            progressFilled.style.width = `${percent}%`;
        }
    });
    
    videoEl.addEventListener('play', () => {
        card.classList.add('playing');
        const playIcon = card.querySelector('.play-icon');
        const pauseIcon = card.querySelector('.pause-icon');
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'block';
    });
    
    videoEl.addEventListener('pause', () => {
        card.classList.remove('playing');
        const playIcon = card.querySelector('.play-icon');
        const pauseIcon = card.querySelector('.pause-icon');
        if (playIcon) playIcon.style.display = 'block';
        if (pauseIcon) pauseIcon.style.display = 'none';
    });
    
    return card;
}

// Toggle fullscreen for a video card
function toggleFullscreen(card) {
    const videoEl = card.querySelector('video');
    
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else if (videoEl.requestFullscreen) {
        videoEl.requestFullscreen();
    } else if (videoEl.webkitRequestFullscreen) {
        videoEl.webkitRequestFullscreen();
    } else if (videoEl.msRequestFullscreen) {
        videoEl.msRequestFullscreen();
    }
}

function handleCardClick(card, index) {
    // If clicking on a non-active card, navigate to it
    if (index !== currentVideoIndex) {
        navigateTo(index);
        return;
    }
    
    // If clicking on active card, toggle play/pause
    const videoEl = card.querySelector('video');
    
    if (isPlaying && currentPlayingVideo === videoEl) {
        stopVideo(card);
    } else {
        playVideo(card);
    }
}

function playVideo(card) {
    // Stop any currently playing video
    if (currentPlayingVideo && currentPlayingVideo !== card.querySelector('video')) {
        const currentCard = currentPlayingVideo.closest('.video-card');
        stopVideo(currentCard);
    }
    
    const videoEl = card.querySelector('video');
    
    // Unmute when user interacts
    videoEl.muted = false;
    
    videoEl.play().then(() => {
        card.classList.add('playing');
        isPlaying = true;
        currentPlayingVideo = videoEl;
        
        // Hide the center play overlay
        const overlay = card.querySelector('.card-play-overlay');
        if (overlay) overlay.style.opacity = '0';
    }).catch(err => {
        console.log('Video play failed:', err);
        // Try playing muted if autoplay blocked
        videoEl.muted = true;
        videoEl.play().catch(() => {});
    });
}

function pauseVideo(card) {
    const videoEl = card.querySelector('video');
    videoEl.pause();
    isPlaying = false;
    
    // Show the center play overlay
    const overlay = card.querySelector('.card-play-overlay');
    if (overlay) overlay.style.opacity = '1';
}

function stopVideo(card) {
    const videoEl = card.querySelector('video');
    
    videoEl.pause();
    // Don't reset to 0 - keep current frame visible
    card.classList.remove('playing');
    isPlaying = false;
    currentPlayingVideo = null;
    
    // Show the center play overlay
    const overlay = card.querySelector('.card-play-overlay');
    if (overlay) overlay.style.opacity = '1';
}

function navigateTo(index) {
    // Stop current video if playing
    const currentCard = document.querySelector('.video-card.active');
    if (currentCard) {
        stopVideo(currentCard);
    }
    
    // Clamp index within bounds
    const newIndex = Math.max(0, Math.min(index, videos.length - 1));
    
    if (newIndex === currentVideoIndex) return;
    
    currentVideoIndex = newIndex;
    updateCoverflow();
    
    // Auto-play the new active video after a short delay for transition
    setTimeout(() => {
        const newActiveCard = document.querySelector('.video-card.active');
        if (newActiveCard) {
            playVideo(newActiveCard);
        }
    }, 300);
}

function updateCoverflow() {
    const track = document.querySelector('.coverflow-track');
    const cards = document.querySelectorAll('.video-card');
    const videoTitleEl = document.querySelector('.current-video-title');
    
    if (!track || cards.length === 0) return;
    
    // Calculate the offset to center the active card
    const cardWidth = 680; // Base card width
    const gap = 30; // Gap between cards
    const offset = currentVideoIndex * (cardWidth + gap);
    
    // Shift the track to center the active video
    track.style.transform = `translateX(-${offset}px)`;
    
    // Update active states on cards
    cards.forEach((card, index) => {
        card.classList.toggle('active', index === currentVideoIndex);
    });
    
    // Update title
    if (videoTitleEl && videos[currentVideoIndex]) {
        const video = videos[currentVideoIndex];
        videoTitleEl.textContent = currentLanguage === 'fr' ? video.titleFr : video.title;
    }
    
    // Update navigation button states
    const prevBtn = document.querySelector('.video-nav-prev');
    const nextBtn = document.querySelector('.video-nav-next');
    
    if (prevBtn) {
        prevBtn.style.opacity = currentVideoIndex === 0 ? '0.3' : '1';
        prevBtn.style.pointerEvents = currentVideoIndex === 0 ? 'none' : 'auto';
    }
    
    if (nextBtn) {
        nextBtn.style.opacity = currentVideoIndex === videos.length - 1 ? '0.3' : '1';
        nextBtn.style.pointerEvents = currentVideoIndex === videos.length - 1 ? 'none' : 'auto';
    }
}

// Update video titles when language changes
function updateVideoTitles() {
    const cards = document.querySelectorAll('.video-card');
    
    cards.forEach((card, index) => {
        const titleEl = card.querySelector('.card-title');
        if (titleEl && videos[index]) {
            titleEl.textContent = currentLanguage === 'fr' ? videos[index].titleFr : videos[index].title;
        }
    });
    
    // Update current title
    const videoTitleEl = document.querySelector('.current-video-title');
    if (videoTitleEl && videos[currentVideoIndex]) {
        const video = videos[currentVideoIndex];
        videoTitleEl.textContent = currentLanguage === 'fr' ? video.titleFr : video.title;
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ===================================
// INITIALIZE APP
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Preload images first
    preloadImages();
    
    // Initialize all components
    initializeLanguageSwitcher();
    initializeInfiniteScroll();
    initializeScrollAnimations();
    initializeServiceCards();
    initializeSmoothScroll();
    initializeScrollSpy();
    initializeZelijScroll();
    initializeCoverflow();
    
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
    
    // Pause video when tab is hidden
    if (document.hidden && currentPlayingVideo) {
        const currentCard = currentPlayingVideo.closest('.video-card');
        if (currentCard) stopVideo(currentCard);
    }
});
