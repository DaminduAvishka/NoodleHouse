// ----------------------------------------------------------------
// INITIALIZE & CORE UTILITIES
// ----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Setup Custom Cursor
    initCustomCursor();


    // Setup Scroll Effects & Header
    initScrollEffects();

    // Setup Navigation & Mobile Hamburger
    initNavigation();

    // Setup GSAP Parallax & Scroll Animations
    initAnimations();

    // Setup Interactive Menu Filters & Customization Modal
    initMenu();

    // Setup Reviews Testimonial Slider
    initReviewsCarousel();

    // Setup Image Gallery Lightbox & Filters
    initGallery();

    // Setup FAQ Japanese Accordions
    initFaqs();

    // Setup Dark-Themed Leaflet Map
    initMap();

    // Setup Mobile Carousels Auto-scroll
    initCarouselsAutoScroll();
});

// Smooth scroll helper
function scrollToSection(selector) {
    const element = document.querySelector(selector);
    if (element) {
        // Close mobile nav if open
        const mobileNav = document.querySelector('.mobile-nav');
        const hamburger = document.querySelector('.mobile-nav-toggle');
        if (mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            hamburger.classList.remove('open');
        }

        const offset = 80; // height of header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// ----------------------------------------------------------------
// CUSTOM CURSOR
// ----------------------------------------------------------------
function initCustomCursor() {
    const canvas = document.getElementById('noodle-canvas');
    if (!canvas) return;

    // Completely disable custom canvas cursor on touch devices / mobile to save CPU/GPU cycles
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 768);
    if (isTouchDevice) {
        canvas.style.display = 'none';
        return;
    }

    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Noodle physics/trail points
    const pointCount = 35; // More points = longer noodle!
    const points = [];
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    // Initialize points
    for (let i = 0; i < pointCount; i++) {
        points.push({ x: mouseX, y: mouseY });
    }

    let isLoopActive = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Wake up loop if idle
        if (!isLoopActive) {
            isLoopActive = true;
            requestAnimationFrame(drawNoodle);
        }
    });

    // Main animation loop
    function drawNoodle() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update noodle physics trail
        points[0].x = mouseX;
        points[0].y = mouseY;

        let totalDelta = 0;

        // Remaining points follow with a drag delay
        for (let i = 1; i < pointCount; i++) {
            const oldX = points[i].x;
            const oldY = points[i].y;

            const dx = points[i-1].x - points[i].x;
            const dy = points[i-1].y - points[i].y;
            
            // Linear interpolation easing rate
            const ease = 0.35 - (i / pointCount) * 0.22;
            
            points[i].x += dx * ease;
            points[i].y += dy * ease;

            totalDelta += Math.abs(points[i].x - oldX) + Math.abs(points[i].y - oldY);
        }

        // Draw the noodle line segments
        const isHovered = document.body.classList.contains('hovered-link');
        
        // Noodle colors
        const normalColor = '#e0a96d'; // Gold
        const hoverColor = '#e63946';  // Crimson red
        const activeColor = isHovered ? hoverColor : normalColor;

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Set noodle shadow for 3D look
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;

        // Draw overlapping line segments with tapering width
        for (let i = 0; i < pointCount - 1; i++) {
            const p1 = points[i];
            const p2 = points[i+1];

            // Taper width from 8px at the head down to 1.6px at the tail
            const width = 8 * (1 - (i / pointCount) * 0.8);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineWidth = width;
            ctx.strokeStyle = activeColor;
            ctx.stroke();
        }

        // Pause loop if cursor physics have completely settled
        const headToMouse = Math.abs(points[0].x - mouseX) + Math.abs(points[0].y - mouseY);
        if (totalDelta < 0.05 && headToMouse < 0.05) {
            isLoopActive = false;
        } else {
            requestAnimationFrame(drawNoodle);
        }
    }

    // Start initial loop to let points settle
    isLoopActive = true;
    requestAnimationFrame(drawNoodle);

    // Link hover states
    const hoverables = document.querySelectorAll('a, button, .menu-tab, .gallery-item, .faq-question, .custom-radio, .custom-checkbox, input, select, textarea');
    
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovered-link');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovered-link');
        });
    });
}


