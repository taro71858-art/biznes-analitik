import React, { useState } from 'react';
import { CalculatedFinancials, FinancialValues } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  PieChart, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck,
  Calculator
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/finance';

interface CalculatedMetricsProps {
  metrics: CalculatedFinancials;
  input: FinancialValues;
  currency: string;
}

export const CalculatedMetrics: React.FC<CalculatedMetricsProps> = ({
  metrics,
  input,
  currency,
}) => {
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  const {
    totalExpenses,
    profit,
    margin,
    breakEven,
    safetyMarginPct,
    safetyMarginAmount,
    isProfitable,
    isBreakEven,
    expenseShares,
  } = metrics;

  // Margin status label and color
  let marginStatus = { text: 'Убыточная', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
  if (margin > 25) {
    marginStatus = { text: 'Высокая (>25%)', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
  } else if (margin >= 15) {
    marginStatus = { text: 'Хорошая (15-25%)', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' };
  } else if (margin > 0) {
    marginStatus = { text: 'Низкая (0-15%)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
  } else if (isBreakEven) {
    marginStatus = { text: 'В ноль (0%)', color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' };
  }

  // Calculate percentage of revenue relative to break-even
  const breakEvenCoverage = breakEven > 0 ? (input.revenue / breakEven) * 100 : 100;
  const breakEvenProgressClamped = Math.min(100, Math.max(0, breakEvenCoverage));

  return (
    <div className="space-y-3">
      {/* Header with Code Calculation Guarantee */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <Calculator className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-slate-200">
            Результаты расчёта кодом
          </h2>
        </div>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/80 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Формулы JavaScript
        </span>
      </div>

      {/* 3 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* 1. Profit / Loss */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isProfitable
            ? 'bg-gradient-to-b from-emerald-950/40 to-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-950/30'
            : isBreakEven
            ? 'bg-slate-900/90 border-slate-700'
            : 'bg-gradient-to-b from-rose-950/40 to-slate-900/90 border-rose-500/40 shadow-lg shadow-rose-950/30'
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isProfitable ? 'Чистая прибыль' : isBreakEven ? 'Результат' : 'Чистый убыток'}
            </span>
            <span className={`p-1 rounded-lg ${
              isProfitable 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : isBreakEven
                ? 'bg-slate-700 text-slate-300'
                : 'bg-rose-500/20 text-rose-400'
            }`}>
              {isProfitable ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            </span>
          </div>

          <div className={`text-2xl font-bold font-mono-numbers tracking-tight ${
            isProfitable ? 'text-emerald-400' : isBreakEven ? 'text-slate-200' : 'text-rose-400'
          }`}>
            {formatCurrency(profit, currency)}
          </div>

          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Доход: {formatCurrency(input.revenue, currency)}</span>
            <span>Расх: {formatCurrency(totalExpenses, currency)}</span>
          </div>
        </div>

        {/* 2. Margin (Рентабельность) */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Маржинальность
            </span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${marginStatus.color}`}>
              {marginStatus.text}
            </span>
          </div>

          <div className={`text-2xl font-bold font-mono-numbers tracking-tight ${
            margin > 0 ? 'text-white' : 'text-rose-400'
          }`}>
            {input.revenue > 0 ? `${margin.toFixed(1)}%` : '—'}
          </div>

          <div className="text-[11px] text-slate-400 mt-1">
            {input.revenue > 0 
              ? `Прибыль с каждого ${currency}: ${(margin / 100).toFixed(2)} ${currency}`
              : 'Укажите доход для расчёта'}
          </div>
        </div>

        {/* 3. Break-Even Point (Точка безубыточности) */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Безубыточность
            </span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="text-2xl font-bold font-mono-numbers tracking-tight text-white">
            {formatCurrency(breakEven, currency)}
          </div>

          <div className="text-[11px] mt-1 flex items-center justify-between">
            <span className="text-slate-400">
              {safetyMarginAmount >= 0 ? 'Запас прочности:' : 'Дефицит оборота:'}
            </span>
            <span className={`font-semibold font-mono-numbers ${
              safetyMarginAmount >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {safetyMarginAmount >= 0 ? '+' : ''}{formatCurrency(safetyMarginAmount, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Break-Even Progress Gauge */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <span>Отношение выручки к точке окупаемости</span>
          </div>
          <span className={`font-mono-numbers font-bold ${
            breakEvenCoverage >= 100 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {breakEvenCoverage.toFixed(0)}%
          </span>
        </div>

        {/* Bar */}
        <div className="relative h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              breakEvenCoverage >= 100
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : 'bg-gradient-to-r from-rose-500 to-amber-500'
            }`}
            style={{ width: `${breakEvenProgressClamped}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
          <span>0 {currency}</span>
          <span className="font-semibold text-cyan-400">
            Порог окупаемости: {formatCurrency(breakEven, currency)}
          </span>
          <span className="font-semibold text-slate-200">
            Выручка: {formatCurrency(input.revenue, currency)}
          </span>
        </div>
      </div>

      {/* Expense Structure */}
      {totalExpenses > 0 && (
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-2.5">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <PieChart className="w-3.5 h-3.5 text-indigo-400" />
              <span>Структура расходов (всего {formatCurrency(totalExpenses, currency)})</span>
            </span>
          </div>

          {/* Multi-segment bar */}
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
            {input.rent > 0 && (
              <div
                style={{ width: `${expenseShares.rentPct}%` }}
                className="bg-blue-500 h-full transition-all"
                title={`Аренда: ${formatCurrency(input.rent, currency)} (${expenseShares.rentPct.toFixed(1)}%)`}
              />
            )}
            {input.salaries > 0 && (
              <div
                style={{ width: `${expenseShares.salariesPct}%` }}
                className="bg-indigo-500 h-full transition-all"
                title={`Зарплаты: ${formatCurrency(input.salaries, currency)} (${expenseShares.salariesPct.toFixed(1)}%)`}
              />
            )}
            {input.ads > 0 && (
              <div
                style={{ width: `${expenseShares.adsPct}%` }}
                className="bg-amber-500 h-full transition-all"
                title={`Реклама: ${formatCurrency(input.ads, currency)} (${expenseShares.adsPct.toFixed(1)}%)`}
              />
            )}
            {input.other > 0 && (
              <div
                style={{ width: `${expenseShares.otherPct}%` }}
                className="bg-rose-500 h-full transition-all"
                title={`Прочие: ${formatCurrency(input.other, currency)} (${expenseShares.otherPct.toFixed(1)}%)`}
              />
            )}
          </div>

          {/* Badges breakdown */}
          <div className="grid grid-cols-2 xs:grid-cols-4 gap-2 mt-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
              <div className="truncate">
                <span className="text-slate-400">Аренда: </span>
                <span className="font-mono-numbers font-semibold">{expenseShares.rentPct.toFixed(0)}%</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
              <div className="truncate">
                <span className="text-slate-400">ФОТ: </span>
                <span className="font-mono-numbers font-semibold">{expenseShares.salariesPct.toFixed(0)}%</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              <div className="truncate">
                <span className="text-slate-400">Реклама: </span>
                <span className="font-mono-numbers font-semibold">{expenseShares.adsPct.toFixed(0)}%</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
              <div className="truncate">
                <span className="text-slate-400">Прочие: </span>
                <span className="font-mono-numbers font-semibold">{expenseShares.otherPct.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulas Accordion */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowFormulaDetails(!showFormulaDetails)}
          className="w-full px-4 py-3 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Проверить формулы и математику</span>
          </span>
          {showFormulaDetails ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showFormulaDetails && (
          <div className="px-4 pb-4 pt-1 space-y-2.5 text-xs text-slate-300 border-t border-slate-800/80 font-mono-numbers">
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="font-bold text-slate-400 text-[11px] uppercase">
                1. Сумма расходов
              </div>
              <div className="text-slate-200 mt-1">
                {input.rent} (аренда) + {input.salaries} (ФОТ) + {input.ads} (реклама) + {input.other} (прочие) = <span className="font-bold text-white">{totalExpenses} {currency}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="font-bold text-slate-400 text-[11px] uppercase">
                2. Прибыль / Убыток
              </div>
              <div className="text-slate-200 mt-1">
                {input.revenue} (доход) − {totalExpenses} (расходы) = <span className={`font-bold ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>{profit} {currency}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="font-bold text-slate-400 text-[11px] uppercase">
                3. Маржинальность продаж
              </div>
              <div className="text-slate-200 mt-1">
                ({profit} / {input.revenue || 1}) × 100% = <span className="font-bold text-white">{margin.toFixed(2)}%</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="font-bold text-slate-400 text-[11px] uppercase">
                4. Точка безубыточности
              </div>
              <div className="text-slate-200 mt-1">
                Минимальный доход = сумме постоянных расходов = <span className="font-bold text-cyan-400">{breakEven} {currency}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
