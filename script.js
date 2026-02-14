const UI = {
    ringTotal: 238.76,
    type: async (text, id) => {
        const el = document.getElementById(id);
        el.innerHTML = "";
        for(let c of text) { el.innerHTML += c === "\n" ? "<br>" : c; await new Promise(r => setTimeout(r, 40)); }
    },
    switch: (from, to) => {
        document.getElementById(from).classList.replace('stage-visible', 'stage-hidden');
        document.getElementById(to).classList.replace('stage-hidden', 'stage-visible');
    }
};

const music = document.getElementById('bg-music');

// --- INTRO ---
document.getElementById('envelope-view').onclick = async () => {
    music.play().catch(() => {}); // 第一次交互尝试播放
    document.getElementById('envelope-view').classList.add('hidden');
    document.getElementById('dossier-view').classList.remove('hidden');
    await UI.type("Jaden,\nThe itinerary is fragmented.\nSolve the core to proceed.\nAuthenticate now.", "briefing-text");
    document.querySelector('.auth-hidden').classList.add('stage-visible');
};

let hold = 0, timer;
const fBtn = document.getElementById('fingerprint-btn'), ring = document.getElementById('progress-ring');
const startH = (e) => { 
    e.preventDefault(); 
    music.play(); // 第二次交互强行触发
    timer = setInterval(() => {
        hold += 2; ring.style.strokeDashoffset = UI.ringTotal - (hold/100)*UI.ringTotal;
        if(hold >= 100) { clearInterval(timer); UI.switch('intro-module', 'phase-1'); }
    }, 30);
};
const stopH = () => { clearInterval(timer); if(hold < 100) { hold = 0; ring.style.strokeDashoffset = UI.ringTotal; }};
fBtn.onmousedown = fBtn.ontouchstart = startH; window.onmouseup = window.ontouchend = stopH;

// --- PHASE 1: STRETCH ---
let stretchDist = 0;
document.getElementById('time-slider').oninput = (e) => {
    document.getElementById('hour-hand-p1').style.transform = `rotate(${e.target.value}deg)`;
    if(Math.abs(e.target.value - 270) < 10) {
        document.getElementById('marker-9').classList.add('marker-active');
        document.getElementById('stretch-zone').classList.remove('hidden');
    }
};

const handle = document.getElementById('stretch-handle');
handle.ontouchmove = (e) => {
    // 模拟拉伸：计算手指滑动的距离
    stretchDist += 2;
    document.querySelector('.left-band').style.width = (20 + stretchDist) + "px";
    document.querySelector('.right-band').style.width = (20 + stretchDist) + "px";
    if(stretchDist > 100) { UI.switch('phase-1', 'phase-2'); initDiner(); }
};

// --- PHASE 2: DINER ---
function initDiner() {
    let fills = 0;
    document.querySelectorAll('.cup').forEach(c => c.onclick = () => {
        c.style.opacity = "1"; c.style.filter = "grayscale(0)"; c.style.transform = "scale(1.2)";
        fills++;
        if(fills === 3) {
            document.getElementById('diner-img').style.opacity = "1";
            document.getElementById('diner-img').style.filter = "grayscale(0)";
            setTimeout(setupWordPuzzle, 1000);
        }
    });
}

function setupWordPuzzle() {
    document.getElementById('diner-puzzle').classList.remove('hidden');
    const target = "DELUXETOWNDINER";
    const pool = "ELUXDETWONDINER".split('').sort(() => Math.random()-0.5);
    const slots = document.getElementById('slots');
    const poolEl = document.getElementById('pool');
    let current = "";

    [...target].forEach(() => { const s = document.createElement('div'); s.className = 'slot'; slots.appendChild(s); });
    pool.forEach(l => {
        const le = document.createElement('div'); le.className = 'letter'; le.innerText = l;
        le.onclick = () => {
            if(current.length < target.length) {
                slots.children[current.length].innerText = l; current += l; le.style.opacity = "0.2";
                if(current === target) setTimeout(() => UI.switch('phase-2', 'phase-3'), 1000);
            }
        };
        poolEl.appendChild(le);
    });
}

// --- PHASE 3: BPL ---
document.getElementById('bpl-btn').onclick = () => {
    if(document.getElementById('bpl-input').value.toLowerCase().includes('lion')) {
        UI.switch('phase-3', 'phase-4');
        initICA();
    }
};

// --- PHASE 4: ICA (Canvas Reveal) ---
function initICA() {
    const canvas = document.getElementById('ica-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 300; canvas.height = 400;
    
    // 覆盖一层灰色的蒙版
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'destination-out';

    let cleared = 0;
    const handleMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();
        cleared++;
        if(cleared > 150) { // 涂抹足够面积后过关
            setTimeout(() => UI.switch('phase-4', 'phase-5'), 1500);
        }
    };
    canvas.addEventListener('touchmove', handleMove);
}