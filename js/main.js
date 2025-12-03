// ==========================================================================
// Main JavaScript for UX Portfolio
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // Hamburger Menu Toggle
    // ==========================================================================
    
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.querySelector('.main-nav');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    function toggleMenu() {
        hamburger.classList.toggle('is-active');
        mainNav.classList.toggle('is-active');
        menuOverlay.classList.toggle('is-active');
        
        // Update aria-expanded for accessibility
        const isExpanded = hamburger.classList.contains('is-active');
        hamburger.setAttribute('aria-expanded', isExpanded);
        
        // Prevent body scroll when menu is open
        if (isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    function closeMenu() {
        hamburger.classList.remove('is-active');
        mainNav.classList.remove('is-active');
        menuOverlay.classList.remove('is-active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
    
    if (hamburger && mainNav) {
        // Toggle menu when clicking hamburger
        hamburger.addEventListener('click', toggleMenu);
        
        // Close menu when clicking overlay
        if (menuOverlay) {
            menuOverlay.addEventListener('click', closeMenu);
        }
        
        // Close menu when clicking on a nav link
        const navLinks = document.querySelectorAll('.nav-link, .nav-btn');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }
    
    // ==========================================================================
    // Active Navigation Link
    // ==========================================================================
    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.style.color = '#A0B1A5';
        }
    });
    
    // ==========================================================================
    // Smooth Scroll for Anchor Links
    // ==========================================================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ==========================================================================
    // Animate.css Integration - Ready for Future Use
    // ==========================================================================
    
    // Function to add animation to elements (ready for future implementation)
    function animateElement(element, animationName, callback) {
        element.classList.add('animate__animated', `animate__${animationName}`);
        
        function handleAnimationEnd(event) {
            event.stopPropagation();
            element.classList.remove('animate__animated', `animate__${animationName}`);
            if (typeof callback === 'function') callback();
        }
        
        element.addEventListener('animationend', handleAnimationEnd, { once: true });
    }
    
    // Expose animateElement function globally for future use
    window.animateElement = animateElement;
    
    // ==========================================================================
    // Scroll Reveal Animation Setup (Ready but not activated)
    // ==========================================================================
    
    // Observer for scroll-triggered animations (ready for future activation)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ready for animation triggers
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);
    
    // Function to observe elements for scroll animations (ready for future use)
    function observeElements(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => observer.observe(el));
    }
    
    // Expose observer function globally for future use
    window.observeElements = observeElements;
    
    // ==========================================================================
    // Touch Support for Tooltips
    // ==========================================================================
    
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('click', function(e) {
            // On mobile, show tooltip on tap
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                
                // Toggle active class for tooltip
                this.classList.toggle('tooltip-active');
                
                // Remove active class from other tooltips
                tooltipElements.forEach(other => {
                    if (other !== this) {
                        other.classList.remove('tooltip-active');
                    }
                });
            }
        });
    });
    
    // Close tooltips when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('[data-tooltip]')) {
            tooltipElements.forEach(element => {
                element.classList.remove('tooltip-active');
            });
        }
    });
    
    // ==========================================================================
    // Testimonials Slider with Drag/Swipe
    // ==========================================================================
    
    const slider = document.querySelector('.testimonials-slider');
    const sliderWrapper = document.querySelector('.testimonials-slider-wrapper');
    const dotsContainer = document.querySelector('.testimonials-dots');
    const cards = document.querySelectorAll('.testimonial-card');
    let currentSlide = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    
    // Check if we're on desktop (2 cards visible)
    function isDesktop() {
        return window.innerWidth >= 1024;
    }
    
    // Get number of visible cards
    function getVisibleCards() {
        return isDesktop() ? 2 : 1;
    }
    
    // Set card widths based on viewport
    function setCardWidths() {
        if (!sliderWrapper || cards.length === 0) return;
        const wrapperWidth = sliderWrapper.offsetWidth;
        const visibleCards = getVisibleCards();
        const gap = 40;
        
        cards.forEach(card => {
            if (visibleCards === 2) {
                card.style.width = `calc(50% - ${gap / 2}px)`;
            } else {
                card.style.width = `${wrapperWidth}px`;
            }
        });
    }
    
    // Update slider position
    function updateSlider() {
        if (!slider || cards.length === 0) return;
        
        const visibleCards = getVisibleCards();
        const cardWidth = cards[0].offsetWidth;
        const gap = 40;
        const slideWidth = visibleCards === 2 ? (cardWidth + gap) * 2 : cardWidth + gap;
        const offset = currentSlide * slideWidth;
        slider.style.transform = `translateX(-${offset}px)`;
        
        // Update active dot
        const dots = document.querySelectorAll('.testimonials-dots .dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Get total number of slides
    function getTotalSlides() {
        const visibleCards = getVisibleCards();
        return Math.ceil(cards.length / visibleCards);
    }
    
    // Update pagination dots
    function updateDots() {
        if (!dotsContainer) return;
        
        const totalSlides = getTotalSlides();
        dotsContainer.innerHTML = '';
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === currentSlide) {
                dot.classList.add('active');
            }
            dot.setAttribute('data-slide', i);
            dot.addEventListener('click', () => {
                goToSlide(i);
            });
            dotsContainer.appendChild(dot);
        }
    }
    
    // Go to specific slide
    function goToSlide(slideIndex) {
        const totalSlides = getTotalSlides();
        currentSlide = Math.max(0, Math.min(slideIndex, totalSlides - 1));
        updateSlider();
    }
    
    // Get position from mouse or touch event
    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }
    
    // Start dragging
    function dragStart(event) {
        if (event.type === 'mousedown') {
            event.preventDefault();
        }
        
        isDragging = true;
        startPos = getPositionX(event);
        animationID = requestAnimationFrame(animation);
        sliderWrapper.classList.add('dragging');
    }
    
    // During drag
    function dragMove(event) {
        if (!isDragging) return;
        
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
    }
    
    // End dragging
    function dragEnd() {
        if (!isDragging) return;
        
        isDragging = false;
        cancelAnimationFrame(animationID);
        sliderWrapper.classList.remove('dragging');
        
        const movedBy = currentTranslate - prevTranslate;
        const totalSlides = getTotalSlides();
        
        // If moved enough, go to next/prev slide
        if (movedBy < -50 && currentSlide < totalSlides - 1) {
            currentSlide += 1;
        }
        
        if (movedBy > 50 && currentSlide > 0) {
            currentSlide -= 1;
        }
        
        setPositionByIndex();
    }
    
    // Animation loop for smooth dragging
    function animation() {
        if (isDragging) {
            slider.style.transform = `translateX(${currentTranslate}px)`;
            requestAnimationFrame(animation);
        }
    }
    
    // Set position based on current slide
    function setPositionByIndex() {
        const visibleCards = getVisibleCards();
        const cardWidth = cards[0].offsetWidth;
        const gap = 40;
        const slideWidth = visibleCards === 2 ? (cardWidth + gap) * 2 : cardWidth + gap;
        currentTranslate = currentSlide * -slideWidth;
        prevTranslate = currentTranslate;
        updateSlider();
    }
    
    // Mouse events
    if (sliderWrapper) {
        sliderWrapper.addEventListener('mousedown', dragStart);
        sliderWrapper.addEventListener('mousemove', dragMove);
        sliderWrapper.addEventListener('mouseup', dragEnd);
        sliderWrapper.addEventListener('mouseleave', dragEnd);
        
        // Touch events
        sliderWrapper.addEventListener('touchstart', dragStart);
        sliderWrapper.addEventListener('touchmove', dragMove);
        sliderWrapper.addEventListener('touchend', dragEnd);
        
        // Prevent context menu on long press
        sliderWrapper.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Disable text selection during drag
        sliderWrapper.addEventListener('dragstart', (e) => e.preventDefault());
    }
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            currentSlide = 0; // Reset to first slide on resize
            setCardWidths();
            updateDots();
            setPositionByIndex();
        }, 250);
    });
    
    // Initialize slider
    if (slider && cards.length > 0) {
        setCardWidths();
        updateDots();
        updateSlider();
    }
    
});

