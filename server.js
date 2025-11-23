import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Inicializa o cliente Gemini usando a API Key do .env
const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Função helper para montar um prompt único (simples) com histórico
function montarPrompt(systemPrompt, history = [], userMessage) {
  let texto = `${systemPrompt}\n\n`;

  history.forEach(msg => {
    if (msg.role === 'user') {
      texto += `Usuário: ${msg.content}\n`;
    } else if (msg.role === 'assistant') {
      texto += `IA: ${msg.content}\n`;
    }
  });

  texto += `Usuário: ${userMessage}\nIA:`;
  return texto;
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    const systemPrompt = `
Você é um assistente de IA que responde em português do Brasil.
Explique de forma clara, objetiva e, quando possível, em passos.
Se o usuário perguntar algo de programação ou roblox, ajude de forma didática.
`.trim();

    const prompt = montarPrompt(systemPrompt, history || [], message);

    // Chamada pro modelo Gemini (modelo rápido e barato)
    const response = await genai.models.generateContent({
      model: 'gemini-2.5-flash', // modelo novo e rápido :contentReference[oaicite:4]{index=4}
      contents: prompt
    });

    const reply = response.text;

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao chamar o Gemini.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
