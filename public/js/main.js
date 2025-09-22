// Handles global UI elements like the login modal and navigation buttons.
document.addEventListener('DOMContentLoaded', () => {
    const loginModalOverlay = document.getElementById('login-modal-overlay');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const dashboardLink = document.getElementById('dashboard-link');
    const heroCtaBtn = document.getElementById('hero-cta-btn');

    const closeModalBtn = document.querySelector('.close-btn');
    const googleLoginBtn = document.getElementById('google-login-btn');
    const emailLoginForm = document.getElementById('email-login-form');
    const phoneLoginForm = document.getElementById('phone-login-form');
    const phoneSubmitBtn = document.getElementById('phone-submit-btn');
    const otpGroup = document.querySelector('.otp-group');

    const performLogin = (userId) => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', userId);
        alert('Login successful! Redirecting to your dashboard.');
        window.location.href = '/dashboard';
    };

    const performLogout = () => {
        localStorage.clear();
        alert('You have been logged out.');
        updateUI();
        window.location.href = '/';
    };

    const showLoginModal = () => loginModalOverlay?.classList.remove('hidden');
    const hideLoginModal = () => loginModalOverlay?.classList.add('hidden');

    const updateUI = () => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (loginBtn) loginBtn.style.display = isLoggedIn ? 'none' : 'inline-block';
        if (registerBtn) registerBtn.textContent = isLoggedIn ? 'Logout' : 'Get Started';
        if (dashboardLink) dashboardLink.style.display = isLoggedIn ? 'block' : 'none';
        if (heroCtaBtn) heroCtaBtn.href = isLoggedIn ? '/dashboard' : '#';
    };

    loginBtn?.addEventListener('click', (e) => { e.preventDefault(); showLoginModal(); });
    registerBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.getItem('isLoggedIn') === 'true' ? performLogout() : showLoginModal();
    });
    heroCtaBtn?.addEventListener('click', (e) => {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            e.preventDefault();
            showLoginModal();
        }
    });

    closeModalBtn?.addEventListener('click', hideLoginModal);
    loginModalOverlay?.addEventListener('click', (e) => { if (e.target === loginModalOverlay) hideLoginModal(); });

    googleLoginBtn?.addEventListener('click', () => performLogin('google_user_' + Date.now()));
    emailLoginForm?.addEventListener('submit', (e) => { e.preventDefault(); performLogin('email_user_' + Date.now()); });
    phoneLoginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (otpGroup?.classList.contains('hidden')) {
            otpGroup.classList.remove('hidden');
            phoneSubmitBtn.textContent = 'Verify OTP';
            alert('Simulated OTP sent to your phone!');
        } else {
            performLogin('phone_user_' + Date.now());
        }
    });
    
    updateUI();
});