// ----------------------------------------------------------------
// HEADER SCROLL & TRANSITIONS
// ----------------------------------------------------------------
function initScrollEffects() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ----------------------------------------------------------------
// NAVIGATION & HAMBURGER
// ----------------------------------------------------------------
function initNavigation() {
    const toggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        mobileNav.classList.toggle('active');
    });

    // Close mobile menu on click of nav links
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSelector = link.getAttribute('href');
            scrollToSection(targetSelector);
        });
    });

    // Nav Links in Header
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSelector = link.getAttribute('href');
            scrollToSection(targetSelector);
        });
    });

    // Active Section Tracking on Scroll
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 120;
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPosition >= top && scrollPosition < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// ----------------------------------------------------------------
// GSAP SCROLLTRIGGERS & PARALLAX
// ----------------------------------------------------------------
function initAnimations() {
    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // 1. Hero Parallax Scroll Effect
    // Shifting background image slower
    gsap.to('.hero-parallax-bg', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // Main image frame parallax (rising slowly)
    gsap.to('.main-frame', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // Offset image frame parallax (sinking slowly)
    gsap.to('.offset-frame', {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // Decor badge parallax (rising faster)
    gsap.to('.hero-decor-badge', {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // Shift text slightly
    gsap.to('.hero-text-wrap', {
        yPercent: 12,
        opacity: 0.1,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // 2. About section collage parallax
    gsap.to('.main-img-wrap', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });

    gsap.to('.float-img-wrap', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });

    // 3. Reveal elements on scroll
    const scrollReveals = document.querySelectorAll('.scroll-reveal');
    scrollReveals.forEach(element => {
        gsap.from(element, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none none' // Play once
            }
        });
    });

    // 4. Menu Card staggered reveal
    ScrollTrigger.batch('.menu-card', {
        onEnter: batch => gsap.to(batch, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            overwrite: 'auto'
        }),
        start: 'top 85%'
    });

    // 5. Offers Card Stagger
    ScrollTrigger.batch('.offer-card', {
        onEnter: batch => gsap.to(batch, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
            overwrite: 'auto'
        }),
        start: 'top 85%'
    });

    // 6. Dynamic Hovers (using GSAP to prevent CSS transition clashes)
    setupCardHovers();
}

function setupCardHovers() {
    // Menu Card Hovers
    document.querySelectorAll('.menu-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -8,
                borderColor: 'rgba(224, 169, 109, 0.3)',
                backgroundColor: '#181818',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
                duration: 0.3,
                ease: 'power2.out',
                overwrite: 'auto'
            });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                borderColor: 'rgba(255, 255, 255, 0.08)',
                backgroundColor: '#121212',
                boxShadow: '0 0px 0px rgba(0, 0, 0, 0)',
                duration: 0.3,
                ease: 'power2.out',
                overwrite: 'auto'
            });
        });
    });

    // Offer Card Hovers
    document.querySelectorAll('.offer-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -8,
                borderColor: 'rgba(224, 169, 109, 0.3)',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
                duration: 0.3,
                ease: 'power2.out',
                overwrite: 'auto'
            });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                borderColor: 'rgba(255, 255, 255, 0.08)',
                boxShadow: '0 0px 0px rgba(0, 0, 0, 0)',
                duration: 0.3,
                ease: 'power2.out',
                overwrite: 'auto'
            });
        });
    });
}

