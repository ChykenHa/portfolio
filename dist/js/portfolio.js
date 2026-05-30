/* portfolio.js - Premium Dark Ocean Particle Animations */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // MOBILE NAV MENU TOGGLE
    // ==========================================================================
    const mobileToggle = document.querySelector(".mobile-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");
    const mobileLinks = document.querySelectorAll(".mobile-link");

    const toggleMenu = () => {
        mobileMenu.classList.toggle("open");
        const isOpen = mobileMenu.classList.contains("open");
        mobileToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    };

    mobileToggle.addEventListener("click", toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (mobileMenu.classList.contains("open")) {
                toggleMenu();
            }
        });
    });

    document.addEventListener("click", (e) => {
        if (mobileMenu.classList.contains("open") && 
            !mobileMenu.contains(e.target) && 
            !mobileToggle.contains(e.target)) {
            toggleMenu();
        }
    });


    // ==========================================================================
    // NAVBAR SCROLL & ACTIVE LINK INDICATOR & PROGRESS
    // ==========================================================================
    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section");
    const scrollProgress = document.querySelector(".scroll-progress");

    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (windowHeight > 0) {
            const scrolledPercentage = (window.scrollY / windowHeight) * 100;
            scrollProgress.style.width = `${scrolledPercentage}%`;
        }

        let currentSectionId = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();


    // ==========================================================================
    // ORGANIC BIOLUMINESCENT PARTICLES WITH UNDERWATER WAVE SWAYS
    // ==========================================================================
    const canvas = document.getElementById("ocean-particles");
    const ctx = canvas.getContext("2d");

    let particlesArray = [];
    const particleCount = 80;
    let mouse = {
        x: null,
        y: null,
        radius: 140
    };

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", () => {
        resizeCanvas();
        initParticles();
    });
    resizeCanvas();

    window.addEventListener("mousemove", (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    window.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle Class with Swaying Sine Mechanics
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 0.5; // Plankton sizes
            this.speedX = Math.random() * 0.2 - 0.1; // Baseline drift
            this.speedY = -(Math.random() * 0.4 + 0.15); // Rising speed
            this.opacity = Math.random() * 0.5 + 0.15;
            this.pulseSpeed = Math.random() * 0.015 + 0.005;
            this.pulseDir = 1;
            
            // Sway physics variables
            this.swayAngle = Math.random() * Math.PI * 2;
            this.swaySpeed = Math.random() * 0.02 + 0.005;
            this.swayMagnitude = Math.random() * 0.6 + 0.2; // Width of sway
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 242, 254, ${this.opacity})`;
            ctx.shadowBlur = this.size * 4;
            ctx.shadowColor = "rgba(0, 242, 254, 0.75)";
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow for CPU performance
        }

        update() {
            // Apply sway oscillation to x coordinate (organic wave movement)
            this.swayAngle += this.swaySpeed;
            const sway = Math.sin(this.swayAngle) * this.swayMagnitude;

            this.x += this.speedX + sway;
            this.y += this.speedY;

            // Recycling when out of screen bounds
            if (this.y < -20) {
                this.y = canvas.height + 20;
                this.x = Math.random() * canvas.width;
                this.swayAngle = Math.random() * Math.PI * 2;
            }
            if (this.x < -20) {
                this.x = canvas.width + 20;
            } else if (this.x > canvas.width + 20) {
                this.x = -20;
            }

            // Bioluminescent pulsing glow
            this.opacity += this.pulseSpeed * this.pulseDir;
            if (this.opacity > 0.65 || this.opacity < 0.15) {
                this.pulseDir = -this.pulseDir;
            }

            // Mouse hover attraction & light link
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    // Light beam connection lines
                    let alpha = (1 - distance / mouse.radius) * 0.15;
                    ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();

                    // Gravity pull force relative to distance
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x += (dx / distance) * force * 0.7;
                    this.y += (dy / distance) * force * 0.7;
                }
            }
        }
    }

    const initParticles = () => {
        particlesArray = [];
        for (let i = 0; i < particleCount; i++) {
            particlesArray.push(new Particle());
        }
    };

    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesArray.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animateParticles);
    };

    initParticles();
    animateParticles();


    // ==========================================================================
    // REVEAL ON SCROLL & SKILLS ANIMATION (INTERSECTION OBSERVER)
    // ==========================================================================
    const revealElements = document.querySelectorAll(".scroll-reveal");

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal-visible");
                
                if (entry.target.classList.contains("skill-category-card")) {
                    const progressBars = entry.target.querySelectorAll(".skill-progress-bar");
                    progressBars.forEach(bar => {
                        const targetWidth = bar.getAttribute("data-width");
                        bar.style.width = targetWidth;
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });


    // ==========================================================================
    // PROJECT FILTERING FUNCTIONALITY
    // ==========================================================================
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const filterValue = button.getAttribute("data-filter");

            projectCards.forEach(card => {
                const category = card.getAttribute("data-category");
                
                if (filterValue === "all" || category === filterValue) {
                    card.classList.remove("hidden");
                    card.style.transform = "scale(0.95)";
                    card.style.opacity = "0.5";
                    setTimeout(() => {
                        card.style.transform = "scale(1)";
                        card.style.opacity = "1";
                        card.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease";
                    }, 50);
                } else {
                    card.classList.add("hidden");
                }
            });
        });
    });


    // ==========================================================================
    // CONTACT FORM INTERACTION & FEEDBACK (ENGLISH)
    // ==========================================================================
    const contactForm = document.getElementById("portfolio-contact-form");
    const feedbackMessage = document.querySelector(".form-feedback-message");

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector(".btn-submit");
        const btnOriginalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending... <i class="fa-solid fa-spinner animate-pulse"></i></span>';
        
        setTimeout(() => {
            feedbackMessage.innerHTML = 'Thank you! Your message has been sent successfully. I will get back to you shortly.';
            feedbackMessage.className = "form-feedback-message success";
            
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = btnOriginalText;

            setTimeout(() => {
                feedbackMessage.className = "form-feedback-message";
                feedbackMessage.innerHTML = "";
            }, 6000);
            
        }, 1500);
    });
});
