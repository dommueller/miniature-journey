const textInput = document.getElementById('textInput');
const wpmInput = document.getElementById('wpmInput');
const pivotToggle = document.getElementById('pivotToggle');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const wordDisplay = document.getElementById('wordDisplay');
const progress = document.getElementById('progress');

const exampleWord = document.getElementById('exampleWord');
const exampleIndex = document.getElementById('exampleIndex');
const exampleIndexLabel = document.getElementById('exampleIndexLabel');
const exampleDisplay = document.getElementById('exampleDisplay');

let words = [];
let current = 0;
let timer = null;

function tokenize(text) {
  return text
    .trim()
    .split(/\s+/)
    .map((w) => w.replace(/[“”]/g, '"'))
    .filter(Boolean);
}

function getPivotIndex(word) {
  // Common RSVP heuristic based on Spritz-style ORP positioning.
  const length = word.length;
  if (length <= 1) return 0;
  if (length <= 5) return 1;
  if (length <= 9) return 2;
  if (length <= 13) return 3;
  return 4;
}

function renderWord(word, forcePivotIndex = null) {
  if (!pivotToggle.checked) {
    return word;
  }

  const safe = word.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const pivot = Math.min(
    Math.max(0, forcePivotIndex ?? getPivotIndex(safe)),
    safe.length - 1,
  );
  const left = safe.slice(0, pivot);
  const mid = safe[pivot] ?? '';
  const right = safe.slice(pivot + 1);
  return `${left}<span class="pivot">${mid}</span>${right}`;
}

function updateDisplay() {
  const word = words[current] ?? 'Done';
  wordDisplay.innerHTML = renderWord(word);
  progress.textContent = `${Math.min(current + 1, words.length)} / ${words.length}`;
}

function tick() {
  if (current >= words.length) {
    stop();
    wordDisplay.textContent = 'Done';
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
    wordDisplay.textContent = 'Add text first';
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
  wordDisplay.textContent = 'Ready';
  progress.textContent = `0 / ${words.length}`;
}

function updateExample() {
  const word = (exampleWord.value || 'focus').trim();
  exampleIndex.max = String(Math.max(0, word.length - 1));
  const idx = Math.min(Number(exampleIndex.value) || 0, word.length - 1);
  exampleIndex.value = String(Math.max(0, idx));
  exampleIndexLabel.textContent = exampleIndex.value;
  exampleDisplay.innerHTML = renderWord(word, Number(exampleIndex.value));
}

startBtn.addEventListener('click', start);
pauseBtn.addEventListener('click', stop);
resetBtn.addEventListener('click', reset);
pivotToggle.addEventListener('change', () => {
  updateDisplay();
  updateExample();
});

exampleWord.addEventListener('input', updateExample);
exampleIndex.addEventListener('input', updateExample);

reset();
updateExample();
