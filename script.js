document.addEventListener('DOMContentLoaded', () => {
    initCursorGlow();
    initInteractiveAudio();
    initBookingActions();
});

/* 1. CURSOR GLOW EFFECT */
function initCursorGlow() {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

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
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function playBeep(freq = 800, duration = 0.05, gainValue = 0.02) {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
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
        target.addEventListener('mouseenter', () => playBeep(900, 0.04, 0.015));
    });
}

/* 3. BOOKING FORM ACTIONS */
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
            const lines = [
                `Name: ${data.name || 'N/A'}`,
                `Phone: ${data.phone || 'N/A'}`,
                `Service: ${data.service || 'N/A'}`,
                `Preferred date: ${data.date || 'N/A'}`,
                `Details: ${data.details || 'N/A'}`,
            ];
            return lines.join('\n');
        }

        // Opens Gmail directly in a browser tab
        emailButton.addEventListener('click', () => {
            const data = getFormData();
            const subject = encodeURIComponent(`Y-ECHNOLOGY booking request: ${data.service || 'Service inquiry'}`);
            const body = encodeURIComponent(`Hello Y-ECHNOLOGY team,\n\nI would like to book a service:\n\n${buildMessage(data)}\n\nThanks!`);
            window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}&su=${subject}&body=${body}`, '_blank');
        });

        whatsappButton.addEventListener('click', () => {
            const data = getFormData();
            const text = encodeURIComponent(`Hello Y-ECHNOLOGY, I would like to book a service.\n\n${buildMessage(data)}`);
            window.open(`https://wa.me/${targetPhone}?text=${text}`, '_blank');
        });
    }

    // Direct Gmail Web opening for standard mailto links
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            const targetEmail = href.replace('mailto:', '').split('?')[0];
            window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}`, '_blank');
        });
    });
}
