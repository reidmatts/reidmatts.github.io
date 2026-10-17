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
