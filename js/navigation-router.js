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

// --- 6A. HTML5 HISTORY API ROUTER (CLEAN PATHNAME URLS) ---
const VALID_ROUTES = new Set([
    '/',
    '/all-time',
    '/archives',
    '/motion',
    '/about',
    '/cinematics',
    '/minecraft-photography',
    '/minecraft-cinematics'
]);

const HASH_TO_PATH = {
    '#2026': '/',
    '#home': '/',
    '#all-time': '/all-time',
    '#archives': '/archives',
    '#motion': '/motion',
    '#about': '/about',
    '#cinematics': '/cinematics',
    '#minecraft-photography': '/minecraft-photography',
    '#mc-photo': '/minecraft-photography',
    '#minecraft-cinematics': '/minecraft-cinematics',
    '#mc-cinema': '/minecraft-cinematics'
};

function normalizePath(rawPath) {
    if (!rawPath) return '/';
    let clean = rawPath.split('?')[0].split('#')[0].trim();
    if (!clean.startsWith('/')) clean = '/' + clean;
    if (clean.length > 1 && clean.endsWith('/')) {
        clean = clean.slice(0, -1);
    }
    if (clean === '/index.html') return '/';
    return VALID_ROUTES.has(clean) ? clean : '/';
}

function resolveInitialRoute() {
    // 1. Check if redirected from 404.html via sessionStorage or ?p= query param
    const savedRedirect = sessionStorage.getItem('spa_redirect_path');
    if (savedRedirect) {
        sessionStorage.removeItem('spa_redirect_path');
        return normalizePath(savedRedirect);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const queryRoute = urlParams.get('p') || urlParams.get('route');
    if (queryRoute) {
        return normalizePath(queryRoute);
    }

    // 2. Legacy hash fallback (e.g. /#motion -> /motion)
    if (window.location.hash) {
        const lowerHash = window.location.hash.toLowerCase();
        if (HASH_TO_PATH[lowerHash]) {
            return HASH_TO_PATH[lowerHash];
        }
        const stripped = '/' + lowerHash.replace(/^#\/?/, '');
        if (VALID_ROUTES.has(stripped)) {
            return stripped;
        }
    }

    // 3. Direct pathname
    return normalizePath(window.location.pathname);
}

function applyRouteDOM(path, options = {}) {
    const { isInitialLoad = false } = options;
    const targetPath = normalizePath(path);

    // Ensure drawer and fullscreen modal close gracefully on navigation / back button
    if (leftDrawer && leftDrawer.classList.contains("open")) {
        toggleDrawer();
    }
    const imageModal = document.getElementById("imageModal");
    if (imageModal && imageModal.style.display === "flex" && typeof window.closeModal === "function") {
        window.closeModal();
    }

    hideAllSections();

    switch (targetPath) {
        case '/all-time':
            navAllTime.classList.add("active");
            gridAllTime.classList.remove("hidden-section");
            if (!isInitialLoad) triggerMobileGridSwitch();
            setSidebarMode('irl');
            break;

        case '/archives':
            navArchives.classList.add("active");
            gridArchives.classList.remove("hidden-section");
            if (!isInitialLoad) triggerMobileGridSwitch();
            setSidebarMode('irl');
            break;

        case '/about':
            navAbout.classList.add("active");
            aboutSection.classList.remove("hidden-section");
            if (!isInitialLoad) showLoading();
            setSidebarMode('irl');
            if (window.triggerAboutReveal) window.triggerAboutReveal();
            break;

        case '/motion':
            navMotion.classList.add("active");
            if (sideNavMotion) sideNavMotion.classList.add("active");
            motionSection.classList.remove("hidden-section");
            setSidebarMode('irl');
            break;

        case '/cinematics':
            navCinematics.classList.add("active");
            cinematicsSection.classList.remove("hidden-section");
            setSidebarMode('irl');
            break;

        case '/minecraft-photography':
            navMcPhoto.classList.add("active");
            if (sideNavMcPhoto) sideNavMcPhoto.classList.add("active");
            mcPhotoSection.classList.remove("hidden-section");
            headerQuote.innerText = minecraftQuote;
            if (!isInitialLoad) triggerMobileGridSwitch(5000);
            setSidebarMode('mc');
            break;

        case '/minecraft-cinematics':
            navMcCinema.classList.add("active");
            if (sideNavMcCinema) sideNavMcCinema.classList.add("active");
            mcCinemaSection.classList.remove("hidden-section");
            headerQuote.innerText = minecraftQuote;
            setSidebarMode('mc');
            break;

        case '/':
        default:
            nav2026.classList.add("active");
            grid2026.classList.remove("hidden-section");
            if (!isInitialLoad) triggerMobileGridSwitch();
            setSidebarMode('irl');
            break;
    }

    if (!isInitialLoad) {
        window.scrollTo(0, 0);
        if (window.refreshBadges) {
            setTimeout(() => window.refreshBadges(), 50);
        }
    }
}

function navigateTo(path, replace = false) {
    const targetPath = normalizePath(path);
    const currentPath = normalizePath(window.location.pathname);

    if (replace) {
        try {
            history.replaceState({ path: targetPath }, '', targetPath);
        } catch (e) {}
    } else if (currentPath !== targetPath || window.location.hash || window.location.search) {
        try {
            history.pushState({ path: targetPath }, '', targetPath);
        } catch (e) {}
    }

    applyRouteDOM(targetPath, { isInitialLoad: false });
}

window.navigateTo = navigateTo;

// --- BIND NAVIGATION LINKS ---
function bindRouteLink(element, path) {
    if (!element) return;
    element.onclick = function(event) {
        if (event) event.preventDefault();
        navigateTo(path);
    };
}

bindRouteLink(nav2026, '/');
bindRouteLink(navAllTime, '/all-time');
bindRouteLink(navArchives, '/archives');
bindRouteLink(navAbout, '/about');
bindRouteLink(navMotion, '/motion');
bindRouteLink(sideNavMotion, '/motion');
bindRouteLink(navCinematics, '/cinematics');
bindRouteLink(navMcPhoto, '/minecraft-photography');
bindRouteLink(sideNavMcPhoto, '/minecraft-photography');
bindRouteLink(navMcCinema, '/minecraft-cinematics');
bindRouteLink(sideNavMcCinema, '/minecraft-cinematics');

const gridVisitMotion = document.getElementById("grid-visit-motion");
if (gridVisitMotion) {
    gridVisitMotion.onclick = function(event) {
        event.preventDefault();
        navigateTo('/motion');
    };
}

loadingToast.addEventListener('click', () => {
    navigateTo('/minecraft-photography');
    loadingToast.classList.remove("show", "minimized");
    clearTimeout(toastTimer);
});

// --- BROWSER BACK / FORWARD (POPSTATE) ---
window.addEventListener('popstate', (event) => {
    const targetPath = (event.state && event.state.path)
        ? normalizePath(event.state.path)
        : normalizePath(window.location.pathname);
    applyRouteDOM(targetPath, { isInitialLoad: false });
});

// --- INITIALIZE ROUTE ON PAGE LOAD ---
const initialRoute = resolveInitialRoute();
window.initialRoute = initialRoute;

try {
    history.replaceState({ path: initialRoute }, '', initialRoute);
} catch (e) {}

if (initialRoute !== '/') {
    applyRouteDOM(initialRoute, { isInitialLoad: true });
}