// ----------------------------------------------------------------
// INTERACTIVE MENU FILTERS & DETAILS MODAL
// ----------------------------------------------------------------
const menuDetails = {
    'tonkotsu': {
        title: 'Black Garlic Tonkotsu',
        price: 18.50,
        category: 'Signature Ramen',
        img: 'assets/ramen_tonkotsu.jpg',
        desc: 'Our supreme chef bowl. Kurobuta pork bone broth slow-simmered for 24 hours to extract rich umami and heavy collagen, infused with charcoal roasted black garlic oil (Mayu), freshly crafted wavy wheat noodles, melt-in-your-mouth pork belly chashu, tender wood ear mushrooms, soft-boiled marinated ajitama egg, fresh scallions, and bamboo shoots.'
    },
    'spicy-miso': {
        title: 'Chili Inferno Miso',
        price: 19.00,
        category: 'Signature Ramen',
        img: 'assets/ramen_spicy.jpg',
        desc: 'Built for fire-lovers. Rich pork bone broth infused with red miso paste, ground toasted sesame seeds, Sichuan chili pepper oil, and double-fermented vinegar. Topped with spiced minced pork, shredded wood ear mushrooms, dynamic thread chili, scallions, bamboo shoots, and soft-boiled ramen egg.'
    },
    'truffle-shoyu': {
        title: 'Truffle Shoyu Dashi',
        price: 21.50,
        category: 'Signature Ramen',
        img: 'assets/ramen_shoyu.jpg',
        desc: 'An exquisite combination of styles. Clear, clean chicken and bonito dashi tare aged with three Japanese soy sauces. Served with slow-cooked, pan-seared duck breast slices, fine black truffle pate, marinated bamboo strips, micro chives, and a soft ajitama egg.'
    },
    'vegan-harvest': {
        title: 'Vegan Sesame Harvest',
        price: 17.50,
        category: 'Signature Ramen',
        img: 'assets/ramen_vegan.jpg',
        desc: '100% plant-based comfort. A creamy, rich broth created by blending ground sesame paste, toasted pine nuts, and organic oat milk with high-grade kombu dashi. Served with egg-free noodles, thick cuts of roasted king oyster mushrooms, charred baby bok choy, sweet corn kernels, and high-quality chili oil.'
    },
    'gyoza': {
        title: 'Hand-Folded Gyoza',
        price: 8.50,
        category: 'House Starters',
        img: 'assets/gyoza.jpg',
        desc: 'Classic potstickers folded daily by our chefs. Filled with minced pork belly, napa cabbage, garlic, ginger, and fresh chives. Pan-seared to form a gorgeous crispy lattice skirt, served alongside dark soy vinegar and chili crisp.'
    },
    'karaage': {
        title: 'Tokyo Crispy Karaage',
        price: 9.50,
        category: 'House Starters',
        img: 'assets/karaage.jpg',
        desc: 'Japanese style crispy fried chicken. Boneless chicken thighs marinated in sake, shoyu, garlic, and fresh ginger juice, coated lightly in potato starch and double-fried to seal juices. Served with yuzu kosho mayo and lemon wedges.'
    },
    'sake-flight': {
        title: 'House Craft Sake Flight',
        price: 16.00,
        category: 'Beverages & Sake',
        img: 'assets/sake.jpg',
        desc: 'An exploration of sake profiles. Includes 2oz pours of: (1) Daiginjo - highly polished, delicate and fruity; (2) Honjozo - dry, sharp and highly pairing-friendly; (3) Nigori - creamy, unfiltered, sweet and textured.'
    },
    'matcha': {
        title: 'Uji Matcha Tiramisu',
        price: 7.50,
        category: 'Desserts',
        img: 'assets/matcha_tiramisu.jpg',
        desc: 'Our flagship dessert. Ladyfinger biscuits soaked in strong ceremonial-grade matcha from Uji, Kyoto. Layered with airy, whipped mascarpone cream, and dusted heavily with aromatic, vibrant green matcha powder.'
    }
};

let currentModalItem = null;
let currentQuantity = 1;
let basePrice = 0;

function initMenu() {
    const tabs = document.querySelectorAll('.menu-tab');
    const cards = document.querySelectorAll('.menu-card');

    if (!tabs || !cards) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active state
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const category = tab.getAttribute('data-category');

            cards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                
                if (category === 'all' || cardCat === category) {
                    card.classList.remove('hidden');
                    // Trigger dynamic layout entry
                    gsap.fromTo(card, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 });
                } else {
                    card.classList.add('hidden');
                }
            });
            
            // Refresh ScrollTrigger as elements heights will shift
            ScrollTrigger.refresh();
        });
    });
}

