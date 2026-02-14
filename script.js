const UI = {
    ringTotal: 238.76,
    type: async (text, id) => {
        const el = document.getElementById(id);
        el.innerHTML = "";
        for(let c of text) { el.innerHTML += c === "\n" ? "<br>" : c; await new Promise(r => setTimeout(r, 45)); }
    },
    switch: (from, to) => {
        document.getElementById(from).classList.replace('stage-visible', 'stage-hidden');
        document.getElementById(to).classList.replace('stage-hidden', 'stage-visible');
    }
};

const music = document.getElementById('bg-music');

// --- 开场逻辑 (完全保留) ---
document.getElementById('envelope-view').onclick = async () => {
    music.volume = 0;
    music.play().catch(() => {});
    document.getElementById('envelope-view').classList.add('hidden');
    document.getElementById('dossier-view').classList.remove('hidden');
    await UI.type("Jaden,\nThe timeline is fragmented.\nSync your biological core.\nAuthenticate to restore.", "briefing-text");
    document.getElementById('auth-zone').classList.remove('auth-hidden');
};

// --- 指纹逻辑 (完全保留) ---
let hold = 0, authTimer;
const fBtn = document.getElementById('fingerprint-btn'), ring = document.getElementById('progress-ring');

const startAuth = (e) => {
    e.preventDefault();
    music.volume = 0.5; music.play();
    authTimer = setInterval(() => {
        hold += 2;
        ring.style.strokeDashoffset = UI.ringTotal - (hold/100)*UI.ringTotal;
        if(hold >= 100) { clearInterval(authTimer); UI.switch('intro-module', 'phase-1'); initPhase1(); }
    }, 30);
};

const stopAuth = () => { clearInterval(authTimer); if(hold < 100) { hold = 0; ring.style.strokeDashoffset = UI.ringTotal; }};
fBtn.onmousedown = fBtn.ontouchstart = startAuth;
window.onmouseup = window.ontouchend = stopAuth;

// --- Phase 1: Pilates (完全保留) ---
function initPhase1() {
    const slider = document.getElementById('time-slider');
    const core = document.getElementById('breath-core');
    let breathCount = 0;

    slider.oninput = (e) => {
        document.getElementById('hour-hand-p1').style.transform = `rotate(${e.target.value}deg)`;
        if(Math.abs(e.target.value - 270) < 10) {
            document.getElementById('marker-9').classList.add('marker-active');
            core.classList.remove('hidden');
        }
    };

    core.onclick = () => {
        breathCount++;
        core.style.transform = `scale(${1 + breathCount * 0.2})`;
        if(breathCount >= 3) {
            setTimeout(() => { UI.switch('phase-1', 'phase-2'); initPhase2(); }, 600);
        }
    };
}

// --- Phase 2: Diner (完全保留) ---
function initPhase2() {
    let fills = 0;
    document.querySelectorAll('.cup').forEach(c => {
        c.onclick = () => {
            if(c.style.opacity === "1") return;
            c.style.opacity = "1"; c.style.transform = "scale(1.2)";
            fills++;
            if(fills === 3) {
                document.getElementById('diner-img').style.opacity = "1";
                document.getElementById('diner-img').style.filter = "grayscale(0)";
                setTimeout(startDinerPuzzle, 1000);
            }
        };
    });
}

function startDinerPuzzle() {
    document.getElementById('diner-puzzle').classList.remove('hidden');
    const target = "DELUXETOWNDINER";
    const poolChars = "DELUXETOWNDINER".split('').sort(() => Math.random() - 0.5);
    const slots = document.getElementById('slots'), poolEl = document.getElementById('pool');
    let current = "";

    [...target].forEach(() => { const s = document.createElement('div'); s.className = 'slot'; slots.appendChild(s); });
    
    poolChars.forEach(l => {
        const le = document.createElement('div');
        le.className = 'letter';
        le.innerText = l;
        le.onclick = () => {
            if(current.length < target.length) {
                slots.children[current.length].innerText = l;
                current += l;
                le.style.opacity = "0.1"; le.style.pointerEvents = "none";
                if(current === target) {
                    setTimeout(() => UI.switch('phase-2', 'phase-3'), 1000);
                } else if(current.length === target.length) {
                    setTimeout(() => {
                        current = "";
                        [...slots.children].forEach(s => s.innerText = "");
                        [...poolEl.children].forEach(p => { p.style.opacity = "1"; p.style.pointerEvents = "auto"; });
                    }, 500);
                }
            }
        };
        poolEl.appendChild(le);
    });
}

// --- Phase 3: BPL (优化了错误提示，更电影感) ---
document.getElementById('bpl-btn').onclick = () => {
    const input = document.getElementById('bpl-input');
    if(input.value.toLowerCase().includes('lion')) {
        UI.switch('phase-3', 'phase-4');
        initPhase4();
    } else {
        input.value = "";
        input.placeholder = "ACCESS DENIED";
        setTimeout(() => input.placeholder = "DECODE...", 2000);
    }
};

// --- Phase 4: ICA (加入了防误触滑动，并衔接到了结局动画) ---
function initPhase4() {
    const canvas = document.getElementById('ica-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 280; canvas.height = 380;
    ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'destination-out';
    
    let draws = 0;
    const paint = (e) => {
        e.preventDefault(); // 极其重要：防止涂抹时手机屏幕跟着上下滑动
        const rect = canvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        ctx.beginPath(); ctx.arc(x, y, 35, 0, Math.PI*2); ctx.fill();
        draws++;
        
        // 当涂抹面积达到要求时
        if(draws > 100) {
            canvas.onmousemove = canvas.ontouchmove = null; // 停止侦听，防止重复触发
            setTimeout(() => {
                UI.switch('phase-4', 'phase-5');
                initPhase5();
            }, 1000);
        }
    };
    canvas.onmousemove = canvas.ontouchmove = paint;
}

// --- Phase 5: 最终表白动画逻辑 ---
function initPhase5() {
    const timeItems = document.querySelectorAll('.time-item');
    const decryptMsg = document.querySelector('.decrypt-msg');
    const designerMsg = document.querySelector('.designer-msg');

    // 1. 时间线一行一行慢慢浮现
    timeItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('fade-in-up');
        }, index * 1000); // 每一行间隔 1 秒
    });

    // 计算等待所有时间线显现完的时间
    const textDelay = timeItems.length * 1000 + 1000; 

    // 2. 出现第一句文案
    setTimeout(() => {
        decryptMsg.classList.add('fade-in-up');
    }, textDelay);

    // 3. 出现落款表白
    setTimeout(() => {
        designerMsg.classList.add('fade-in-up');
    }, textDelay + 2500); 
}