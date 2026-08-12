document.addEventListener('DOMContentLoaded', () => {
    initCursorGlow();
    initInteractiveAudio();
    initCardGlowTracking();
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
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}
