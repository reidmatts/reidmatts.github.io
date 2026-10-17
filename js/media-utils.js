// --- 8. ANTI-INSPECT SHORTCUT BLOCKS ---
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || 
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) || 
        ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U'))) {
        e.preventDefault();
        return false;
    }
});

// --- 9 & 11. UNIFIED SCROLL ENGINE (PROGRESS BAR & SCROLL TO TOP) ---
const scrollProgress = document.getElementById('scrollProgress');
const scrollTopBtn = document.getElementById('scrollTopBtn');
let isScrollTicking = false;

window.addEventListener('scroll', () => {
    if (!isScrollTicking) {
        window.requestAnimationFrame(() => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight;
            const winHeight = window.innerHeight;

            if (window.innerWidth <= 768 && scrollProgress) {
                const scrollable = docHeight - winHeight;
                const scrolled = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;
                scrollProgress.style.width = scrolled + '%';
            }

            if (docHeight - (scrollTop + winHeight) < 350) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }

            isScrollTicking = false;
        });
        isScrollTicking = true;
    }
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById("copyrightYear").innerText = new Date().getFullYear();

// --- 13. MOBILE 2026 PROMO BANNER ENGINE ---
function initMobileBanner() {
    const mobileBanner = document.getElementById('mobile-2026-banner');
    const mobileDivider = document.getElementById('mobileBannerDivider');
    if (!mobileBanner) return;

    const isMobile = window.innerWidth <= 768;
    const bannerVersion = mobileBanner.getAttribute('data-version');
    const memoryKey = 'seenMobileBanner_' + bannerVersion;
    const forceAlwaysPromo = localStorage.getItem('alwaysPromoEnabled') === 'true';

    if (isMobile) {
        if (!localStorage.getItem(memoryKey) || forceAlwaysPromo) {
            mobileBanner.classList.remove('mobile-banner-hide');
            if (mobileDivider) mobileDivider.classList.remove('mobile-banner-hide');
        }

        const closeBtn = document.getElementById('closeMobileBanner');
        if (closeBtn) {
            closeBtn.onclick = function() {
                mobileBanner.style.opacity = '0';
                if (mobileDivider) mobileDivider.style.opacity = '0';
                
                mobileBanner.style.transition = 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), margin 0.45s cubic-bezier(0.16, 1, 0.3, 1), height 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
                mobileBanner.style.height = '0px';
                mobileBanner.style.marginBottom = '0px';
                if (mobileDivider) mobileDivider.style.margin = '0px';
                
                setTimeout(() => {
                    mobileBanner.style.display = 'none';
                    if (mobileDivider) mobileDivider.style.display = 'none';
                    if (!forceAlwaysPromo) {
                        localStorage.setItem(memoryKey, 'true');
                    }
                }, 450);
            };
        }
    }
}

initMobileBanner();

// --- 14. AUTO-DETECT PORTRAITS IN 2026 BANNER ---
function autoStraightenBanner() {
    const promoBanner = document.getElementById('mobile-2026-banner');
    if (!promoBanner) return;

    const bannerImages = promoBanner.querySelectorAll('.banner-item img');
    bannerImages.forEach(img => {
        const applyStraighten = () => {
            if (img.naturalHeight > img.naturalWidth) {
                promoBanner.classList.add('snap-active', 'straight-mode');
                img.parentElement.classList.add('is-portrait');
                setTimeout(() => {
                    promoBanner.classList.remove('snap-active');
                }, 50);
            }
        };

        if (img.complete && img.naturalHeight !== 0) {
            applyStraighten();
        } else {
            img.addEventListener('load', applyStraighten, { once: true });
        }
    });
}

autoStraightenBanner();

// --- 15. PWA SERVICE WORKER REGISTRATION ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js?v=2').then((registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch((err) => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// --- 16. YOUTUBE AUTO-PAUSE ENGINE ---
function setupYouTubeAutoPause() {
    const iframes = document.querySelectorAll('.image-item iframe');

    const pauseVideo = (iframe) => {
        if (iframe && iframe.contentWindow) {
            try {
                iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            } catch (e) {}
        }
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                pauseVideo(entry.target);
            }
        });
    }, { threshold: 0.1 });

    iframes.forEach(iframe => observer.observe(iframe));

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            iframes.forEach(pauseVideo);
        }
    });
    
    document.querySelectorAll('nav a, .sidebar-toggle, #grid-visit-motion').forEach(link => {
        link.addEventListener('click', () => {
            iframes.forEach(pauseVideo);
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupYouTubeAutoPause);
} else {
    setupYouTubeAutoPause();
}
