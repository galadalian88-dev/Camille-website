document.addEventListener('DOMContentLoaded', () => {

    // ── Mobile Menu Toggle ──────────────────────────────
    const mobileBtn  = document.querySelector('.nav-mobile-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('open');
            mobileMenu.classList.toggle('active');
        });
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileBtn.classList.remove('open');
                mobileMenu.classList.remove('active');
            });
        });
    }

    // ── Sticky Navbar ───────────────────────────────────
    const primaryNav = document.getElementById('primary-nav');
    if (primaryNav) {
        window.addEventListener('scroll', () => {
            primaryNav.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    // ── Scroll Reveal ───────────────────────────────────
    const revealEls = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const vh = window.innerHeight;
        revealEls.forEach(el => {
            if (el.getBoundingClientRect().top < vh - 100) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll, { passive: true });
    revealOnScroll();

    // ── Smooth Scroll ───────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const id = this.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ── Theater Carousel (shared theater.js component) ──
    initTheater('.gallery-img');

});
