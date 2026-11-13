const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const content = window.FORM_PLAY_CONTENT || {};

// Intro — once per browser tab.
const intro = document.querySelector('#intro');
const skipIntro = document.querySelector('.intro-skip');
const backgroundSurfaces = [...document.body.children].filter(element => element !== intro);
function setBackgroundInert(value) {
  backgroundSurfaces.forEach(element => { element.inert = value; });
}
let introTimer;
function finishIntro(instant = false, moveFocus = false) {
  window.clearTimeout(introTimer);
  try { sessionStorage.setItem('formPlayIntroSeen', '1'); } catch (_) {}
  intro.setAttribute('aria-hidden', 'true');
  intro.inert = true;
  setBackgroundInert(false);
  if (instant) intro.classList.add('is-hidden');
  else {
    intro.classList.add('is-ending');
    window.setTimeout(() => intro.classList.add('is-hidden'), 680);
  }
  document.body.classList.add('is-ready');
  if (moveFocus) document.querySelector('#home-title').focus({ preventScroll: true });
}
let introSeen = false;
try { introSeen = sessionStorage.getItem('formPlayIntroSeen') === '1'; } catch (_) {}
if (reduceMotion || introSeen) finishIntro(true);
else {
  setBackgroundInert(true);
  requestAnimationFrame(() => skipIntro.focus({ preventScroll: true }));
  introTimer = window.setTimeout(() => finishIntro(false, true), 3000);
}
skipIntro.addEventListener('click', () => finishIntro(true, true));

// Compact mobile navigation.
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('#site-nav');
function closeMenu() {
  siteNav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.querySelector('span').textContent = 'MENU';
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  siteNav.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.querySelector('span').textContent = open ? 'CLOSE' : 'MENU';
});
siteNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && siteNav.classList.contains('is-open')) {
    closeMenu();
    menuToggle.focus();
  }
});

// Visual Lab state.
const styles = {
  editorial: { number: '01', name: 'EDITORIAL', image: 'assets/images/model-v2-editorial.png', description: '짙은 레드와 단단한 빛으로 인물의 존재감을 끌어올립니다.', copy: '강한 레드와 직접적인 빛으로 인물의 존재감을 강조합니다.' },
  cinematic: { number: '02', name: 'CINEMATIC', image: 'assets/images/model-v2-cinematic.png', description: '블루와 앰버의 대비, 깊은 그림자로 한 장면의 서사를 만듭니다.', copy: '블루와 앰버 조명의 대비로 장면의 서사를 만듭니다.' },
  minimal: { number: '03', name: 'MINIMAL', image: 'assets/images/model-v2-minimal.png', description: '밝은 공간과 부드러운 빛으로 인물과 실루엣에 집중합니다.', copy: '부드러운 빛과 여백으로 인물의 형태에 집중합니다.' }
};
['editorial', 'cinematic', 'minimal'].forEach(key => {
  if (!content[key]) return;
  styles[key].image = content[key].image || styles[key].image;
  styles[key].name = (content[key].title || styles[key].name).toUpperCase();
  styles[key].description = content[key].labDescription || styles[key].description;
  styles[key].copy = content[key].labCopy || styles[key].copy;
});
function applyManagedContent() {
  const sourceImage = content.source?.image;
  if (sourceImage) {
    document.querySelectorAll('.compare-before,.source-ref img,.process-case .case-panel:first-child img').forEach(image => { image.src = sourceImage; });
  }
  ['editorial', 'cinematic', 'minimal'].forEach(key => {
    const managed = content[key];
    const article = document.querySelector(`.study--${key}`);
    if (!managed || !article) return;
    const image = article.querySelector('figure img');
    if (managed.image) image.src = managed.image;
    if (managed.title) article.querySelector('h3').textContent = managed.title;
    if (managed.key) article.querySelector('.study-key').textContent = managed.key;
    if (managed.description) article.querySelector('.study-key + p').textContent = managed.description;
    const tabTitle = document.querySelector(`.concept-tab[data-style="${key}"] strong`);
    if (managed.title && tabTitle) tabTitle.textContent = managed.title;
  });
  if (content.minimal?.image) document.querySelector('.home-visual img').src = content.minimal.image;
  if (content.editorial?.image) document.querySelector('.process-case .case-panel:last-child img').src = content.editorial.image;
}
applyManagedContent();
Object.values(styles).forEach(style => { const image = new Image(); image.src = style.image; });
const compare = document.querySelector('.compare');
const range = document.querySelector('#compare-range');
const afterImage = document.querySelector('#after-image');
const styleName = document.querySelector('#style-name');
const styleNumber = document.querySelector('#style-number');
const styleDescription = document.querySelector('#style-description');
const conceptTitle = document.querySelector('#concept-title');
const conceptCopy = document.querySelector('#concept-copy');
const conceptDisplay = document.querySelector('.concept-display');
const lab = document.querySelector('.lab');
const buttons = [...document.querySelectorAll('.concept-tab')];
afterImage.src = styles.editorial.image;
styleName.textContent = styles.editorial.name;
conceptTitle.textContent = styles.editorial.name;
styleDescription.textContent = styles.editorial.description;
conceptCopy.textContent = styles.editorial.copy;
let styleTransitionTimer;
function updateRange() {
  const value = Number(range.value);
  compare.style.setProperty('--position', `${value}%`);
  range.setAttribute('aria-valuetext', `변환 전 ${100 - value}%, 변환 후 ${value}%`);
}
function selectStyle(button) {
  if (button.classList.contains('is-active')) return;
  const key = button.dataset.style;
  const selected = styles[key];
  window.clearTimeout(styleTransitionTimer);
  buttons.forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  compare.classList.add('is-switching');
  compare.setAttribute('aria-busy', 'true');
  conceptDisplay.classList.add('is-switching');
  styleTransitionTimer = window.setTimeout(() => {
    afterImage.src = selected.image;
    styleName.textContent = selected.name;
    styleNumber.textContent = selected.number;
    styleDescription.textContent = selected.description;
    conceptTitle.textContent = selected.name;
    conceptCopy.textContent = selected.copy;
    lab.dataset.theme = key;
    compare.classList.remove('is-switching');
    compare.removeAttribute('aria-busy');
    conceptDisplay.classList.remove('is-switching');
  }, reduceMotion ? 0 : 180);
}
range.addEventListener('input', updateRange);
buttons.forEach(button => button.addEventListener('click', () => selectStyle(button)));
updateRange();

