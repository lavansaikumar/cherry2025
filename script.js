// Config-driven dynamic site
const CONFIG_URL = 'config.json';

const state = {
  photos: ['assets/photo1.jpg', 'assets/photo2.jpg', 'assets/photo3.jpg'],
  audio: 'assets/birthday.mp3',
  quotes: [],
  captions: [],
  name: 'CHARITHA (Cherry)',
  date: 'January 05',
  tagline: 'You are the melody in ordinary moments, the sparkle in quiet skies.',
  intro: 'Today is for you—your laughter, your courage, your gentle heart.',
  footer: 'May this day be your most valuable memory.',
  theme: 'dark'
};

async function loadConfig() {
  try {
    const res = await fetch(CONFIG_URL);
    const data = await res.json();
    Object.assign(state, data);
  } catch (e) {
    // Fallback to defaults if config missing
  }
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function buildCollage() {
  const collage = document.getElementById('collage');
  const positions = [
    {style:'--r:-3deg;top:6%;left:6%;width:220px;height:280px;'},
    {style:'--r:2deg;top:12%;right:8%;width:240px;height:300px;'},
    {style:'--r:-6deg;bottom:8%;left:12%;width:260px;height:320px;'},
    {style:'--r:5deg;bottom:10%;right:12%;width:220px;height:260px;'},
    {style:'--r:-2deg;top:50%;left:40%;width:180px;height:220px;'},
    {style:'--r:8deg;top:30%;right:40%;width:200px;height:240px;'}
  ];
  collage.innerHTML = '';
  positions.forEach((pos, i) => {
    const img = document.createElement('img');
    img.src = state.photos[i % state.photos.length];
    img.alt = `Cherry ${i+1}`;
    img.style = pos.style;
    collage.appendChild(img);
  });
}

function buildQuotes() {
  const grid = document.getElementById('quoteGrid');
  grid.innerHTML = '';
  state.quotes.forEach(q => {
    const div = document.createElement('div');
    div.className = 'quote';
    div.innerHTML = `<p>“${q.text}”</p><div class="author">— ${q.author}</div>`;
    grid.appendChild(div);
  });
}

function buildCarousel() {
  const track = document.getElementById('carouselTrack');
  track.innerHTML = '';
  const slides = [];
  for (let i = 0; i < 9; i++) {
    const idx = i % state.photos.length;
    const caption = state.captions[idx % state.captions.length] || 'Cherry';
    slides.push({ src: state.photos[idx], caption });
  }
  slides.concat(slides.slice(0,3)).forEach(s => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.innerHTML = `<img src="${s.src}" alt="Cherry"><div class="caption">${s.caption}</div>`;
    track.appendChild(slide);
  });
}

function buildParallax() {
  const container = document.getElementById('parallax');
  container.innerHTML = '';
  const labels = ['Radiant','Brave','Kind'];
  for (let i = 0; i < 3; i++) {
    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.innerHTML = `
      <img src="${state.photos[i % state.photos.length]}" alt="Cherry">
      <div class="overlay"></div>
      <div class="label">${labels[i]}</div>
    `;
    container.appendChild(panel);
  }
}

function initText() {
  setText('title', `Happy Birthday, ${state.name}`);
  setText('date', `${state.date} • Forever your most cherished day`);
  setText('tagline', state.tagline);
  setText('intro', state.intro);
  setText('footerText', `Made with love for ${state.name}. ${state.footer}`);
}

function spawnHearts() {
  function spawnHeart(){
    const h=document.createElement('div');
    h.className='heart';
    h.textContent='❤';
    h.style.left=Math.random()*100+'vw';
    h.style.animationDuration=(6+Math.random()*6)+'s';
    h.style.fontSize=(14+Math.random()*18)+'px';
    document.body.appendChild(h);
    setTimeout(()=>h.remove(),12000);
  }
  setInterval(spawnHeart,700);
}

function spawnBalloons() {
  const colors = ['#ff7ac8','#ffd166','#7ad7f0','#b6ffb4','#f9a8d4','#fcd34d'];
  for(let i=0;i<10;i++){
    const b=document.createElement('div');
    b.className='balloon';
    const color=colors[Math.floor(Math.random()*colors.length)];
    b.style.background=color;
    b.style.left=Math.random()*100+'vw';
    b.style.animation=`rise ${8+Math.random()*10}s linear infinite`;
    document.body.appendChild(b);
  }
}

function initConfetti() {
  const canvas=document.getElementById('confetti');
  const ctx=canvas.getContext('2d');
  function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight}
  resize();window.addEventListener('resize',resize);
  const pieces=[];
  const colors=['#ff7ac8','#ffd166','#7ad7f0','#b6ffb4','#f9a8d4','#fcd34d','#ffffff'];
  for(let i=0;i<180;i++){
    pieces.push({
      x:Math.random()*canvas.width,
      y:Math.random()*canvas.height,
      w:4+Math.random()*6,
      h:8+Math.random()*12,
      c:colors[Math.floor(Math.random()*colors.length)],
      s:0.5+Math.random()*2,
      r:Math.random()*Math.PI
    });
  }
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(const p of pieces){
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r);
      ctx.fillStyle=p.c; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
      ctx.restore();
      p.y+=p.s; p.r+=0.01;
      if(p.y>canvas.height){p.y=-10; p.x=Math.random()*canvas.width}
    }
    requestAnimationFrame(draw);
  }
  draw();
}

function initAudio() {
  const audio=document.getElementById('bgAudio');
  const playBtn=document.getElementById('playBtn');
  const status=document.getElementById('audioStatus');
  const musicToggle=document.getElementById('musicToggle');

  audio.src = state.audio;

  async function tryPlay(){
    try{
      audio.muted=true;
      await audio.play();
      setTimeout(()=>{audio.muted=false;},300);
      status.textContent='Music is playing 🎶';
      musicToggle.textContent='🔇 Mute';
    }catch(e){
      status.textContent='Tap the button to start the music.';
      musicToggle.textContent='🎵 Music';
    }
  }
  window.addEventListener('load',tryPlay);

  playBtn.addEventListener('click',async()=>{
    try{
      audio.muted=false;
      await audio.play();
      status.textContent='Music is playing 🎶';
      musicToggle.textContent='🔇 Mute';
    }catch(e){
      status.textContent='Please check your audio settings.';
    }
  });

  musicToggle.addEventListener('click',()=>{
    if(audio.paused){
      audio.play(); musicToggle.textContent='🔇 Mute';
    }else{
      audio.pause(); musicToggle.textContent='🎵 Music';
    }
  });
}

function initTheme() {
  const toggle = document.getElementById('themeToggle');
  function applyTheme(){
    if(state.theme === 'light') document.body.classList.add('light');
    else document.body.classList.remove('light');
  }
  applyTheme();
  toggle.addEventListener('click',()=>{
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme();
  });
}

function hidePreloader() {
  const pre = document.getElementById('preloader');
  setTimeout(()=> pre.style.display='none', 600);
}

(async function init(){
  await loadConfig();
  initText();
  buildCollage();
  buildQuotes();
  buildCarousel();
  buildParallax();
  spawnHearts();
  spawnBalloons();
  initConfetti();
  initAudio();
  initTheme();
  hidePreloader();
})();
