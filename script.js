document.addEventListener('DOMContentLoaded', () => {
    initCursorGlow();
    initInteractiveAudio();
    initCardGlowTracking();
    initBookingActions();
});

/* 1. CURSOR GLOW EFFECT */
function initCursorGlow() {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

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
}

/* 2. DYNAMIC SYNTH AUDIO EFFECTS */
function initInteractiveAudio() {
    const audioCtx = new(window.AudioContext || window.webkitAudioContext)();

    function playBeep(freq = 800, type = 'sine', duration = 0.05, gainValue = 0.02) {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(gainValue, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
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

/* 3. CARD MOUSE LIGHTING TRACKER */
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

        card.addEventListener('pointermove', (e) => {
            updatePosition(e.clientX, e.clientY);
        });

        card.addEventListener('touchstart', (e) => {
            if (!e.touches.length) return;
            updatePosition(e.touches[0].clientX, e.touches[0].clientY);
            card.classList.add('touch-active');
        }, { passive: true });

        card.addEventListener('touchend', () => {
            card.classList.remove('touch-active');
        });
    });
}

function initBookingActions() {
    const form = document.getElementById('booking-form');
    const emailButton = document.getElementById('booking-email');
    const whatsappButton = document.getElementById('booking-whatsapp');
    if (!form || !emailButton || !whatsappButton) return;

    const targetPhone = '23000000000';
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

    function buildMessage(data) {
        const lines = [
            `Name: ${data.name || 'N/A'}`,
            `Phone: ${data.phone || 'N/A'}`,
            `Service: ${data.service || 'N/A'}`,
            `Preferred date: ${data.date || 'N/A'}`,
            `Details: ${data.details || 'N/A'}`,
        ];
        return lines.join('%0A');
    }

    function sendEmail() {
        const data = getFormData();
        const subject = encodeURIComponent(`Y-ECHNOLOGY booking request: ${data.service || 'Service inquiry'}`);
        const body = encodeURIComponent(`Hello Y-ECHNOLOGY team,%0A%0AI would like to book a service with the following details:%0A%0A${buildMessage(data)}%0A%0AThanks!`);
        window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
    }

    function sendWhatsApp() {
        const data = getFormData();
        const text = encodeURIComponent(`Hello Y-ECHNOLOGY, I would like to book a service.%0A%0A${buildMessage(data)}`);
        window.open(`https://wa.me/${targetPhone}?text=${text}`, '_blank');
    }

    emailButton.addEventListener('click', sendEmail);
    whatsappButton.addEventListener('click', sendWhatsApp);
}