function openMenuDetails(itemId) {
    const item = menuDetails[itemId];
    if (!item) return;

    currentModalItem = itemId;
    currentQuantity = 1;
    basePrice = item.price;

    // Populate modal fields
    document.getElementById('modal-item-img').src = item.img;
    document.getElementById('modal-item-img').alt = item.title;
    document.getElementById('modal-item-category').innerText = item.category;
    document.getElementById('modal-item-title').innerText = item.title;
    document.getElementById('modal-item-price').innerText = `$${item.price.toFixed(2)}`;
    document.getElementById('modal-item-desc').innerText = item.desc;
    document.getElementById('item-quantity').innerText = currentQuantity;

    // Reset customizations
    document.querySelectorAll('.customization-options input[type="radio"]').forEach(radio => {
        if (radio.value === 'medium' || radio.value === '1' || radio.value === '0') {
            radio.checked = true;
        }
    });
    document.querySelectorAll('.customization-options input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });

    updateModalTotal();

    // Show modal
    document.getElementById('menu-detail-modal').classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
    
    // Add custom cursor hover state resets
    document.body.classList.remove('hovered-link');
}

function closeMenuDetails() {
    document.getElementById('menu-detail-modal').classList.remove('active');
    document.body.style.overflow = ''; // Release scroll
}

function changeQty(amount) {
    currentQuantity += amount;
    if (currentQuantity < 1) currentQuantity = 1;
    document.getElementById('item-quantity').innerText = currentQuantity;
    updateModalTotal();
}

// Listen to customized toppings checks to dynamically adjust total price
document.querySelectorAll('.customization-options input').forEach(input => {
    input.addEventListener('change', updateModalTotal);
});

function updateModalTotal() {
    if (!basePrice) return;
    
    let toppingsCost = 0;
    const checkedToppings = document.querySelectorAll('.customization-options input[name="toppings"]:checked');
    toppingsCost = checkedToppings.length * 2.00; // $2 per topping

    const singleItemTotal = basePrice + toppingsCost;
    const finalTotal = singleItemTotal * currentQuantity;

    document.getElementById('modal-order-total').innerText = `$${finalTotal.toFixed(2)}`;
}

function addToOrder() {
    // Show success visual trigger on Add button
    const btn = document.querySelector('.btn-add-order');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<span>Added! ✓</span>';
    btn.style.backgroundColor = '#4caf50';
    btn.style.boxShadow = '0 0 10px rgba(76,175,80,0.4)';

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.backgroundColor = '';
        btn.style.boxShadow = '';
        closeMenuDetails();
        
        // Dynamic Notification message
        alert(`Order Added: ${currentQuantity}x ${menuDetails[currentModalItem].title} to tray!`);
    }, 800);
}

// ----------------------------------------------------------------
// GOOGLE REVIEWS CAROUSEL
// ----------------------------------------------------------------
function initReviewsCarousel() {
    const track = document.querySelector('.reviews-track');
    const cards = document.querySelectorAll('.review-card');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const dots = document.querySelectorAll('.carousel-dots .dot');

    if (!track || cards.length === 0) return;

    let currentIndex = 0;

    function getVisibleCards() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function updateCarousel() {
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(0, cards.length - visibleCards);
        
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        if (currentIndex < 0) currentIndex = 0;

        const cardWidth = cards[0].offsetWidth;
        const gap = 32; // 2rem gap defined in CSS
        const offset = currentIndex * (cardWidth + gap);

        track.style.transform = `translateX(-${offset}px)`;

        // Update dot states
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            // Group active states based on current visibility
            if (visibleCards === 3 && index === currentIndex) {
                dot.classList.add('active');
            } else if (visibleCards === 2 && index === Math.min(currentIndex, 2)) {
                dot.classList.add('active');
            } else if (visibleCards === 1 && index === currentIndex) {
                dot.classList.add('active');
            }
        });
    }

    nextBtn.addEventListener('click', () => {
        const visibleCards = getVisibleCards();
        if (currentIndex < cards.length - visibleCards) {
            currentIndex++;
            updateCarousel();
        } else {
            currentIndex = 0; // loop back
            updateCarousel();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        } else {
            currentIndex = cards.length - getVisibleCards(); // loop to end
            updateCarousel();
        }
    });

    // Make dots clickable
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const visibleCards = getVisibleCards();
            const maxIndex = cards.length - visibleCards;
            currentIndex = Math.min(index, maxIndex);
            updateCarousel();
        });
    });

    window.addEventListener('resize', updateCarousel);
    
    // Auto slide
    let timer = setInterval(() => {
        nextBtn.click();
    }, 6000);

    // Pause on hover
    track.parentElement.addEventListener('mouseenter', () => clearInterval(timer));
    track.parentElement.addEventListener('mouseleave', () => {
        timer = setInterval(() => {
            nextBtn.click();
        }, 6000);
    });
}

