// --- GLOBAL SYSTEM STATE ---
let globalEvacuationState = false;

// --- ROUTING LOGIC ---
function showView(viewId) {
    // Hide all views
    const views = document.querySelectorAll('.view');
    views.forEach(v => v.classList.remove('active'));
    
    // Show target view
    document.getElementById(viewId).classList.add('active');

    // Handle Logout Button visibility
    const logoutBtn = document.getElementById('logoutBtn');
    if(viewId === 'view-selector' || viewId === 'view-fan-login' || viewId === 'view-mgmt-login') {
        logoutBtn.style.display = 'none';
    } else {
        logoutBtn.style.display = 'block';
    }

    // If entering Fan Dash, check if evacuation is active
    if(viewId === 'view-fan-dash') {
        applyEvacuationStateToFan();
    }
}

// --- LOGIN LOGIC ---
function loginFan() {
    const name = document.getElementById('fanName').value;
    const ticket = document.getElementById('fanTicket').value;
    
    if(!name || !ticket) {
        alert("Please enter both Name and Ticket Number.");
        return;
    }

    document.getElementById('displayFanName').innerText = name;
    document.getElementById('displayFanTicket').innerText = ticket;
    showView('view-fan-dash');
}

function loginMgmt() {
    const pin = document.getElementById('adminPin').value;
    if(pin === "1234") {
        showView('view-mgmt-dash');
    } else {
        alert("Incorrect PIN.");
    }
}

function logout() {
    // Clear inputs
    document.getElementById('fanName').value = '';
    document.getElementById('fanTicket').value = '';
    document.getElementById('adminPin').value = '';
    showView('view-selector');
}

// --- MANAGEMENT LOGIC ---
function triggerEvacuation() {
    const confirmEvac = confirm("WARNING: Are you sure you want to trigger a stadium-wide evacuation?");
    if(confirmEvac) {
        globalEvacuationState = true;
        
        // Show Global Banner
        document.getElementById('evac-banner').style.display = 'block';
        
        // Add to AI Log
        const logBox = document.getElementById('aiLogBox');
        const time = new Date().toLocaleTimeString().split(' ')[0];
        logBox.innerHTML += `<div class="ai-msg alert" style="color:#ff3333;">[${time}] SYSTEM OVERRIDE: Evacuation Triggered by Command.</div>`;
        logBox.scrollTop = logBox.scrollHeight;

        alert("Evacuation Protocol Initiated. All Fan Apps have been notified.");
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
