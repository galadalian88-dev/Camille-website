/**
 * Theater Carousel Lightbox — Shared Component
 * Drop this into any escort site's JS or include as <script src="js/theater.js">
 *
 * Usage:
 *   initTheater('.gallery-img');          // pass CSS selector of all gallery images
 *   initTheater('.gallery-img', '#theme-color'); // optional accent colour override
 *
 * HTML required (place just before </body>):
 *   <div class="theater-overlay" id="theater" role="dialog" aria-modal="true">
 *     <button class="theater-close" id="theater-close" aria-label="Close">&times;</button>
 *     <button class="theater-arrow theater-prev" id="theater-prev" aria-label="Previous">&#8249;</button>
 *     <img src="" alt="" id="theater-img" class="theater-img">
 *     <button class="theater-arrow theater-next" id="theater-next" aria-label="Next">&#8250;</button>
 *     <div class="theater-counter" id="theater-counter"></div>
 *     <div class="theater-dots" id="theater-dots"></div>
 *   </div>
 *
 * CSS required: theater.css (or the theater section inside the site's style.css)
 */

function initTheater(imgSelector) {
    const imgs    = Array.from(document.querySelectorAll(imgSelector));
    if (!imgs.length) return;

    const overlay  = document.getElementById('theater');
    const tImg     = document.getElementById('theater-img');
    const prevBtn  = document.getElementById('theater-prev');
    const nextBtn  = document.getElementById('theater-next');
    const closeBtn = document.getElementById('theater-close');
    const counter  = document.getElementById('theater-counter');
    const dotsWrap = document.getElementById('theater-dots');

    if (!overlay || !tImg) return;

    let current = 0;

    // ── Build dot indicators ──────────────────────────
    if (dotsWrap) {
        imgs.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'theater-dot';
            dot.setAttribute('aria-label', `Go to image ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(dot);
        });
    }

    function updateDots() {
        if (!dotsWrap) return;
        const dots = dotsWrap.querySelectorAll('.theater-dot');
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    // ── Navigation ───────────────────────────────────
    function goTo(idx) {
        current = (idx + imgs.length) % imgs.length;
        tImg.style.opacity = '0';
        setTimeout(() => {
            tImg.src = imgs[current].src;
            tImg.style.opacity = '1';
        }, 120);
        if (counter) counter.textContent = `${current + 1} / ${imgs.length}`;
        updateDots();
    }

    function open(idx) {
        current = idx;
        tImg.src = imgs[current].src;
        tImg.style.opacity = '1';
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        if (counter) counter.textContent = `${current + 1} / ${imgs.length}`;
        updateDots();
    }

    function close() {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
        setTimeout(() => { tImg.src = ''; }, 300);
    }

    // ── Event listeners ──────────────────────────────
    imgs.forEach((img, idx) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => open(idx));
    });

    if (prevBtn)  prevBtn.addEventListener('click',  () => goTo(current - 1));
    if (nextBtn)  nextBtn.addEventListener('click',  () => goTo(current + 1));
    if (closeBtn) closeBtn.addEventListener('click', close);

    overlay.addEventListener('click', e => {
        // close if clicking the dark backdrop (not the image or buttons)
        if (e.target === overlay) close();
    });

    document.addEventListener('keydown', e => {
        if (!overlay.classList.contains('open')) return;
        if (e.key === 'ArrowLeft')  goTo(current - 1);
        if (e.key === 'ArrowRight') goTo(current + 1);
        if (e.key === 'Escape')     close();
    });

    // ── Touch / swipe support ────────────────────────
    let touchStartX = 0;
    overlay.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    overlay.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(dx) > 50) {
            dx < 0 ? goTo(current + 1) : goTo(current - 1);
        }
    }, { passive: true });
}