// ----------------------------------------------------------------
// IMAGE GALLERY MASONRY & LIGHTBOX
// ----------------------------------------------------------------
const galleryData = [
    { src: 'assets/gallery_dish_1.jpg', category: 'dishes', title: 'Pork Belly Caramelization', desc: 'Searing chashu slices with high heat torch' },
    { src: 'assets/gallery_craft_1.jpg', category: 'craft', title: 'Noodle Stretching Ritual', desc: 'Fresh Hokkaido dough pulled and sliced into shape' },
    { src: 'assets/gallery_int_1.jpg', category: 'interior', title: 'Wooden Counter & Lanterns', desc: 'Our intimate cedar bar lit by soft and warm custom lamps' },
    { src: 'assets/gallery_dish_2.jpg', category: 'dishes', title: 'House Chili Oil Infusion', desc: 'Adding droplets of hand-ground chili and sesame oil' },
    { src: 'assets/gallery_craft_2.jpg', category: 'craft', title: 'Broth Master Strain', desc: 'Straining soup dashi base after a continuous boil' },
    { src: 'assets/gallery_int_2.jpg', category: 'interior', title: 'Exterior Noren Curtains', desc: 'Entrance curtains greeting guests with cozy ambiance' }
];

let activeLightboxIndex = 0;

function initGallery() {
    const filters = document.querySelectorAll('.gallery-filter-btn');
    const items = document.querySelectorAll('.gallery-item');

    if (!filters || !items) return;

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            items.forEach(item => {
                const itemCat = item.getAttribute('data-category');
                if (filterValue === 'all' || itemCat === filterValue) {
                    item.classList.remove('hidden');
                    gsap.fromTo(item, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.3 });
                } else {
                    item.classList.add('hidden');
                }
            });
            ScrollTrigger.refresh();
        });
    });
}

