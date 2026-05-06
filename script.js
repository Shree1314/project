// --- 1. INTERACTIVE MOUSE GLOW ---
const mouseGlow = document.getElementById('mouse-glow');
document.addEventListener('mousemove', (e) => {
    mouseGlow.style.left = e.clientX + 'px';
    mouseGlow.style.top = e.clientY + 'px';
});

// --- 2. ORGANIC NEURAL NETWORK PATTERN ---
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const particles = [];
// Generate cybernetic nodes
for(let i=0; i<75; i++) {
    particles.push({
        x: Math.random() * width, 
        y: Math.random() * height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.7, 
        dy: (Math.random() - 0.5) * 0.7,
        opacity: Math.random() * 0.6 + 0.2
    });
}

function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    
    for(let i=0; i<particles.length; i++) {
        let p = particles[i];
        
        // Move nodes
        p.x += p.dx; 
        p.y += p.dy;
        
        // Soft bounce on edges
        if(p.x < 0 || p.x > width) p.dx *= -1;
        if(p.y < 0 || p.y > height) p.dy *= -1;
        
        // Draw the glowing cyan nodes
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${p.opacity})`;
        ctx.fill();

        // Draw intricate data connections (Neural Network web)
        for(let j=i+1; j<particles.length; j++) {
            let p2 = particles[j];
            let dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            
            // Connect if nodes are close enough
            if(dist < 140) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                // Line gets brighter as nodes get closer
                ctx.strokeStyle = `rgba(0, 229, 255, ${0.15 - dist/1000})`; 
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

// --- 3. SYSTEM LOGIC & ROUTING ---
function showView(viewId) {
    const views = document.querySelectorAll('.view');
    views.forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');

    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.style.display = (viewId === 'view-selector' || viewId === 'view-fan-login' || viewId === 'view-mgmt-login') ? 'none' : 'block';
}

function loginFan() {
    const name = document.getElementById('fanName').value;
    const ticket = document.getElementById('fanTicket').value;
    if(!name || !ticket) { alert("Authentication Failed: Please provide valid credentials."); return; }
    document.getElementById('displayFanName').innerText = name;
    showView('view-fan-dash');
}

function loginMgmt() {
    const pin = document.getElementById('adminPin').value;
    if(pin === "1234") showView('view-mgmt-dash');
    else alert("Authentication Failed: Invalid Admin PIN.");
}

function logout() {
    document.getElementById('fanName').value = '';
    document.getElementById('fanTicket').value = '';
    document.getElementById('adminPin').value = '';
    showView('view-selector');
}
