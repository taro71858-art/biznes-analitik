import React, { useState, useMemo, useRef } from 'react';
import { FinancialValues, PresetScenario } from './types';
import { calculateFinancialMetrics } from './utils/finance';
import { Header } from './components/Header';
import { FinancialInputForm } from './components/FinancialInputForm';
import { CalculatedMetrics } from './components/CalculatedMetrics';
import { AiAnalysisView } from './components/AiAnalysisView';
import { PresetsModal } from './components/PresetsModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { AlertCircle, RefreshCw } from 'lucide-react';

const INITIAL_VALUES: FinancialValues = {
  revenue: 550000,
  rent: 90000,
  salaries: 160000,
  ads: 45000,
  other: 55000,
};

export default function App() {
  const [values, setValues] = useState<FinancialValues>(INITIAL_VALUES);
  const [currency, setCurrency] = useState<string>('₽');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isPresetsOpen, setIsPresetsOpen] = useState<boolean>(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Pure code calculation of all financial metrics (real-time reactive)
  const calculatedMetrics = useMemo(() => {
    return calculateFinancialMetrics(values);
  }, [values]);

  const handleFieldChange = (field: keyof FinancialValues, value: number) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setValues({
      revenue: 0,
      rent: 0,
      salaries: 0,
      ads: 0,
      other: 0,
    });
    setAiExplanation(null);
    setError(null);
  };

  const handleSelectPreset = (preset: PresetScenario) => {
    setValues(preset.values);
    setAiExplanation(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          currency,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Не удалось выполнить анализ');
      }

      setAiExplanation(data.explanation);

      // Smooth scroll down to analysis on mobile
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Произошла непредвиденная ошибка при обращении к аналитику.');
    } finally {
      setIsLoading(false);
    }
  };

  const hasEnteredAnyData = Object.values(values).some((v) => v > 0);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      {/* Sticky Mobile Header */}
      <Header
        currency={currency}
        onCurrencyChange={setCurrency}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onReset={handleReset}
        hasValues={hasEnteredAnyData}
      />

      <main className="flex-1 w-full max-w-md mx-auto px-4 py-4 space-y-4">
        {/* PWA Install Banner */}
        <PWAInstallBanner />

        {/* Main Form: Revenue, Rent, Salaries, Ads, Other + Analyze button */}
        <section className="bg-slate-900/40 p-4 rounded-3xl border border-slate-800/80 shadow-xl">
          <FinancialInputForm
            values={values}
            onChange={handleFieldChange}
            onSubmit={handleAnalyze}
            isLoading={isLoading}
            currency={currency}
          />
        </section>

        {/* Error notification */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-3 text-rose-200 text-xs">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{error}</p>
              <button
                onClick={handleAnalyze}
                className="mt-2 text-rose-300 underline font-medium hover:text-white flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Попробовать снова
              </button>
            </div>
          </div>
        )}

        {/* Code-Calculated Metrics (always available, calculated purely by formulas) */}
        {hasEnteredAnyData && (
          <section ref={resultsRef} className="pt-1">
            <CalculatedMetrics
              metrics={calculatedMetrics}
              input={values}
              currency={currency}
            />
          </section>
        )}

        {/* Gemini AI Detailed Explanation */}
        {aiExplanation && (
          <section className="pt-1">
            <AiAnalysisView
              explanationText={aiExplanation}
              financialContext={{
                ...values,
                ...calculatedMetrics,
              }}
              currency={currency}
            />
          </section>
        )}

        {/* Bottom hint when no AI analysis yet */}
        {!aiExplanation && !isLoading && hasEnteredAnyData && (
          <div className="text-center p-4 rounded-2xl bg-slate-900/30 border border-dashed border-slate-800 text-xs text-slate-400">
            Нажмите кнопку <strong className="text-emerald-400">«Анализ»</strong> выше, чтобы Gemini объяснил эти цифры простыми словами в формате «Вывод, Причина, Расчёт, 3 действия».
          </div>
        )}
      </main>

      {/* Presets Modal */}
      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelect={handleSelectPreset}
        currency={currency}
      />

      {/* Offline Status Indicator */}
      <OfflineIndicator />
    </div>
  );
}