function openLightbox(index) {
    activeLightboxIndex = index;
    const data = galleryData[index];
    if (!data) return;

    document.getElementById('lightbox-img').src = data.src;
    document.getElementById('lightbox-img').alt = data.title;
    document.getElementById('lightbox-caption').innerHTML = `<strong>${data.title}</strong> — ${data.desc}`;

    document.getElementById('gallery-lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('gallery-lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    activeLightboxIndex += direction;
    if (activeLightboxIndex < 0) {
        activeLightboxIndex = galleryData.length - 1;
    } else if (activeLightboxIndex >= galleryData.length) {
        activeLightboxIndex = 0;
    }
    openLightbox(activeLightboxIndex);
}

// ----------------------------------------------------------------
// FAQs ACCORDION (Exclusive Opening)
// ----------------------------------------------------------------
function initFaqs() {
    const cards = document.querySelectorAll('.faq-card');
    
    cards.forEach(card => {
        const question = card.querySelector('.faq-question');
        const answer = card.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = card.classList.contains('active');

            // Close all open FAQs
            cards.forEach(c => {
                c.classList.remove('active');
                c.querySelector('.faq-answer').style.maxHeight = null;
            });

            // If it wasn't open, open it
            if (!isActive) {
                card.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

// ----------------------------------------------------------------
// FORMS RESERVATION & NEWSLETTER HANDLERS
// ----------------------------------------------------------------
function handleReservationSubmit(event) {
    event.preventDefault();
    const form = document.getElementById('booking-form');
    const success = document.getElementById('booking-success');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Simulate Server Loading
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Confirming Seat...</span>';
    submitBtn.disabled = true;

    setTimeout(() => {
        form.classList.add('hidden');
        success.classList.add('active');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function resetBookingForm() {
    const form = document.getElementById('booking-form');
    const success = document.getElementById('booking-success');
    
    form.reset();
    form.classList.remove('hidden');
    success.classList.remove('active');
}

function handleNewsletterSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const input = form.querySelector('input');
    const successMsg = document.getElementById('newsletter-success-msg');
    
    successMsg.classList.add('active');
    input.value = '';
    
    setTimeout(() => {
        successMsg.classList.remove('active');
    }, 4000);
}

// ----------------------------------------------------------------
// DARK MODE LEAFLET MAP
// ----------------------------------------------------------------
function initMap() {
    const mapContainer = document.getElementById('leaflet-map');
    if (!mapContainer) return;

    // Set coordinates for Shibakoen, Tokyo (Ramen restaurant coordinates)
    const restaurantCoords = [35.6575, 139.7528]; 

    // Instantiate map
    const map = L.map('leaflet-map', {
        center: restaurantCoords,
        zoom: 15,
        zoomControl: false, // Custom position or disable for clean look
        scrollWheelZoom: false // Prevent accidental scrolling
    });

    // Dark-themed tile layer from CartoDB (Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Custom Icon for Ramen Pin (Red glowing point)
    const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
            <div class="marker-pulse"></div>
            <div class="marker-icon">🍜</div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    // Add marker to map
    const marker = L.marker(restaurantCoords, { icon: customIcon }).addTo(map);

    // Add styled popup
    marker.bindPopup(`
        <div class="map-popup-card">
            <h4 style="margin-bottom: 2px; font-family: 'Noto Serif JP', serif; color: #e63946;">NoodleHouse Tokyo</h4>
            <p style="margin: 0; font-size: 11px; color: #a0a0a0;">Cozy bar tables. Smelling fresh broth daily.</p>
        </div>
    `).openPopup();

    // Map style injection for marker
    const style = document.createElement('style');
    style.innerHTML = `
        .custom-map-marker {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .marker-icon {
            font-size: 24px;
            z-index: 2;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
        }
        .marker-pulse {
            position: absolute;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: rgba(230, 57, 70, 0.4);
            border: 2px solid var(--color-primary);
            z-index: 1;
            animation: mapPulse 2s infinite;
        }
        @keyframes mapPulse {
            0% { transform: scale(0.6); opacity: 1; }
            100% { transform: scale(1.6); opacity: 0; }
        }
        .map-popup-card {
            background-color: #121212;
            color: #fff;
            border: none;
        }
        .leaflet-popup-content-wrapper, .leaflet-popup-tip {
            background: #121212 !important;
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
            color: #fff !important;
            border-radius: 4px !important;
        }
    `;
    document.head.appendChild(style);
}

// Setup horizontal touch-friendly carousels auto-scroll on mobile
function initCarouselsAutoScroll() {
    setupAutoScroll('.menu-grid', '.menu-card');
    setupAutoScroll('.offers-grid', '.offer-card');
    setupAutoScroll('.gallery-grid', '.gallery-item');
}

function setupAutoScroll(gridSelector, cardSelector) {
    const grid = document.querySelector(gridSelector);
    if (!grid) return;

    let isUserInteracting = false;
    let scrollInterval;
    let touchTimeout;

    function startAutoScroll() {
        stopAutoScroll();
        scrollInterval = setInterval(() => {
            if (isUserInteracting || window.innerWidth > 768) return;
            
            // Only select visible cards in the carousel (not hidden by category filters)
            const cards = Array.from(grid.querySelectorAll(cardSelector)).filter(card => {
                return !card.classList.contains('hidden') && getComputedStyle(card).display !== 'none';
            });
            if (cards.length <= 1) return;

            const cardWidth = cards[0].offsetWidth;
            const gap = 24; // 1.5rem
            const step = cardWidth + gap;

            // Current horizontal scroll index
            const currentIndex = Math.round(grid.scrollLeft / step);
            const nextIndex = (currentIndex + 1) % cards.length;

            grid.scrollTo({
                left: nextIndex * step,
                behavior: 'smooth'
            });
        }, 4500); // Auto-scroll every 4.5 seconds
    }

    function stopAutoScroll() {
        if (scrollInterval) clearInterval(scrollInterval);
    }

    // Pause on manual touch start, and resume after 8 seconds of inactivity
    grid.addEventListener('touchstart', () => {
        isUserInteracting = true;
        stopAutoScroll();
        if (touchTimeout) clearTimeout(touchTimeout);
    }, { passive: true });

    grid.addEventListener('touchend', () => {
        touchTimeout = setTimeout(() => {
            isUserInteracting = false;
            startAutoScroll();
        }, 8000); // wait 8s after last touch to resume
    }, { passive: true });

    // Start on init
    startAutoScroll();
}
