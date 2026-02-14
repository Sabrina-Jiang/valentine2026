const UI = {
    ringTotal: 238.76,
    typewriter: async (text, elementId) => {
        const el = document.getElementById(elementId);
        el.innerHTML = "";
        for (let char of text) {
            el.innerHTML += char === "\n" ? "<br>" : char;
            await new Promise(r => setTimeout(r, 40));
        }
    },
    switch: (from, to) => {
        document.getElementById(from).classList.replace('stage-visible', 'stage-hidden');
        document.getElementById(to).classList.replace('stage-hidden', 'stage-visible');
    }
};

// --- 开场逻辑 ---
document.getElementById('envelope-view').onclick = async () => {
    document.getElementById('envelope-view').classList.add('hidden');
    document.getElementById('dossier-view').classList.remove('hidden');
    await UI.typewriter("Jaden,\nSomeone stole tomorrow.\nEvery plan, every memory we haven't made yet...\nReconstruct the itinerary.", "briefing-text");
    document.getElementById('auth-zone').classList.replace('auth-hidden', 'auth-visible');
    document.getElementById('auth-zone').style.opacity = 1;
};

// --- 指纹认证 ---
let holdProgress = 0;
let holdTimer;
const ring = document.getElementById('progress-ring');

const startHold = (e) => {
    e.preventDefault();
    holdTimer = setInterval(() => {
        holdProgress += 2;
        ring.style.strokeDashoffset = UI.ringTotal - (holdProgress/100)*UI.ringTotal;
        if(holdProgress >= 100) {
            clearInterval(holdTimer);
            document.getElementById('bg-music').play();
            UI.switch('intro-module', 'phase-1');
        }
    }, 30);
};

const stopHold = () => {
    clearInterval(holdTimer);
    if(holdProgress < 100) {
        holdProgress = 0;
        ring.style.strokeDashoffset = UI.ringTotal;
    }
};

const fBtn = document.getElementById('fingerprint-btn');
fBtn.onmousedown = fBtn.ontouchstart = startHold;
window.onmouseup = window.ontouchend = stopHold;

// --- Phase 1: Pilates ---
let timeOK = false;
let balanceProgress = 0;
document.getElementById('time-slider').oninput = (e) => {
    document.getElementById('hour-hand-p1').style.transform = `rotate(${e.target.value}deg)`;
    if(Math.abs(e.target.value - 270) < 10) {
        timeOK = true;
        document.getElementById('balance-progress-container').style.opacity = 1;
    }
};

setInterval(() => {
    if(!timeOK) return;
    balanceProgress += 0.4;
    document.getElementById('balance-fill').style.width = balanceProgress + "%";
    if(balanceProgress >= 100) {
        timeOK = false;
        setTimeout(() => UI.switch('phase-1', 'phase-2'), 100);
    }
}, 50);

// --- Phase 2: Diner ---
let filledCups = 0;
document.querySelectorAll('.cup').forEach(cup => {
    cup.onclick = () => {
        if(cup.style.opacity === "1") return;
        cup.style.opacity = "1";
        cup.style.filter = "grayscale(0)";
        filledCups++;
        if(filledCups === 3) {
            document.getElementById('diner-img').style.opacity = 1;
            document.getElementById('diner-img').style.filter = "grayscale(0)";
            document.getElementById('neon-sign').classList.remove('hidden');
            setTimeout(() => UI.switch('phase-2', 'phase-3'), 2000);
        }
    };
});

// --- Phase 3: BPL ---
document.getElementById('bpl-btn').onclick = () => {
    const val = document.getElementById('bpl-input').value.toLowerCase();
    if(val.includes('lion')) {
        UI.switch('phase-3', 'phase-4');
    } else {
        alert("ACCESS DENIED: Hint - Check the statues at the entrance.");
    }
};

// --- Phase 4: ICA ---
document.getElementById('ica-spot').onclick = () => {
    document.getElementById('ica-img').style.opacity = 1;
    document.getElementById('ica-img').style.filter = "grayscale(0) brightness(1.2)";
    setTimeout(() => UI.switch('phase-4', 'phase-5'), 2000);
};