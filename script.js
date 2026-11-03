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
const aiStartButton = document.querySelector('#ai-start-button');
const aiEngineState = document.querySelector('#ai-engine-state');
const chatSendButton = chatForm.querySelector('button');
const chatSuggestions = [...document.querySelectorAll('.chat-suggestions button')];
let localEngine = null;
let modelWorker = null;
let engineLoading = false;
function setEngineState(message, ready = false) {
  aiEngineState.lastChild.textContent = ` ${message}`;
  aiEngineState.classList.toggle('ready', ready);
}
async function startLocalAI() {
  if (localEngine || engineLoading) return;
  if (!navigator.gpu) {
    setEngineState('Бұл браузерде WebGPU жоқ');
    chatStatus.textContent = 'Соңғы Google Chrome қолданып, браузер баптауынан графикалық үдетуді қос.';
    addChatBubble('assistant', 'Бұл құрылғы не браузер WebGPU қолдамайды. Соңғы Chrome нұсқасын ашып, графикалық үдетуді қосып көр. Кейбір құрылғыларда бұл модель жұмыс істемеуі мүмкін.', 'Жүйе');
    return;
  }
  engineLoading = true;
  aiStartButton.disabled = true;
  aiStartButton.textContent = 'Жүктелуде…';
  setEngineState('Браузерге модель жүктеліп жатыр');
  chatStatus.textContent = 'Алғашқы жүктеу біраз уақыт алады. Осы бетті жаппай күте тұр.';
  try {
    const webllm = await import('https://esm.run/@mlc-ai/web-llm@0.2.87');
    modelWorker = new Worker(new URL('./webllm-worker.js', document.baseURI), { type: 'module' });
    localEngine = await webllm.CreateWebWorkerMLCEngine(
      modelWorker,
      'Qwen2.5-Math-1.5B-Instruct-q4f16_1-MLC',
      {
        initProgressCallback: report => {
          const progressText = report?.text || 'Модель жүктеліп жатыр…';
          chatStatus.textContent = progressText;
          setEngineState(progressText.slice(0, 58));
        },
      },
      { context_window_size: 4096 },
    );
    setEngineState('Жұмысқа дайын', true);
    aiStartButton.textContent = 'ИИ қосылды ✓';
    aiStartButton.classList.add('is-ready');
    chatInput.disabled = false;
    chatInput.placeholder = 'Есебіңді немесе сұрағыңды жаз…';
    chatSendButton.disabled = false;
    chatSuggestions.forEach(button => { button.disabled = false; });
    chatStatus.textContent = 'Модель осы браузерде жұмыс істейді; есептер серверге жіберілмейді.';
  } catch (error) {
    localEngine = null;
    modelWorker?.terminate();
    modelWorker = null;
    setEngineState('Қосу сәтсіз аяқталды');
    aiStartButton.disabled = false;
    aiStartButton.textContent = 'Қайта жүктеу ↻';
    chatStatus.textContent = 'Интернетті, бос жадты және браузердің WebGPU қолдауын тексеріп, қайта байқап көр.';
    addChatBubble('assistant', 'Модель жүктелмеді. Интернет байланысын, браузердің WebGPU қолдауын және құрылғыдағы бос жадты тексеріп, қайта қосып көр.', 'Жүйе');
  } finally {
    engineLoading = false;
  }
}
aiStartButton.addEventListener('click', startLocalAI);
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
  if (!message || chatSendButton.disabled || !localEngine) return;
  addChatBubble('user', message, 'Сен');
  chatHistory.push({ role: 'user', content: message });
  chatSendButton.disabled = true;
  chatInput.disabled = true;
  chatSuggestions.forEach(item => { item.disabled = true; });
  chatStatus.textContent = 'Көмекші ойланып жатыр…';
  const waiting = addChatBubble('assistant', 'Сұрағыңды қарап жатырмын…', 'Көмекші', 'thinking');
  try {
    const response = await localEngine.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Сен Қазақстандағы 5–11 сынып оқушыларына көмектесетін әдепті, шыдамды математика мұғалімісің. Әдетте қазақша жауап бер. Есепті түсінікті шағын қадамдарға бөліп шығар: формуланы жаз, мәндерді қойып, жауабын тексер. Алдымен қысқа ишара беріп, оқушы сұраса толық шешімін түсіндір. Қате болса, байыппен түзет. Белгісіз шартты нақтылап сұра. Жеке дерек сұрама. Математикаға қатыссыз ұзақ әңгімеге оралмай, математикаға көмектес.',
        },
        ...chatHistory.slice(-10),
      ],
      max_tokens: 420,
      temperature: 0.35,
    });
    waiting.remove();
    const reply = response.choices?.[0]?.message?.content || 'Жауап дайындау мүмкін болмады. Сұрағыңды басқаша жазып көр.';
    chatHistory.push({ role: 'assistant', content: reply });
    addChatBubble('assistant', reply, 'Көмекші');
    chatStatus.textContent = `${chatInput.maxLength} таңбаға дейін`;
  } catch {
    waiting.remove();
    addChatBubble('assistant', 'Жауап дайындау кезінде қате болды. Бетті жаңартып, ИИ-ді қайта жүктеп көр.', 'Көмекші');
    chatStatus.textContent = 'Жүктелген модельді қайта қосып көр.';
  } finally {
    chatSendButton.disabled = false;
    chatInput.disabled = false;
    chatSuggestions.forEach(item => { item.disabled = false; });
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
chatSuggestions.forEach(button => {
  button.addEventListener('click', () => askTutor(button.dataset.prompt));
});
document.querySelector('#clear-chat').addEventListener('click', () => {
  chatHistory.length = 0;
  chatMessages.innerHTML = '';
  addChatBubble('assistant', localEngine ? 'Әңгіме тазартылды. Келесі есепті жібере бер!' : 'Сәлем! Алдымен «ИИ-ді қосу» батырмасын басып, модельді жүктеп ал.', 'Көмекші');
  chatStatus.textContent = localEngine ? 'Модель осы браузерде іске қосулы.' : 'Алғашқы қосқанда модель жүктеледі.';
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

