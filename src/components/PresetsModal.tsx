import React from 'react';
import { PRESET_SCENARIOS } from '../utils/presets';
import { PresetScenario } from '../types';
import { X, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/finance';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (scenario: PresetScenario) => void;
  currency: string;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currency,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#0d131f] border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Готовые примеры бизнеса</h3>
            <p className="text-xs text-slate-400">Выберите нишу для моментальной проверки</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2.5 overflow-y-auto">
          {PRESET_SCENARIOS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelect(item);
                onClose();
              }}
              className="w-full text-left p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/50 transition-all group active:scale-[0.98]"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-bold text-sm text-slate-100 group-hover:text-emerald-400 transition-colors">
                    {item.name}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-slate-400 mb-2">{item.description}</p>
              
              <div className="flex items-center justify-between text-[11px] font-mono-numbers text-slate-300 bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-850">
                <span>Доход: {formatCurrency(item.values.revenue, currency)}</span>
                <span className="text-slate-400">
                  Расходы: {formatCurrency(
                    item.values.rent + item.values.salaries + item.values.ads + item.values.other,
                    currency
                  )}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
