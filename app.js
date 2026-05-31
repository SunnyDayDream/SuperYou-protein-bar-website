const totalFrames = 240;
const images = [];
let currentFrame = 1;

const canvas = document.getElementById('animation-canvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('animation-container');
const heroOverlay = document.getElementById('hero-text-overlay');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  render(currentFrame);
}
window.addEventListener('resize', resizeCanvas);

function drawImageCover(img) {
  const w = canvas.width;
  const h = canvas.height;
  const iw = img.width;
  const ih = img.height;
  
  const r = Math.min(w / iw, h / ih);
  let nw = iw * r;
  let nh = ih * r;
  let ar = 1;

  if (nw < w) ar = w / nw;
  if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;
  nw *= ar;
  nh *= ar;

  let cw = iw / (nw / w);
  let ch = ih / (nh / h);

  let cx = (iw - cw) * 0.5;
  let cy = (ih - ch) * 0.5;

  if (cx < 0) cx = 0;
  if (cy < 0) cy = 0;
  if (cw > iw) cw = iw;
  if (ch > ih) ch = ih;

  ctx.drawImage(img, cx, cy, cw, ch, 0, 0, w, h);
}

function render(frameIndex) {
  const img = images[frameIndex - 1];
  if (img && img.complete) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawImageCover(img);
  }
}

function preloadImages() {
  for (let i = 1; i <= totalFrames; i++) {
    const img = new Image();
    const frameNum = String(i).padStart(3, '0');
    img.src = `ezgif-frame-${frameNum}.jpg`;
    img.onload = () => {
      // Render first frame as soon as it's ready
      if (i === 1) render(1);
    };
    images.push(img);
  }
}

window.addEventListener('scroll', () => {
  const rect = container.getBoundingClientRect();
  
  // The scrollable distance is the height of the container minus the viewport height
  const maxScroll = rect.height - window.innerHeight;
  
  // The distance scrolled into the container is essentially how far 'top' is pushed upwards
  // when top is 0, we are at the beginning. 
  // when top is -maxScroll, we are at the end of the container's scroll area.
  let scrollFraction = -rect.top / maxScroll;
  
  // Clamp between 0 and 1
  scrollFraction = Math.max(0, Math.min(1, scrollFraction));
  
  const targetFrame = Math.max(1, Math.min(totalFrames, Math.floor(scrollFraction * (totalFrames - 1)) + 1));
  
  if (targetFrame !== currentFrame) {
    currentFrame = targetFrame;
    requestAnimationFrame(() => render(currentFrame));
  }

  if (heroOverlay) {
    // Fade out completely by 30% scroll
    let opacity = 1 - (scrollFraction / 0.3);
    heroOverlay.style.opacity = Math.max(0, Math.min(1, opacity));
  }
}, { passive: true });

// Initialize
resizeCanvas();
preloadImages();
