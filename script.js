document.addEventListener('DOMContentLoaded', () => {
    initMobileGlowAndParticles();
    initInteractiveAudio();
    initBookingActions();
    initMobileDropdowns();
});

function initMobileDropdowns() {
    const dropdowns = document.querySelectorAll('.has-dropdown');

    dropdowns.forEach((dropdown) => {
        const trigger = dropdown.querySelector('a');

        if (!trigger) return;

        trigger.addEventListener('click', (event) => {
            if (window.innerWidth > 900) return;

            event.preventDefault();
            const isOpen = dropdown.classList.contains('open');

            dropdowns.forEach((item) => {
                item.classList.remove('open');
            });

            if (!isOpen) {
                dropdown.classList.add('open');
            }
        });
    });

    document.addEventListener('click', (event) => {
        if (window.innerWidth > 900) return;

        const clickedInsideDropdown = event.target.closest('.has-dropdown');
        if (!clickedInsideDropdown) {
            dropdowns.forEach((dropdown) => dropdown.classList.remove('open'));
        }
    });
}

/* 1. GPU-ACCELERATED PC & MOBILE PARTICLE & GLOW ENGINE */
function initMobileGlowAndParticles() {
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth <= 768;
    let lastEffectTime = 0;

    // Ambient Glow Setup
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    if (!isMobile) {
        let mouseX = 0,
            mouseY = 0;
        let glowX = 0,
            glowY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateGlow() {
            glowX += (mouseX - glowX) * 0.15;
            glowY += (mouseY - glowY) * 0.15;
            glow.style.transform = `translate3d(${glowX - 125}px, ${glowY - 125}px, 0)`;
            requestAnimationFrame(animateGlow);
        }
        animateGlow();
    } else {
        glow.style.position = 'fixed';
        glow.style.top = '25%';
        glow.style.left = '50%';
        glow.style.transform = 'translate(-50%, -50%)';
        glow.style.animation = 'mobileGlowPulse 5s ease-in-out infinite alternate';
    }

    // Star Particle Generator
    function createGlowStar(x, y) {
        const star = document.createElement('div');
        star.className = 'site-cursor-star';
        star.textContent = '✦';
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        document.body.appendChild(star);

        requestAnimationFrame(() => {
            star.style.transform = 'translate(-50%, -130%) scale(0.2) rotate(180deg)';
            star.style.opacity = '0';
        });

        setTimeout(() => star.remove(), 700);
    }

    // Micro Sparkle Generator
    function createGlowParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'site-cursor-particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.setProperty('--move-x', `${(Math.random() - 0.5) * 35}px`);
        particle.style.setProperty('--move-y', `${(Math.random() - 0.5) * 35}px`);
        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 600);
    }

    function handleInputEvent(x, y) {
        const now = Date.now();
        const throttleInterval = isMobile ? 40 : 25;
        if (now - lastEffectTime > throttleInterval) {
            createGlowStar(x, y);
            createGlowParticle(x, y);
            lastEffectTime = now;
        }
    }

    // Desktop Mouse Tracking
    if (!isMobile) {
        window.addEventListener('mousemove', (e) => handleInputEvent(e.clientX, e.clientY));
    }

    // Mobile Touch Tracking (Tap and Drag)
    window.addEventListener('touchmove', (e) => {
        for (let i = 0; i < e.touches.length; i++) {
            handleInputEvent(e.touches[i].clientX, e.touches[i].clientY);
        }
    }, { passive: true });

    window.addEventListener('touchstart', (e) => {
        for (let i = 0; i < e.touches.length; i++) {
            createGlowStar(e.touches[i].clientX, e.touches[i].clientY);
            createGlowParticle(e.touches[i].clientX, e.touches[i].clientY);
        }
    }, { passive: true });
}

/* 2. SYNTH SOUND EFFECTS FOR TOUCH & MOUSE HOVER */
function initInteractiveAudio() {
    let audioCtx = null;

    function getAudioContext() {
        if (!audioCtx) {
            audioCtx = new(window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playBeep(freq = 800, duration = 0.05, gainValue = 0.02) {
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(gainValue, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            // Mobile browser fallback
        }
    }

    const targets = document.querySelectorAll('.btn, .seller-card, .nav-links a');
    targets.forEach(target => {
        target.addEventListener('mouseenter', () => playBeep(900, 0.04, 0.015));
        target.addEventListener('touchstart', () => playBeep(900, 0.04, 0.015), { passive: true });
    });
}

/* 3. BOOKING FORM (EMAIL & WHATSAPP DIRECT ACTION) */
function initBookingActions() {
    const form = document.getElementById('booking-form');
    const emailButton = document.getElementById('booking-email');
    const whatsappButton = document.getElementById('booking-whatsapp');

    const targetPhone = '23000000000';
    const emailAddress = 'yechnology.mu@gmail.com';

    if (form && emailButton && whatsappButton) {
        function getFormData() {
            return {
                name: form.name.value.trim(),
                phone: form.phone.value.trim(),
                service: form.service.value.trim(),
                date: form.date.value,
                details: form.details.value.trim(),
            };
        }

        function buildMessage(data) {
            return [
                `Name: ${data.name || 'N/A'}`,
                `Phone: ${data.phone || 'N/A'}`,
                `Service Category: ${data.service || 'N/A'}`,
                `Preferred Date: ${data.date || 'N/A'}`,
                `Details: ${data.details || 'N/A'}`
            ].join('\n');
        }

        emailButton.addEventListener('click', () => {
            const data = getFormData();
            const subject = encodeURIComponent(`Y-ECHNOLOGY Mauritius Inquiry: ${data.service || 'General Inquiry'}`);
            const body = encodeURIComponent(`Hello Y-ECHNOLOGY Team,\n\nI would like to book a service:\n\n${buildMessage(data)}\n\nThank you.`);
            window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}&su=${subject}&body=${body}`, '_blank');
        });

        whatsappButton.addEventListener('click', () => {
            const data = getFormData();
            const text = encodeURIComponent(`Hello Y-ECHNOLOGY Mauritius, I would like to book a service:\n\n${buildMessage(data)}`);
            window.open(`https://wa.me/${targetPhone}?text=${text}`, '_blank');
        });
    }
}
