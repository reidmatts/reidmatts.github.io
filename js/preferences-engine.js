// --- 10. SETTINGS & LOCAL STORAGE MEMORY ENGINE ---
const primaryNav = document.getElementById('primaryNav');
const settingsNav = document.getElementById('settingsNav');
const openSettingsBtn = document.getElementById('openSettingsBtn');
const backToNavBtn = document.getElementById('backToNavBtn');

const toggleTwoGrid = document.getElementById('toggleTwoGrid');
const toggleGridAnim = document.getElementById('toggleGridAnim');
const toggleAlwaysPromo = document.getElementById('toggleAlwaysPromo');
const toggleDisableIntro = document.getElementById('toggleDisableIntro');
const toggleLightMode = document.getElementById('toggleLightMode');
const toggleLowDetail = document.getElementById('toggleLowDetail');
const toggleExperimental = document.getElementById('toggleExperimental');

openSettingsBtn.onclick = () => {
    primaryNav.style.display = "none";
    settingsNav.style.display = "block";
};

backToNavBtn.onclick = () => {
    settingsNav.style.display = "none";
    primaryNav.style.display = "flex";
};

if (localStorage.getItem('twoGridEnabled') === 'true') {
    toggleTwoGrid.checked = true;
    document.body.classList.add('force-two-cols');
}
if (localStorage.getItem('alwaysGridAnimEnabled') === 'true') {
    toggleGridAnim.checked = true;
}
if (localStorage.getItem('disableIntroAnimation') === 'true') {
    toggleDisableIntro.checked = true;
}
if (localStorage.getItem('alwaysPromoEnabled') === 'true') {
    toggleAlwaysPromo.checked = true;
}
if (localStorage.getItem('lightModeEnabled') === 'true') {
    toggleLightMode.checked = true;
    document.body.classList.add('light-theme');
}
const savedLowDetail = localStorage.getItem('lowDetailEnabled');
if (savedLowDetail === 'true') {
    toggleLowDetail.checked = true;
    document.body.classList.add('low-detail');
} else if (savedLowDetail === null) {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isLowMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;
    const isLowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    const isDataSaver = navigator.connection && navigator.connection.saveData === true;

    if (prefersReducedMotion || isDataSaver || (isLowMemory && isLowCPU)) {
        toggleLowDetail.checked = true;
        document.body.classList.add('low-detail');
    }
}

toggleTwoGrid.addEventListener('change', (e) => {
    localStorage.setItem('twoGridEnabled', e.target.checked);
    document.body.classList.toggle('force-two-cols', e.target.checked);
});

toggleGridAnim.addEventListener('change', (e) => {
    localStorage.setItem('alwaysGridAnimEnabled', e.target.checked);
});

toggleAlwaysPromo.addEventListener('change', (e) => {
    localStorage.setItem('alwaysPromoEnabled', e.target.checked);
});

toggleDisableIntro.addEventListener('change', (e) => {
    localStorage.setItem('disableIntroAnimation', e.target.checked);
});

toggleLightMode.addEventListener('change', (e) => {
    localStorage.setItem('lightModeEnabled', e.target.checked);
    document.body.classList.toggle('light-theme', e.target.checked);
});

toggleLowDetail.addEventListener('change', (e) => {
    localStorage.setItem('lowDetailEnabled', e.target.checked);
    document.body.classList.toggle('low-detail', e.target.checked);
});

// --- THE EASTER EGG ---
toggleExperimental.addEventListener('change', (e) => {
    if (e.target.checked) {
        e.target.checked = false;
        const trap = document.getElementById('trapOverlay');
        const video = document.getElementById('trapVideo');
        const audio = document.getElementById('trapAudio');
        
        trap.style.display = "flex";
        video.muted = true;
        video.play().catch(err => console.log("Video play error:", err));
        audio.play().catch(err => console.log("Audio play error:", err));

        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(() => {});
        }
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(() => {});
        }
    }
});

// --- YOUTUBE ICON 1.5-SECOND HOLD EASTER EGG ---
(function initYouTubeEasterEgg() {
    const ytLink = document.querySelector('.drawer-yt-link');
    const ytIcon = document.querySelector('.drawer-yt-icon');
    const mysteryPopup = document.getElementById('mysteryFacePopup');
    const vineAudio = document.getElementById('vineBoomAudio');

    if (!ytLink || !ytIcon || !mysteryPopup) return;

    let holdTimer = null;
    let dismissTimer = null;
    let didTriggerEasterEgg = false;

    function triggerHaptics() {
        if ('vibrate' in navigator) {
            try {
                // Rapid burst pattern for tactile impact
                navigator.vibrate([60, 40, 70, 40, 100]);
            } catch (err) {}
        }
    }

    function launchEasterEgg() {
        didTriggerEasterEgg = true;
        clearTimeout(holdTimer);
        holdTimer = null;

        // 1. Shake the YouTube logo cutely
        ytIcon.classList.add('cute-shake');

        // 2. Play vineboom sound
        if (vineAudio) {
            vineAudio.currentTime = 0;
            vineAudio.play().catch(() => {});
        }

        // 3. Trigger haptic feedback / rapid vibration on mobile
        triggerHaptics();

        // 4. Slide face up at furthest bottom left
        if (dismissTimer) clearTimeout(dismissTimer);
        mysteryPopup.classList.remove('slide-down');
        mysteryPopup.classList.add('slide-up');

        // 5. Slide back down after 5 seconds
        dismissTimer = setTimeout(() => {
            mysteryPopup.classList.remove('slide-up');
            mysteryPopup.classList.add('slide-down');
            ytIcon.classList.remove('cute-shake');

            setTimeout(() => {
                mysteryPopup.classList.remove('slide-down');
            }, 400);
        }, 5000);
    }

    function startPress(e) {
        // Prevent default context menu on long press on mobile
        didTriggerEasterEgg = false;
        clearTimeout(holdTimer);
        holdTimer = setTimeout(launchEasterEgg, 1500);
    }

    function cancelPress() {
        clearTimeout(holdTimer);
        holdTimer = null;
    }

    // Touch events for mobile phones
    ytLink.addEventListener('touchstart', (e) => {
        startPress(e);
    }, { passive: true });

    ytLink.addEventListener('touchend', (e) => {
        cancelPress();
        if (didTriggerEasterEgg) {
            if (e.cancelable) e.preventDefault();
        }
    });

    ytLink.addEventListener('touchcancel', cancelPress);
    ytLink.addEventListener('touchmove', cancelPress);

    // Mouse events for desktop
    ytLink.addEventListener('mousedown', (e) => {
        if (e.button === 0) { // left click only
            startPress(e);
        }
    });

    ytLink.addEventListener('mouseup', cancelPress);
    ytLink.addEventListener('mouseleave', cancelPress);

    // Suppress context menu on long touch on mobile so browser menu doesn't block the egg
    ytLink.addEventListener('contextmenu', (e) => {
        if (didTriggerEasterEgg || holdTimer) {
            e.preventDefault();
        }
    });

    // Prevent navigation if the long press triggered the egg
    ytLink.addEventListener('click', (e) => {
        if (didTriggerEasterEgg) {
            e.preventDefault();
            e.stopPropagation();
            didTriggerEasterEgg = false;
        }
    });
})();
