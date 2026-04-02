/* ===== PARTICLE CANVAS ===== */
(function() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;
    let animationId;

    function resize() {
        w = canvas.width = canvas.offsetWidth;
        h = canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.min(Math.floor((w * h) / 12000), 120);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 1.5 + 0.5,
                color: ['#a855f7', '#3b82f6', '#06b6d4', '#22c55e'][Math.floor(Math.random() * 4)]
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(168, 85, 247, ${0.08 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        // Draw particles
        for (const p of particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = 0.6;
            ctx.fill();
            ctx.globalAlpha = 1;

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;
        }

        animationId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });
})();

/* ===== HEADER SCROLL ===== */
(function() {
    const header = document.getElementById('header');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                header.classList.toggle('scrolled', window.scrollY > 50);
                ticking = false;
            });
            ticking = true;
        }
    });
})();

/* ===== MOBILE MENU ===== */
(function() {
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    if (!burger || !nav) return;

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    nav.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
})();

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ===== COUNTDOWN ===== */
(function() {
    const target = new Date('2026-10-17T10:00:00+03:00').getTime();
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');

    if (!daysEl) return;

    function update() {
        const now = Date.now();
        const diff = target - now;

        if (diff <= 0) {
            daysEl.textContent = '000';
            hoursEl.textContent = '00';
            minsEl.textContent = '00';
            secsEl.textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(3, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minsEl.textContent = String(mins).padStart(2, '0');
        secsEl.textContent = String(secs).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
})();

/* ===== REVEAL ON SCROLL ===== */
(function() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
})();

/* ===== COUNTER ANIMATION ===== */
(function() {
    const counters = document.querySelectorAll('[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                const duration = 2000;
                const start = performance.now();

                function animate(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.round(eased * target);

                    el.textContent = current.toLocaleString('ru-RU');

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                }

                requestAnimationFrame(animate);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(el => observer.observe(el));
})();

/* ===== FORM ===== */
(function() {
    const form = document.getElementById('partnerForm');
    const success = document.getElementById('formSuccess');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Basic validation
        const required = form.querySelectorAll('[required]');
        let valid = true;
        required.forEach(input => {
            if (input.type === 'checkbox' && !input.checked) {
                valid = false;
                input.closest('.form__checkbox').style.color = '#ef4444';
            } else if (!input.value.trim()) {
                valid = false;
                input.style.borderColor = '#ef4444';
            } else {
                input.style.borderColor = '';
                if (input.type === 'checkbox') {
                    input.closest('.form__checkbox').style.color = '';
                }
            }
        });

        if (!valid) return;

        // Collect data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => { data[key] = value; });

        // Show success
        form.style.display = 'none';
        success.classList.add('visible');

        // Optionally send via mailto or external service
        console.log('Partnership form submitted:', data);
    });

    // Clear error styling on input
    form.querySelectorAll('.form__input').forEach(input => {
        input.addEventListener('focus', () => {
            input.style.borderColor = '';
        });
    });
})();

/* ===== ACTIVE NAV LINK ===== */
(function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active',
                        link.getAttribute('href') === '#' + id
                    );
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

    sections.forEach(s => observer.observe(s));
})();

/* ===== TYPING CURSOR EFFECT for hero code-line ===== */
(function() {
    const comment = document.querySelector('.hero__code-line .code-comment');
    if (!comment) return;

    const text = comment.textContent;
    comment.textContent = '';
    comment.style.borderRight = '2px solid var(--accent-purple)';

    let i = 0;
    function type() {
        if (i < text.length) {
            comment.textContent += text.charAt(i);
            i++;
            setTimeout(type, 30 + Math.random() * 30);
        } else {
            // Blinking cursor
            setInterval(() => {
                comment.style.borderRight = comment.style.borderRight === 'none'
                    ? '2px solid var(--accent-purple)'
                    : 'none';
            }, 530);
        }
    }

    setTimeout(type, 500);
})();
