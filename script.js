document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Scroll Reveal Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });

    // 2. Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // 3. Smooth Scrolling & Active Navbar Highlight
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');
    const nav = document.querySelector('.glass-nav');

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = nav.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active Highlight & Navbar Dynamic Background on Scroll
    window.addEventListener('scroll', () => {
        // Dynamic Navbar Background
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(5, 5, 8, 0.85)';
            nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.6)';
        } else {
            nav.style.background = 'rgba(5, 5, 8, 0.6)';
            nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        }

        // Active Navbar Link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Subtracting an offset to trigger earlier when scrolling down
            if (window.pageYOffset >= (sectionTop - 250)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // 4. Typing Animation for Hero Subtitle
    const textToType = "Aspiring AI/ML Engineer";
    const typingElement = document.querySelector('.typing-text');
    let charIndex = 0;

    if (typingElement) {
        typingElement.textContent = ''; // Clear fallback text

        function typeWriter() {
            if (charIndex < textToType.length) {
                typingElement.textContent += textToType.charAt(charIndex);
                charIndex++;
                const typingSpeed = Math.floor(Math.random() * (120 - 50 + 1)) + 50;
                setTimeout(typeWriter, typingSpeed);
            }
        }

        setTimeout(typeWriter, 800);
    }

    // 5. Contact Form Validation
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            let isValid = true;
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            // Reset errors
            document.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));
            
            // Validate Name
            if (nameInput.value.trim() === '') {
                showError(nameInput, 'Name is required');
                isValid = false;
            }
            
            // Validate Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value.trim() === '') {
                showError(emailInput, 'Email is required');
                isValid = false;
            } else if (!emailRegex.test(emailInput.value.trim())) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate Message
            if (messageInput.value.trim() === '') {
                showError(messageInput, 'Message is required');
                isValid = false;
            } else if (messageInput.value.trim().length < 10) {
                showError(messageInput, 'Message must be at least 10 characters');
                isValid = false;
            }
            
            if (isValid) {
                const submitBtn = contactForm.querySelector('.submit-btn');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Formspree Integration using Fetch API
                fetch(contactForm.action, {
                    method: contactForm.method,
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                }).then(response => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    
                    if (response.ok) {
                        contactForm.reset();
                        const successMsg = document.getElementById('form-success');
                        successMsg.style.display = 'block';
                        
                        setTimeout(() => {
                            successMsg.style.display = 'none';
                        }, 5000);
                    } else {
                        alert("Oops! There was a problem submitting your form. Please check your Formspree ID.");
                    }
                }).catch(error => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    alert("Oops! There was a network problem submitting your form.");
                });
            }
        });
        
        function showError(input, message) {
            const formGroup = input.parentElement;
            formGroup.classList.add('error');
            const errorElement = formGroup.querySelector('.error-msg');
            if (errorElement) {
                errorElement.textContent = message;
            }
        }
    }
});
