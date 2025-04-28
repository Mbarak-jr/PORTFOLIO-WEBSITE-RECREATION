// main.js - Enhanced version with navigation fixes
document.addEventListener('DOMContentLoaded', function() {
    // First include all components
    includeHTML().then(() => {
        // Initialize all functionality after components load
        initNavigation();
        initTypedJS();
        initCounters();
        initBackToTop();
        initThemeToggle();
        
        // Debug log to verify home page load
        if (window.location.pathname.endsWith('index.html') || 
            window.location.pathname === '/') {
            console.log('Home page loaded successfully');
        }
    }).catch(error => {
        console.error('Error initializing page:', error);
    });
});

// Improved includeHTML function with better error handling
function includeHTML() {
    return new Promise((resolve, reject) => {
        const elements = document.querySelectorAll('[w3-include-html]');
        if (elements.length === 0) {
            console.warn('No components found to include');
            return resolve();
        }

        let loadedCount = 0;
        const totalElements = elements.length;
        const errors = [];

        elements.forEach(element => {
            const file = element.getAttribute('w3-include-html');
            fetch(file)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to load ${file}: ${response.status}`);
                    }
                    return response.text();
                })
                .then(html => {
                    element.innerHTML = html;
                    processScripts(element);
                    loadedCount++;
                    
                    if (loadedCount === totalElements) {
                        if (errors.length > 0) {
                            reject(new Error(`Failed to load ${errors.length} components`));
                        } else {
                            resolve();
                        }
                    }
                })
                .catch(error => {
                    console.error(`Error loading ${file}:`, error);
                    element.innerHTML = `<div class="alert alert-danger">Failed to load component: ${file}</div>`;
                    errors.push(error);
                    loadedCount++;
                    
                    if (loadedCount === totalElements) {
                        if (errors.length > 0) {
                            reject(new Error(`Failed to load ${errors.length} components`));
                        } else {
                            resolve();
                        }
                    }
                });
        });
    });
}

function processScripts(element) {
    const scripts = element.querySelectorAll('script');
    scripts.forEach(script => {
        const newScript = document.createElement('script');
        if (script.src) {
            newScript.src = script.src;
            newScript.async = false;
        } else {
            newScript.textContent = script.textContent;
        }
        document.body.appendChild(newScript).remove();
    });
}

// NEW: Navigation initialization to ensure proper page loading
function initNavigation() {
    // Highlight current page in navbar
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });

    // Prevent default for all nav links to handle programmatically
    document.querySelectorAll('a').forEach(link => {
        if (link.getAttribute('href')?.startsWith('#')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    });
}

function initTypedJS() {
    if (document.querySelector('.typed-text')) {
        try {
            new Typed('.typed-text', {
                strings: ["Software Developer", "Cybersecurity Specialist", "Data Analyst", "Full Stack Engineer"],
                typeSpeed: 50,
                backSpeed: 30,
                loop: true
            });
        } catch (error) {
            console.error('Typed.js initialization error:', error);
        }
    }
}

function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;

    const speed = 200;
    
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / speed;
            
            if(count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target + '+';
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                updateCount();
                observer.unobserve(counter);
            }
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    if (!backToTopButton) return;

    window.addEventListener('scroll', () => {
        backToTopButton.classList.toggle('show', window.pageYOffset > 300);
    });
    
    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
}

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const icon = themeToggle.querySelector('i');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme or use preferred color scheme
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-theme');
        if (icon) icon.classList.replace('fa-moon', 'fa-sun');
    }
    
    // Toggle theme
    themeToggle.addEventListener('click', function() {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        if (icon) {
            icon.classList.toggle('fa-moon', !isDark);
            icon.classList.toggle('fa-sun', isDark);
        }
    });
}

// Error handling for failed component loads
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    if (event.filename.includes('components')) {
        const errorElement = document.createElement('div');
        errorElement.className = 'alert alert-danger m-3';
        errorElement.textContent = `Failed to load component: ${event.message}`;
        document.body.prepend(errorElement);
    }
});