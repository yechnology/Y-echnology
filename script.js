document.addEventListener('DOMContentLoaded', () => {
    initCursorAndTouchGlow();
    initInteractiveAudio();
    initCardGlowTracking();
    initBookingActions();
});

/* 1. CURSOR & TOUCH GLOW EFFECT (Desktop Mouse + Mobile Touch) */
function initCursorAndTouchGlow() {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 3;
    let glowX = mouseX;
    let glowY = mouseY;

    const updateCoords = (x, y) => {
        mouseX = x;
        mouseY = y;
        glow.style.opacity = '1';
    };

    // Desktop Mouse Tracking
    window.addEventListener('mousemove', (e) => {
        updateCoords(e.clientX, e.clientY);
    });

    // Smartphone / Tablet Touch Tracking
    window.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            updateCoords(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            updateCoords(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.15;
        glowY += (mouseY - glowY) * 0.15;
        glow.style.transform = `translate3d(${glowX - 125}px, ${glowY - 125}px, 0)`;
        requestAnimationFrame(animateGlow);
    }
    animateGlow();
}

/* 2. INTERACTIVE AUDIO SYNTH (Guarded for User Gestures) */
function initInteractiveAudio() {
    let audioCtx = null;

    function getAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playBeep(freq = 800, type = 'sine', duration = 0.05, gainValue = 0.02) {
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            gain.gain.setValueAtTime(gainValue, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            // Silence if audio context restricted by browser policy
        }
    }

    const hoverTargets = document.querySelectorAll('.btn, .seller-card, .nav-links a');
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => playBeep(900, 'sine', 0.04, 0.015));
        target.addEventListener('touchstart', () => playBeep(900, 'sine', 0.04, 0.015), { passive: true });
    });

    const clickTargets = document.querySelectorAll('.btn, .btn-purple-sm');
    clickTargets.forEach(target => {
        target.addEventListener('click', () => playBeep(1400, 'triangle', 0.08, 0.03));
    });
}

/* 3. CARD LIGHTING TRACKER */
function initCardGlowTracking() {
    const cards = document.querySelectorAll('.seller-card, .about-card');
    cards.forEach(card => {
        const updatePosition = (clientX, clientY) => {
            const rect = card.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        };

        card.addEventListener('pointermove', (e) => updatePosition(e.clientX, e.clientY));
        
        card.addEventListener('touchstart', (e) => {
            if (!e.touches.length) return;
            updatePosition(e.touches[0].clientX, e.touches[0].clientY);
            card.classList.add('touch-active');
        }, { passive: true });

        card.addEventListener('touchend', () => card.classList.remove('touch-active'));
    });
}

/* 4. SANITIZED FORM ACTIONS */
function initBookingActions() {
    const form = document.getElementById('booking-form');
    const emailButton = document.getElementById('booking-email');
    const whatsappButton = document.getElementById('booking-whatsapp');
    if (!form || !emailButton || !whatsappButton) return;

    const targetPhone = '23000000000'; // Replace with your company phone number
    const emailAddress = 'yechnology.mu@gmail.com';

    function getFormData() {
        return {
            name: form.name.value.trim(),
            phone: form.phone.value.trim(),
            service: form.service.value.trim(),
            date: form.date.value,
            details: form.details.value.trim(),
        };
    }

    function validateForm(data) {
        if (!data.name) {
            alert('Please enter your full name.');
            form.name.focus();
            return false;
        }
        if (!data.phone) {
            alert('Please enter your phone number.');
            form.phone.focus();
            return false;
        }
        return true;
    }

    function buildMessageBody(data) {
        const lines = [
            `Name: ${data.name || 'N/A'}`,
            `Phone: ${data.phone || 'N/A'}`,
            `Service: ${data.service || 'N/A'}`,
            `Preferred Date: ${data.date || 'N/A'}`,
            `Details: ${data.details || 'N/A'}`,
        ];
        return lines.join('\n');
    }

    function sendEmail() {
        const data = getFormData();
        if (!validateForm(data)) return;

        const subject = encodeURIComponent(`Y-ECHNOLOGY Service Booking: ${data.service || 'Inquiry'}`);
        const bodyText = `Hello Y-ECHNOLOGY Team,\n\nI would like to book a service with the following details:\n\n${buildMessageBody(data)}\n\nThank you!`;
        const body = encodeURIComponent(bodyText);

        window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
    }

    function sendWhatsApp() {
        const data = getFormData();
        if (!validateForm(data)) return;

        const textText = `Hello Y-ECHNOLOGY, I would like to book a service:\n\n${buildMessageBody(data)}`;
        const text = encodeURIComponent(textText);

        window.open(`https://wa.me/${targetPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
    }

    emailButton.addEventListener('click', sendEmail);
    whatsappButton.addEventListener('click', sendWhatsApp);
}
