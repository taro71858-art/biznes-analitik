import React, { useState } from 'react';
import { FinancialValues } from '../types';
import { 
  TrendingUp, 
  Home, 
  Users, 
  Megaphone, 
  Layers, 
  Play, 
  Loader2, 
  Plus, 
  Minus,
  Sparkles
} from 'lucide-react';
import { formatCurrency } from '../utils/finance';

interface FinancialInputFormProps {
  values: FinancialValues;
  onChange: (field: keyof FinancialValues, value: number) => void;
  onSubmit: () => void;
  isLoading: boolean;
  currency: string;
}

interface FieldConfig {
  key: keyof FinancialValues;
  label: string;
  icon: React.ReactNode;
  hint: string;
  quickStep: number;
}

export const FinancialInputForm: React.FC<FinancialInputFormProps> = ({
  values,
  onChange,
  onSubmit,
  isLoading,
  currency,
}) => {
  const fields: FieldConfig[] = [
    {
      key: 'revenue',
      label: 'Доход (выручка)',
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
      hint: 'Все поступления от клиентов за месяц',
      quickStep: 50000,
    },
    {
      key: 'rent',
      label: 'Аренда',
      icon: <Home className="w-5 h-5 text-blue-400" />,
      hint: 'Плата за помещение или точку продаж',
      quickStep: 10000,
    },
    {
      key: 'salaries',
      label: 'Зарплаты (ФОТ)',
      icon: <Users className="w-5 h-5 text-indigo-400" />,
      hint: 'Выплаты сотрудникам и смежникам',
      quickStep: 20000,
    },
    {
      key: 'ads',
      label: 'Реклама',
      icon: <Megaphone className="w-5 h-5 text-amber-400" />,
      hint: 'Таргет, контекст, полиграфия, блогеры',
      quickStep: 10000,
    },
    {
      key: 'other',
      label: 'Прочие расходы',
      icon: <Layers className="w-5 h-5 text-rose-400" />,
      hint: 'Сырьё, связь, налоги, сервисы, логистика',
      quickStep: 10000,
    },
  ];

  const handleInputChange = (field: keyof FinancialValues, rawVal: string) => {
    // Strip non-digits
    const clean = rawVal.replace(/\D/g, '');
    const num = clean ? parseInt(clean, 10) : 0;
    onChange(field, num);
  };

  const handleStep = (field: keyof FinancialValues, step: number) => {
    const current = values[field] || 0;
    const next = Math.max(0, current + step);
    onChange(field, next);
  };

  const hasEnteredData = Object.values(values).some((v) => v > 0);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-3.5"
    >
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <span>Финансовые показатели</span>
          <span className="text-xs text-slate-500 font-normal lowercase">(в месяц)</span>
        </h2>
        <span className="text-xs text-slate-400 font-mono-numbers">
          Валюта: <span className="text-emerald-400 font-semibold">{currency}</span>
        </span>
      </div>

      <div className="space-y-2.5">
        {fields.map((field) => {
          const val = values[field.key];
          const displayVal = val === 0 ? '' : new Intl.NumberFormat('ru-RU').format(val);
          const isRevenue = field.key === 'revenue';

          return (
            <div
              key={field.key}
              className={`relative rounded-2xl p-3 transition-all border ${
                isRevenue
                  ? 'bg-slate-900/90 border-emerald-500/30 shadow-md shadow-emerald-950/20'
                  : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700/80'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor={field.key}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-200 cursor-pointer"
                >
                  <span className="p-1 rounded-lg bg-slate-800/80 border border-slate-700/50">
                    {field.icon}
                  </span>
                  <span>{field.label}</span>
                </label>
                <span className="text-[11px] text-slate-400 hidden xs:inline">
                  {field.hint}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    id={field.key}
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={displayVal}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    className="w-full h-12 bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 pr-9 text-lg font-bold font-mono-numbers text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 pointer-events-none">
                    {currency}
                  </div>
                </div>

                {/* Quick adjustment buttons */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleStep(field.key, -field.quickStep)}
                    disabled={val <= 0}
                    title={`Уменьшить на ${formatCurrency(field.quickStep, currency)}`}
                    className="w-10 h-12 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all text-sm font-bold"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStep(field.key, field.quickStep)}
                    title={`Добавить ${formatCurrency(field.quickStep, currency)}`}
                    className="w-10 h-12 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 active:scale-95 transition-all text-sm font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Big "Анализ" Action Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading || !hasEnteredData}
          className={`w-full h-14 rounded-2xl font-bold text-base tracking-wide flex items-center justify-center gap-2.5 shadow-xl transition-all active:scale-[0.98] ${
            isLoading
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
              : !hasEnteredData
              ? 'bg-slate-800/80 text-slate-500 border border-slate-700/50 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:brightness-110 border border-emerald-400/30'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
              <span>Анализируем цифры...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-emerald-200 animate-pulse" />
              <span className="text-lg">Анализ</span>
              <Play className="w-4 h-4 fill-white/80" />
            </>
          )}
        </button>
        
        <p className="text-center text-[11px] text-slate-500 mt-2">
          Прибыль, маржа и окупаемость считаются моментально кодом. Gemini формирует понятный вердикт.
        </p>
      </div>
    </form>
  );
};
