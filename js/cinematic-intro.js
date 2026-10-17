// --- 12. CINEMATIC DESKTOP INTRO ENGINE ---
function runCinematicIntro() {
    const isDesktop = window.innerWidth > 1280;
    const navEntries = performance.getEntriesByType('navigation');
    const isReload = navEntries.length > 0 && navEntries[0].type === 'reload';

    const hasSeenIntro = localStorage.getItem('hasSeenCinematicIntro') === 'true';
    const disableIntro = localStorage.getItem('disableIntroAnimation') === 'true';

    if (isDesktop && !disableIntro && !isReload) { 
        const isLight = document.body.classList.contains('light-theme');
        const overlayFadeColor = isLight ? '#f5f5f7' : '#121212';

        const lockOverlay = document.createElement('div');
        lockOverlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99999;background-color:rgba(18,18,18,0);transition:background-color 0.8s cubic-bezier(0.16, 1, 0.3, 1);cursor:wait;';
        document.body.appendChild(lockOverlay);

        let skipBtn = null;
        if (hasSeenIntro) {
            skipBtn = document.createElement('div');
            skipBtn.className = 'skip-intro-btn';
            skipBtn.innerHTML = `Skip <svg viewBox="0 0 38 24"><path d="M2 12h32M26 5l8 7-8 7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            lockOverlay.appendChild(skipBtn);
            setTimeout(() => { skipBtn.style.opacity = '1'; }, 1000);
        }

        const preventScroll = (e) => e.preventDefault();
        const preventKeys = (e) => {
            if (["Space","ArrowUp","ArrowDown","PageUp","PageDown","Home","End"].includes(e.code)) e.preventDefault();
        };
        window.addEventListener('wheel', preventScroll, { passive: false });
        window.addEventListener('touchmove', preventScroll, { passive: false });
        window.addEventListener('keydown', preventKeys, { passive: false });

        let scrollAnimId = null;
        function cinematicScroll(targetEl, duration) {
            const targetY = targetEl.getBoundingClientRect().top + window.scrollY - (window.innerHeight / 2) + (targetEl.offsetHeight / 2) - 40;
            const startY = window.scrollY;
            const diff = targetY - startY;
            let start = null;

            window.requestAnimationFrame(function step(timestamp) {
                if (!start) start = timestamp;
                const time = timestamp - start;
                let percent = Math.min(time / duration, 1);
                percent = percent < 0.5 ? 4 * percent * percent * percent : 1 - Math.pow(-2 * percent + 2, 3) / 2;
                window.scrollTo(0, startY + diff * percent);
                if (time < duration) {
                    scrollAnimId = window.requestAnimationFrame(step);
                }
            });
        }

        hideAllSections();
        navAbout.classList.add("active");
        aboutSection.classList.remove("hidden-section");
        window.scrollTo(0, 0);

        if (loadingToast) loadingToast.style.display = 'none';

        let loadedCount = 0;
        let sequenceStarted = false;
        let t1, t2, t3, fallbackTimer;

        const finalizeIntro = () => {
            hideAllSections();
            nav2026.classList.add("active");
            grid2026.classList.remove("hidden-section");
            window.scrollTo(0, 0);

            shuffleGalleries(); 
            if (window.refreshBadges) window.refreshBadges();

            lockOverlay.style.backgroundColor = 'rgba(18,18,18,0)';

            setTimeout(() => {
                lockOverlay.remove();
                window.removeEventListener('wheel', preventScroll);
                window.removeEventListener('touchmove', preventScroll);
                window.removeEventListener('keydown', preventKeys);
                showLoading();
                localStorage.setItem('hasSeenCinematicIntro', 'true');
            }, 800);
        };

        const skipSequence = () => {
            clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(fallbackTimer);
            if (scrollAnimId) cancelAnimationFrame(scrollAnimId);
            if (skipBtn) skipBtn.style.opacity = '0';
            
            lockOverlay.style.transition = 'background-color 0.4s ease';
            lockOverlay.style.backgroundColor = overlayFadeColor;
            setTimeout(finalizeIntro, 400); 
        };

        if (skipBtn) {
            skipBtn.addEventListener('click', skipSequence);
        }

        const startMovieSequence = () => {
            if (sequenceStarted) return;
            sequenceStarted = true;

            t1 = setTimeout(() => {
                const mobilePhotoBlock = aboutSection.querySelector('.about-block');
                if (mobilePhotoBlock) {
                    cinematicScroll(mobilePhotoBlock, 2000); 
                }

                t2 = setTimeout(() => {
                    if (skipBtn) skipBtn.style.opacity = '0';
                    lockOverlay.style.backgroundColor = overlayFadeColor; 

                    t3 = setTimeout(() => {
                        finalizeIntro();
                    }, 800); 
                }, 3000); 
            }, 3000); 
        };

        const bannerImgs = Array.from(aboutSection.querySelectorAll('.banner-item img'));
        fallbackTimer = setTimeout(startMovieSequence, 5000);

        if (bannerImgs.length === 0) {
            startMovieSequence();
        } else {
            bannerImgs.forEach(img => {
                if (img.complete && img.naturalHeight !== 0) {
                    loadedCount++;
                } else {
                    img.addEventListener('load', () => { 
                        loadedCount++; if (loadedCount === bannerImgs.length) startMovieSequence(); 
                    }, { once: true });
                    img.addEventListener('error', () => { 
                        loadedCount++; if (loadedCount === bannerImgs.length) startMovieSequence(); 
                    }, { once: true });
                }
            });
            if (loadedCount === bannerImgs.length) startMovieSequence();
        }
        
        return true; 
    }
    return false; 
}

const isIntroRunning = runCinematicIntro();
if (!isIntroRunning) {
    setTimeout(showLoading, 100);
}
