// Smooth scroll for Learn More button
function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

// Contact form interactivity
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('form-message').textContent = 'Thank you for reaching out! I will get back to you soon.';
    form.reset();
  });
}

// Responsive nav (for mobile)
document.addEventListener('DOMContentLoaded', function() {
  const nav = document.querySelector('nav ul');
  const logo = document.querySelector('.logo');
  logo.addEventListener('click', function() {
    nav.classList.toggle('active');
  });
})

// scripts.js

function downloadPDF() {
  const main = document.querySelector('main');
  const opt = {
    margin:       0.2,
    filename:     'blast-using-python.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  const feedback = document.getElementById('pdf-feedback');
  feedback.innerText = '';

  html2pdf().set(opt).from(main).save()
    .then(function() {
      feedback.innerText = 'PDF downloaded successfully!';
      feedback.style.color = '#219150';
      setTimeout(() => { feedback.innerText = ''; }, 2500);
    })
    .catch(function(err) {
      feedback.innerText = 'PDF download failed. Please try again.';
      feedback.style.color = '#b71c1c';
    });
}

(function(){
  const canvas = document.getElementById('dnaCanvas');
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = Math.max(1, window.devicePixelRatio || 1);
  const params = {
    amplitude: 40,
    period: 180,
    speed: 0.02,
    strandGap: 120,
    basePairEvery: 18,
    strandWidth: 3,
    pairWidth: 2.2
  };
  function resize(){
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  window.addEventListener('resize', resize);
  resize();
  let t = 0;
  function draw(){
    ctx.clearRect(0,0,w,h);
    const g = ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0, 'rgba(255,255,255,0.08)');
    g.addColorStop(1, 'rgba(250,255,255,0.03)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);
    const centerY = h/2;
    const leftMargin = 70;
    const rightMargin = w - 70;
    const pointsA = [];
    const pointsB = [];
    for(let x = leftMargin; x <= rightMargin; x += 2){
      const phase = (x / params.period) * Math.PI * 2 + t;
      const yOffset = Math.sin(phase) * params.amplitude;
      const ax = x - params.strandGap/2;
      const ay = centerY + yOffset;
      const bx = x + params.strandGap/2;
      const by = centerY - yOffset;
      pointsA.push({x: ax, y: ay, phase});
      pointsB.push({x: bx, y: by, phase});
    }
    ctx.lineWidth = params.pairWidth;
    for(let i=0;i<pointsA.length;i+=Math.round(params.basePairEvery/2)){
      const pa = pointsA[i];
      const pb = pointsB[i];
      const depth = (Math.sin(pa.phase + t) + 1)/2;
      ctx.strokeStyle = `rgba(255,209,102, ${0.35 + 0.45*depth})`;
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.stroke();
    }
    drawStrand(pointsB, 'rgba(26,159,177,0.95)', params.strandWidth+1);
    drawStrand(pointsA, 'rgba(10,107,107,0.97)', params.strandWidth);
    t += params.speed;
    requestAnimationFrame(draw);
  }
  function drawStrand(points, color, width){
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    for(let i=0;i<points.length;i++){
      const p = points[i];
      if(i===0) ctx.moveTo(p.x, p.y);
      else{
        const prev = points[i-1];
        const cx = (prev.x + p.x)/2;
        const cy = (prev.y + p.y)/2;
        ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);
      }
    }
    ctx.stroke();
  }
  resize();
  requestAnimationFrame(draw);
})();