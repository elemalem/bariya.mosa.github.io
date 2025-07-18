// Global variables
let audioContext;
let isMuted = false;
let currentTheme = 'cyberpunk';
let particles = [];
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeTypewriter();
    initializeScrollAnimations();
    initializeNavigation();
    initializeSkillBars();
    initializeThemeToggle();
    initializeAudioControls();
    initializeKonamiCode();
    initializeDownloadButton();
    initializeHoverSounds();
    initializeModal();
});

// Particle System
function initializeParticles() {
    const container = document.getElementById('particles-container');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }

    // Animate particles
    setInterval(updateParticles, 100);
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Random animation delay
    particle.style.animationDelay = Math.random() * 6 + 's';
    
    // Random color
    const colors = ['var(--neon-cyan)', 'var(--neon-pink)', 'var(--neon-purple)', 'var(--neon-green)'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.background = color;
    particle.style.boxShadow = `0 0 10px ${color}`;
    
    container.appendChild(particle);
    particles.push(particle);
}

function updateParticles() {
    particles.forEach(particle => {
        // Randomly move particles
        if (Math.random() < 0.1) {
            const currentLeft = parseFloat(particle.style.left);
            const currentTop = parseFloat(particle.style.top);
            
            particle.style.left = Math.max(0, Math.min(100, currentLeft + (Math.random() - 0.5) * 5)) + '%';
            particle.style.top = Math.max(0, Math.min(100, currentTop + (Math.random() - 0.5) * 5)) + '%';
        }
    });
}

// Typewriter Effect
function initializeTypewriter() {
    const nameElement = document.getElementById('typewriter-name');
    const titleElement = document.getElementById('typewriter-title');
    
    if (nameElement && titleElement) {
        const nameText = nameElement.textContent;
        const titleText = titleElement.textContent;
        
        nameElement.textContent = '';
        titleElement.textContent = '';
        
        typeWriter(nameElement, nameText, 100, () => {
            setTimeout(() => {
                typeWriter(titleElement, titleText, 50);
            }, 500);
        });
    }
}

function typeWriter(element, text, speed, callback) {
    let i = 0;
    element.style.opacity = '1';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    
    type();
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger skill bar animations
                if (entry.target.classList.contains('skills-section')) {
                    animateSkillBars();
                }
            }
        });
    }, observerOptions);

    // Observe all sections and timeline items
    document.querySelectorAll('.section, .timeline-item, .skill-item, .cert-item, .education-item').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero-section');

    // Smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                playClickSound();
            }
        });
    });

    // Active navigation highlighting
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => {
        navObserver.observe(section);
    });
}

// Skill Bars Animation
function initializeSkillBars() {
    // This will be triggered by scroll animation
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
            bar.style.width = width + '%';
        }, Math.random() * 500);
    });
}

// Theme Toggle
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    themeToggle.addEventListener('click', () => {
        playClickSound();
        
        if (currentTheme === 'cyberpunk') {
            currentTheme = 'light';
            body.className = 'light-theme';
            themeToggle.textContent = '☀️';
            themeToggle.setAttribute('data-theme', 'light');
        } else if (currentTheme === 'light') {
            currentTheme = 'dark';
            body.className = 'dark-theme';
            themeToggle.textContent = '🌙';
            themeToggle.setAttribute('data-theme', 'dark');
        } else {
            currentTheme = 'cyberpunk';
            body.className = '';
            themeToggle.textContent = '🔮';
            themeToggle.setAttribute('data-theme', 'cyberpunk');
        }
        
        // Add glitch effect
        body.classList.add('glitch');
        setTimeout(() => {
            body.classList.remove('glitch');
        }, 300);
    });
}

// Audio Controls
function initializeAudioControls() {
    const muteToggle = document.getElementById('mute-toggle');
    
    muteToggle.addEventListener('click', () => {
        isMuted = !isMuted;
        muteToggle.textContent = isMuted ? '🔇' : '🔊';
        
        if (!isMuted) {
            playClickSound();
        }
    });
}

// Sound Effects
function initializeHoverSounds() {
    // Add hover sound effects to interactive elements
    const interactiveElements = document.querySelectorAll('.nav-link, .contact-item, .skill-item, .timeline-content, .cert-item, .education-item, .download-btn');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            playHoverSound();
        });
        
        element.addEventListener('click', () => {
            playClickSound();
        });
    });
}

function createAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

function playHoverSound() {
    if (isMuted) return;
    
    try {
        const ctx = createAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
    } catch (e) {
        console.log('Audio not supported');
    }
}

function playClickSound() {
    if (isMuted) return;
    
    try {
        const ctx = createAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
    } catch (e) {
        console.log('Audio not supported');
    }
}

// Konami Code
function initializeKonamiCode() {
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.code);
        
        // Keep only the last 10 keys
        if (konamiCode.length > 10) {
            konamiCode.shift();
        }
        
        // Check if the sequence matches
        if (konamiCode.length === 10 && 
            konamiCode.every((key, index) => key === konamiSequence[index])) {
            activateKonamiCode();
            konamiCode = []; // Reset
        }
    });
}

function activateKonamiCode() {
    playKonamiSound();
    showEasterEggModal();
    activateCyberpunkMode();
}

function playKonamiSound() {
    if (isMuted) return;
    
    try {
        const ctx = createAudioContext();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C
        
        notes.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);
                
                oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
                
                gainNode.gain.setValueAtTime(0, ctx.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
                
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.3);
            }, index * 200);
        });
    } catch (e) {
        console.log('Audio not supported');
    }
}

