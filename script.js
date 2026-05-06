// --- GLOBAL SYSTEM STATE ---
let globalEvacuationState = false;

// --- ROUTING LOGIC ---
function showView(viewId) {
    const views = document.querySelectorAll('.view');
    views.forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');

    const logoutBtn = document.getElementById('logoutBtn');
    if(viewId === 'view-selector' || viewId === 'view-fan-login' || viewId === 'view-mgmt-login') {
        logoutBtn.style.display = 'none';
    } else {
        logoutBtn.style.display = 'block';
    }

    if(viewId === 'view-fan-dash') applyEvacuationStateToFan();
    
    if(viewId === 'view-mgmt-dash') {
        startGraph();
        startAILogs(); // Start generating live AI data
    } else {
        stopGraph();
        stopAILogs();
    }
}

// --- LOGIN LOGIC ---
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

// --- MANAGEMENT EVACUATION LOGIC ---
function triggerEvacuation() {
    const confirmEvac = confirm("CRITICAL WARNING: Initiate stadium-wide evacuation protocol?");
    if(confirmEvac) {
        globalEvacuationState = true;
        
        // Show Global Banner
        const banner = document.getElementById('evac-banner');
        banner.style.display = 'block';
        banner.classList.add('glitch-text'); // Add CSS glitch animation
        
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

// --- NEW: DYNAMIC AI LOG GENERATOR ---
let aiLogInterval;
const logPhrases = [
    "Recalibrating spatial grid mapping...",
    "Thermal sensors indicate optimal temperatures in Sector B.",
    "Gate 4 throughput steady at 12 fans/min.",
    "Anomaly detected in VIP lounge. Re-routing staff.",
    "Drone swarm 2 returning for battery cycle.",
    "Concession Stand 3 reports low beverage inventory.",
    "Predictive model shows 4% increase in exiting traffic next over.",
    "Network handshake secure with Local Metro Transit API."
];

function addAILog(message, type = "normal") {
    const logBox = document.getElementById('aiLogBox');
    if(!logBox) return;

    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    let colorClass = "";
    if (type === "warning") colorClass = "warning";
    if (type === "danger") colorClass = "danger";

    const logHTML = `<div class="ai-msg ${colorClass}"><span class="time">[${timeString}]</span> ${message}</div>`;
    
    logBox.innerHTML += logHTML;
    
    // Keep only the last 50 logs to prevent memory issues
    if (logBox.children.length > 50) {
        logBox.removeChild(logBox.firstChild);
    }

    // Auto-scroll to bottom smoothly
    logBox.scrollTo({ top: logBox.scrollHeight, behavior: 'smooth' });
}

function startAILogs() {
    // Clear existing static logs
    const logBox = document.getElementById('aiLogBox');
    if(logBox) logBox.innerHTML = '';
    
    addAILog("System boot sequence initialized.");
    addAILog("Real-time spatial tracking online.");

    aiLogInterval = setInterval(() => {
        if(globalEvacuationState) return; // Stop random logs during emergency
        
        // Randomly pick a phrase
        const randomPhrase = logPhrases[Math.floor(Math.random() * logPhrases.length)];
        
        // 10% chance to be a warning
        const isWarning = Math.random() > 0.9;
        addAILog(randomPhrase, isWarning ? "warning" : "normal");

    }, 4000 + Math.random() * 4000); // Random interval between 4 to 8 seconds
}

function stopAILogs() {
    if(aiLogInterval) clearInterval(aiLogInterval);
}

// --- SMOOTH LIVE GRAPH ANIMATION ---
let graphInterval;
function startGraph() {
    const canvas = document.getElementById('ingress-graph');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Start with a smooth baseline
    let data = Array.from({length: 40}, () => 40);
    let currentTarget = 40;

    graphInterval = setInterval(() => {
        // Smooth target seeking algorithm (looks much better than random jumps)
        if(Math.random() > 0.8) currentTarget = Math.random() * 50 + 10; // Change target occasionally
        
        // Smoothly move the last data point toward the target
        let lastVal = data[data.length - 1];
        let nextVal = lastVal + (currentTarget - lastVal) * 0.2;
        
        data.shift(); 
        data.push(nextVal); 

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath(); ctx.strokeStyle = '#39FF88'; ctx.lineWidth = 2; ctx.lineJoin = 'round';
        
        const widthStep = canvas.width / (data.length - 1);
        
        for(let i = 0; i < data.length; i++) {
            const x = i * widthStep; const y = canvas.height - data[i]; 
            if(i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke(); ctx.lineTo(canvas.width, canvas.height); ctx.lineTo(0, canvas.height); ctx.closePath();
        
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(57, 255, 136, 0.25)'); gradient.addColorStop(1, 'rgba(57, 255, 136, 0.0)');
        ctx.fillStyle = gradient; ctx.fill();
    }, 500); // Update much faster (500ms) for smoother animation
}

function stopGraph() { 
    if(graphInterval) clearInterval(graphInterval); 
}
