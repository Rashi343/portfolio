// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Three.js Background Animation ---
    const canvas = document.getElementById('bg-canvas');
    if (canvas && typeof THREE !== 'undefined') {
        let scene, camera, renderer, particles, particleMaterial;
        const particleCount = 500;
        const mouse = new THREE.Vector2();

        function initThreeJS() {
            try {
            // Scene
            scene = new THREE.Scene();

            // Camera
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 30; // Adjusted for particle field depth

            // Renderer
            renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true }); // Alpha true for transparent background
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            // Particles
            const particleGeometry = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);

            const limit = particleCount * 3;
            for (let i = 0; i < limit; i++) {
                positions[i] = (Math.random() - 0.5) * 100;
            }
            particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particleGeometry.computeBoundingSphere();

            particleMaterial = new THREE.PointsMaterial({
                size: 0.15,
                color: 0x818CF8, // Light Indigo, matching theme
                transparent: true,
                opacity: 0.7,
                blending: THREE.AdditiveBlending // For a glowing effect
            });

            particles = new THREE.Points(particleGeometry, particleMaterial);
            scene.add(particles);

            // Lights (subtle, as particles are somewhat emissive with AdditiveBlending)
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
            scene.add(ambientLight);
            const pointLight = new THREE.PointLight(0xffffff, 0.2);
            pointLight.position.set(10, 10, 10);
            scene.add(pointLight);


            // Event Listeners
            window.addEventListener('resize', onWindowResize, { passive: true });
            document.addEventListener('mousemove', onMouseMove, { passive: true });

                animateThreeJS();
            } catch (err) {
                console.error('Three.js initialization failed:', err);
                throw err;
            }
        }

        let resizeTimeout;
        function onWindowResize() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            }, 100);
        }

        function onMouseMove(event) {
            const width = window.innerWidth;
            const height = window.innerHeight;
            mouse.x = (event.clientX / width) * 2 - 1;
            mouse.y = -(event.clientY / height) * 2 + 1;
        }

        let animationId;
        function animateThreeJS() {
            animationId = requestAnimationFrame(animateThreeJS);

            particles.rotation.y += 0.0005;
            particles.rotation.x += 0.0002;

            const targetX = mouse.x * 2;
            const targetY = -mouse.y * 2;
            particles.position.x += (targetX - particles.position.x) * 0.02;
            particles.position.y += (targetY - particles.position.y) * 0.02;

            renderer.render(scene, camera);
        }

        try {
            initThreeJS();
        } catch (error) {
            console.error('Failed to initialize Three.js:', error);
        }
    } else if (!canvas) {
        console.warn("Background canvas element not found. Three.js animation not initialized.");
    } else {
        console.warn("Three.js library not loaded.");
    }


    // --- Mobile Navigation ---
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-links li');

    if (burger && navLinks) {
        burger.addEventListener('click', (e) => {
            e.preventDefault();
            // Toggle Nav
            navLinks.classList.toggle('nav-active');

            // Animate Links
            navLinkItems.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });

            // Burger Animation
            burger.classList.toggle('toggle');
        });
    }

    // Close mobile nav when a link is clicked
    navLinkItems.forEach(link => {
        link.addEventListener('click', (e) => {
            if (navLinks && navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                navLinkItems.forEach(item => item.style.animation = '');
                if (burger) burger.classList.remove('toggle');
            }
        });
    });


    // --- Smooth Scrolling & Active Link Highlighting ---
    const header = document.getElementById('main-header');
    const headerHeight = header ? header.offsetHeight : 0;
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = document.querySelectorAll('.portfolio-section'); // Assuming all main content sections have this class

    navAnchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    function highlightActiveLink() {
        let currentSectionId = '';
        const scrollPos = window.pageYOffset || window.scrollY;
        const offset = headerHeight + 50;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - offset;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navAnchors.forEach(anchor => {
            anchor.classList.remove('active-link');
            if (currentSectionId && anchor.getAttribute('href') === `#${currentSectionId}`) {
                anchor.classList.add('active-link');
            }
        });
    }


    let scrollTimeout;
    function handleScroll() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (header) {
                const scrollY = window.scrollY || window.pageYOffset;
                if (scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
            highlightActiveLink();
        }, 50);
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    highlightActiveLink();


    // --- Dynamic Copyright Year ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }


    // --- Contact Form Submission (Basic Simulation) ---
    const contactForm = document.getElementById('contact-form');
    const formStatusMessage = document.getElementById('form-status');

    if (contactForm && formStatusMessage) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            
            if (!name || !email) {
                formStatusMessage.textContent = 'Please fill in all required fields.';
                formStatusMessage.className = 'form-status-message error';
                return;
            }

            formStatusMessage.textContent = 'Sending your message...';
            formStatusMessage.className = 'form-status-message';

            try {
                const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000/api/messages' : '/api/messages';
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({
                        name: formData.get('name'),
                        email: formData.get('email'),
                        subject: formData.get('subject'),
                        message: formData.get('message')
                    })
                });
                
                if (!response.ok) throw new Error('Network response was not ok');
                
                formStatusMessage.textContent = 'Thank you! Your message has been sent successfully.';
                formStatusMessage.classList.add('success');
                contactForm.reset();
            } catch (error) {
                console.error('Form submission error:', error);
                formStatusMessage.textContent = 'Oops! Something went wrong. Please try again.';
                formStatusMessage.classList.add('error');
            }
        });
    }


    // --- Scroll Animations for Sections (Intersection Observer) ---
    const animatedSections = document.querySelectorAll('.portfolio-section, .project-card, .skill-category'); // Add more selectors as needed

    const observerOptions = {
        root: null, // observes intersections relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the item is visible
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    animatedSections.forEach(section => {
        section.classList.add('fade-in'); // Add initial state for animation
        scrollObserver.observe(section);
    });

    // Load dynamic content from API
    async function loadPortfolioContent() {
        try {
            // Load projects
            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api';
            const projects = await fetch(`${apiUrl}/projects`).then(r => r.json());
            const projectsGrid = document.querySelector('.projects-grid');
            if (projectsGrid && projects.length > 0) {
                projectsGrid.innerHTML = projects.map(p => `
                    <div class="project-card">
                        <div class="project-image">
                            <img src="${p.image}" alt="${p.name}">
                        </div>
                        <div class="project-info">
                            <h3>${p.name}</h3>
                            <p>${p.description}</p>
                            <div class="project-tags">
                                ${p.tags.map(tag => `<span>${tag}</span>`).join('')}
                            </div>
                            <a href="${p.link}" target="_blank" class="project-link">View Project &rarr;</a>
                        </div>
                    </div>
                `).join('');
            }

            // Load skills
            const skills = await fetch(`${apiUrl}/skills`).then(r => r.json());
            const skillsContainer = document.querySelector('.skills-container');
            if (skillsContainer && Object.keys(skills).length > 0) {
                skillsContainer.innerHTML = Object.keys(skills).map(category => `
                    <div class="skill-category">
                        <h4>${category}</h4>
                        <ul>
                            ${skills[category].map(skill => `<li>${skill.name}</li>`).join('')}
                        </ul>
                    </div>
                `).join('');
            }

            // Load about
            const about = await fetch(`${apiUrl}/about`).then(r => r.json());
            if (about.image) {
                const aboutImage = document.querySelector('.about-image img');
                const aboutText = document.querySelectorAll('.about-text p');
                if (aboutImage) aboutImage.src = about.image;
                if (aboutText[0]) aboutText[0].textContent = about.bio1;
                if (aboutText[1]) aboutText[1].textContent = about.bio2;
            }

            // Load settings
            const settings = await fetch(`${apiUrl}/settings`).then(r => r.json());
            if (settings.favicon) {
                const favicon = document.querySelector('link[rel="icon"]');
                if (favicon) favicon.href = settings.favicon;
                
                document.title = settings.title;
                
                const footerText = document.querySelector('#main-footer p');
                if (footerText) {
                    const year = footerText.querySelector('#currentYear');
                    footerText.innerHTML = `&copy; <span id="currentYear">${year ? year.textContent : new Date().getFullYear()}</span> ${settings.footer}`;
                }
                
                const socialLinks = document.querySelectorAll('.social-links a');
                if (socialLinks[0] && settings.github) socialLinks[0].href = settings.github;
                if (socialLinks[1] && settings.linkedin) socialLinks[1].href = settings.linkedin;
                if (socialLinks[2] && settings.twitter) socialLinks[2].href = settings.twitter;
            }
        } catch (error) {
            console.error('Error loading content:', error);
        }
    }

    loadPortfolioContent();

});
