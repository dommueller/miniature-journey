const textInput = document.getElementById('textInput');
const wpmInput = document.getElementById('wpmInput');
const pivotToggle = document.getElementById('pivotToggle');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const wordDisplay = document.getElementById('wordDisplay');
const progress = document.getElementById('progress');

const exampleIndex = document.getElementById('exampleIndex');
const exampleIndexLabel = document.getElementById('exampleIndexLabel');
const exampleDisplay = document.getElementById('exampleDisplay');
const exampleWordInfo = document.getElementById('exampleWordInfo');

const exampleWords = [
  'Anchor',
  'position',
  'changes',
  'perception',
  'because',
  'your',
  'eyes',
  'track',
  'less',
];

let words = [];
let current = 0;
let timer = null;
let exampleCurrent = 0;
let exampleTimer = null;

function tokenize(text) {
  return text
    .trim()
    .split(/\s+/)
    .map((w) => w.replace(/[“”]/g, '"'))
    .filter(Boolean);
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getPivotIndex(word) {
  const length = word.length;
  if (length <= 1) return 0;
  if (length <= 5) return 1;
  if (length <= 9) return 2;
  if (length <= 13) return 3;
  return 4;
}

function renderWord(word, forcedIndex = null) {
  const safe = escapeHtml(word);
  const pivot = Math.min(
    Math.max(0, forcedIndex ?? getPivotIndex(word)),
    Math.max(0, safe.length - 1),
  );

  const left = safe.slice(0, pivot);
  const mid = safe[pivot] ?? '';
  const right = safe.slice(pivot + 1);

  const html = pivotToggle.checked
    ? `${left}<span class="pivot">${mid}</span>${right}`
    : `${left}${mid}${right}`;

  return { html, pivot };
}

function setAlignedWord(element, word, forcedIndex = null) {
  const { html, pivot } = renderWord(word, forcedIndex);
  element.style.setProperty('--pivot-index', String(pivot));
  element.innerHTML = html;
}

function updateDisplay() {
  const word = words[current] ?? 'Done';
  setAlignedWord(wordDisplay, word);
  progress.textContent = `${Math.min(current + 1, words.length)} / ${words.length}`;
}

function tick() {
  if (current >= words.length) {
    stop();
    setAlignedWord(wordDisplay, 'Done', 1);
    return;
  }

  updateDisplay();
  current += 1;
}

function start() {
  if (timer) return;

  if (!words.length || current >= words.length) {
    words = tokenize(textInput.value);
    current = 0;
    progress.textContent = `0 / ${words.length}`;
  }

  if (!words.length) {
    setAlignedWord(wordDisplay, 'Add text first', 2);
    return;
  }

  const wpm = Number(wpmInput.value) || 300;
  const interval = Math.max(50, Math.round(60000 / wpm));
  tick();
  timer = setInterval(tick, interval);
}

function stop() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function reset() {
  stop();
  current = 0;
  words = tokenize(textInput.value);
  setAlignedWord(wordDisplay, 'Ready', 1);
  progress.textContent = `0 / ${words.length}`;
}

function updateExample() {
  const idx = Number(exampleIndex.value) || 0;
  exampleIndexLabel.textContent = String(idx);

  const word = exampleWords[exampleCurrent % exampleWords.length];
  const clamped = Math.min(idx, Math.max(0, word.length - 1));
  setAlignedWord(exampleDisplay, word, clamped);
  exampleWordInfo.textContent = `Word: ${word} | Anchor index: ${clamped}`;
}

function tickExample() {
  exampleCurrent += 1;
  updateExample();
}

function startExample() {
  if (exampleTimer) return;
  updateExample();
  exampleTimer = setInterval(tickExample, 520);
}

startBtn.addEventListener('click', start);
pauseBtn.addEventListener('click', stop);
resetBtn.addEventListener('click', reset);
pivotToggle.addEventListener('change', () => {
  updateDisplay();
  updateExample();
});

exampleIndex.addEventListener('input', updateExample);

reset();
startExample();
updateExample();
