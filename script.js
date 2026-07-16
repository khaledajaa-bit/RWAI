// ---------- THEME TOGGLE ----------
const themeButtons = document.querySelectorAll('.theme-btn');
themeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    themeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.body.classList.toggle('dark', btn.dataset.theme === 'dark');
  });
});

// ---------- TICKER TAPE ----------
const tickerItems = [
  '$RWAI <b>$0.0842</b>',
  'TVL <b>$128.4M</b>',
  'Assets Tokenized <b>4,732</b>',
  'Holders <b>18,920</b>',
  'Collateral Ratio <b>142%</b>',
  'Network: Base · virtuals.io',
  'Real Estate 42% · Invoices 27% · Commodities 18% · Credit 13%'
];
const track = document.getElementById('tickerTrack');
const tapeContent = tickerItems.map(t => `<span>${t}</span>`).join('');
track.innerHTML = tapeContent + tapeContent; // duplicate for seamless loop

// ---------- COUNT-UP STATS ----------
function formatNumber(n, decimals){
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

document.querySelectorAll('.stat-value').forEach(el => {
  const target = parseFloat(el.dataset.count);
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1100;
  const start = performance.now();

  function tick(now){
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = prefix + formatNumber(value, decimals) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
});

// ---------- SPARKLINES ----------
const sparkData = {
  tvl:     [90, 94, 92, 98, 101, 99, 108, 112, 110, 118, 122, 128],
  assets:  [3.8, 3.9, 4.0, 4.1, 4.0, 4.2, 4.3, 4.4, 4.5, 4.6, 4.65, 4.732],
  holders: [12, 13, 13.5, 14, 15, 15.6, 16.2, 17, 17.5, 18, 18.5, 18.92],
  price:   [0.061, 0.065, 0.07, 0.068, 0.074, 0.079, 0.081, 0.076, 0.083, 0.088, 0.086, 0.0842]
};

function drawSpark(canvas, data, color){
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const min = Math.min(...data), max = Math.max(...data);
  const pad = 4;
  ctx.clearRect(0, 0, w, h);

  ctx.beginPath();
  data.forEach((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // fill under line
  ctx.lineTo(w - pad, h);
  ctx.lineTo(pad, h);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, color + '33');
  grad.addColorStop(1, color + '00');
  ctx.fillStyle = grad;
  ctx.fill();
}

const sparkColors = { tvl: '#6C4CF1', assets: '#14B8A6', holders: '#6C4CF1', price: '#F59E0B' };
document.querySelectorAll('.spark').forEach(canvas => {
  const key = canvas.dataset.spark;
  drawSpark(canvas, sparkData[key], sparkColors[key]);
});

// ---------- GAUGE ----------
const gaugeFill = document.getElementById('gaugeFill');
const gaugeNumber = document.getElementById('gaugeNumber');
const gaugeTarget = 142; // %
const gaugeMax = 200; // scale ceiling for visual purposes
const circumference = 251; // approximate arc length used in CSS dasharray

requestAnimationFrame(() => {
  const ratio = Math.min(gaugeTarget / gaugeMax, 1);
  gaugeFill.style.strokeDashoffset = circumference - circumference * ratio;
});

let gaugeStart = null;
function animateGaugeNumber(ts){
  if (!gaugeStart) gaugeStart = ts;
  const progress = Math.min((ts - gaugeStart) / 1200, 1);
  const eased = 1 - Math.pow(1 - progress, 3);
  gaugeNumber.textContent = Math.round(gaugeTarget * eased) + '%';
  if (progress < 1) requestAnimationFrame(animateGaugeNumber);
}
requestAnimationFrame(animateGaugeNumber);

// ---------- MAP MARKERS ----------
const mapWrap = document.getElementById('mapWrap');
const markers = [
  { x: '18%', y: '30%', label: 'Jakarta' },
  { x: '38%', y: '62%', label: 'Surabaya' },
  { x: '62%', y: '22%', label: 'Singapore' },
  { x: '78%', y: '55%', label: 'Manila' },
  { x: '50%', y: '80%', label: 'Bali' }
];
markers.forEach((m, i) => {
  const dot = document.createElement('div');
  dot.className = 'map-dot';
  dot.style.left = m.x;
  dot.style.top = m.y;
  dot.style.animationDelay = (i * 0.4) + 's';
  dot.innerHTML = `<span>${m.label}</span>`;
  mapWrap.appendChild(dot);
});

// ---------- COPY CONTRACT ADDRESS ----------
const fullAddress = '0xA1b2C3d4E5f6789012aBcDeF345678901RwAi9f';
document.getElementById('contractAddr').textContent =
  fullAddress.slice(0, 6) + '...' + fullAddress.slice(-6);

document.getElementById('copyBtn').addEventListener('click', () => {
  navigator.clipboard.writeText(fullAddress).then(() => {
    const btn = document.getElementById('copyBtn');
    const original = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => (btn.textContent = original), 1500);
  });
});

// ---------- LAUNCH BUTTON ----------
document.getElementById('launchBtn').addEventListener('click', () => {
  window.open('https://app.virtuals.io', '_blank');
});
