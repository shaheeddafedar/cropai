document.addEventListener('DOMContentLoaded', () => {
    const loginModalOverlay = document.getElementById('login-modal-overlay');
    const loginBtn = document.getElementById('login-btn');
    const heroCtaBtn = document.getElementById('hero-cta-btn');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const closeModalBtn = document.querySelector('.close-btn');


    const showLoginModal = () => {
        loginModalOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };
    window.showLoginModal = showLoginModal; 

    const hideLoginModal = () => {
        loginModalOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    };


    loginBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginModal();
    });
    
   

    heroCtaBtn?.addEventListener('click', (e) => {
      
        const isLoggedIn = !document.getElementById('login-btn');
        if (!isLoggedIn) {
            e.preventDefault();
            showLoginModal();
        }
    });
    
    mobileMenuToggle?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuToggle.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    closeModalBtn?.addEventListener('click', hideLoginModal);
    
    loginModalOverlay?.addEventListener('click', (e) => {
        if (e.target === loginModalOverlay) hideLoginModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !loginModalOverlay.classList.contains('hidden')) {
            hideLoginModal();
        }
    });

    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .testimonial-card, .stat-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    };
    
    animateOnScroll();
});