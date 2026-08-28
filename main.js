// ======================================================
// PsyberGamesStudio - Main JS
// Built from template: mobile menu + header + reveal + modals
// Adapted for indie game studio use
// ======================================================

document.addEventListener('DOMContentLoaded', () => {

    // =========================
    // DOM ELEMENTS
    // =========================

    const menuButton = document.querySelector('.menu-button');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-nav a');
    const menuIcon = document.querySelector('.menu-icon');
    const header = document.querySelector('.site-header');
    const revealElements = document.querySelectorAll('.reveal');

    // Studio-specific elements (safe to be null if not on page)
    const yearEl = document.querySelector('#current-year');
    const newsletterForm = document.querySelector('#newsletter-form');
    const contactForm = document.querySelector('#contact-form');
    const gameFilterButtons = document.querySelectorAll('[data-filter]');
    const gameCards = document.querySelectorAll('[data-category]');
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    console.log('%c PSYBER GAMES STUDIO ', 'background:#D6E400;color:#0a0a0a;padding:8px 12px;font-weight:bold;border-radius:4px;');
    console.log('System initialized // Welcome to the Psyberverse');

    // =========================
    // MODAL STATE
    // =========================

    let activeModal = null;
    let lastFocusedElement = null;

    // =========================
    // MOBILE MENU
    // =========================

    function closeMenu() {
        if (!mobileNav || !menuButton) return;
        mobileNav.classList.remove('active');
        menuButton.setAttribute('aria-expanded', 'false');
        if (menuIcon) menuIcon.textContent = '☰';
        menuButton.setAttribute('aria-label', 'Open menu');
        document.body.classList.remove('menu-open');
    }

    function openMenu() {
        if (!mobileNav || !menuButton) return;
        mobileNav.classList.add('active');
        menuButton.setAttribute('aria-expanded', 'true');
        if (menuIcon) menuIcon.textContent = '✖';
        menuButton.setAttribute('aria-label', 'Close menu');
        document.body.classList.add('menu-open');
    }

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', () => {
            const isOpen = mobileNav.classList.contains('active');
            if (isOpen) closeMenu();
            else openMenu();
        });
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => closeMenu());
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!mobileNav || !menuButton) return;
        const clickedButton = menuButton.contains(event.target);
        const clickedNav = mobileNav.contains(event.target);
        const isOpen = mobileNav.classList.contains('active');
        if (!clickedButton && !clickedNav && isOpen) {
            closeMenu();
        }
    });

    // Close menu on Escape and on resize to desktop
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && mobileNav && mobileNav.classList.contains('active')) {
            closeMenu();
            if (menuButton) menuButton.focus();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900 && mobileNav && mobileNav.classList.contains('active')) {
            closeMenu();
        }
    });

    // =========================
    // HEADER SCROLL EFFECT + ACTIVE LINK HIGHLIGHT
    // =========================

    const navLinks = document.querySelectorAll('.site-header nav a, .desktop-nav a, .mobile-nav a');
    const sections = document.querySelectorAll('section[id]');

    function handleHeaderScroll() {
        if (!header) return;
        const isScrolled = window.scrollY > 50;
        header.classList.toggle('scrolled', isScrolled);
    }

    function handleActiveNavLink() {
        if (sections.length === 0 || navLinks.length === 0) return;
        let currentId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                currentId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active-link');
            }
        });
    }

    window.addEventListener('scroll', () => {
        handleHeaderScroll();
        handleActiveNavLink();
    }, { passive: true });

    // Init on load
    handleHeaderScroll();
    handleActiveNavLink();

    // =========================
    // SCROLL REVEAL
    // =========================

    if (revealElements.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, revealObserver) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach((element, index) => {
            // Stagger effect - grouped by parent to avoid huge delays on long pages
            element.style.transitionDelay = `${(index % 6) * 0.08}s`;
            observer.observe(element);
        });
    } else {
        // Fallback: show all if no observer
        revealElements.forEach(el => el.classList.add('active'));
    }

    // =========================
    // FOOTER YEAR (PsyberGamesStudio)
    // =========================

    if (yearEl) {
        yearEl.textContent = new Date().getFullYear().toString();
    }

    // =========================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // =========================

    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return;
            if (href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    // Close mobile menu if open before scrolling
                    closeMenu();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Update URL without jump
                    history.pushState(null, null, href);
                }
            }
        });
    });

    // =========================
    // GAME FILTERING (for games page)
    // Example: <button data-filter="horror">Horror</button>
    //          <div data-category="horror">...</div>
    // =========================

    if (gameFilterButtons.length > 0 && gameCards.length > 0) {
        gameFilterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter; // e.g. "all", "horror", "sci-fi"

                gameFilterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                gameCards.forEach(card => {
                    const category = card.dataset.category;
                    const shouldShow = filter === 'all' || category === filter;
                    card.style.display = shouldShow ? '' : 'none';
                    // Re-trigger reveal animation
                    if (shouldShow) {
                        card.classList.remove('active');
                        requestAnimationFrame(() => card.classList.add('active'));
                    }
                });
            });
        });
    }

    // =========================
    // MODAL HELPERS
    // =========================

    function getFocusableElements(container) {
        return container.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
    }

    function trapFocus(event) {
        if (!activeModal || event.key !== 'Tab') return;
        const modalBox = activeModal.querySelector('.modal');
        if (!modalBox) return;
        const focusableElements = getFocusableElements(modalBox);
        if (focusableElements.length === 0) return;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }

    function pauseMediaInModal(modal) {
        // Pause HTML5 video
        modal.querySelectorAll('video').forEach(video => {
            video.pause();
        });
        // Stop YouTube / iframe trailers by resetting src
        modal.querySelectorAll('iframe').forEach(iframe => {
            const src = iframe.getAttribute('src');
            if (src && src.includes('youtube') || src && src.includes('youtu.be')) {
                // trick to stop playback: reassign src
                iframe.setAttribute('src', src);
            }
        });
    }

    function openModal(modal, triggerButton) {
        if (!modal) return;
        if (activeModal && activeModal !== modal) {
            closeModal(activeModal, false);
        }
        activeModal = modal;
        lastFocusedElement = triggerButton || document.activeElement;
        modal.hidden = false;
        // Force reflow so transition works even after hidden=false
        void modal.offsetWidth;
        requestAnimationFrame(() => {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            const modalBox = modal.querySelector('.modal');
            if (modalBox) {
                modalBox.setAttribute('tabindex', '-1');
                modalBox.focus();
            }
        });
        document.body.classList.add('modal-open');
        // Prevent background scroll on mobile
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal, restoreFocus = true) {
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        pauseMediaInModal(modal);
        setTimeout(() => {
            modal.hidden = true;
            if (restoreFocus && lastFocusedElement) {
                lastFocusedElement.focus();
            }
        }, 300);
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        if (activeModal === modal) {
            activeModal = null;
        }
    }

    // =========================
    // MODAL EVENT HANDLING
    // =========================

    document.addEventListener('click', (event) => {

        // OPEN MODAL - any element with [data-modal-target="modal-id"]
        // Example: <button data-modal-target="game-neon-requiem-modal">View Game</button>
        const openButton = event.target.closest('[data-modal-target]');
        if (openButton) {
            event.preventDefault();
            const modalId = openButton.dataset.modalTarget;
            const modal = document.getElementById(modalId);
            if (!modal) {
                console.warn(`[PsyberGamesStudio] Modal not found: #${modalId}`);
                return;
            }
            openModal(modal, openButton);
            return;
        }

        // CLOSE BUTTON - [data-close-modal]
        const closeButton = event.target.closest('[data-close-modal]');
        if (closeButton) {
            const modal = closeButton.closest('.modal-overlay');
            closeModal(modal);
            return;
        }

        // CLICK OUTSIDE (OVERLAY)
        if (event.target.classList.contains('modal-overlay')) {
            closeModal(event.target);
            return;
        }

        // MODAL JUMP LINK - close modal then scroll to section
        // Example: <a href="#games" class="modal-jump-link">See all games</a>
        const jumpLink = event.target.closest('.modal-jump-link');
        if (jumpLink) {
            event.preventDefault();
            const targetId = jumpLink.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (!targetElement || !activeModal) return;
            closeModal(activeModal, false);
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.pushState(null, null, targetId);
            }, 300);
        }
    });

    // Handle Escape key and focus trapping (modals + menu)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && activeModal) {
            closeModal(activeModal);
            return;
        }
        trapFocus(event);
    });

    // =========================
    // NEWSLETTER FORM (mock - replace with real API)
    // =========================

    // =========================
    // NEWSLETTER FORM — LIVE to psybergamesstudio@gmail.com
    // =========================
    if (newsletterForm) {
        const newsletterStatus = document.getElementById('newsletter-status');
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input[type="email"]');
            const btn = newsletterForm.querySelector('button[type="submit"]');
            const email = input ? input.value.trim() : '';

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                if (newsletterStatus) {
                    newsletterStatus.textContent = '⚠ Please enter a valid email address.';
                    newsletterStatus.style.color = '#f87171';
                } else {
                    alert('Please enter a valid email address, Psyber.');
                }
                if (input) input.focus();
                return;
            }

            const originalText = btn ? btn.textContent : '';
            if (btn) { btn.textContent = 'Transmitting...'; btn.disabled = true; }
            if (newsletterStatus) { newsletterStatus.textContent = 'Transmitting signal to Psyber HQ...'; newsletterStatus.style.color = 'var(--accent-soft)'; }

            try {
                const payload = new FormData();
                payload.append('email', email);
                payload.append('_subject', 'New Newsletter Signal – PsyberGamesStudio');
                payload.append('_captcha', 'false');
                payload.append('_template', 'table');

                const res = await fetch('https://formsubmit.co/ajax/psybergamesstudio@gmail.com', {
                    method: 'POST',
                    body: payload,
                    headers: { 'Accept': 'application/json' }
                });

                if (!res.ok) throw new Error('Network response not ok');

                console.log(`[PsyberGamesStudio] Newsletter sent to psybergamesstudio@gmail.com: ${email}`);

                if (btn) btn.textContent = '✓ Joined the Psyberverse';
                if (newsletterStatus) {
                    newsletterStatus.textContent = '✓ Signal received! You\'re on the list. (First time? Check psybergamesstudio@gmail.com to activate FormSubmit)';
                    newsletterStatus.style.color = 'var(--accent-soft)';
                }
                if (input) input.value = '';

                setTimeout(() => {
                    if (btn) { btn.textContent = originalText; btn.disabled = false; }
                    if (newsletterStatus) newsletterStatus.textContent = '';
                }, 4000);

            } catch (err) {
                console.error('[PsyberGamesStudio] Newsletter failed, falling back to mailto:', err);
                if (newsletterStatus) {
                    newsletterStatus.textContent = '⚠ Direct send failed — opening your email app as fallback.';
                    newsletterStatus.style.color = '#fbbf24';
                }
                // Fallback: open user's mail client
                const subject = encodeURIComponent('Newsletter Signup – PsyberGamesStudio');
                const body = encodeURIComponent(`Please add me to the PsyberGamesStudio newsletter:\n\nEmail: ${email}`);
                window.location.href = `mailto:psybergamesstudio@gmail.com?subject=${subject}&body=${body}`;
                if (btn) { btn.textContent = originalText; btn.disabled = false; }
            }
        });
    }

    // =========================
    // CONTACT FORM — LIVE to psybergamesstudio@gmail.com
    // =========================
    if (contactForm) {
        const contactStatus = document.getElementById('contact-status');
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const original = submitBtn ? submitBtn.textContent : '';

            const nameVal = contactForm.querySelector('#contact-name')?.value.trim() || '';
            const emailVal = contactForm.querySelector('#contact-email')?.value.trim() || '';
            const msgVal = contactForm.querySelector('#contact-message')?.value.trim() || '';

            if (!nameVal || !emailVal || !msgVal) {
                if (contactStatus) {
                    contactStatus.textContent = '⚠ Please fill in all fields.';
                    contactStatus.style.color = '#f87171';
                }
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
                if (contactStatus) {
                    contactStatus.textContent = '⚠ Please enter a valid email.';
                    contactStatus.style.color = '#f87171';
                }
                return;
            }

            if (submitBtn) { submitBtn.textContent = 'Transmitting...'; submitBtn.disabled = true; }
            if (contactStatus) { contactStatus.textContent = 'Sending signal to psybergamesstudio@gmail.com...'; contactStatus.style.color = 'var(--accent-soft)'; }

            try {
                const fd = new FormData(contactForm);
                // Ensure correct subject even if hidden input missing
                if (!fd.has('_subject')) fd.append('_subject', 'New Contact Signal – PsyberGamesStudio');
                fd.set('_captcha', 'false');
                fd.set('_template', 'table');

                const res = await fetch('https://formsubmit.co/ajax/psybergamesstudio@gmail.com', {
                    method: 'POST',
                    body: fd,
                    headers: { 'Accept': 'application/json' }
                });

                if (!res.ok) throw new Error('Network response not ok');

                const data = await res.json().catch(() => ({}));
                console.log('[PsyberGamesStudio] Contact sent to psybergamesstudio@gmail.com:', Object.fromEntries(fd.entries()), data);

                if (submitBtn) submitBtn.textContent = 'Message Sent ✓';
                if (contactStatus) {
                    contactStatus.textContent = '✓ Signal transmitted! We\'ll reply within 48h to ' + emailVal + '. (First submission? Activate FormSubmit via email sent to psybergamesstudio@gmail.com)';
                    contactStatus.style.color = 'var(--accent-soft)';
                }
                contactForm.reset();
                setTimeout(() => {
                    if (submitBtn) { submitBtn.textContent = original; submitBtn.disabled = false; }
                    if (contactStatus) contactStatus.textContent = '';
                }, 6000);

            } catch (err) {
                console.error('[PsyberGamesStudio] Contact failed, fallback to mailto:', err);
                if (contactStatus) {
                    contactStatus.textContent = '⚠ Direct send failed — opening your email app.';
                    contactStatus.style.color = '#fbbf24';
                }
                const subject = encodeURIComponent(`Contact Signal from ${nameVal} – PsyberGamesStudio`);
                const body = encodeURIComponent(`Name: ${nameVal}\nEmail: ${emailVal}\n\nMessage:\n${msgVal}`);
                window.location.href = `mailto:psybergamesstudio@gmail.com?subject=${subject}&body=${body}`;
                if (submitBtn) { submitBtn.textContent = original; submitBtn.disabled = false; }
            }
        });
    }

    // =========================
    // OPTIONAL: Lazy load images + fade in
    // =========================

    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window && lazyImages.length > 0) {
        lazyImages.forEach(img => {
            img.addEventListener('load', () => img.classList.add('loaded'));
        });
    }

});
