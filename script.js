const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
const calcButton = document.querySelector('#calculate');
calcButton.addEventListener('click', () => {
  const a = Number(document.querySelector('#num-a').value);
  const b = Number(document.querySelector('#num-b').value);
  const result = document.querySelector('#calc-result');
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b < 1) {
    result.textContent = 'Екі оң бүтін сан енгізіңіз.';
    return;
  }
  const common = gcd(a, b);
  result.innerHTML = `<span>ЕҮОБ (${a}, ${b}) = <b>${common}</b> &nbsp; · &nbsp; ЕКОЕ = <b>${(a / common) * b}</b></span>`;
});

const reviews = [
  { text: 'Алдымен қазіргі деңгейің мен мақсатыңды анықтаймыз. Бұл қадам сабақ жоспарын саған дәл бейімдеуге көмектеседі.', name: 'Деңгейді анықтау', detail: 'Алғашқы кеңес · 15 минут', avatar: '01' },
  { text: 'Тақырыпты шағын бөліктерге бөлеміз. Әр жаңа ұғымды мысалмен түсіндіріп, сұрақтарыңа бірге жауап іздейміз.', name: 'Түсіну және үйрену', detail: 'Жеке қарқын · нақты мысалдар', avatar: '02' },
  { text: 'Есептерді өз бетіңше шығарып көресің. Қателерді талдап, келесі аптаға нақты оқу мақсатын белгілейміз.', name: 'Бекіту және ілгерілеу', detail: 'Практика · кері байланыс', avatar: '03' },
];
let reviewIndex = 0;
function showReview(index) {
  reviewIndex = (index + reviews.length) % reviews.length;
  const review = reviews[reviewIndex];
  document.querySelector('#review-text').textContent = review.text;
  document.querySelector('#review-name').textContent = review.name;
  document.querySelector('#review-detail').textContent = review.detail;
  document.querySelector('#review-avatar').textContent = review.avatar;
  document.querySelector('#review-step').textContent = String(reviewIndex + 1);
  document.querySelector('#review-count').textContent = `0${reviewIndex + 1} / 0${reviews.length}`;
}
document.querySelector('#prev-review').addEventListener('click', () => showReview(reviewIndex - 1));
document.querySelector('#next-review').addEventListener('click', () => showReview(reviewIndex + 1));

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  nav.classList.toggle('open', !expanded);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

const slider = document.querySelector('#x-slider');
function updateGraph() {
  const x = Number(slider.value);
  const y = x * x - 4 * x + 3;
  document.querySelector('#x-value').textContent = x.toFixed(1);
  document.querySelector('#fx-value').textContent = Number.isInteger(y) ? String(y).replace('-', '−') : y.toFixed(1).replace('-', '−');
  const point = document.querySelector('#graph-point');
  point.setAttribute('cx', String(120 + x * 40));
  point.setAttribute('cy', String(110 - y * 30));
}
slider.addEventListener('input', updateGraph);
updateGraph();

const questions = [
  { prompt: 'Параболаның ең төменгі нүктесі қайсы?', options: ['(2; −1)', '(−1; 2)', '(2; 1)'], answer: 0, hint: 'f(x) = (x − 2)² − 1 түріне қара: квадрат нөл болғанда y = −1.' },
  { prompt: 'График x осін қай нүктелерде қияды?', options: ['x = −1 және x = 3', 'x = 1 және x = 3', 'x = 1 және x = −3'], answer: 1, hint: 'x осінде y = 0. Графикте түбірлер x = 1 және x = 3.' },
  { prompt: 'x = 0 болғанда f(x) нешеге тең?', options: ['−1', '0', '3'], answer: 2, hint: 'x = 0 деп қойып көр: 0² − 4·0 + 3 = ?' },
];
let questionIndex = 0;
let completedQuestions = new Set();
let answered = false;
const quizContent = document.querySelector('#quiz-content');
const quizFeedback = document.querySelector('#quiz-feedback');
const quizButton = document.querySelector('#quiz-submit');
function renderQuestion() {
  const q = questions[questionIndex];
  answered = false;
  document.querySelector('#quiz-number').textContent = `${questionIndex + 1} / ${questions.length}`;
  document.querySelector('#quiz-bar').style.width = `${(questionIndex / questions.length) * 100}%`;
  quizFeedback.textContent = '';
  quizFeedback.className = 'quiz-feedback';
  quizButton.innerHTML = 'Жауапты тексеру <span>→</span>';
  quizContent.innerHTML = `<h3 class="quiz-question">${q.prompt}</h3><div class="quiz-options">${q.options.map((option, i) => `<label class="quiz-option"><input type="radio" name="lesson-answer" value="${i}"><span>${option}</span></label>`).join('')}</div>`;
}
quizButton.addEventListener('click', () => {
  if (answered) {
    if (questionIndex < questions.length - 1) {
      questionIndex += 1;
      renderQuestion();
    } else {
      quizContent.innerHTML = '<div class="quiz-finish">✳<h3>Сабақ тәмам!</h3><p>Параболаның төбесін және түбірін ажырата аласың. Енді басқа есепке қолданып көр.</p></div>';
      quizFeedback.textContent = 'Төмендегі калькулятор мен келесі материалдар да дайын.';
      quizButton.hidden = true;
      document.querySelector('#quiz-reset').textContent = 'Қайта өту';
      document.querySelector('#quiz-number').textContent = '3 / 3';
      document.querySelector('#quiz-bar').style.width = '100%';
    }
    return;
  }
  const selected = quizContent.querySelector('input[name="lesson-answer"]:checked');
  if (!selected) {
    quizFeedback.textContent = 'Алдымен бір жауапты таңда.';
    quizFeedback.classList.add('error');
    return;
  }
  const q = questions[questionIndex];
  answered = true;
  completedQuestions.add(questionIndex);
  document.querySelector('#lesson-progress-label').textContent = `${completedQuestions.size} / 3 тапсырма`;
  document.querySelector('#lesson-progress-bar').style.width = `${completedQuestions.size / 3 * 100}%`;
  const right = Number(selected.value) === q.answer;
  quizContent.querySelectorAll('.quiz-option').forEach((label, i) => {
    if (i === q.answer) label.classList.add('is-correct');
    else if (i === Number(selected.value)) label.classList.add('is-wrong');
    label.querySelector('input').disabled = true;
  });
  quizFeedback.textContent = right ? 'Дұрыс! ' + q.hint : 'Тағы бір қарап көр. ' + q.hint;
  quizFeedback.classList.toggle('error', !right);
  quizButton.innerHTML = questionIndex < questions.length - 1 ? 'Келесі тапсырма <span>→</span>' : 'Нәтижені көру <span>→</span>';
});
document.querySelector('#quiz-reset').addEventListener('click', () => {
  questionIndex = 0;
  completedQuestions = new Set();
  quizButton.hidden = false;
  document.querySelector('#lesson-progress-label').textContent = '0 / 3 тапсырма';
  document.querySelector('#lesson-progress-bar').style.width = '0%';
  renderQuestion();
});
renderQuestion();

