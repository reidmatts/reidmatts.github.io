// --- UNIVERSAL CROSS-DEVICE HAPTIC FEEDBACK ENGINE ---
(function initHapticEngine() {
    let tapticLabel = null;

    // iOS Safari 18+: clicking a <label> bound to an <input type="checkbox" switch> fires the Taptic Engine.
    // (Setting .checked directly does NOT trigger haptics, so we click the label.)
    function triggerAppleHaptic() {
        try {
            if (!tapticLabel) {
                const input = document.createElement('input');
                input.type = 'checkbox';
                input.id = 'hapticSwitchProxy';
                input.setAttribute('switch', '');
                tapticLabel = document.createElement('label');
                tapticLabel.htmlFor = 'hapticSwitchProxy';
                tapticLabel.setAttribute('aria-hidden', 'true');
                const hide = 'position:fixed;opacity:0;pointer-events:none;top:-9999px;left:-9999px;width:1px;height:1px;';
                input.style.cssText = hide;
                tapticLabel.style.cssText = hide;
                document.body.appendChild(input);
                document.body.appendChild(tapticLabel);
            }
            tapticLabel.click();
        } catch (e) {}
    }

    /**
     * @param {'ui' | 'image' | 'egg'} type
     * - 'ui': Menu open/close, section switch, settings toggle
     * - 'image': Image click / modal open & close (crisp light tactile pop)
     * - 'egg': Easter egg burst
     */
    function triggerHaptic(type = 'ui') {
        // Respect user preference to disable haptics
        if (localStorage.getItem('disableHapticsEnabled') === 'true') {
            return;
        }

        // 1. Apple Taptic Engine (iOS Safari / WebKit)
        triggerAppleHaptic();

        // 2. Gamepad / Chrome haptic actuator API (Android / Windows touch / gamepads)
        try {
            if (navigator.getGamepads) {
                const gamepads = navigator.getGamepads();
                if (gamepads && gamepads[0] && gamepads[0].vibrationActuator) {
                    gamepads[0].vibrationActuator.playEffect('dual-rumble', {
                        startDelay: 0,
                        duration: type === 'egg' ? 120 : (type === 'image' ? 10 : 15),
                        weakMagnitude: type === 'image' ? 0.4 : 0.6,
                        strongMagnitude: type === 'image' ? 0.2 : 0.3
                    }).catch(() => {});
                }
            }
        } catch (e) {}

        // 3. Vibration API fallback (Android phones / touch devices with vibration motor):
        if ('vibrate' in navigator) {
            try {
                if (type === 'egg') {
                    navigator.vibrate([60, 40, 70, 40, 100]);
                } else if (type === 'image') {
                    // Ultra-light micro-pulse for crisp image opening feel
                    navigator.vibrate(8);
                } else {
                    // UI navigation / menu / settings toggle
                    navigator.vibrate(12);
                }
            } catch (e) {}
        }
    }

    window.triggerHaptic = triggerHaptic;
})();

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
const toggleDisableHaptics = document.getElementById('toggleDisableHaptics');
const hapticsSettingItem = document.getElementById('hapticsSettingItem');
const toggleExperimental = document.getElementById('toggleExperimental');

openSettingsBtn.onclick = () => {
    if (window.triggerHaptic) window.triggerHaptic('ui');
    primaryNav.style.display = "none";
    settingsNav.style.display = "block";
};

backToNavBtn.onclick = () => {
    if (window.triggerHaptic) window.triggerHaptic('ui');
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
if (localStorage.getItem('disableHapticsEnabled') === 'true') {
    if (toggleDisableHaptics) toggleDisableHaptics.checked = true;
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
    if (window.triggerHaptic) window.triggerHaptic('ui');
    localStorage.setItem('twoGridEnabled', e.target.checked);
    document.body.classList.toggle('force-two-cols', e.target.checked);
});

toggleGridAnim.addEventListener('change', (e) => {
    if (window.triggerHaptic) window.triggerHaptic('ui');
    localStorage.setItem('alwaysGridAnimEnabled', e.target.checked);
});

toggleAlwaysPromo.addEventListener('change', (e) => {
    if (window.triggerHaptic) window.triggerHaptic('ui');
    localStorage.setItem('alwaysPromoEnabled', e.target.checked);
});

toggleDisableIntro.addEventListener('change', (e) => {
    if (window.triggerHaptic) window.triggerHaptic('ui');
    localStorage.setItem('disableIntroAnimation', e.target.checked);
});

toggleLightMode.addEventListener('change', (e) => {
    if (window.triggerHaptic) window.triggerHaptic('ui');
    localStorage.setItem('lightModeEnabled', e.target.checked);
    document.body.classList.toggle('light-theme', e.target.checked);
});

toggleLowDetail.addEventListener('change', (e) => {
    if (window.triggerHaptic) window.triggerHaptic('ui');
    localStorage.setItem('lowDetailEnabled', e.target.checked);
    document.body.classList.toggle('low-detail', e.target.checked);
});

if (toggleDisableHaptics) {
    toggleDisableHaptics.addEventListener('change', (e) => {
        if (!e.target.checked && window.triggerHaptic) {
            // Provide a pleasant tactile confirmation when turning back on
            window.triggerHaptic('ui');
        }
        localStorage.setItem('disableHapticsEnabled', e.target.checked);
    });
}

// --- THE EASTER EGG ---
toggleExperimental.addEventListener('change', (e) => {
    if (window.triggerHaptic) window.triggerHaptic('egg');
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
        if (window.triggerHaptic) {
            window.triggerHaptic('egg');
        } else {
            triggerHaptics();
        }

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
                if (!mysteryPopup.classList.contains('slide-up')) {
                    mysteryPopup.classList.remove('slide-down');
                }
            }, 400);
        }, 5000);
    }

    // Lazy-load egg assets only when someone actually starts holding (zero bytes for normal visitors)
    let eggAssetsLoaded = false;
    function warmEggAssets() {
        if (eggAssetsLoaded) return;
        eggAssetsLoaded = true;
        const img = mysteryPopup.querySelector('img[data-src]');
        if (img) img.src = img.dataset.src;
        if (vineAudio && vineAudio.dataset.src) {
            vineAudio.src = vineAudio.dataset.src;
            vineAudio.preload = 'auto';
            vineAudio.load();
        }
    }

    function startPress(e) {
        warmEggAssets();
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