// YOUR FRAME — all visitor image work stays in browser memory.
const frameFile = document.querySelector('#frame-file');
const frameChoose = document.querySelector('#frame-choose');
const frameChange = document.querySelector('#frame-change');
const frameReset = document.querySelector('#frame-reset');
const frameDropzone = document.querySelector('#frame-dropzone');
const frameEditor = document.querySelector('.frame-editor');
const frameSourceCanvas = document.querySelector('#frame-source-canvas');
const frameResultCanvas = document.querySelector('#frame-result-canvas');
const frameRange = document.querySelector('#frame-range');
const frameCompare = document.querySelector('.frame-compare');
const frameStatus = document.querySelector('#frame-status');
const frameDownload = document.querySelector('#frame-download');
const frameStyleName = document.querySelector('#frame-style-name');
const frameDirections = [...document.querySelectorAll('.frame-direction')];
const frameSteps = [...document.querySelectorAll('.frame-steps span')];
let frameBitmap = null;
let frameStyle = 'editorial';
let frameRenderToken = 0;
const frameMaxBytes = 15 * 1024 * 1024;
const frameMaxPixels = 40_000_000;
const frameMaxSide = 2400;

function setFrameStep(index) {
  frameSteps.forEach((step, stepIndex) => step.classList.toggle('is-current', stepIndex === index));
}
function resetFrameExperience(message = '사진을 선택하면 체험을 시작할 수 있습니다.') {
  frameRenderToken += 1;
  if (frameBitmap?.close) frameBitmap.close();
  frameBitmap = null;
  frameFile.value = '';
  frameSourceCanvas.width = frameSourceCanvas.height = 1;
  frameResultCanvas.width = frameResultCanvas.height = 1;
  frameEditor.hidden = true;
  frameDropzone.hidden = false;
  frameDownload.disabled = true;
  frameRange.value = '50';
  frameCompare.style.setProperty('--frame-position', '50%');
  frameStatus.textContent = message;
  setFrameStep(0);
}
function drawFrameSource(bitmap) {
  const scale = Math.min(1, frameMaxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  [frameSourceCanvas, frameResultCanvas].forEach(canvas => { canvas.width = width; canvas.height = height; });
  const sourceContext = frameSourceCanvas.getContext('2d', { alpha: false });
  sourceContext.fillStyle = '#111'; sourceContext.fillRect(0, 0, width, height); sourceContext.drawImage(bitmap, 0, 0, width, height);
}
function renderFrameStyle() {
  if (!frameBitmap) return;
  const token = ++frameRenderToken;
  frameDownload.disabled = true;
  frameStatus.textContent = '색감과 조명을 적용하는 중입니다…';
  requestAnimationFrame(() => {
    if (token !== frameRenderToken || !frameBitmap) return;
    const canvas = frameResultCanvas;
    const context = canvas.getContext('2d', { alpha: false });
    const width = canvas.width, height = canvas.height;
    context.clearRect(0, 0, width, height);
    if (frameStyle === 'editorial') context.filter = 'contrast(1.28) saturate(1.18) brightness(.9)';
    else if (frameStyle === 'cinematic') context.filter = 'contrast(1.22) saturate(.92) brightness(.82) sepia(.08)';
    else context.filter = 'contrast(.9) saturate(.62) brightness(1.12)';
    context.drawImage(frameSourceCanvas, 0, 0);
    context.filter = 'none';
    if (frameStyle === 'editorial') {
      context.globalCompositeOperation = 'multiply'; context.fillStyle = 'rgba(112,8,38,.32)'; context.fillRect(0, 0, width, height);
      const light = context.createLinearGradient(0, 0, width, height); light.addColorStop(0, 'rgba(255,235,225,.16)'); light.addColorStop(.48, 'rgba(255,255,255,0)'); light.addColorStop(1, 'rgba(35,0,12,.2)'); context.globalCompositeOperation = 'screen'; context.fillStyle = light; context.fillRect(0, 0, width, height);
    } else if (frameStyle === 'cinematic') {
      const tone = context.createLinearGradient(0, 0, width, height); tone.addColorStop(0, 'rgba(0,73,105,.42)'); tone.addColorStop(.52, 'rgba(0,25,40,.08)'); tone.addColorStop(1, 'rgba(185,78,20,.34)'); context.globalCompositeOperation = 'overlay'; context.fillStyle = tone; context.fillRect(0, 0, width, height);
      const vignette = context.createRadialGradient(width / 2, height / 2, Math.min(width,height)*.18, width / 2, height / 2, Math.max(width,height)*.72); vignette.addColorStop(.45, 'rgba(0,0,0,0)'); vignette.addColorStop(1, 'rgba(0,10,18,.48)'); context.globalCompositeOperation = 'multiply'; context.fillStyle = vignette; context.fillRect(0, 0, width, height);
    } else {
      context.globalCompositeOperation = 'screen'; context.fillStyle = 'rgba(248,246,239,.2)'; context.fillRect(0, 0, width, height);
      const wash = context.createLinearGradient(0, 0, width, 0); wash.addColorStop(0, 'rgba(255,255,255,.2)'); wash.addColorStop(1, 'rgba(220,225,220,.08)'); context.fillStyle = wash; context.fillRect(0, 0, width, height);
    }
    context.globalCompositeOperation = 'source-over';
    frameDownload.disabled = false;
    frameStatus.textContent = `${frameStyle.toUpperCase()} 색감과 조명 시뮬레이션이 적용되었습니다.`;
    setFrameStep(2);
  });
}
async function loadFrameFile(file) {
  if (!file) return;
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { frameStatus.textContent = 'JPG, PNG, WEBP 이미지 파일만 사용할 수 있습니다.'; return; }
  if (file.size > frameMaxBytes) { frameStatus.textContent = '파일이 너무 큽니다. 15MB 이하 이미지를 선택해 주세요.'; return; }
  frameStatus.textContent = '이미지를 준비하는 중입니다…';
  frameDownload.disabled = true;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    if (bitmap.width * bitmap.height > frameMaxPixels) { bitmap.close(); throw new Error('pixels'); }
    if (frameBitmap?.close) frameBitmap.close();
    frameBitmap = bitmap;
    drawFrameSource(bitmap);
    frameDropzone.hidden = true;
    frameEditor.hidden = false;
    frameFile.value = '';
    setFrameStep(1);
    renderFrameStyle();
  } catch (error) {
    frameStatus.textContent = error.message === 'pixels' ? '이미지 해상도가 너무 큽니다. 4천만 픽셀 이하 이미지를 선택해 주세요.' : '이미지를 읽지 못했습니다. 다른 파일을 선택해 주세요.';
  }
}
function updateFrameRange() {
  const value = Number(frameRange.value);
  frameCompare.style.setProperty('--frame-position', `${value}%`);
  frameRange.setAttribute('aria-valuetext', `원본 ${100 - value}%, 결과 ${value}%`);
  if (frameBitmap) setFrameStep(2);
}
frameChoose.addEventListener('click', () => frameFile.click());
frameChange.addEventListener('click', () => frameFile.click());
frameReset.addEventListener('click', () => resetFrameExperience());
frameFile.addEventListener('change', event => loadFrameFile(event.target.files[0]));
frameRange.addEventListener('input', updateFrameRange);
frameDirections.forEach(button => button.addEventListener('click', () => {
  frameStyle = button.dataset.frameStyle;
  frameStyleName.textContent = frameStyle.toUpperCase();
  frameDirections.forEach(item => { const active = item === button; item.classList.toggle('is-active', active); item.setAttribute('aria-pressed', String(active)); });
  setFrameStep(frameBitmap ? 1 : 0);
  renderFrameStyle();
}));
['dragenter','dragover'].forEach(type => frameDropzone.addEventListener(type, event => { event.preventDefault(); frameDropzone.classList.add('is-dragging'); }));
['dragleave','drop'].forEach(type => frameDropzone.addEventListener(type, event => { event.preventDefault(); frameDropzone.classList.remove('is-dragging'); }));
frameDropzone.addEventListener('drop', event => loadFrameFile(event.dataTransfer.files[0]));
frameDownload.addEventListener('click', () => {
  if (!frameBitmap || frameDownload.disabled) return;
  frameDownload.disabled = true;
  frameResultCanvas.toBlob(blob => {
    if (!blob) { frameStatus.textContent = 'PNG 파일을 만들지 못했습니다.'; frameDownload.disabled = false; return; }
    const link = document.createElement('a'); const url = URL.createObjectURL(blob);
    link.href = url; link.download = `form-play-${frameStyle}.png`; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
    frameDownload.disabled = false; frameStatus.textContent = `${link.download} 파일을 만들었습니다.`; setFrameStep(3);
  }, 'image/png');
});
updateFrameRange();

