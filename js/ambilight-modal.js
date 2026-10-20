// --- 3. FULL SCREEN MODAL LOGIC WITH AMBILIGHT ENGINE ---
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("fullScreenImage");
const modalGlow = document.getElementById("modalGlow");
const body = document.body;

const colorCanvas = document.createElement('canvas');
colorCanvas.width = 1;
colorCanvas.height = 1;
const colorCtx = colorCanvas.getContext('2d', { willReadFrequently: true });

function getAverageColor(imgElement) {
    try {
        colorCtx.drawImage(imgElement, 0, 0, 1, 1);
        const rgb = colorCtx.getImageData(0, 0, 1, 1).data;
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    } catch (e) {
        return 'rgba(0,0,0,0)';
    }
}

function attachModalEvents() {
    const images = document.querySelectorAll(".image-grid .image-item > img, #about-section .image-item > img");
    images.forEach(img => {
        const openModal = function() {
            modal.classList.remove('closing');
            modal.style.display = "flex";
            modalImg.src = img.src;
            body.classList.add('modal-open');

            const dominantColor = getAverageColor(img);
            modalGlow.style.backgroundColor = dominantColor;
            
            setTimeout(() => modal.classList.add('open-glow'), 50);
        };
        img.onclick = openModal;
        if (img.parentElement && img.parentElement.classList.contains('image-item')) {
            img.parentElement.onclick = openModal;
        }
    });
}

attachModalEvents();

function closeModal() {
    modal.classList.add('closing');
    modal.classList.remove('open-glow');
    
    setTimeout(() => {
        modal.style.display = "none";
        modal.classList.remove('closing');
        body.classList.remove('modal-open');
        modalImg.src = ""; 
        modalGlow.style.backgroundColor = "transparent";
    }, 400); 
}

document.querySelector(".close-modal").onclick = closeModal;
window.closeModal = closeModal;

modal.onclick = (event) => { 
    if (event.target === modal || event.target === modalGlow) closeModal(); 
};

document.addEventListener('keydown', (event) => { 
    if (event.key === 'Escape' && modal.style.display === "flex") closeModal(); 
});

