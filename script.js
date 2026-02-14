const UI = {
    ringTotal: 238.76,
    type: async (text, id) => {
        const el = document.getElementById(id);
        for(let char of text) {
            el.innerHTML += char === "\n" ? "<br>" : char;
            await new Promise(r => setTimeout(r, 40 Char === " " ? 20 : 40));
        }
    },
    transition: (from, to) => {
        document.getElementById(from).classList.replace('stage-visible', 'stage-hidden');
        document.getElementById(to).classList.replace('stage-hidden', 'stage-visible');
    }
};

// --- INTRO LOGIC ---
document.getElementById('envelope-view').onclick = async () => {
    document.getElementById('envelope-view').classList.add('hidden');
    document.getElementById('dossier-view').classList.remove('hidden');
    await UI.type("Agent,\nSomeone stole tomorrow.\nReconstruct the itinerary.\nPlease authenticate.", "briefing-text");
    document.getElementById('auth-zone').classList.add('opacity-100');
};

let holdProgress = 0;
let holdTimer;
const fingerBtn = document.getElementById('fingerprint-btn');
const ring = document.getElementById('progress-ring');

fingerBtn.onmousedown = fingerBtn.ontouchstart = (e) => {
    e.preventDefault();
    holdTimer = setInterval(() => {
        holdProgress += 2;
        ring.style.strokeDashoffset = UI.ringTotal - (holdProgress/100)*UI.ringTotal;
        if(holdProgress >= 100) {
            clearInterval(holdTimer);
            document.getElementById('bg-music').play();
            UI.transition('intro-module', 'phase-1');
        }
    }, 30);
};

window.onmouseup = window.ontouchend = () => {
    clearInterval(holdTimer);
    if(holdProgress < 100) {
        holdProgress = 0;
        ring.style.strokeDashoffset = UI.ringTotal;
    }
};

// --- PHASE 1: PILATES ---
let balance = 0;
let timeOK = false;
document.getElementById('time-slider').oninput = (e) => {
    document.getElementById('hour-hand-p1').style.transform = `rotate(${e.target.value}deg)`;
    if(Math.abs(e.target.value - 270) < 10) {
        timeOK = true;
        document.getElementById('balance-progress-container').classList.add('opacity-100');
    }
};

// 平衡球自动逻辑 (电脑模拟，手机用陀螺仪)
setInterval(() => {
    if(!timeOK) return;
    balance += 0.5;
    document.getElementById('balance-fill').style.width = balance + '%';
    if(balance >= 100) {
        timeOK = false; 
        setTimeout(() => UI.transition('phase-1', 'phase-2'), 1000);
    }
}, 50);

// --- PHASE 2: DINER ---
let cups = 0;
document.querySelectorAll('.cup').forEach(cup => {
    cup.onclick = () => {
        if(cup.classList.contains('filled')) return;
        cup.classList.add('filled');
        cups++;
        if(cups === 3) {
            document.getElementById('diner-img').style.opacity = "1";
            document.getElementById('diner-img').style.filter = "grayscale(0)";
            document.getElementById('neon-sign').classList.replace('opacity-0', 'opacity-100');
            setTimeout(() => UI.transition('phase-2', 'phase-3'), 2500);
        }
    };
});

// --- PHASE 3: BPL ---
document.getElementById('bpl-btn').onclick = () => {
    if(document.getElementById('bpl-input').value.toLowerCase().includes('lion')) {
        UI.transition('phase-3', 'phase-4');
    } else {
        document.getElementById('bpl-input').style.color = 'red';
        setTimeout(() => document.getElementById('bpl-input').style.color = '', 500);
    }
};

// --- PHASE 4: ICA ---
document.getElementById('ica-spot').onclick = () => {
    document.getElementById('ica-img').style.opacity = "1";
    document.getElementById('ica-img').style.filter = "grayscale(0) brightness(1.2)";
    setTimeout(() => UI.transition('phase-4', 'phase-5'), 2000);
};