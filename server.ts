import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface FinancialInput {
  revenue: number;
  rent: number;
  salaries: number;
  ads: number;
  other: number;
  currency?: string;
}

export interface CalculatedFinancials {
  totalExpenses: number;
  profit: number;
  margin: number;
  breakEven: number;
  safetyMarginPct: number;
  safetyMarginAmount: number;
  isProfitable: boolean;
  isBreakEven: boolean;
}

// Calculate financials purely with mathematical code
export function calculateFinancials(data: FinancialInput): CalculatedFinancials {
  const revenue = Math.max(0, Number(data.revenue) || 0);
  const rent = Math.max(0, Number(data.rent) || 0);
  const salaries = Math.max(0, Number(data.salaries) || 0);
  const ads = Math.max(0, Number(data.ads) || 0);
  const other = Math.max(0, Number(data.other) || 0);

  const totalExpenses = rent + salaries + ads + other;
  const profit = revenue - totalExpenses;
  const margin = revenue > 0 ? (profit / revenue) * 100 : (profit === 0 ? 0 : -100);
  const breakEven = totalExpenses;
  const safetyMarginAmount = revenue - breakEven;
  const safetyMarginPct = revenue > 0 ? ((revenue - breakEven) / revenue) * 100 : (breakEven === 0 ? 0 : -100);

  return {
    totalExpenses,
    profit,
    margin,
    breakEven,
    safetyMarginPct,
    safetyMarginAmount,
    isProfitable: profit > 0,
    isBreakEven: profit === 0,
  };
}

// Format numbers nicely with Russian locale
function formatMoney(amount: number, currency: string = '₽'): string {
  return `${new Intl.NumberFormat('ru-RU').format(Math.round(amount))} ${currency}`;
}

const SYSTEM_INSTRUCTION = `Ты финансовый аналитик малого бизнеса. Отвечай коротко и просто, как живой человек, на «вы». Используй только цифры клиента. Ничего не выдумывай. Порядок: выпиши данные, посчитай по шагам, проверь себя, ответь. Если данных не хватает, скажи, каких именно. Формат: Вывод, Причина, Расчёт, 3 действия. Не обещай гарантированный доход. Не давай налоговых и юридических заключений.`;

// Call Gemini with automatic retry and model fallback in case of temporary 503 high demand spikes
async function generateGeminiContent(prompt: string, systemInstruction: string): Promise<string> {
  const models = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.2,
          },
        });
        if (response.text) {
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Attempt ${attempt} for model ${model} failed:`, err?.message || err);
        // Wait briefly before retry
        await new Promise((resolve) => setTimeout(resolve, 800 * attempt));
      }
    }
  }

  throw lastError || new Error('Не удалось получить ответ от модели.');
}

// API endpoint for analysis
app.post('/api/analyze', async (req, res) => {
  try {
    const { revenue, rent, salaries, ads, other, currency = '₽' } = req.body;

    // Validate presence of key input values
    if (revenue === undefined || rent === undefined || salaries === undefined || ads === undefined || other === undefined) {
      return res.status(400).json({
        error: 'Не все поля заполнены. Укажите: доход, аренду, зарплаты, рекламу и прочие расходы.',
      });
    }

    const inputData: FinancialInput = {
      revenue: Number(revenue) || 0,
      rent: Number(rent) || 0,
      salaries: Number(salaries) || 0,
      ads: Number(ads) || 0,
      other: Number(other) || 0,
      currency,
    };

    // Calculate in code! Never via AI
    const calculations = calculateFinancials(inputData);

    if (!apiKey) {
      return res.status(500).json({
        error: 'API-ключ Gemini не настроен. Проверьте переменную GEMINI_API_KEY в панели Settings > Secrets.',
        calculations,
      });
    }

    // Prepare clear prompt with explicit customer figures and exact code-calculated indicators
    const prompt = `Клиент предоставил следующие данные малого бизнеса:
- Доход: ${formatMoney(inputData.revenue, currency)}
- Аренда: ${formatMoney(inputData.rent, currency)}
- Зарплаты: ${formatMoney(inputData.salaries, currency)}
- Реклама: ${formatMoney(inputData.ads, currency)}
- Прочие расходы: ${formatMoney(inputData.other, currency)}

Точный расчёт, выполненный кодом (используй эти точные результаты):
- Общие расходы: ${formatMoney(calculations.totalExpenses, currency)} (${inputData.rent} + ${inputData.salaries} + ${inputData.ads} + ${inputData.other})
- Прибыль / Убыток: ${formatMoney(calculations.profit, currency)} (${calculations.profit >= 0 ? 'чистая прибыль' : 'чистый убыток'})
- Маржинальность (рентабельность продаж): ${calculations.margin.toFixed(1)}%
- Точка безубыточности: ${formatMoney(calculations.breakEven, currency)} (минимальный доход для покрытия всех текущих расходов)
- Запас финансовой прочности: ${formatMoney(calculations.safetyMarginAmount, currency)} (${calculations.safetyMarginPct.toFixed(1)}% от дохода)

Объясни результат простыми словами для предпринимателя. Соблюдай формат:
Вывод: ...
Причина: ...
Расчёт: ...
3 действия:
1. ...
2. ...
3. ...`;

    const explanation = await generateGeminiContent(prompt, SYSTEM_INSTRUCTION);

    return res.json({
      success: true,
      input: inputData,
      calculated: calculations,
      explanation,
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    return res.status(500).json({
      error: error.message || 'Ошибка при проведении анализа',
    });
  }
});

// Endpoint for follow-up questions regarding the current business financials
app.post('/api/ask-analyst', async (req, res) => {
  try {
    const { question, financialContext, currency = '₽' } = req.body;

    if (!question || !financialContext) {
      return res.status(400).json({ error: 'Вопрос или финансовый контекст отсутствует.' });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: 'API-ключ Gemini не настроен.',
      });
    }

    const prompt = `Контекст бизнеса клиента:
- Доход: ${formatMoney(financialContext.revenue, currency)}
- Аренда: ${formatMoney(financialContext.rent, currency)}
- Зарплаты: ${formatMoney(financialContext.salaries, currency)}
- Реклама: ${formatMoney(financialContext.ads, currency)}
- Прочие расходы: ${formatMoney(financialContext.other, currency)}
- Общие расходы: ${formatMoney(financialContext.totalExpenses, currency)}
- Прибыль: ${formatMoney(financialContext.profit, currency)}
- Маржинальность: ${Number(financialContext.margin).toFixed(1)}%
- Точка безубыточности: ${formatMoney(financialContext.breakEven, currency)}

Вопрос предпринимателя:
"${question}"

Ответь коротко, просто и по делу на «вы», опираясь исключительно на цифры клиента. Порядок: выпиши данные, посчитай по шагам, проверь себя, ответь. Если данных не хватает, скажи, каких именно. Не обещай гарантированный доход. Не давай налоговых и юридических заключений.`;

    const answer = await generateGeminiContent(prompt, SYSTEM_INSTRUCTION);

    return res.json({
      success: true,
      answer: answer || 'Ответ не получен.',
    });
  } catch (err: any) {
    console.error('Follow-up error:', err);
    return res.status(500).json({ error: err.message || 'Ошибка обработки вопроса' });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(apiKey) });
});

// Explicit manifest route for PWA installability across all browsers
app.get(['/manifest.webmanifest', '/manifest.json'], (_req, res) => {
  res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
  const manifestPath = path.resolve(__dirname, 'public', 'manifest.json');
  res.sendFile(manifestPath);
});

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        port: 3000,
        host: '0.0.0.0',
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
