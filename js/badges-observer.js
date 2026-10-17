// --- 6B. ABOUT ME SCROLL-TRIGGERED LIQUID REVEAL ENGINE ---
function setupAboutScrollAnimations() {
    const revealBlocks = document.querySelectorAll('#about-section .about-reveal');
    if (revealBlocks.length === 0) return;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.12 });

    window.triggerAboutReveal = () => {
        revealBlocks.forEach((block, idx) => {
            if (idx === 0) {
                block.classList.add('in-view');
            } else {
                block.classList.remove('in-view');
                revealObserver.observe(block);
            }
        });
    };

    window.triggerAboutReveal();
}

setupAboutScrollAnimations();

// --- 7. AUTOMATIC BADGES (LOAD-AWARE & MEMORY SAFE) ---
function setupFavoriteBadges() {
    let favObserver = null;
    let badgeTimer = null; 
    window.refreshBadges = applyFavoritesToActiveSection;

    function applyFavoritesToActiveSection() {
        if (badgeTimer) clearTimeout(badgeTimer);
        if (favObserver) {
            favObserver.disconnect();
            favObserver = null;
        }
        
        const isMobile = window.innerWidth <= 480;
        const activeSection = document.querySelector('.content-section:not(.hidden-section)');
        if (!activeSection) return;
        
        const badgeItems = activeSection.querySelectorAll('.image-item.favorite, .image-item.award-winning, .image-item.new');
        if (badgeItems.length === 0) return;

        badgeItems.forEach(item => {
            item.querySelectorAll('.favorite-badge, .award-badge, .new-text-label').forEach(b => b.remove());
            item.classList.remove('badge-completed'); 
        });

        const createBadge = (item, delaySeconds) => {
            if (item.classList.contains('badge-completed')) return;
            item.classList.add('badge-completed');

            const isAward = item.classList.contains('award-winning');
            const isFavorite = item.classList.contains('favorite');
            const isNew = item.classList.contains('new');

            if (isAward || isFavorite) {
                const badge = document.createElement('div');
                badge.className = isAward ? 'award-badge' : 'favorite-badge';
                badge.style.setProperty('--stagger-delay', `${delaySeconds}s`);
                
                const textToDisplay = isAward ? 'AWARD-WINNING' : 'HIGHLIGHTS';
                const svgIcon = isAward ? 
                    `<svg viewBox="0 0 24 24"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"></path></svg>` : 
                    `<svg viewBox="0 0 24 24"><path d="M12 2L22 12 12 22 2 12 12 2z"></path></svg>`;
                
                badge.innerHTML = `
                    <div class="fav-bg-rect"></div>
                    <div class="fav-icon-shadow">
                        <div class="fav-icon-ribbon">${svgIcon}</div>
                    </div>
                    <span class="fav-text">${textToDisplay}</span>
                `;
                
                item.appendChild(badge);
                
                setTimeout(() => {
                    if (badge.parentNode) badge.remove();
                }, 6000 + (delaySeconds * 1000));
            }

            if (isNew) {
                const newText = document.createElement('div');
                newText.className = 'new-text-label';
                newText.style.setProperty('--stagger-delay', `${delaySeconds}s`);
                newText.innerText = 'NEW';

                item.appendChild(newText);

                setTimeout(() => {
                    if (newText.parentNode) newText.remove();
                }, 9000 + (delaySeconds * 1000));
            }
        };

        const triggerWhenReady = (item, delaySeconds) => {
            const img = item.querySelector('img');
            if (img && img.complete && img.naturalHeight !== 0) {
                createBadge(item, delaySeconds);
            } else if (img) {
                img.addEventListener('load', () => {
                    createBadge(item, 0); 
                }, { once: true });
            }
        };

        const delay = (isMobile && window.isGridAnimActive) ? 5200 : 100;
        
        badgeTimer = setTimeout(() => {
            let desktopStaggerCount = 0;
            let resetTimer;

            favObserver = new IntersectionObserver((entries, observerInstance) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        let stagger = 0;
                        if (!isMobile) {
                            stagger = desktopStaggerCount * 0.5;
                            desktopStaggerCount++;
                            clearTimeout(resetTimer);
                            resetTimer = setTimeout(() => { desktopStaggerCount = 0; }, 100);
                        }

                        triggerWhenReady(entry.target, stagger);
                        observerInstance.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '0px', threshold: 0.3 });

            badgeItems.forEach(item => {
                if (!item.classList.contains('badge-completed')) {
                    favObserver.observe(item);
                }
            });
        }, delay);
    }

    applyFavoritesToActiveSection();

    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(applyFavoritesToActiveSection, 50); 
        });
    });
}

setupFavoriteBadges();