function activateCyberpunkMode() {
    const body = document.body;
    body.classList.add('cyberpunk-mode');
    
    // Create matrix rain effect
    createMatrixRain();
    
    // Remove effect after 5 seconds
    setTimeout(() => {
        body.classList.remove('cyberpunk-mode');
    }, 5000);
}

function createMatrixRain() {
    const matrixContainer = document.querySelector('.matrix-rain');
    if (!matrixContainer) return;
    
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    
    for (let i = 0; i < 20; i++) {
        const column = document.createElement('div');
        column.style.position = 'absolute';
        column.style.left = Math.random() * 100 + '%';
        column.style.top = '-100px';
        column.style.color = '#00ff41';
        column.style.fontSize = '14px';
        column.style.fontFamily = 'monospace';
        column.style.animation = 'matrix-fall 3s linear infinite';
        column.style.animationDelay = Math.random() * 2 + 's';
        
        let text = '';
        for (let j = 0; j < 20; j++) {
            text += characters[Math.floor(Math.random() * characters.length)] + '<br>';
        }
        column.innerHTML = text;
        
        matrixContainer.appendChild(column);
        
        // Remove after animation
        setTimeout(() => {
            if (column.parentNode) {
                column.parentNode.removeChild(column);
            }
        }, 5000);
    }
}

// Add matrix fall animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes matrix-fall {
        to {
            transform: translateY(100vh);
        }
    }
`;
document.head.appendChild(style);

// Modal
function initializeModal() {
    const modal = document.getElementById('easter-egg-modal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function showEasterEggModal() {
    const modal = document.getElementById('easter-egg-modal');
    modal.style.display = 'block';
}

// Download PDF Button
function initializeDownloadButton() {
    const downloadBtn = document.getElementById('download-pdf');
    
    downloadBtn.addEventListener('click', () => {
        playClickSound();
        generatePDF();
    });
}

function generatePDF() {
    // Show loading state
    const downloadBtn = document.getElementById('download-pdf');
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<span class="download-icon">⏳</span> Generating...';
    downloadBtn.classList.add('loading');
    
    // Simulate PDF generation (in a real app, this would call a server endpoint)
    setTimeout(() => {
        // Create a simple text-based resume content
        const resumeContent = generateResumeText();
        downloadTextAsFile(resumeContent, 'Bariya_Mosa_Resume.txt');
        
        // Reset button
        downloadBtn.innerHTML = originalText;
        downloadBtn.classList.remove('loading');
    }, 2000);
}

function generateResumeText() {
    return `
BARIYA MOSA
Supply Chain & Customer Service Professional

Contact Information:
Phone: (+251)941406111
Email: bariyams@gmail.com
Location: Addis Ababa, Ethiopia
LinkedIn: www.linkedin.com/in/bariyamm

SUMMARY
Supply Chain and Customer service professional with more than 10 years of experience at Ethio Telecom.

SKILLS
• Peacebuilding
• Digital Media Literacy
• Digital storytelling
• Supply Chain Management
• Customer Service
• Supply and Demand Planning
• Inventory Replenishment
• Monitoring and Evaluation

PROFESSIONAL EXPERIENCE

CSCAfCFTA Ethiopia, National Coordinator
Civil Society Coalition for African Continental Free Trade Area (CSCAfCFTA)
April 2025 - Present (4 months)
Location: Ethiopia

Supply Strategy and Planning Specialist
ethio telecom
May 2019 - Present (6 years 3 months)
Location: Ethiopia
• Supply and Demand Planning
• Inventory Replenishment
• Monitoring and Evaluation: POR

Supply Chain Management: Inventory Management Administrator
ethiotelecom
March 2017 - June 2019 (2 years 4 months)
Location: Ethiopia

Customer Service: contact center Advisor
ethiotelecom
March 2014 - March 2017 (3 years 1 month)
Location: Ethiopia
• Customer Service via 994 platform

Junior Officer_Custom Crime Investigation
Ethiopian Revenues & Customs Authority
December 2012 - February 2014 (1 year 3 months)
Location: Ethiopia

Trainee
ERCA
September 2012 - December 2012 (4 months)
Location: Addis Ababa
• Trained Basic about revenues and customs, Tax policy & assessment (ERCA), Customs crime and its investigation (by Ethiopian Police College at AA Management Institute) facilitated by Ethiopian Revenues and Customs Authority (ERCA).

EDUCATION
Bachelor of Arts (BA), Economics
Jimma University
2009 - 2012

CERTIFICATIONS
• Information Security Basics
• Presentation of Financial Information
• Understanding Logistics
• Professional Ethics
• Inventory Management Foundations
`;
}

function downloadTextAsFile(text, filename) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Additional Interactive Features
function addInteractiveFeatures() {
    // Add click effects to all interactive elements
    document.addEventListener('click', (e) => {
        if (e.target.matches('.nav-link, .contact-item, .skill-item, .timeline-content, .cert-item, .education-item, .download-btn, .tag')) {
            createClickRipple(e);
        }
    });
}

function createClickRipple(e) {
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(0, 255, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.left = (e.clientX - 10) + 'px';
    ripple.style.top = (e.clientY - 10) + 'px';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '9999';
    
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        document.body.removeChild(ripple);
    }, 600);
}

// Add ripple animation to CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Initialize additional features
document.addEventListener('DOMContentLoaded', addInteractiveFeatures);

// Parallax scrolling effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-section');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
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

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Scroll-based animations can be added here
}, 16)); // ~60fps

