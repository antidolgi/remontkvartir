document.addEventListener('DOMContentLoaded', () => {
    /* ========== PRELOADER ========== */
    const preloader = document.getElementById('preloader');
    const fillPath = document.querySelector('.preloader__apartment .fill-color');

    // Анимация заполнения контура
    gsap.to(fillPath, {
        opacity: 1,
        duration: 1.2,
        ease: 'power2.inOut',
        delay: 0.3,
        onComplete: () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                document.body.classList.add('loaded');
                initLenis();
                initGSAPAnimations();
                initSplitting();
                initTilt();
                initCalculator();
                initComparisonSlider();
                initSwiper();
                initLottieSteps();
                initContactForm();
                initHeroVideoScrub()
            }, 400);
        }
    });

    /* ========== LENIS SMOOTH SCROLL ========== */
    let lenis;
    function initLenis() {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Связь ScrollTrigger с ленисом
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        // Обновление ScrollTrigger при скролле
        lenis.on('scroll', ScrollTrigger.update);
    }
    /* ========== 3 VIDEO ========== */
    function initHeroVideoScrub() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    const video1 = document.querySelector('.hero__video--1');
    const video2 = document.querySelector('.hero__video--2');
    const video3 = document.querySelector('.hero__video--3');
    if (!video1 || !video2 || !video3) return;

    // Запускаем все видео сразу (они будут играть фоном)
    [video1, video2, video3].forEach(v => v.play().catch(() => {}));

    // Создаём таймлайн, привязанный к скроллу по секции hero
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: heroSection,
            start: 'top top',    // начинаем, когда верх hero касается верха окна
            end: 'bottom top',   // заканчиваем, когда низ hero уходит за верх окна
            scrub: 1.5,          // плавное ведение за скроллом
            // markers: true,    // раскомментировать для отладки
        }
    });

    // Анимация прозрачности: видео сменяют друг друга
    // 0% - 33% скролла: показываем video1, скрываем остальные
    tl.fromTo(video1, { opacity: 1 }, { opacity: 0, duration: 0.33 }, 0)
      .fromTo(video2, { opacity: 0 }, { opacity: 1, duration: 0.33 }, 0.33)
      .fromTo(video2, { opacity: 1 }, { opacity: 0, duration: 0.34 }, 0.66)
      .fromTo(video3, { opacity: 0 }, { opacity: 1, duration: 0.34 }, 0.66);
}

    /* ========== GSAP + SCROLLTRIGGER ANIMATIONS ========== */
    function initGSAPAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Hero: заголовок и кнопка появляются плавно
        const heroTitle = document.querySelector('.hero__title');
        const heroSub = document.querySelector('.hero__subtitle');
        const heroBtn = document.querySelector('.hero .btn');
        if (heroTitle) {
            gsap.from(heroTitle, {
                y: 80,
                opacity: 0,
                duration: 1.2,
                delay: 1.5,
                ease: 'power3.out'
            });
            gsap.from(heroSub, { y: 40, opacity: 0, duration: 1, delay: 1.8, ease: 'power2.out' });
            gsap.from(heroBtn, { y: 40, opacity: 0, duration: 1, delay: 2.1, ease: 'power2.out' });
        }

        // Анимации секций при скролле
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            const title = section.querySelector('.section-title');
            if (title) {
                gsap.from(title, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    },
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                });
            }
        });

        // Карточки стилей
        gsap.from('.style-card', {
            scrollTrigger: { trigger: '#styles', start: 'top 70%' },
            y: 60,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out'
        });

        // Шаги
        gsap.from('.step-item', {
            scrollTrigger: { trigger: '#steps', start: 'top 75%' },
            scale: 0.8,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        });

        // Гарантии
        gsap.from('.guarantees__block', {
            scrollTrigger: { trigger: '#guarantees', start: 'top 80%' },
            y: 40,
            opacity: 0,
            duration: 0.8
        });

        // Отзывы
        gsap.from('.review-item', {
            scrollTrigger: { trigger: '#reviews', start: 'top 80%' },
            y: 40,
            opacity: 0,
            stagger: 0.2,
            duration: 0.6
        });
    }

    /* ========== SPLITTING.JS ========== */
    function initSplitting() {
        // Разбиваем заголовок на слова для возможности анимации (если нужно)
        if (typeof Splitting !== 'undefined') {
            Splitting({ target: '.hero__title', by: 'chars' });
        }
    }

    /* ========== VANILLA TILT ========== */
    function initTilt() {
        if (typeof VanillaTilt !== 'undefined') {
            VanillaTilt.init(document.querySelectorAll('.style-card'), {
                max: 10,
                speed: 400,
                glare: false,
                'max-glare': 0.2,
            });
        }
    }

    /* ========== CALCULATOR ========== */
    function initCalculator() {
        const form = document.getElementById('calcForm');
        const resultDiv = document.getElementById('calcResult');
        const priceSpan = resultDiv.querySelector('.price');
        const previewImg = document.getElementById('calcPreviewImg');
        const typeSelect = document.getElementById('type');

        // Меняем картинку при смене типа ремонта (ещё до расчёта)
        const previewMap = {
            cosmetic: 'assets/img/calculator-default.jpg',
            euro: 'assets/img/calculator-euro.jpg',
            design: 'assets/img/calculator-euro.jpg' // позже можно отдельную
        };
        typeSelect.addEventListener('change', () => {
            const type = typeSelect.value;
            const newSrc = previewMap[type] || previewMap.euro;
            gsap.to(previewImg, { opacity: 0, duration: 0.2, onComplete: () => {
                previewImg.src = newSrc;
                gsap.to(previewImg, { opacity: 1, duration: 0.4 });
            }});
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const area = parseFloat(document.getElementById('area').value) || 0;
            const type = typeSelect.value;
            const bathroom = document.querySelector('input[name="bathroom"]:checked')?.value === 'yes';

            const basePrice = {
                cosmetic: 4500,
                euro: 8000,
                design: 15000
            }[type] || 8000;

            let total = area * basePrice;
            if (bathroom) total += 80000; // фикс за санузел

            // Анимация цифр (простая замена с эффектом)
            const finalPrice = total.toLocaleString('ru-RU') + ' ₽';
            gsap.to(resultDiv, { opacity: 0, duration: 0.2, onComplete: () => {
                priceSpan.textContent = '≈ ' + finalPrice;
                resultDiv.classList.add('visible');
                gsap.fromTo(resultDiv, { scale: 1.1 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' });
            }});
        });
    }

    /* ========== COMPARISON SLIDER ========== */
    function initComparisonSlider() {
        const slider = document.querySelector('.comparison-slider');
        if (!slider) return;
        const after = slider.querySelector('.comparison-slider__after');
        const handle = slider.querySelector('.comparison-slider__handle');
        let isDragging = false;

        const setPosition = (clientX) => {
            const rect = slider.getBoundingClientRect();
            let x = clientX - rect.left;
            x = Math.max(0, Math.min(x, rect.width));
            const percent = (x / rect.width) * 100;
            after.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
            handle.style.left = percent + '%';
        };

        // Mouse events
        handle.addEventListener('mousedown', () => { isDragging = true; });
        window.addEventListener('mouseup', () => { isDragging = false; });
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            setPosition(e.clientX);
        });

        // Touch events
        handle.addEventListener('touchstart', (e) => {
            isDragging = true;
            e.preventDefault();
        });
        window.addEventListener('touchend', () => { isDragging = false; });
        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            setPosition(e.touches[0].clientX);
        });

        // Initial position 50%
        setPosition(slider.getBoundingClientRect().left + slider.offsetWidth / 2);
    }

    /* ========== SWIPER (портфолио) ========== */
    function initSwiper() {
        if (typeof Swiper === 'undefined') return;
        new Swiper('.portfolio-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: { slidesPerView: 2 }
            }
        });
    }

    /* ========== LOTTIE STEPS ========== */
    function initLottieSteps() {
        if (typeof lottie === 'undefined') return;
        const lottieContainers = document.querySelectorAll('.step-lottie');
        lottieContainers.forEach(container => {
            const path = container.dataset.lottie;
            if (!path) return;
            const anim = lottie.loadAnimation({
                container: container,
                renderer: 'svg',
                loop: false,
                autoplay: false,
                path: path,
            });
            // Запуск при появлении в зоне видимости
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        anim.play();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            observer.observe(container);
        });
    }

    /* ========== CONTACT FORM to TELEGRAM ========== */
    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        // ⚠️ Замените на свои данные бота
        const TELEGRAM_TOKEN = 'YOUR_BOT_TOKEN';
        const CHAT_ID = 'YOUR_CHAT_ID';

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const name = formData.get('name')?.trim();
            const phone = formData.get('phone')?.trim();
            const message = formData.get('message')?.trim();
            const agree = formData.get('agree');

            if (!name || !phone || !agree) {
                alert('Пожалуйста, заполните обязательные поля и согласитесь на обработку данных.');
                return;
            }

            const text = `*Новая заявка с сайта Remontbanan817*%0AИмя: ${name}%0AТелефон: ${phone}%0AСообщение: ${message || 'не указано'}`;
            const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${text}&parse_mode=Markdown`;

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data.ok) {
                    alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
                    form.reset();
                } else {
                    throw new Error(data.description || 'Ошибка отправки');
                }
            } catch (error) {
                console.error(error);
                alert('Не удалось отправить заявку. Пожалуйста, позвоните нам по телефону.');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});
