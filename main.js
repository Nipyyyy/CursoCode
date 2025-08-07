// Premium Animation System - MIT Level
class PremiumAnimationEngine {
    constructor() {
        this.observers = new Map();
        this.scrollElements = new Set();
        this.isScrolling = false;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollEffects();
        this.setupPremiumInteractions();
        this.initializeAnimations();
    }

    // Advanced Intersection Observer
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: [0, 0.1, 0.5, 1],
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Staggered animation for grid items
                    if (entry.target.parentElement?.classList.contains('features-grid') ||
                        entry.target.parentElement?.classList.contains('gallery') ||
                        entry.target.parentElement?.classList.contains('stats')) {
                        
                        const siblings = Array.from(entry.target.parentElement.children);
                        const index = siblings.indexOf(entry.target);
                        entry.target.style.animationDelay = `${index * 0.2}s`;
                    }
                }
            });
        }, observerOptions);

        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        this.observers.set('intersection', observer);
    }

    // Premium Scroll Effects
    setupScrollEffects() {
        let ticking = false;

        const updateScrollEffects = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            const header = document.getElementById('header');

            // Header backdrop blur effect
            if (scrolled > 50) {
                header?.classList.add('scrolled');
            } else {
                header?.classList.remove('scrolled');
            }

            // Parallax background
            const bgGrid = document.querySelector('.bg-grid');
            if (bgGrid) {
                bgGrid.style.transform = `translateY(${rate * 0.1}px) translateX(${rate * 0.05}px)`;
            }

            // Particles movement
            const particles = document.querySelector('.particles');
            if (particles) {
                particles.style.transform = `translateY(${rate * 0.2}px)`;
            }

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        }, { passive: true });
    }

    // Premium Interactive Elements
    setupPremiumInteractions() {
        // Enhanced button interactions
        document.querySelectorAll('.cta-button, .feature-card, .gallery-item, .stat-item').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.createRippleEffect(e);
            });

            element.addEventListener('mouseleave', (e) => {
                this.removeRippleEffect(e.target);
            });
        });

        // Advanced click effects for CTA buttons
        document.querySelectorAll('.cta-button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.createClickWave(e);
            });
        });

        // Smooth navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href?.startsWith('#')) {
                    e.preventDefault();
                    this.smoothScrollTo(href);
                }
            });
        });
    }

    // Create premium ripple effect
    createRippleEffect(e) {
        const element = e.currentTarget;
        const rect = element.getBoundingClientRect();
        const ripple = document.createElement('div');
        
        const size = Math.max(rect.width, rect.height) * 1.5;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: premiumRipple 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            z-index: 1;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 800);
    }

    // Remove ripple effect
    removeRippleEffect(element) {
        const ripples = element.querySelectorAll('div[style*="premiumRipple"]');
        ripples.forEach(ripple => {
            ripple.style.animation = 'premiumRippleFade 0.3s ease-out forwards';
            setTimeout(() => ripple.remove(), 300);
        });
    }

    // Create click wave effect
    createClickWave(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const wave = document.createElement('div');
        
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        wave.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(0, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            animation: clickWave 0.6s ease-out;
            pointer-events: none;
            z-index: 2;
        `;

        button.appendChild(wave);
        setTimeout(() => wave.remove(), 600);
    }

    // Smooth scroll with easing
    smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (!element) return;

        const targetPosition = element.offsetTop - 100;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutCubic(timeElapsed, startPosition, distance, duration);
            
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    // Cubic easing function
    easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }

    // Initialize premium animations
    initializeAnimations() {
        // Hero title typing effect
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            this.createTypingEffect(heroTitle, 100);
        }

        // Subtitle glitch effect
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            setTimeout(() => {
                this.createGlitchEffect(heroSubtitle);
            }, 2000);
        }

        // Stats counter animation
        this.setupCounterAnimations();
    }

    // Advanced typing effect
    createTypingEffect(element, speed = 100) {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '3px solid #00ffff';
        
        let i = 0;
        const typing = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            
            if (i >= text.length) {
                clearInterval(typing);
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        }, speed);
    }

    // Glitch effect for cyberpunk aesthetic
    createGlitchEffect(element) {
        const originalText = element.textContent;
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        let glitchCount = 0;
        const maxGlitches = 3;

        const glitch = () => {
            if (glitchCount >= maxGlitches) return;
            
            let glitchedText = '';
            for (let i = 0; i < originalText.length; i++) {
                if (Math.random() < 0.1) {
                    glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                } else {
                    glitchedText += originalText[i];
                }
            }
            
            element.textContent = glitchedText;
            
            setTimeout(() => {
                element.textContent = originalText;
                glitchCount++;
                if (glitchCount < maxGlitches) {
                    setTimeout(glitch, 2000 + Math.random() * 3000);
                }
            }, 100);
        };

        glitch();
    }

    // Animated counters for stats
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        
        const animateCounter = (counter) => {
            const target = counter.textContent;
            const isInfinity = target === '∞';
            const hasK = target.includes('K');
            const hasPercent = target.includes('%');
            
            if (isInfinity) return;
            
            const numericTarget = parseFloat(target.replace(/[K%+]/g, ''));
            const duration = 2000;
            const increment = numericTarget / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current >= numericTarget) {
                    current = numericTarget;
                }
                
                let displayValue = Math.floor(current);
                if (hasK) displayValue += 'K';
                if (hasPercent) displayValue += '%';
                if (target.includes('+')) displayValue += '+';
                
                counter.textContent = displayValue;
                
                if (current < numericTarget) {
                    requestAnimationFrame(updateCounter);
                }
            };
            
            updateCounter();
        };

        // Trigger counter animations when visible
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => counterObserver.observe(counter));
    }
}

// Advanced CSS Animations via JavaScript
const addPremiumStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes premiumRipple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        @keyframes premiumRippleFade {
            to {
                opacity: 0;
                transform: scale(1.5);
            }
        }
        
        @keyframes clickWave {
            to {
                width: 200px;
                height: 200px;
                opacity: 0;
            }
        }
        
        @keyframes glitchShake {
            0%, 100% { transform: translateX(0); }
            10% { transform: translateX(-2px) translateY(1px); }
            20% { transform: translateX(2px) translateY(-1px); }
            30% { transform: translateX(-1px) translateY(2px); }
            40% { transform: translateX(1px) translateY(-2px); }
            50% { transform: translateX(-2px) translateY(1px); }
            60% { transform: translateX(2px) translateY(-1px); }
            70% { transform: translateX(-1px) translateY(2px); }
            80% { transform: translateX(1px) translateY(-2px); }
            90% { transform: translateX(-2px) translateY(1px); }
        }
        
        .glitch-active {
            animation: glitchShake 0.1s ease-in-out;
        }
    `;
    document.head.appendChild(style);
};

// Performance optimization
const optimizePerformance = () => {
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Preload critical resources
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800';
    document.head.appendChild(preloadLink);
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    addPremiumStyles();
    optimizePerformance();
    
    // Initialize premium animation engine
    const animationEngine = new PremiumAnimationEngine();
    
    // Add global error handling
    window.addEventListener('error', (e) => {
        console.warn('Non-critical error handled:', e.message);
    });
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Site loaded in ${loadTime}ms`);
        });
    }
});

// Export for potential external use
window.AnchoredAnimationEngine = PremiumAnimationEngine;