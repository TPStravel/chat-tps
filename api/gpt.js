export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { message } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Chave da OpenAI não configurada' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Você é um assistente de viagem amigável.' },
          { role: 'user', content: message }
        ],
        max_tokens: 100,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Erro na resposta da OpenAI';
    res.status(200).json({ reply });

  } catch (err) {
    res.status(500).json({ error: 'Erro ao conectar com OpenAI', details: err.message });
  }
}
