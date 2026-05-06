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
for(let i=0; i<60; i++) {
    particles.push({
        x: Math.random() * width, y: Math.random() * height,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.6, dy: (Math.random() - 0.5) * 0.6,
        opacity: Math.random() * 0.5 + 0.2
    });
}

function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    
    for(let i=0; i<particles.length; i++) {
        let p = particles[i];
        p.x += p.dx; p.y += p.dy;
        
        // Bounce smoothly off screen edges to maintain organic flow
        if(p.x < 0 || p.x > width) p.dx *= -1;
        if(p.y < 0 || p.y > height) p.dy *= -1;
        
        // Draw the glowing cyan nodes
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${p.opacity})`;
        ctx.fill();

        // Neural network connections (draw lines if nodes are close)
        for(let j=i+1; j<particles.length; j++) {
            let p2 = particles[j];
            let dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            
            if(dist < 120) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                // Line opacity fades based on distance
                ctx.strokeStyle = `rgba(0, 229, 255, ${0.15 - dist/800})`; 
                ctx.lineWidth = 0.5;
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
let globalEvacuationState = false;

function showView(viewId) {
    const views = document.querySelectorAll('.view');
    views.forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');

    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.style.display = (viewId === 'view-selector' || viewId === 'view-fan-login' || viewId === 'view-mgmt-login') ? 'none' : 'block';

    if(viewId === 'view-fan-dash') applyEvacuationStateToFan();
    if(viewId === 'view-mgmt-dash') { startGraph(); startAILogs(); }
    else { stopGraph(); stopAILogs(); }
}

function loginFan() {
    const name = document.getElementById('fanName').value;
    const ticket = document.getElementById('fanTicket').value;
    if(!name || !ticket) { alert("Authentication Failed: Please provide valid credentials."); return; }
    document.getElementById('displayFanName').innerText = name;
    document.getElementById('displayFanTicket').innerText = ticket;
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

// --- 4. EVACUATION LOGIC ---
function triggerEvacuation() {
    if(confirm("CRITICAL WARNING: Initiate stadium-wide evacuation protocol?")) {
        globalEvacuationState = true;
        const banner = document.getElementById('evac-banner');
        banner.style.display = 'block'; banner.classList.add('glitch-text');
        addAILog("SYSTEM OVERRIDE: Evacuation Triggered by Command.", "danger");
        alert("Protocol Initiated. All Smart Passes synced to Evacuation Mode.");
    }
}

function applyEvacuationStateToFan() {
    if(globalEvacuationState) {
        document.getElementById('normal-fan-view').style.display = 'none';
        document.getElementById('evac-fan-view').style.display = 'block';
        document.getElementById('evac-banner').style.display = 'block';
    } else {
        document.getElementById('normal-fan-view').style.display = 'grid';
        document.getElementById('evac-fan-view').style.display = 'none';
        document.getElementById('evac-banner').style.display = 'none';
    }
}

// --- 5. LIVE AI LOG GENERATOR ---
let aiLogInterval;
const logPhrases = [
    "Recalibrating spatial grid mapping...", "Thermal sensors indicate optimal temps in Sector B.",
    "Gate 4 throughput steady at 12 fans/min.", "Anomaly detected in VIP lounge. Re-routing staff.",
    "Drone swarm 2 returning for battery cycle.", "Predictive model shows 4% traffic increase next over.",
    "Network handshake secure with Local Transit API."
];

function addAILog(message, type = "normal") {
    const logBox = document.getElementById('aiLogBox');
    if(!logBox) return;
    const timeString = new Date().toLocaleTimeString().split(' ')[0];
    let colorClass = type === "warning" ? "warning" : (type === "danger" ? "danger" : "");
    logBox.innerHTML += `<div class="ai-msg ${colorClass}"><span class="time">[${timeString}]</span> ${message}</div>`;
    if (logBox.children.length > 50) logBox.removeChild(logBox.firstChild);
    logBox.scrollTo({ top: logBox.scrollHeight, behavior: 'smooth' });
}

function startAILogs() {
    const logBox = document.getElementById('aiLogBox');
    if(logBox) logBox.innerHTML = '';
    addAILog("System boot sequence initialized."); addAILog("Real-time spatial tracking online.");
    aiLogInterval = setInterval(() => {
        if(globalEvacuationState) return;
        const phrase = logPhrases[Math.floor(Math.random() * logPhrases.length)];
        addAILog(phrase, Math.random() > 0.9 ? "warning" : "normal");
    }, 4000 + Math.random() * 4000);
}
function stopAILogs() { if(aiLogInterval) clearInterval(aiLogInterval); }

// --- 6. SMOOTH LIVE GRAPH ---
let graphInterval;
function startGraph() {
    const gCanvas = document.getElementById('ingress-graph');
    if(!gCanvas) return;
    const gCtx = gCanvas.getContext('2d');
    let data = Array.from({length: 40}, () => 40);
    let currentTarget = 40;

    graphInterval = setInterval(() => {
        if(Math.random() > 0.8) currentTarget = Math.random() * 50 + 10; 
        let nextVal = data[data.length - 1] + (currentTarget - data[data.length - 1]) * 0.2;
        data.shift(); data.push(nextVal); 

        gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
        gCtx.beginPath(); gCtx.strokeStyle = '#00E5FF'; gCtx.lineWidth = 2; gCtx.lineJoin = 'round';
        const widthStep = gCanvas.width / (data.length - 1);
        
        for(let i = 0; i < data.length; i++) {
            const x = i * widthStep; const y = gCanvas.height - data[i]; 
            if(i === 0) gCtx.moveTo(x, y); else gCtx.lineTo(x, y);
        }
        gCtx.stroke(); gCtx.lineTo(gCanvas.width, gCanvas.height); gCtx.lineTo(0, gCanvas.height); gCtx.closePath();
        const gradient = gCtx.createLinearGradient(0, 0, 0, gCanvas.height);
        gradient.addColorStop(0, 'rgba(0, 229, 255, 0.3)'); gradient.addColorStop(1, 'rgba(0, 229, 255, 0.0)');
        gCtx.fillStyle = gradient; gCtx.fill();
    }, 500); 
}
function stopGraph() { if(graphInterval) clearInterval(graphInterval); }