// Section reveals and process emphasis.
const revealItems = document.querySelectorAll('.lab-head,.frame-head,.frame-workspace,.section-intro,.concept-tabs,.concept-display,.compare-shell,.study,.process-case,.about>div');
if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => { item.classList.add('reveal'); revealObserver.observe(item); });
  const steps = document.querySelectorAll('.process-list li');
  const stepObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('is-current', entry.isIntersecting));
  }, { rootMargin: '-38% 0px -42% 0px', threshold: 0 });
  steps.forEach(step => stepObserver.observe(step));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

// Study lightbox — VIEW cursor is only used because the images open here.
const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('p');
const studyFigures = document.querySelectorAll('.study > figure');
document.querySelectorAll('.study img,.process-case img,.source-ref img').forEach(image => {
  image.loading = 'lazy';
  image.decoding = 'async';
});
function openStudy(figure) {
  const image = figure.querySelector('img');
  const title = figure.closest('.study').querySelector('h3').textContent;
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = `${title.toUpperCase()} / FORM / PLAY`;
  lightbox.showModal();
}
studyFigures.forEach(figure => {
  figure.tabIndex = 0;
  figure.setAttribute('role', 'button');
  figure.setAttribute('aria-label', `${figure.querySelector('img').alt} 확대 보기`);
  figure.dataset.cursor = 'view';
  figure.addEventListener('click', () => openStudy(figure));
  figure.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openStudy(figure); }
  });
});
lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });

