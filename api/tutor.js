module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Тек сұрақ жіберуге болады.' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'ИИ қызметінің кілті серверге әлі қосылмаған.' });
  }

  const messages = req.body?.messages;
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > 12) {
    return res.status(400).json({ error: 'Сұрақтар тізімі жарамсыз. Бетті жаңартып көр.' });
  }

  const input = [];
  for (const message of messages) {
    if (!message || !['user', 'assistant'].includes(message.role) || typeof message.content !== 'string') {
      return res.status(400).json({ error: 'Хабарлама пішімі жарамсыз.' });
    }
    const content = message.content.trim();
    if (!content || content.length > 1000) {
      return res.status(400).json({ error: 'Әр хабарлама 1–1000 таңба аралығында болуы керек.' });
    }
    input.push({ role: message.role, content });
  }

  try {
    const upstream = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        instructions: [
          'Сен Қазақстандағы 5–11 сынып оқушыларына көмектесетін әдепті, шыдамды математика мұғалімісің.',
          'Қазақша жауап бер. Оқушы басқа тілде сұраса, сол тілде жауап беруге болады.',
          'Математика есебін түсінікті шағын қадамдарға бөліп шығар. Формуланы жазып, сандарды орнына қойып, жауабын тексер.',
          'Оқушы тек дайын жауапты сұраса да, қысқа түсіндірмені бірге бер. Алдымен ойландыратын шағын ишара ұсын, қажет болса толық шешімін көрсет.',
          'Тақырып математикаға қатыссыз болса, қысқаша жауап беріп, математикаға көмектесуге орал.',
          'Жеке деректерді сұрама. Белгісіз немесе екіұшты есептің шартын нақтылап сұра. Оқушыны кемсітпе, қателікті үйрену мүмкіндігі деп түсіндір.',
        ].join(' '),
        input,
        max_output_tokens: 600,
        store: false,
      }),
      signal: AbortSignal.timeout(30000),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      console.error('OpenAI Responses API error:', upstream.status, data.error?.type || 'unknown');
      const status = upstream.status === 429 ? 503 : 502;
      return res.status(status).json({
        error: upstream.status === 429
          ? 'Көмекшіге сұрақ көп түсті немесе API шегі аяқталды. Сәлден соң қайталап көр.'
          : 'Көмекші қазір жауап бере алмады. Біраздан соң қайталап көр.',
      });
    }

    const reply = (data.output || [])
      .flatMap(item => item.content || [])
      .filter(item => item.type === 'output_text')
      .map(item => item.text)
      .join('\n')
      .trim();

    if (!reply) return res.status(502).json({ error: 'Жауап бос келді. Сұрағыңды тағы бір рет жібер.' });
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Tutor request failed:', error.name || 'Error');
    return res.status(502).json({ error: 'Көмекшіге қосылу қиындады. Байланысты тексеріп, қайта көр.' });
  }
};

