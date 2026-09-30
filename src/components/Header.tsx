import React from 'react';
import { RotateCcw, FolderOpen } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currency: string;
  onCurrencyChange: (curr: string) => void;
  onOpenPresets: () => void;
  onReset: () => void;
  hasValues: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currency,
  onCurrencyChange,
  onOpenPresets,
  onReset,
  hasValues,
}) => {
  const currencies = ['₽', '$', '€', '₸'];

  return (
    <header className="sticky top-0 z-30 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80 px-3.5 py-2.5">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Brand Icon: Blue circle with white growth chart */}
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-blue-500/20 shrink-0 border border-blue-400/30">
            <img src="/icon.svg" alt="Бизнес-аналитик" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold tracking-tight text-white leading-tight">
                Бизнес-аналитик
              </h1>
              <span className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                PWA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Финансовый экспресс-анализ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Currency selector */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            {currencies.map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => onCurrencyChange(curr)}
                className={`w-6 h-7 text-[11px] font-semibold rounded-md transition-all ${
                  currency === curr
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>

          {/* Presets button */}
          <button
            type="button"
            onClick={onOpenPresets}
            title="Готовые шаблоны бизнеса"
            className="h-8 px-2 flex items-center gap-1 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg active:scale-95 transition-all"
          >
            <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Кейсы</span>
          </button>

          {/* Reset button */}
          {hasValues && (
            <button
              type="button"
              onClick={onReset}
              title="Сбросить все поля"
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-400 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-lg active:scale-95 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
