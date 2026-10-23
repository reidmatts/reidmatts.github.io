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
        if (loadingToast.classList.contains("show")) {
            loadingToast.classList.add("minimized");
        }
    }, 4000); 
}

function hideLoadingToast() {
    clearTimeout(toastTimer);
    loadingToast.classList.remove("show", "minimized");
}

window.showLoading = showLoading;
window.hideLoadingToast = hideLoadingToast;

// --- 5. DRAWER & HAMBURGER MENU LOGIC ---
const hamburgerBtn = document.getElementById("hamburgerBtn");
const leftDrawer = document.getElementById("leftDrawer");
const drawerOverlay = document.getElementById("drawerOverlay");

function toggleDrawer(options = {}) {
    const { silentHaptic = false } = options;
    if (!silentHaptic && window.triggerHaptic) {
        window.triggerHaptic('ui');
    }
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
const sideNavChangelogs = document.getElementById("side-nav-changelogs");

const sideNavMcPhoto = document.getElementById("side-nav-mc-photo");
const sideNavMcCinema = document.getElementById("side-nav-mc-cinema");
const sidebarMcLinks = document.getElementById("sidebar-mc-links");
const sidebarIrlLinks = document.getElementById("sidebar-irl-links");
const irlToggleBtn = document.getElementById("irl-toggle-btn");

const navChangelogs = document.getElementById("nav-changelogs");
const navAbout = document.getElementById("nav-about");
const navMotion = document.getElementById("nav-motion");
const navCinematics = document.getElementById("nav-cinematics");
const navMcPhoto = document.getElementById("nav-mc-photo");
const navMcCinema = document.getElementById("nav-mc-cinema");
const changelogsMorphPill = document.getElementById("changelogsMorphPill");

const grid2026 = document.getElementById("grid-2026");
const gridAllTime = document.getElementById("grid-all-time");
const gridArchives = document.getElementById("grid-archives"); 
const aboutSection = document.getElementById("about-section");
const motionSection = document.getElementById("motion-section");
const cinematicsSection = document.getElementById("cinematics-section");
const mcPhotoSection = document.getElementById("mc-photo-section");
const mcCinemaSection = document.getElementById("mc-cinema-section");
const changelogsSection = document.getElementById("changelogs-section");

const headerQuote = document.getElementById("headerQuote");
const defaultQuote = '"Sharing Untold Stories Through Leica, Shot With Xiaomi 15"';
const minecraftQuote = '"In Minecraft, the only limit is your imagination"';

let currentSidebarMode = 'irl';
let expandTimer;
let retractTimer;

irlToggleBtn.onclick = function() {
    if (window.triggerHaptic) window.triggerHaptic('ui');
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
    if (changelogsSection) changelogsSection.classList.add("hidden-section");
    
    nav2026.classList.remove("active");
    navAllTime.classList.remove("active");
    navArchives.classList.remove("active"); 
    navAbout.classList.remove("active");
    navMotion.classList.remove("active");
    navCinematics.classList.remove("active");
    navMcPhoto.classList.remove("active");
    navMcCinema.classList.remove("active");
    if (navChangelogs) navChangelogs.classList.remove("active");
    
    if (sideNavMcPhoto) sideNavMcPhoto.classList.remove("active");
    if (sideNavMcCinema) sideNavMcCinema.classList.remove("active");
    if (sideNavMotion) sideNavMotion.classList.remove("active"); 
    if (sideNavChangelogs) sideNavChangelogs.classList.remove("active");

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
    '/minecraft-cinematics',
    '/changelogs'
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
    '#mc-cinema': '/minecraft-cinematics',
    '#changelogs': '/changelogs',
    '#changes': '/changelogs'
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
        toggleDrawer({ silentHaptic: true });
    }
    const imageModal = document.getElementById("imageModal");
    if (imageModal && imageModal.style.display === "flex" && typeof window.closeModal === "function") {
        window.closeModal();
    }

    hideAllSections();
    hideLoadingToast();

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

        case '/changelogs':
            if (navChangelogs) navChangelogs.classList.add("active");
            if (sideNavChangelogs) sideNavChangelogs.classList.add("active");
            if (changelogsSection) changelogsSection.classList.remove("hidden-section");
            setSidebarMode('irl');
            if (window.renderChangelogs) window.renderChangelogs(false);
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

    if (window.triggerHaptic) {
        window.triggerHaptic('ui');
    }

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
bindRouteLink(navChangelogs, '/changelogs');
bindRouteLink(sideNavChangelogs, '/changelogs');
bindRouteLink(navAbout, '/about');
bindRouteLink(navMotion, '/motion');
bindRouteLink(sideNavMotion, '/motion');
bindRouteLink(navCinematics, '/cinematics');
bindRouteLink(navMcPhoto, '/minecraft-photography');
bindRouteLink(sideNavMcPhoto, '/minecraft-photography');
bindRouteLink(navMcCinema, '/minecraft-cinematics');
bindRouteLink(sideNavMcCinema, '/minecraft-cinematics');

if (changelogsMorphPill) {
    changelogsMorphPill.onclick = function(event) {
        if (event) event.preventDefault();
        changelogsMorphPill.classList.remove("morph-out");
        changelogsMorphPill.classList.add("morph-back");
        hamburgerBtn.classList.remove("morph-to-icon");
        navigateTo('/changelogs');
    };
}

// --- MOBILE HAMBURGER MORPH-OUT CHANGELOGS HINT ANIMATION ---
function runMobileChangelogsMorph() {
    if (!changelogsMorphPill || window.innerWidth > 1280) return;

    let morphOutTimer;
    let morphBackTimer;

    morphOutTimer = setTimeout(() => {
        if (leftDrawer && leftDrawer.classList.contains("open")) return;
        // 1. Cleanly morph hamburger lines into the Changelogs image SVG icon & cubic-slide text left
        hamburgerBtn.classList.add("morph-to-icon");
        changelogsMorphPill.classList.remove("morph-back");
        changelogsMorphPill.classList.add("morph-out");

        // 2. Smoothly slide text back & morph the image SVG icon back into the 3 hamburger lines
        morphBackTimer = setTimeout(() => {
            changelogsMorphPill.classList.remove("morph-out");
            changelogsMorphPill.classList.add("morph-back");
            hamburgerBtn.classList.remove("morph-to-icon");
        }, 2800);
    }, 800);

    hamburgerBtn.addEventListener("click", () => {
        clearTimeout(morphOutTimer);
        clearTimeout(morphBackTimer);
        changelogsMorphPill.classList.remove("morph-out");
        changelogsMorphPill.classList.add("morph-back");
        hamburgerBtn.classList.remove("morph-to-icon");
    });
}

runMobileChangelogsMorph();

// --- 6C. CURATED CHANGELOGS ENGINE (GITHUB COMMIT TIMESTAMPS & 31-DAY FILTER) ---
const CHANGELOG_ITEMS_SEED = [
    {
        filename: "ConcertBW.avif",
        src: "Photography/2026/ConcertBW.avif",
        addedAtMs: 1792415846 * 1000
    },
    {
        filename: "guitarkid.avif",
        src: "Photography/2026/guitarkid.avif",
        addedAtMs: 1791504826 * 1000
    },
    {
        filename: "waterfallwide.avif",
        src: "Photography/2026/waterfallwide.avif",
        addedAtMs: 1791504826 * 1000
    },
    {
        filename: "waterfall.avif",
        src: "Photography/2026/waterfall.avif",
        addedAtMs: 1787377019 * 1000
    },
    {
        filename: "sharkgirl.avif",
        src: "Photography/2026/sharkgirl.avif",
        addedAtMs: 1785583230 * 1000
    },
    {
        filename: "birdguy.avif",
        src: "Photography/2026/birdguy.avif",
        addedAtMs: 1785506507 * 1000
    },
    {
        filename: "voque.avif",
        src: "Photography/2026/voque.avif",
        addedAtMs: 1785230828 * 1000
    },
    {
        filename: "2024portraitgirl.avif",
        src: "Photography/2026/2024portraitgirl.avif",
        addedAtMs: 1785331245 * 1000
    }
];

function getCollectionNameFromSrc(src) {
    if (!src) return "2026";
    if (src.includes("Photography/2026/")) return "2026";
    if (src.includes("Photography/AllTime/")) return "All Time";
    if (src.includes("Photography/Archives/")) return "Archives";
    if (src.includes("PhotographyMinecraft/Photography/")) return "Minecraft Photography";
    return "2026";
}

function formatRelativeTime(timestampMs) {
    const diffMs = Math.max(0, Date.now() - timestampMs);
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    return `${days} day${days === 1 ? '' : 's'} ago`;
}

let isSyncingGitHub = false;

async function syncGitHubCommitTimestamps() {
    if (isSyncingGitHub) return;
    isSyncingGitHub = true;
    try {
        const res = await fetch("https://api.github.com/repos/reidmatts/reidmatts.github.io/commits?per_page=25", {
            headers: { "Accept": "application/vnd.github.v3+json" }
        });
        if (!res.ok) return;
        const commits = await res.json();
        if (!Array.isArray(commits)) return;

        // Match commit messages or fetch recent image commits if available
        commits.forEach(c => {
            if (!c || !c.commit || !c.commit.author || !c.commit.author.date) return;
            const msg = (c.commit.message || "").toLowerCase();
            const commitTime = new Date(c.commit.author.date).getTime();
            if (!commitTime || isNaN(commitTime)) return;

            CHANGELOG_ITEMS_SEED.forEach(item => {
                const baseName = item.filename.toLowerCase();
                if (msg.includes(baseName)) {
                    item.addedAtMs = commitTime;
                }
            });
        });
    } catch (e) {
        // Offline or rate-limited: fallback to exact local Git commit timestamps
    } finally {
        isSyncingGitHub = false;
    }
}

function renderChangelogs(triggerNetworkSync = false) {
    const feedEl = document.getElementById("changelogsFeed");
    if (!feedEl) return;

    const thirtyOneDaysMs = 31 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    // Filter curated additions strictly within the past 31 days
    const recentAdditions = CHANGELOG_ITEMS_SEED
        .filter(item => (now - item.addedAtMs) <= thirtyOneDaysMs && (now - item.addedAtMs) >= -86400000)
        .sort((a, b) => b.addedAtMs - a.addedAtMs);

    if (recentAdditions.length === 0) {
        feedEl.innerHTML = `<div class="changelogs-empty">No new curated additions in the past 31 days.</div>`;
        return;
    }

    feedEl.innerHTML = recentAdditions.map((item, idx) => {
        const collectionLabel = item.collection || getCollectionNameFromSrc(item.src);
        return `
        <article class="changelog-card" style="animation-delay: ${idx * 0.08}s;">
            <div class="changelog-ambient-bleed" style="background-image: url('${item.src}');" aria-hidden="true"></div>
            <div class="changelog-card-surface">
                <div class="changelog-card-inner">
                    <div class="changelog-media">
                        <img src="${item.src}" alt="${item.filename}" loading="lazy" decoding="async">
                    </div>
                    <div class="changelog-body">
                        <div class="changelog-meta-row">
                            <h3 class="changelog-item-title">New Curated Image!</h3>
                            <span class="changelog-time">${formatRelativeTime(item.addedAtMs)}</span>
                        </div>
                        <p class="changelog-desc">Added <span class="changelog-filename">${item.filename}</span> to the curated collection (${collectionLabel})</p>
                    </div>
                </div>
            </div>
        </article>
        `;
    }).join('');

    if (typeof window.attachModalEvents === "function") {
        window.attachModalEvents();
    }

    if (triggerNetworkSync) {
        syncGitHubCommitTimestamps().then(() => {
            renderChangelogs(false);
        });
    }
}

window.renderChangelogs = renderChangelogs;
renderChangelogs(true);

const refreshChangelogsBtn = document.getElementById("refreshChangelogsBtn");
if (refreshChangelogsBtn) {
    refreshChangelogsBtn.addEventListener("click", () => {
        refreshChangelogsBtn.classList.add("spinning");
        renderChangelogs(true);
        setTimeout(() => {
            refreshChangelogsBtn.classList.remove("spinning");
        }, 650);
    });
}

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