// Custom cursor — mouse only, with direct dot and lightly eased ring.
const finePointer = window.matchMedia('(pointer: fine)').matches;
if (finePointer && !reduceMotion) {
  const cursor = document.querySelector('.cursor');
  const dot = cursor.querySelector('.cursor-dot');
  const ring = cursor.querySelector('.cursor-ring');
  let mouseX = -100, mouseY = -100, ringX = -100, ringY = -100, cursorFrame = 0;
  document.body.classList.add('has-custom-cursor');
  function renderCursor() {
    ringX += (mouseX - ringX) * 0.24;
    ringY += (mouseY - ringY) * 0.24;
    ring.style.transform = `translate(${ringX}px,${ringY}px) translate(-50%,-50%)`;
    const moving = Math.abs(mouseX - ringX) > 0.15 || Math.abs(mouseY - ringY) > 0.15;
    cursorFrame = moving ? requestAnimationFrame(renderCursor) : 0;
  }
  document.addEventListener('pointermove', event => {
    mouseX = event.clientX; mouseY = event.clientY;
    dot.style.transform = `translate(${mouseX}px,${mouseY}px) translate(-50%,-50%)`;
    const nativeText = event.target.closest('textarea,[contenteditable="true"],input:not([type="range"])');
    cursor.classList.toggle('is-hidden', Boolean(nativeText));
    const target = event.target.closest('[data-cursor],a,button');
    cursor.classList.toggle('is-drag', target?.dataset.cursor === 'drag');
    cursor.classList.toggle('is-view', target?.dataset.cursor === 'view');
    cursor.classList.toggle('is-active', Boolean(target));
    if (!cursorFrame) cursorFrame = requestAnimationFrame(renderCursor);
  });
  document.documentElement.addEventListener('mouseleave', () => {
    cursor.classList.add('is-hidden');
    if (cursorFrame) cancelAnimationFrame(cursorFrame);
    cursorFrame = 0;
  });
  document.documentElement.addEventListener('mouseenter', () => cursor.classList.remove('is-hidden'));
}
