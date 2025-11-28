// Architecture Co - Main JavaScript File

$(document).ready(function() {
    
    // ===== Active Page Highlighting =====
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        // Handle both with and without .html extension
        const currentPageBase = currentPage.replace('.html', '') || 'index';
        
        $('.navbar-nav .nav-link').each(function() {
            const href = $(this).attr('href');
            const hrefBase = href.replace('.html', '') || 'index';
            
            // Check if current page matches the nav link
            if (href === currentPage || 
                hrefBase === currentPageBase || 
                (currentPage === '' && (href === 'index.html' || hrefBase === 'index'))) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });
    }
    
    // Set active nav link initially
    setActiveNavLink();
    
    // Re-run after header loads (for dynamically loaded headers)
    setTimeout(setActiveNavLink, 100);
    
    // Also trigger after header placeholder loads
    $(document).on('DOMNodeInserted', function(e) {
        if ($(e.target).find('.navbar-nav').length || $(e.target).hasClass('navbar-nav')) {
            setActiveNavLink();
        }
    });

    // ===== Mobile Menu Toggle =====
    $('.navbar-toggler').on('click', function() {
        $(this).toggleClass('active');
    });

    // ===== Smooth Scroll for Anchor Links =====
    $('a[href^="#"]').on('click', function(e) {
        const target = $(this.getAttribute('href'));
        if (target.length) {
            e.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 1000);
        }
    });

    // ===== Contact Form AJAX Submission =====
    $('#contactForm, #careerForm, #loginForm, #registerForm').on('submit', function(e) {
        e.preventDefault();
        
        const form = $(this);
        const submitBtn = form.find('button[type="submit"]');
        const originalText = submitBtn.html();
        const formData = form.serialize();
        const formMessages = form.find('.form-message');
        
        // Show loading state
        submitBtn.prop('disabled', true).html('<span class="loading"></span> Sending...');
        formMessages.removeClass('success error').hide();

        // AJAX submission
        $.ajax({
            url: form.attr('action') || '#',
            type: 'POST',
            data: formData,
            success: function(response) {
                formMessages.removeClass('error').addClass('success').html('Thank you! Your message has been sent successfully.').fadeIn();
                form[0].reset();
                submitBtn.prop('disabled', false).html(originalText);
            },
            error: function(xhr, status, error) {
                formMessages.removeClass('success').addClass('error').html('Sorry, there was an error sending your message. Please try again later.').fadeIn();
                submitBtn.prop('disabled', false).html(originalText);
            }
        });
    });

    // ===== Form Validation =====
    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.find('[required]');
        
        requiredFields.each(function() {
            const field = $(this);
            const value = field.val().trim();
            
            // Remove previous error styling
            field.removeClass('error');
            field.next('.error-message').remove();
            
            // Check if field is empty
            if (!value) {
                isValid = false;
                field.addClass('error');
                field.after('<span class="error-message" style="color: #dc3545; font-size: 0.875rem; display: block; margin-top: 0.25rem;">This field is required.</span>');
            }
            
            // Email validation
            if (field.attr('type') === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    field.addClass('error');
                    field.next('.error-message').remove();
                    field.after('<span class="error-message" style="color: #dc3545; font-size: 0.875rem; display: block; margin-top: 0.25rem;">Please enter a valid email address.</span>');
                }
            }
            
            // Phone validation
            if (field.attr('type') === 'tel' && value) {
                const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
                if (!phoneRegex.test(value)) {
                    isValid = false;
                    field.addClass('error');
                    field.next('.error-message').remove();
                    field.after('<span class="error-message" style="color: #dc3545; font-size: 0.875rem; display: block; margin-top: 0.25rem;">Please enter a valid phone number.</span>');
                }
            }
        });
        
        return isValid;
    }

    // Real-time form validation
    $('input[required], textarea[required]').on('blur', function() {
        const field = $(this);
        const value = field.val().trim();
        
        field.removeClass('error');
        field.next('.error-message').remove();
        
        if (!value) {
            field.addClass('error');
            field.after('<span class="error-message" style="color: #dc3545; font-size: 0.875rem; display: block; margin-top: 0.25rem;">This field is required.</span>');
        }
    });

    // ===== Lazy Loading Images =====
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ===== Animate on Scroll =====
    function animateOnScroll() {
        const elements = document.querySelectorAll('.card, .cta-card, .testimonial-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });

        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    animateOnScroll();

    // ===== Back to Top Button =====
    const backToTopBtn = $('<button class="back-to-top" style="position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; background-color: #c9a961; color: white; border: none; border-radius: 50%; cursor: pointer; display: none; z-index: 999; font-size: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.2); transition: all 0.3s ease;"><i class="fas fa-arrow-up"></i></button>');
    $('body').append(backToTopBtn);

    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 300) {
            backToTopBtn.fadeIn();
        } else {
            backToTopBtn.fadeOut();
        }
    });

    backToTopBtn.on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 800);
    });

    // ===== Initialize Tooltips (if using Bootstrap) =====
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // ===== External Links - Open in New Tab =====
    $('a[href^="http"]').attr('target', '_blank').attr('rel', 'noopener noreferrer');

    // ===== Make Phone Numbers Clickable =====
    $('.phone-number').each(function() {
        const phone = $(this).text().trim();
        $(this).html('<a href="tel:' + phone.replace(/[\s\(\)\-]/g, '') + '">' + phone + '</a>');
    });

    // ===== Make Email Addresses Clickable =====
    $('.email-address').each(function() {
        const email = $(this).text().trim();
        $(this).html('<a href="mailto:' + email + '">' + email + '</a>');
    });

    // ===== Prevent Empty Form Submissions =====
    $('form').on('submit', function(e) {
        // Skip validation for forms that already have AJAX handling
        if ($(this).attr('id') === 'contactForm' || 
            $(this).attr('id') === 'careerForm' || 
            $(this).attr('id') === 'loginForm' || 
            $(this).attr('id') === 'registerForm') {
            return true; // Let AJAX handler manage validation
        }
        if (!validateForm($(this))) {
            e.preventDefault();
            return false;
        }
    });

    // ===== Password Confirmation Validation (Register Form) =====
    $('#registerConfirmPassword').on('blur', function() {
        const password = $('#registerPassword').val();
        const confirmPassword = $(this).val();
        
        $(this).removeClass('error');
        $(this).next('.error-message').remove();
        
        if (confirmPassword && password !== confirmPassword) {
            $(this).addClass('error');
            $(this).after('<span class="error-message" style="color: #dc3545; font-size: 0.875rem; display: block; margin-top: 0.25rem;">Passwords do not match.</span>');
        }
    });

    // ===== Card Equal Heights =====
    function equalizeCardHeights() {
        $('.card-group, .row').each(function() {
            const cards = $(this).find('.card, .cta-card, .testimonial-card');
            let maxHeight = 0;
            
            cards.css('height', 'auto');
            
            cards.each(function() {
                const height = $(this).outerHeight();
                if (height > maxHeight) {
                    maxHeight = height;
                }
            });
            
            cards.css('height', maxHeight + 'px');
        });
    }

    // Equalize on load and resize
    equalizeCardHeights();
    $(window).on('resize', function() {
        setTimeout(equalizeCardHeights, 100);
    });

    // ===== Dark Mode Toggle =====
    function initTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        updateThemeIcon(theme);
    }
    
    function updateThemeIcon(theme) {
        const themeIcon = $('#themeIcon');
        const themeText = $('#themeText');
        
        if (theme === 'dark') {
            themeIcon.removeClass('fa-moon').addClass('fa-sun');
            themeText.text('Light Mode');
        } else {
            themeIcon.removeClass('fa-sun').addClass('fa-moon');
            themeText.text('Dark Mode');
        }
    }
    
    // Initialize theme on page load
    initTheme();
    
    // Theme toggle button click
    $('#themeToggle').on('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    // ===== Console Welcome Message =====
    console.log('%c Architecture Co Website ', 'background: #c9a961; color: white; padding: 10px; font-size: 16px; font-weight: bold;');
    console.log('Website loaded successfully!');

});

