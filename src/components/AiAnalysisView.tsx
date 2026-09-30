import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Copy, 
  Check, 
  Send, 
  MessageSquare, 
  Loader2, 
  ArrowRight,
  Info,
  ListOrdered
} from 'lucide-react';
import { parseAiAnalysis } from '../utils/finance';
import { FinancialValues, CalculatedFinancials } from '../types';

interface AiAnalysisViewProps {
  explanationText: string;
  financialContext: FinancialValues & CalculatedFinancials;
  currency: string;
}

export const AiAnalysisView: React.FC<AiAnalysisViewProps> = ({
  explanationText,
  financialContext,
  currency,
}) => {
  const [copied, setCopied] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [followUpAnswer, setFollowUpAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [askError, setAskError] = useState<string | null>(null);

  const parsed = parseAiAnalysis(explanationText);

  const handleCopy = () => {
    navigator.clipboard.writeText(explanationText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAskQuestion = async (qText?: string) => {
    const questionToSend = qText || followUpQuestion;
    if (!questionToSend.trim()) return;

    setIsAsking(true);
    setAskError(null);

    try {
      const res = await fetch('/api/ask-analyst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionToSend,
          financialContext,
          currency,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Ошибка при ответе на вопрос');
      }

      setFollowUpAnswer(data.answer);
      setFollowUpQuestion('');
    } catch (err: any) {
      setAskError(err.message || 'Не удалось получить ответ');
    } finally {
      setIsAsking(false);
    }
  };

  const suggestedQuestions = [
    'Что если снизить аренду на 15%?',
    'Как повысить маржинальность до 20%?',
    'Окупается ли текущая реклама?',
  ];

  return (
    <div className="space-y-4 pt-2">
      {/* Top Banner with Copy Button */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-200">
              Разбор финансового аналитика
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg transition-all active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Скопировано</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Копировать</span>
            </>
          )}
        </button>
      </div>

      {/* Structured Sections */}
      <div className="space-y-3">
        {/* 1. Вывод */}
        {parsed.conclusion && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-lg">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Вывод</span>
            </div>
            <p className="text-sm font-medium text-slate-100 leading-relaxed whitespace-pre-line">
              {parsed.conclusion}
            </p>
          </div>
        )}

        {/* 2. Причина */}
        {parsed.reason && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Причина</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {parsed.reason}
            </p>
          </div>
        )}

        {/* 3. Расчёт */}
        {parsed.calculation && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="text-base leading-none">🧮</span>
              <span>Расчёт</span>
            </div>
            <p className="text-sm text-slate-300 font-mono-numbers leading-relaxed whitespace-pre-line bg-slate-950/60 p-3 rounded-xl border border-slate-850">
              {parsed.calculation}
            </p>
          </div>
        )}

        {/* 4. 3 Действия */}
        {parsed.actions.length > 0 && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-2.5">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <ListOrdered className="w-3.5 h-3.5" />
              <span>3 действия для предпринимателя</span>
            </div>

            <div className="space-y-2 pt-1">
              {parsed.actions.map((act, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-snug">
                    {act}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* If for some reason structured fields were not matched, render clean raw text */}
        {!parsed.conclusion && !parsed.reason && !parsed.calculation && parsed.actions.length === 0 && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-slate-200 whitespace-pre-line leading-relaxed">
            {explanationText}
          </div>
        )}
      </div>

      {/* Follow-up question module */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Уточнить у финансового аналитика
          </h3>
        </div>

        {/* Suggested pills */}
        <div className="flex flex-wrap gap-1.5">
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleAskQuestion(q)}
              disabled={isAsking}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700/60 active:scale-95 transition-all text-left"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Спросить: например, что будет при росте рекламы на 30%..."
            value={followUpQuestion}
            onChange={(e) => setFollowUpQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAskQuestion();
              }
            }}
            disabled={isAsking}
            className="flex-1 h-11 bg-slate-950 border border-slate-800 rounded-xl px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
          />
          <button
            type="button"
            onClick={() => handleAskQuestion()}
            disabled={isAsking || !followUpQuestion.trim()}
            className="w-11 h-11 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:pointer-events-none text-white flex items-center justify-center shrink-0 transition-all active:scale-95 shadow-md shadow-emerald-950"
          >
            {isAsking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>

        {askError && (
          <div className="text-xs text-rose-400 bg-rose-950/30 p-2.5 rounded-lg border border-rose-900/50">
            {askError}
          </div>
        )}

        {/* Follow-up answer view */}
        {followUpAnswer && (
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-emerald-500/30 text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed">
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
              Ответ аналитика:
            </div>
            {followUpAnswer}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-[11px] text-slate-400">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p>
          Аналитика основана исключительно на ваших цифрах. Сервис не даёт гарантий доходности, а также налоговых и юридических заключений.
        </p>
      </div>
    </div>
  );
};
