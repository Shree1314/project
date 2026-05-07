const canvas = document.getElementById('sim-canvas');
const ctx = canvas.getContext('2d');

// UI Elements
const countSlider = document.getElementById('particle-count');
const speedSlider = document.getElementById('speed-mult');
const distSlider = document.getElementById('connect-dist');
const linesToggle = document.getElementById('toggle-lines');
const resetBtn = document.getElementById('btn-reset');

// Value Displays
const countVal = document.getElementById('count-val');
const speedVal = document.getElementById('speed-val');
const distVal = document.getElementById('dist-val');

// Simulation State
let particles = [];
let params = {
    count: parseInt(countSlider.value),
    speedMult: parseFloat(speedSlider.value),
    maxDist: parseInt(distSlider.value),
    showLines: linesToggle.checked
};

// Resize Canvas
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Particle Class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        // Base velocity (between -1 and 1)
        this.baseVx = (Math.random() - 0.5) * 2;
        this.baseVy = (Math.random() - 0.5) * 2;
        this.radius = Math.random() * 2 + 1;
    }

    update() {
        // Apply speed multiplier
        this.x += this.baseVx * params.speedMult;
        this.y += this.baseVy * params.speedMult;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.baseVx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.baseVy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#00E5FF';
        ctx.fill();
    }
}

// Initialize Particle Array
function initParticles() {
    particles = [];
    for (let i = 0; i < params.count; i++) {
        particles.push(new Particle());
    }
}

// Main Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw connections first (so they are under particles)
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();

        if (params.showLines) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.hypot(dx, dy);

                if (distance < params.maxDist) {
                    // Opacity gets stronger the closer they are
                    const opacity = 1 - (distance / params.maxDist);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 229, 255, ${opacity * 0.5})`; // Max opacity 0.5
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        
        // Draw particle on top
        particles[i].draw();
    }

    requestAnimationFrame(animate);
}

// Event Listeners for Controls
countSlider.addEventListener('input', (e) => {
    params.count = parseInt(e.target.value);
    countVal.innerText = params.count;
    initParticles(); // Rebuild array when count changes
});

speedSlider.addEventListener('input', (e) => {
    params.speedMult = parseFloat(e.target.value);
    speedVal.innerText = params.speedMult.toFixed(1);
});

distSlider.addEventListener('input', (e) => {
    params.maxDist = parseInt(e.target.value);
    distVal.innerText = params.maxDist;
});

linesToggle.addEventListener('change', (e) => {
    params.showLines = e.target.checked;
});

resetBtn.addEventListener('click', () => {
    // Reset UI
    countSlider.value = 100;
    speedSlider.value = 1.0;
    distSlider.value = 120;
    linesToggle.checked = true;
    
    // Update labels
    countVal.innerText = "100";
    speedVal.innerText = "1.0";
    distVal.innerText = "120";

    // Reset State
    params = { count: 100, speedMult: 1.0, maxDist: 120, showLines: true };
    initParticles();
});

// Start Simulation
initParticles();
animate();
