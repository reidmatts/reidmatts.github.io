// --- 1. NOTIFICATION REDIRECT LOGIC ---
const loadingToast = document.getElementById("loadingToast");
window.loadingToast = loadingToast;
let toastTimer;

function showLoading() {
    loadingToast.style.display = 'flex'; 
    loadingToast.classList.remove("minimized"); 
    loadingToast.classList.add("show");
    
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        loadingToast.classList.add("minimized");
    }, 4000); 
}

window.showLoading = showLoading;

// --- 5. DRAWER & HAMBURGER MENU LOGIC ---
const hamburgerBtn = document.getElementById("hamburgerBtn");
const leftDrawer = document.getElementById("leftDrawer");
const drawerOverlay = document.getElementById("drawerOverlay");

function toggleDrawer() {
    hamburgerBtn.classList.toggle("open"); 
    leftDrawer.classList.toggle("open");   
    drawerOverlay.classList.toggle("show"); 
    
    if (leftDrawer.classList.contains("open")) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "";
        setTimeout(() => {
            const primary = document.getElementById('primaryNav');
            const settings = document.getElementById('settingsNav');
            if (primary && settings) {
                primary.style.display = "flex";
                settings.style.display = "none";
            }
        }, 450);
    }
}

window.toggleDrawer = toggleDrawer;

hamburgerBtn.addEventListener("click", toggleDrawer);
drawerOverlay.addEventListener("click", toggleDrawer);

// --- 6. MENU NAVIGATION LOGIC ---
const nav2026 = document.getElementById("nav-2026");
const navAllTime = document.getElementById("nav-all-time");
const navArchives = document.getElementById("nav-archives"); 
const sideNavMotion = document.getElementById("side-nav-motion");

const sideNavMcPhoto = document.getElementById("side-nav-mc-photo");
const sideNavMcCinema = document.getElementById("side-nav-mc-cinema");
const sidebarMcLinks = document.getElementById("sidebar-mc-links");
const sidebarIrlLinks = document.getElementById("sidebar-irl-links");
const irlToggleBtn = document.getElementById("irl-toggle-btn");

const navAbout = document.getElementById("nav-about");
const navMotion = document.getElementById("nav-motion");
const navCinematics = document.getElementById("nav-cinematics");
const navMcPhoto = document.getElementById("nav-mc-photo");
const navMcCinema = document.getElementById("nav-mc-cinema");

const grid2026 = document.getElementById("grid-2026");
const gridAllTime = document.getElementById("grid-all-time");
const gridArchives = document.getElementById("grid-archives"); 
const aboutSection = document.getElementById("about-section");
const motionSection = document.getElementById("motion-section");
const cinematicsSection = document.getElementById("cinematics-section");
const mcPhotoSection = document.getElementById("mc-photo-section");
const mcCinemaSection = document.getElementById("mc-cinema-section");

const headerQuote = document.getElementById("headerQuote");
const defaultQuote = '"Sharing Untold Stories Through Leica, Shot With Xiaomi 15"';
const minecraftQuote = '"In Minecraft, the only limit is your imagination"';

let currentSidebarMode = 'irl';
let expandTimer;
let retractTimer;

irlToggleBtn.onclick = function() {
    clearTimeout(retractTimer);
    sidebarIrlLinks.classList.toggle('collapsed');
    irlToggleBtn.classList.toggle('expanded');
};

function setSidebarMode(mode) {
    clearTimeout(expandTimer);
    clearTimeout(retractTimer);
    
    if (mode === 'mc') {
        if (currentSidebarMode !== 'mc') {
            currentSidebarMode = 'mc';
            
            sidebarIrlLinks.classList.add('no-transition', 'collapsed');
            irlToggleBtn.classList.remove('expanded');
            
            void sidebarIrlLinks.offsetWidth;
            sidebarIrlLinks.classList.remove('no-transition');

            sidebarMcLinks.style.display = 'flex'; 
            irlToggleBtn.style.display = 'flex';
            
            expandTimer = setTimeout(() => {
                if (currentSidebarMode === 'mc') {
                    sidebarIrlLinks.classList.remove('collapsed');
                    irlToggleBtn.classList.add('expanded');
                    
                    retractTimer = setTimeout(() => {
                        if (currentSidebarMode === 'mc') {
                            sidebarIrlLinks.classList.add('collapsed');
                            irlToggleBtn.classList.remove('expanded');
                        }
                    }, 2000);
                }
            }, 1000);
        }
    } else if (mode === 'irl') {
        currentSidebarMode = 'irl';
        sidebarMcLinks.style.display = 'none';
        irlToggleBtn.style.display = 'none';
        
        sidebarIrlLinks.classList.add('no-transition');
        sidebarIrlLinks.classList.remove('collapsed');
        irlToggleBtn.classList.remove('expanded');
        
        void sidebarIrlLinks.offsetWidth;
        sidebarIrlLinks.classList.remove('no-transition');
    }
}

