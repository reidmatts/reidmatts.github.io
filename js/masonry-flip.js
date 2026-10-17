// --- 2. RANDOMIZE GALLERY ORDER (TRUE JS MASONRY FOR DESKTOP) ---
function shuffleGalleries(forceReshuffle = false) {
    const grids = document.querySelectorAll('.image-grid');
    const isDesktop = window.innerWidth > 1280;
    const estimatedGridWidth = window.innerWidth - 320;
    const targetCols = isDesktop ? Math.max(1, Math.floor(estimatedGridWidth / 315)) : 0;
    
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    grids.forEach(grid => {
        const currentMode = isDesktop ? `desktop-${targetCols}` : 'mobile';
        const isAlreadyShuffled = grid.dataset.shuffled === 'true';

        // Skip DOM teardown if layout mode & column count haven't changed (prevents iframe reloads)
        if (!forceReshuffle && isAlreadyShuffled && grid.dataset.layoutMode === currentMode) {
            return;
        }

        const allItems = Array.from(grid.querySelectorAll('.image-item'));
        if (allItems.length === 0) return;

        const promoItem = allItems.find(item => item.classList.contains('motion-grid-promo'));
        const fixedItems = allItems.filter(item => item.classList.contains('fixed-order') && !item.classList.contains('motion-grid-promo'));
        const normalItems = allItems.filter(item => !item.classList.contains('fixed-order') && !item.classList.contains('motion-grid-promo'));

        Array.from(grid.children).forEach(child => {
            if (!child.classList.contains('image-item')) {
                child.remove();
            }
        });

        if (isDesktop) {
            if (!isAlreadyShuffled || forceReshuffle) {
                shuffleArray(fixedItems);
                shuffleArray(normalItems);
            }

            grid.style.columnCount = 'auto'; 
            grid.style.columnWidth = 'auto';
            grid.style.display = 'flex';
            grid.style.alignItems = 'flex-start';
            grid.style.gap = '15px';

            const numCols = targetCols;
            const columns = [];
            for (let i = 0; i < numCols; i++) {
                const col = document.createElement('div');
                col.style.display = 'flex';
                col.style.flexDirection = 'column';
                col.style.gap = '20px'; 
                col.style.flex = '1';
                col.style.minWidth = '0'; 
                grid.appendChild(col);
                columns.push(col);
            }
            
            if (promoItem) {
                grid.appendChild(promoItem);
            }

            fixedItems.forEach((item, index) => {
                item.style.marginBottom = '0'; 
                columns[index % numCols].appendChild(item);
            });
            
            normalItems.forEach((item, index) => {
                item.style.marginBottom = '0'; 
                columns[(fixedItems.length + index) % numCols].appendChild(item);
            });
        } else {
            grid.style.columnCount = ''; 
            grid.style.columnWidth = '';
            grid.style.display = '';
            grid.style.alignItems = '';
            grid.style.gap = '';

            if (!isAlreadyShuffled || forceReshuffle) {
                shuffleArray(normalItems);
            }
            
            fixedItems.forEach((item, index) => {
                item.style.marginBottom = '';
                grid.appendChild(item);
                if (index === 1 && promoItem) {
                    promoItem.style.marginBottom = '';
                    grid.appendChild(promoItem);
                }
            });

            if (promoItem && fixedItems.length < 2) {
                promoItem.style.marginBottom = '';
                grid.appendChild(promoItem);
            }

            normalItems.forEach(item => {
                item.style.marginBottom = '';
                grid.appendChild(item);
            });
        }

        grid.dataset.shuffled = 'true';
        grid.dataset.layoutMode = currentMode;
    });
}

window.shuffleGalleries = shuffleGalleries;

requestAnimationFrame(() => {
    shuffleGalleries();
});

// --- MAKE GRID RESPONSIVE TO ZOOM & RESIZE ---
let resizeTimer;
let currentWindowWidth = window.innerWidth; 

