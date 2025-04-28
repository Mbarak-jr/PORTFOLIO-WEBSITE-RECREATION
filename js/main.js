// main.js - Optimized for component loading
document.addEventListener('DOMContentLoaded', function() {
    // First include all components
    includeHTML().then(() => {
        // Initialize all functionality after components load
        initTypedJS();
        initCounters();
        initBackToTop();
        initThemeToggle();
    });
});

// Improved includeHTML function with Promise
function includeHTML() {
    return new Promise((resolve) => {
        let elements = document.querySelectorAll('[w3-include-html]');
        let remaining = elements.length;
        
        if (remaining === 0) {
            resolve();
            return;
        }

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
                    // Process any scripts in the included HTML
                    const scripts = element.querySelectorAll('script');
                    scripts.forEach(script => {
                        const newScript = document.createElement('script');
                        if (script.src) {
                            newScript.src = script.src;
                        } else {
                            newScript.textContent = script.textContent;
                        }
                        document.body.appendChild(newScript).remove();
                    });
                    remaining--;
                    if (remaining === 0) resolve();
                })
                .catch(error => {
                    console.error(error);
                    element.innerHTML = 'Component loading failed';
                    remaining--;
                    if (remaining === 0) resolve();
                });
        });
    });
}

function initTypedJS() {
    if (document.querySelector('.typed-text')) {
        new Typed('.typed-text', {
            strings: ["Software Developer", "Cybersecurity Specialist", "Data Analyst", "Full Stack Engineer"],
            typeSpeed: 50,
            backSpeed: 30,
            loop: true
        });
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
        
        // Start counting when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                updateCount();
                observer.unobserve(counter);
            }
        });
        
        observer.observe(counter);
    });
}

function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    if (!backToTopButton) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
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
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            if (icon) icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            if (icon) icon.classList.replace('fa-sun', 'fa-moon');
        }
    });
}