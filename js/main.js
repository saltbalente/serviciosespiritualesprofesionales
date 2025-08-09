/**
 * Servicios Espirituales Profesionales - Main JavaScript
 * Funcionalidades: Navegación responsive, lazy loading, formularios, animaciones
 */

(function() {
    'use strict';

    // ==========================================================================
    // Utility Functions
    // ==========================================================================

    /**
     * Debounce function to limit function calls
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function to limit function calls
     */
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Check if element is in viewport
     */
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Smooth scroll to element
     */
    function smoothScrollTo(element) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const elementPosition = element.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }

    // ==========================================================================
    // Navigation Module
    // ==========================================================================

    const Navigation = {
        init() {
            this.setupMobileMenu();
            this.setupSmoothScrolling();
            this.setupActiveNavigation();
            this.setupHeaderScroll();
        },

        setupMobileMenu() {
            const toggle = document.querySelector('.navbar-toggle');
            const menu = document.querySelector('.navbar-menu');
            const menuLinks = document.querySelectorAll('.navbar-menu a');

            if (!toggle || !menu) return;

            // Toggle mobile menu
            toggle.addEventListener('click', () => {
                menu.classList.toggle('active');
                toggle.classList.toggle('active');
                
                // Animate hamburger lines
                const lines = toggle.querySelectorAll('.hamburger-line');
                if (toggle.classList.contains('active')) {
                    lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    lines[1].style.opacity = '0';
                    lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    lines[0].style.transform = 'none';
                    lines[1].style.opacity = '1';
                    lines[2].style.transform = 'none';
                }
            });

            // Close menu when clicking on links
            menuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    menu.classList.remove('active');
                    toggle.classList.remove('active');
                    
                    const lines = toggle.querySelectorAll('.hamburger-line');
                    lines[0].style.transform = 'none';
                    lines[1].style.opacity = '1';
                    lines[2].style.transform = 'none';
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                    menu.classList.remove('active');
                    toggle.classList.remove('active');
                    
                    const lines = toggle.querySelectorAll('.hamburger-line');
                    lines[0].style.transform = 'none';
                    lines[1].style.opacity = '1';
                    lines[2].style.transform = 'none';
                }
            });
        },

        setupSmoothScrolling() {
            const links = document.querySelectorAll('a[href^="#"]');
            
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (href === '#') return;
                    
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        smoothScrollTo(target);
                    }
                });
            });
        },

        setupActiveNavigation() {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.navbar-menu a[href^="#"]');
            
            if (sections.length === 0 || navLinks.length === 0) return;

            const updateActiveNav = throttle(() => {
                let current = '';
                const scrollPosition = window.scrollY + 100;

                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${current}`) {
                        link.classList.add('active');
                    }
                });
            }, 100);

            window.addEventListener('scroll', updateActiveNav);
        },

        setupHeaderScroll() {
            const header = document.querySelector('.header');
            if (!header) return;

            const handleScroll = throttle(() => {
                if (window.scrollY > 100) {
                    header.style.background = 'rgba(44, 24, 16, 0.98)';
                    header.style.boxShadow = '0 2px 20px rgba(44, 24, 16, 0.3)';
                } else {
                    header.style.background = 'rgba(44, 24, 16, 0.95)';
                    header.style.boxShadow = 'none';
                }
            }, 100);

            window.addEventListener('scroll', handleScroll);
        }
    };

    // ==========================================================================
    // Video Management Module
    // ==========================================================================

    const VideoManager = {
        init() {
            this.setupVideoObserver();
            this.setupVideoControls();
        },

        setupVideoObserver() {
            const videos = document.querySelectorAll('video');
            
            if ('IntersectionObserver' in window && videos.length > 0) {
                const videoObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        const video = entry.target;
                        
                        if (entry.isIntersecting) {
                            // Video is visible, play it
                            if (video.paused) {
                                video.play().catch(error => {
                                    console.log('Error playing video:', error);
                                });
                            }
                        } else {
                            // Video is not visible, pause it
                            if (!video.paused) {
                                video.pause();
                            }
                        }
                    });
                }, {
                    rootMargin: '0px 0px -50px 0px',
                    threshold: 0.5
                });

                videos.forEach(video => {
                    // Set initial video properties
                    video.muted = true; // Required for autoplay in most browsers
                    video.playsInline = true; // Better mobile support
                    
                    // Observe the video
                    videoObserver.observe(video);
                });
            }
        },

        setupVideoControls() {
            const videos = document.querySelectorAll('video');
            
            videos.forEach(video => {
                // Add loading state
                video.addEventListener('loadstart', () => {
                    video.style.opacity = '0.7';
                });
                
                video.addEventListener('canplay', () => {
                    video.style.opacity = '1';
                });
                
                // Handle video errors
                video.addEventListener('error', (e) => {
                    console.error('Video error:', e);
                    // Hide video if it fails to load
                    video.style.display = 'none';
                });
                
                // Pause other videos when one starts playing
                video.addEventListener('play', () => {
                    const otherVideos = document.querySelectorAll('video');
                    otherVideos.forEach(otherVideo => {
                        if (otherVideo !== video && !otherVideo.paused) {
                            otherVideo.pause();
                        }
                    });
                });
            });
        }
    };

    // ==========================================================================
    // Lazy Loading Module
    // ==========================================================================

    const LazyLoading = {
        init() {
            this.setupImageLazyLoading();
            this.setupContentLazyLoading();
        },

        setupImageLazyLoading() {
            const images = document.querySelectorAll('img[data-src]');
            
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            img.classList.add('loaded');
                            observer.unobserve(img);
                        }
                    });
                }, {
                    rootMargin: '50px 0px',
                    threshold: 0.01
                });

                images.forEach(img => {
                    img.classList.add('lazy');
                    imageObserver.observe(img);
                });
            } else {
                // Fallback for older browsers
                images.forEach(img => {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                });
            }
        },

        setupContentLazyLoading() {
            const elements = document.querySelectorAll('.lazy-content');
            
            if ('IntersectionObserver' in window) {
                const contentObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('animate-in');
                        }
                    });
                }, {
                    rootMargin: '20px 0px',
                    threshold: 0.1
                });

                elements.forEach(el => contentObserver.observe(el));
            }
        }
    };

    // ==========================================================================
    // Form Handling Module
    // ==========================================================================

    const FormHandler = {
        init() {
            this.setupContactForm();
            this.setupFormValidation();
        },

        setupContactForm() {
            const form = document.querySelector('.contact-form');
            if (!form) return;

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const submitBtn = form.querySelector('button[type="submit"]');
                
                // Get form data
                const formData = {
                    name: form.querySelector('#name').value.trim(),
                    email: form.querySelector('#email').value.trim(),
                    phone: form.querySelector('#phone').value.trim(),
                    service: form.querySelector('#service').value,
                    message: form.querySelector('#message').value.trim()
                };
                
                // Validate required fields
                if (!this.validateForm(formData)) {
                    return;
                }
                
                const originalText = submitBtn.textContent;
                
                // Show loading state
                submitBtn.textContent = 'Enviando...';
                submitBtn.disabled = true;
                
                try {
                    // Format message for WhatsApp
                    const whatsappMessage = this.formatWhatsAppMessage(formData);
                    
                    // WhatsApp number (replace with actual number)
                    const whatsappNumber = '14133912149';
                    
                    // Create WhatsApp URL
                    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
                    
                    // Show success message
                    this.showMessage('Redirigiendo a WhatsApp...', 'success');
                    
                    // Clear form
                    form.reset();
                    
                    // Redirect to WhatsApp after a short delay
                    setTimeout(() => {
                        window.open(whatsappUrl, '_blank');
                    }, 1000);
                    
                } catch (error) {
                    // Show error message
                    this.showMessage('Error al procesar el formulario. Por favor, intenta nuevamente.', 'error');
                } finally {
                    // Reset button
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 1500);
                }
            });
        },

        setupFormValidation() {
            const inputs = document.querySelectorAll('input[required], textarea[required], select[required]');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        },

        validateField(field) {
            const value = field.value.trim();
            let isValid = true;
            let message = '';

            // Remove existing error
            this.clearFieldError(field);

            // Required validation
            if (field.hasAttribute('required') && !value) {
                isValid = false;
                message = 'Este campo es obligatorio';
            }

            // Email validation
            if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    message = 'Por favor, ingresa un email válido';
                }
            }

            // Phone validation
            if (field.type === 'tel' && value) {
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                    isValid = false;
                    message = 'Por favor, ingresa un teléfono válido';
                }
            }

            if (!isValid) {
                this.showFieldError(field, message);
            }

            return isValid;
        },

        showFieldError(field, message) {
            field.classList.add('error');
            
            let errorElement = field.parentNode.querySelector('.field-error');
            if (!errorElement) {
                errorElement = document.createElement('span');
                errorElement.className = 'field-error';
                errorElement.style.color = '#e74c3c';
                errorElement.style.fontSize = '0.875rem';
                errorElement.style.marginTop = '0.25rem';
                errorElement.style.display = 'block';
                field.parentNode.appendChild(errorElement);
            }
            
            errorElement.textContent = message;
        },

        clearFieldError(field) {
            field.classList.remove('error');
            const errorElement = field.parentNode.querySelector('.field-error');
            if (errorElement) {
                errorElement.remove();
            }
        },

        validateForm(data) {
            const errors = [];
            
            if (!data.name) {
                errors.push('El nombre es requerido');
            }
            
            if (!data.email) {
                errors.push('El correo electrónico es requerido');
            } else if (!this.isValidEmail(data.email)) {
                errors.push('El correo electrónico no es válido');
            }
            
            if (!data.service) {
                errors.push('Debes seleccionar un servicio');
            }
            
            if (!data.message) {
                errors.push('El mensaje es requerido');
            }
            
            if (errors.length > 0) {
                this.showMessage(errors.join('. '), 'error');
                return false;
            }
            
            return true;
        },

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        formatWhatsAppMessage(data) {
            const serviceNames = {
                'amarres': 'Amarres de Amor',
                'proteccion': 'Rituales de Protección',
                'consultas': 'Consultas Espirituales',
                'otro': 'Otro servicio'
            };
            
            let message = `🔮 *Nueva Consulta Espiritual*\n\n`;
            message += `👤 *Nombre:* ${data.name}\n`;
            message += `📧 *Email:* ${data.email}\n`;
            
            if (data.phone) {
                message += `📱 *Teléfono:* ${data.phone}\n`;
            }
            
            message += `🌟 *Servicio de interés:* ${serviceNames[data.service] || data.service}\n\n`;
            message += `💬 *Mensaje:*\n${data.message}\n\n`;
            message += `_Enviado desde el sitio web - Consulta gratuita_`;
            
            return message;
        },

        showMessage(message, type) {
            // Create and show notification
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            
            // Add styles if not already present
            if (!document.querySelector('#notification-styles')) {
                const styles = document.createElement('style');
                styles.id = 'notification-styles';
                styles.textContent = `
                    .notification {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        padding: 15px 20px;
                        border-radius: 8px;
                        color: white;
                        font-weight: 500;
                        z-index: 10000;
                        max-width: 300px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                        animation: slideIn 0.3s ease-out;
                    }
                    .notification-success {
                        background-color: #10b981;
                    }
                    .notification-error {
                        background-color: #ef4444;
                    }
                    @keyframes slideIn {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                `;
                document.head.appendChild(styles);
            }
            
            document.body.appendChild(notification);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                notification.style.animation = 'slideIn 0.3s ease-out reverse';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 5000);
        }
    };

    // ==========================================================================
    // Animation Module
    // ==========================================================================

    const Animations = {
        init() {
            this.setupScrollAnimations();
            this.setupHoverEffects();
        },

        setupScrollAnimations() {
            const animatedElements = document.querySelectorAll('.service-card, .testimonial-card, .about-content');
            
            if ('IntersectionObserver' in window) {
                const animationObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }
                    });
                }, {
                    rootMargin: '20px 0px',
                    threshold: 0.1
                });

                animatedElements.forEach(el => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(30px)';
                    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    animationObserver.observe(el);
                });
            }
        },

        setupHoverEffects() {
            // Add subtle hover effects to interactive elements
            const interactiveElements = document.querySelectorAll('.service-card, .testimonial-card, .btn');
            
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    el.style.transition = 'all 0.3s ease';
                });
            });
        }
    };

    // ==========================================================================
    // WhatsApp Integration
    // ==========================================================================

    const WhatsApp = {
        init() {
            this.setupWhatsAppButton();
        },

        setupWhatsAppButton() {
            const whatsappButtons = document.querySelectorAll('.whatsapp-btn, .whatsapp-float');
            
            whatsappButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    const phone = btn.dataset.phone || '+1234567890';
                    const message = btn.dataset.message || 'Hola, me interesa conocer más sobre sus servicios espirituales.';
                    
                    const whatsappUrl = `https://wa.me/${phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
                    
                    window.open(whatsappUrl, '_blank');
                });
            });
        }
    };

    // ==========================================================================
    // Performance Optimization
    // ==========================================================================

    const Performance = {
        init() {
            this.preloadCriticalResources();
            this.setupServiceWorker();
        },

        preloadCriticalResources() {
            // Preload critical fonts
            const fontLinks = [
                'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap',
                'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap'
            ];

            fontLinks.forEach(href => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'style';
                link.href = href;
                document.head.appendChild(link);
            });
        },

        setupServiceWorker() {
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js')
                        .then(registration => {
                            console.log('SW registered: ', registration);
                        })
                        .catch(registrationError => {
                            console.log('SW registration failed: ', registrationError);
                        });
                });
            }
        }
    };

    // ==========================================================================
    // Main Application
    // ==========================================================================

    const App = {
        init() {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.start());
            } else {
                this.start();
            }
        },

        start() {
            try {
                // Initialize all modules
                Navigation.init();
                VideoManager.init();
                LazyLoading.init();
                FormHandler.init();
                Animations.init();
                WhatsApp.init();
                Performance.init();
                
                console.log('✅ Aplicación inicializada correctamente');
            } catch (error) {
                console.error('❌ Error al inicializar la aplicación:', error);
            }
        }
    };

    // ==========================================================================
    // Initialize Application
    // ==========================================================================

    App.init();

    // Export for potential external use
    window.SitioEspiritual = {
        Navigation,
        VideoManager,
        LazyLoading,
        FormHandler,
        Animations,
        WhatsApp,
        Performance
    };

})();

// ==========================================================================
// Additional Utilities
// ==========================================================================

/**
 * Google Analytics Integration (if needed)
 */
function initGoogleAnalytics(trackingId) {
    if (!trackingId) return;
    
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', trackingId);
    
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script);
}

/**
 * Cookie Consent (if needed)
 */
function initCookieConsent() {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
        // Show cookie consent banner
        console.log('Cookie consent needed');
    }
}

/**
 * Schema.org structured data helper
 */
function addStructuredData(data) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
}