window.addEventListener('resize', () => {
    if (window.innerWidth === currentWindowWidth) return; 
    currentWindowWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    
    resizeTimer = setTimeout(() => {
        document.querySelectorAll('.favorite-badge, .award-badge, .new-text-label').forEach(badge => badge.remove());
        document.querySelectorAll('.badge-completed').forEach(item => item.classList.remove('badge-completed'));

        shuffleGalleries();
        if (window.refreshBadges) window.refreshBadges();
    }, 250); 
});

// --- 4. MOBILE GRID 2-TO-1 ANIMATION LOGIC (FLIP TECHNIQUE) ---
let mobileGridTimer;
let isAnimating = false;

function performSmoothLayoutChange(gridElement, addTwoColumns) {
    if (!gridElement || isAnimating) return;
    isAnimating = true;
    
    const items = Array.from(gridElement.querySelectorAll('.image-item'));
    if (items.length === 0) {
        isAnimating = false;
        return;
    }

    const firstRects = items.map(item => item.getBoundingClientRect());

    if (addTwoColumns) {
        gridElement.classList.add('show-two-columns');
    } else {
        gridElement.classList.remove('show-two-columns');
    }

    const lastRects = items.map(item => item.getBoundingClientRect());

    items.forEach((item, i) => {
        const f = firstRects[i];
        const l = lastRects[i];
        
        if (l.width === 0 || l.height === 0) return;

        const dx = f.left - l.left;
        const dy = f.top - l.top;
        const sx = f.width / Math.max(l.width, 1);
        const sy = f.height / Math.max(l.height, 1);
        
        item.style.willChange = 'transform';
        item.style.transition = 'none';
        item.style.transformOrigin = 'top left';
        item.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${sx}, ${sy})`;
        item.style.zIndex = '10';
    });

    void gridElement.offsetWidth;

    requestAnimationFrame(() => {
        items.forEach(item => {
            item.style.transition = 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)';
            item.style.transform = '';
        });
        
        setTimeout(() => {
            items.forEach(item => {
                item.style.transition = '';
                item.style.transformOrigin = '';
                item.style.transform = '';
                item.style.zIndex = '';
                item.style.willChange = '';
            });
            isAnimating = false;
        }, 780);
    });
}

window.performSmoothLayoutChange = performSmoothLayoutChange;

function triggerMobileGridSwitch(duration = 4000) {
    if (window.innerWidth <= 480) {
        if (localStorage.getItem('twoGridEnabled') === 'true') return;
        if (localStorage.getItem('lowDetailEnabled') === 'true') return;

        const activeSection = document.querySelector('.content-section:not(.hidden-section)');
        if (!activeSection) return;
        const sectionId = activeSection.id; 

        const forceAlwaysPlay = localStorage.getItem('alwaysGridAnimEnabled') === 'true';
        const storageKey = 'lastGridAnim_' + sectionId;
        const lastPlayed = localStorage.getItem(storageKey);
        
        if (!forceAlwaysPlay && lastPlayed) {
            const oneWeek = 7 * 24 * 60 * 60 * 1000;
            if (Date.now() - parseInt(lastPlayed, 10) < oneWeek) {
                return;
            }
        }
        
        localStorage.setItem(storageKey, Date.now());
        
        window.isGridAnimActive = true;
        setTimeout(() => { window.isGridAnimActive = false; }, duration + 1200);

        const gridElement = activeSection.querySelector('.image-grid');
        if (!gridElement) return;
        
        performSmoothLayoutChange(gridElement, true);
        clearTimeout(mobileGridTimer);
        
        mobileGridTimer = setTimeout(() => {
            const currentActiveGrid = document.querySelector('.content-section:not(.hidden-section) .image-grid');
            performSmoothLayoutChange(currentActiveGrid, false);
        }, duration);
    }
}

window.triggerMobileGridSwitch = triggerMobileGridSwitch;

triggerMobileGridSwitch();
