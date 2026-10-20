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

            const scrollable = Math.max(0, docHeight - winHeight);
            const scrollFraction = scrollable > 0 ? scrollTop / scrollable : 0;

            if (window.innerWidth <= 768 && scrollProgress) {
                scrollProgress.style.width = (scrollFraction * 100) + '%';
            }

            const isNearBottom = docHeight - (scrollTop + winHeight) < 350;
            const isHalfway = scrollFraction >= 0.45 && scrollable > 150;
            const grid2026El = document.getElementById('grid-2026');
            const is2026Active = grid2026El && !grid2026El.classList.contains('hidden-section');

            if (isNearBottom) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }

            if (is2026Active && isHalfway) {
                if (window.loadingToast && !window.loadingToast.classList.contains('show')) {
                    if (typeof window.showLoading === 'function') window.showLoading();
                }
            } else {
                if (window.loadingToast && window.loadingToast.classList.contains('show')) {
                    if (typeof window.hideLoadingToast === 'function') window.hideLoadingToast();
                }
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
        navigator.serviceWorker.register('sw.js?v=4').then((registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch((err) => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// --- 16. YOUTUBE FACADE & AUTO-PAUSE ENGINE ---
function buildYouTubeSrcdoc(videoId, videoTitle, videoAlt) {
    return `<style>*{padding:0;margin:0;overflow:hidden;box-sizing:border-box}html,body{height:100%;background:#000}img{position:absolute;width:100%;height:100%;object-fit:cover;top:0;left:0}a{display:flex;align-items:center;justify-content:center;height:100%;text-decoration:none}.yt-btn{width:68px;height:48px;position:relative;z-index:2;transition:transform 0.2s cubic-bezier(0,0,0.2,1)}.yt-btn svg{width:100%;height:100%;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.4))}a:hover .yt-btn{transform:scale(1.12)}.top-bar{position:absolute;top:0;left:0;right:0;padding:12px 16px;background:linear-gradient(to bottom,rgba(0,0,0,0.7) 0%,transparent 100%);color:#fff;font-family:Roboto,sans-serif;font-size:15px;font-weight:500;z-index:2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}</style><a href=https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1><img src=https://img.youtube.com/vi/${videoId}/maxresdefault.jpg alt='${videoAlt}'><div class=top-bar>${videoTitle}</div><div class=yt-btn><svg viewBox='0 0 68 48'><path d='M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z' fill='#f00'/><polygon points='28,34 45,24 28,14' fill='#fff'/></svg></div></a>`;
}

function setupYouTubeAutoPause() {
    document.querySelectorAll('iframe[data-video-id]').forEach(iframe => {
        if (!iframe.hasAttribute('srcdoc')) {
            const videoId = iframe.getAttribute('data-video-id');
            const videoTitle = iframe.getAttribute('data-video-title') || '';
            const videoAlt = iframe.getAttribute('data-video-alt') || videoTitle;
            iframe.setAttribute('srcdoc', buildYouTubeSrcdoc(videoId, videoTitle, videoAlt));
        }
    });

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

    window.addEventListener('popstate', () => {
        iframes.forEach(pauseVideo);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupYouTubeAutoPause);
} else {
    setupYouTubeAutoPause();
}

// --- 17. STAGED BACKGROUND IMAGE PRELOADER (2026 & ABOUT ME FIRST, THEN SILENT PRELOAD) ---
function setupStagedPreloader() {
    let preloadStarted = false;

    const unlockSectionImages = (sectionEl) => {
        if (!sectionEl) return;
        sectionEl.querySelectorAll('img[loading="lazy"]').forEach(img => {
            img.removeAttribute('loading');
            // Pre-warm browser cache even while parent section has display: none
            if (!img.complete && img.src) {
                const preloader = new Image();
                preloader.decoding = 'async';
                preloader.src = img.src;
            }
        });
    };

    const startSilentBackgroundPreload = () => {
        if (preloadStarted) return;
        preloadStarted = true;

        const secondarySections = [
            document.getElementById('changelogs-section'),
            document.getElementById('grid-all-time'),
            document.getElementById('grid-archives'),
            document.getElementById('mc-photo-section'),
            document.getElementById('cinematics-section')
        ];

        // Stagger each hidden gallery slightly so the main thread stays buttery smooth
        secondarySections.forEach((section, index) => {
            setTimeout(() => {
                unlockSectionImages(section);
            }, index * 400);
        });
    };

    // Wait for initial 2026 Gallery & About Me images to finish (window 'load'), then preload silently
    if (document.readyState === 'complete') {
        setTimeout(startSilentBackgroundPreload, 1200);
    } else {
        window.addEventListener('load', () => {
            setTimeout(startSilentBackgroundPreload, 1200);
        }, { once: true });
        // Safety fallback if window load takes longer than 3.5s
        setTimeout(startSilentBackgroundPreload, 3500);
    }

    // Also unlock immediately if the user hovers or clicks any navigation link early
    const navMap = {
        'nav-changelogs': 'changelogs-section',
        'side-nav-changelogs': 'changelogs-section',
        'nav-all-time': 'grid-all-time',
        'nav-archives': 'grid-archives',
        'nav-mc-photo': 'mc-photo-section',
        'side-nav-mc-photo': 'mc-photo-section',
        'nav-cinematics': 'cinematics-section'
    };

    Object.entries(navMap).forEach(([navId, sectionId]) => {
        const navEl = document.getElementById(navId);
        const sectionEl = document.getElementById(sectionId);
        if (navEl && sectionEl) {
            ['mouseenter', 'touchstart', 'click'].forEach(evt => {
                navEl.addEventListener(evt, () => unlockSectionImages(sectionEl), { once: true, passive: true });
            });
        }
    });
}

setupStagedPreloader();