const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const chatMessages = document.querySelector('#chat-messages');
const chatStatus = document.querySelector('#chat-status');
const chatHistory = [];
function addChatBubble(role, message, label, extraClass = '') {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${role} ${extraClass}`.trim();
  const name = document.createElement('span');
  name.textContent = label;
  const text = document.createElement('p');
  text.textContent = message;
  bubble.append(name, text);
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return bubble;
}
async function askTutor(message) {
  if (!message || chatForm.querySelector('button').disabled) return;
  addChatBubble('user', message, 'Сен');
  chatHistory.push({ role: 'user', content: message });
  const button = chatForm.querySelector('button');
  const suggestionButtons = document.querySelectorAll('.chat-suggestions button');
  button.disabled = true;
  chatInput.disabled = true;
  suggestionButtons.forEach(item => { item.disabled = true; });
  chatStatus.textContent = 'Көмекші ойланып жатыр…';
  const waiting = addChatBubble('assistant', 'Сұрағыңды қарап жатырмын…', 'Көмекші', 'thinking');
  try {
    const response = await fetch('/api/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatHistory.slice(-12) }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Көмекшіге әзірше қосылу мүмкін болмады.');
    waiting.remove();
    const reply = data.reply || 'Жауап дайындау мүмкін болмады. Сұрағыңды басқаша жазып көр.';
    chatHistory.push({ role: 'assistant', content: reply });
    addChatBubble('assistant', reply, 'Көмекші');
    chatStatus.textContent = `${chatInput.maxLength} таңбаға дейін`;
  } catch (error) {
    waiting.remove();
    addChatBubble('assistant', error.message.includes('Failed to fetch') ? 'Бұл беттің ИИ бөлігі сервер арқылы жұмыс істейді. Сайтты Vercel сияқты қызметке жариялап, API кілтін сервер баптауына қосу керек.' : error.message, 'Көмекші');
    chatStatus.textContent = 'Қосылымды тексеріп, қайта көр.';
  } finally {
    button.disabled = false;
    chatInput.disabled = false;
    suggestionButtons.forEach(item => { item.disabled = false; });
    chatInput.focus();
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}
chatForm.addEventListener('submit', event => {
  event.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;
  chatInput.value = '';
  askTutor(message);
});
chatInput.addEventListener('input', () => {
  chatInput.style.height = 'auto';
  chatInput.style.height = `${Math.min(chatInput.scrollHeight, 88)}px`;
});
document.querySelectorAll('.chat-suggestions button').forEach(button => {
  button.addEventListener('click', () => askTutor(button.dataset.prompt));
});
document.querySelector('#clear-chat').addEventListener('click', () => {
  chatHistory.length = 0;
  chatMessages.innerHTML = '';
  addChatBubble('assistant', 'Сәлем! Қай есепке тоқтап қалдың? Есептің шартын жібер немесе төменнен тақырып таңда. Бірге қадамдап талдаймыз 🙂', 'Көмекші');
  chatStatus.textContent = `${chatInput.maxLength} таңбаға дейін`;
});

document.querySelector('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = form.elements.name.value.trim();
  const message = document.querySelector('#form-message');
  message.textContent = `Рақмет, ${name}! Сұранысың дайын. Мұғалім байланыс дерегің арқылы хабарласады.`;
  message.classList.add('success');
  form.querySelector('button').textContent = 'Сұраныс қабылданды ✓';
});

