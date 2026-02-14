const UI = {
    ringTotal: 238.76,
    typewriter: async (text, id) => {
        const el = document.getElementById(id);
        el.innerHTML = "";
        for (let char of text) {
            el.innerHTML += char === "\n" ? "<br>" : char;
            await new Promise(r => setTimeout(r, 45));
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
    await UI.typewriter("Agent,\nSomeone stole tomorrow.\nEvery plan, every memory...\nReconstruct the itinerary.\nAuthenticate to begin.", "briefing-text");
    document.getElementById('auth-zone').style.opacity = 1;
};

// --- 指纹认证与陀螺仪权限 ---
let holdProgress = 0;
let holdTimer;
const ring = document.getElementById('progress-ring');

const startHold = async (e) => {
    e.preventDefault();
    holdTimer = setInterval(() => {
        holdProgress += 2;
        ring.style.strokeDashoffset = UI.ringTotal - (holdProgress/100)*UI.ringTotal;
        if(holdProgress >= 100) {
            clearInterval(holdTimer);
            handleSuccess();
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

const handleSuccess = async () => {
    document.getElementById('bg-music').play();
    
    // iOS 陀螺仪权限请求
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
            await DeviceOrientationEvent.requestPermission();
        } catch (e) { console.error(e); }
    }
    
    UI.switch('intro-module', 'phase-1');
    initPhase1Logic();
};

const fBtn = document.getElementById('fingerprint-btn');
fBtn.onmousedown = fBtn.ontouchstart = startHold;
window.onmouseup = window.ontouchend = stopHold;

// --- Phase 1: Pilates 逻辑 ---
let timeOK = false;
let balanceScore = 0;

function initPhase1Logic() {
    const slider = document.getElementById('time-slider');
    const ball = document.getElementById('balance-ball');
    
    slider.oninput = (e) => {
        const val = e.target.value;
        document.getElementById('hour-hand-p1').style.transform = `rotate(${val}deg)`;
        // 9点钟是 270度
        if(Math.abs(val - 270) < 10) {
            timeOK = true;
            document.getElementById('marker-9').classList.add('marker-active');
            document.getElementById('balance-progress-container').classList.remove('opacity-0');
        } else {
            timeOK = false;
            document.getElementById('marker-9').classList.remove('marker-active');
        }
    };

    window.addEventListener('deviceorientation', (e) => {
        if(!timeOK) return;
        // 映射倾斜到小球位移
        let x = Math.max(-35, Math.min(35, e.gamma * 1.5));
        let y = Math.max(-35, Math.min(35, (e.beta - 45) * 1.5));
        ball.style.transform = `translate(${x}px, ${y}px)`;

        // 中心判定
        if(Math.abs(x) < 12 && Math.abs(y) < 12) {
            balanceScore += 0.8;
        } else {
            balanceScore = Math.max(0, balanceScore - 0.2);
        }
        document.getElementById('balance-fill').style.width = balanceScore + "%";
        
        if(balanceScore >= 100) {
            timeOK = false; // 停止逻辑
            setTimeout(() => { UI.switch('phase-1', 'phase-2'); initPhase2Logic(); }, 1000);
        }
    });
}

// --- Phase 2: Diner 逻辑 ---
function initPhase2Logic() {
    let filled = 0;
    // 点击填充作为备选，重力倾斜作为主要
    document.querySelectorAll('.cup').forEach(cup => {
        cup.onclick = () => {
            if(cup.classList.contains('done')) return;
            cup.classList.add('done');
            cup.style.opacity = 1; cup.style.filter = "grayscale(0)";
            filled++;
            if(filled === 3) {
                document.getElementById('diner-img').style.opacity = 1;
                document.getElementById('diner-img').style.filter = "grayscale(0)";
                document.getElementById('neon-sign').classList.remove('hidden');
                setTimeout(() => UI.switch('phase-2', 'phase-3'), 2500);
            }
        };
    });

    window.addEventListener('deviceorientation', (e) => {
        if(document.getElementById('phase-2').classList.contains('stage-visible')) {
            if(Math.abs(e.gamma) > 35) { // 侧倾手机
                const next = document.querySelector('.cup:not(.done)');
                if(next) next.click();
            }
        }
    });
}

// --- Phase 3 & 4 基础逻辑 ---
document.getElementById('bpl-btn').onclick = () => {
    if(document.getElementById('bpl-input').value.toLowerCase().includes('lion')) {
        UI.switch('phase-3', 'phase-4');
    }
};

document.getElementById('ica-spot').onclick = () => {
    document.getElementById('ica-img').style.opacity = 1;
    document.getElementById('ica-img').style.filter = "grayscale(0)";
    setTimeout(() => UI.switch('phase-4', 'phase-5'), 2000);
};