window.setSidebarMode = setSidebarMode;

function hideAllSections() {
    grid2026.classList.add("hidden-section");
    gridAllTime.classList.add("hidden-section");
    gridArchives.classList.add("hidden-section"); 
    aboutSection.classList.add("hidden-section");
    motionSection.classList.add("hidden-section");
    cinematicsSection.classList.add("hidden-section");
    mcPhotoSection.classList.add("hidden-section");
    mcCinemaSection.classList.add("hidden-section");
    
    nav2026.classList.remove("active");
    navAllTime.classList.remove("active");
    navArchives.classList.remove("active"); 
    navAbout.classList.remove("active");
    navMotion.classList.remove("active");
    navCinematics.classList.remove("active");
    navMcPhoto.classList.remove("active");
    navMcCinema.classList.remove("active");
    
    if (sideNavMcPhoto) sideNavMcPhoto.classList.remove("active");
    if (sideNavMcCinema) sideNavMcCinema.classList.remove("active");
    if (sideNavMotion) sideNavMotion.classList.remove("active"); 

    headerQuote.innerText = defaultQuote;
}

window.hideAllSections = hideAllSections;

nav2026.onclick = function(event) {
    event.preventDefault(); 
    hideAllSections();
    nav2026.classList.add("active");
    grid2026.classList.remove("hidden-section");
    triggerMobileGridSwitch(); 
    setSidebarMode('irl');
};

navAllTime.onclick = function(event) {
    event.preventDefault(); 
    hideAllSections();
    navAllTime.classList.add("active");
    gridAllTime.classList.remove("hidden-section");
    triggerMobileGridSwitch();
    setSidebarMode('irl');
};

navArchives.onclick = function(event) {
    event.preventDefault(); 
    hideAllSections();
    navArchives.classList.add("active");
    gridArchives.classList.remove("hidden-section");
    triggerMobileGridSwitch();
    setSidebarMode('irl');
};

navAbout.onclick = function(event) {
    event.preventDefault();
    hideAllSections();
    navAbout.classList.add("active");
    aboutSection.classList.remove("hidden-section");
    showLoading(); 
    if (leftDrawer.classList.contains("open")) toggleDrawer();
    setSidebarMode('irl');
    if (window.triggerAboutReveal) window.triggerAboutReveal();
};

navMotion.onclick = function(event) {
    event.preventDefault();
    hideAllSections();
    navMotion.classList.add("active");
    if (sideNavMotion) sideNavMotion.classList.add("active");
    motionSection.classList.remove("hidden-section");
    if (leftDrawer.classList.contains("open")) toggleDrawer();
    setSidebarMode('irl');
};

if (sideNavMotion) {
    sideNavMotion.onclick = function(event) {
        event.preventDefault();
        hideAllSections();
        sideNavMotion.classList.add("active");
        navMotion.classList.add("active");
        motionSection.classList.remove("hidden-section");
        setSidebarMode('irl');
    };
}

const gridVisitMotion = document.getElementById("grid-visit-motion");
if (gridVisitMotion) {
    gridVisitMotion.onclick = function(event) {
        event.preventDefault();
        navMotion.click();
    };
}

navCinematics.onclick = function(event) {
    event.preventDefault();
    hideAllSections();
    navCinematics.classList.add("active");
    cinematicsSection.classList.remove("hidden-section");
    if (leftDrawer.classList.contains("open")) toggleDrawer();
    setSidebarMode('irl');
};

function activateMcPhoto(event) {
    if (event) event.preventDefault();
    hideAllSections();
    navMcPhoto.classList.add("active");
    if (sideNavMcPhoto) sideNavMcPhoto.classList.add("active");
    
    mcPhotoSection.classList.remove("hidden-section");
    headerQuote.innerText = minecraftQuote;
    
    triggerMobileGridSwitch(5000); 
    if (leftDrawer.classList.contains("open")) toggleDrawer();
    setSidebarMode('mc');
}
navMcPhoto.onclick = activateMcPhoto;
if (sideNavMcPhoto) sideNavMcPhoto.onclick = activateMcPhoto;

loadingToast.addEventListener('click', () => {
    navMcPhoto.click(); 
    loadingToast.classList.remove("show", "minimized"); 
    clearTimeout(toastTimer); 
});

function activateMcCinema(event) {
    if (event) event.preventDefault();
    hideAllSections();
    navMcCinema.classList.add("active");
    if (sideNavMcCinema) sideNavMcCinema.classList.add("active");
    
    mcCinemaSection.classList.remove("hidden-section");
    headerQuote.innerText = minecraftQuote;
    
    if (leftDrawer.classList.contains("open")) toggleDrawer();
    setSidebarMode('mc');
}
navMcCinema.onclick = activateMcCinema;
if (sideNavMcCinema) sideNavMcCinema.onclick = activateMcCinema;
