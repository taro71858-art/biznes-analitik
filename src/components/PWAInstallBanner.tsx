import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, MoreVertical, PlusSquare, Check } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showAndroidModal, setShowAndroidModal] = useState(false);

  if (isInstalled || isDismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (!ok) {
        setShowAndroidModal(true);
      }
    } else {
      setShowAndroidModal(true);
    }
  };

  return (
    <>
      <div className="rounded-2xl p-3.5 bg-gradient-to-r from-blue-950/80 via-indigo-950/60 to-slate-900 border border-blue-500/40 shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-blue-400/40 shadow-md">
            <img src="/pwa-192x192.png" alt="Иконка приложения" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Установить «Бизнес-аналитик»</span>
            </div>
            <p className="text-[11px] text-blue-200/80">
              Быстрый доступ с экрана телефона без браузера
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="h-9 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-900/40 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Установить</span>
          </button>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Android Instruction Modal */}
      {showAndroidModal && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowAndroidModal(false)}
        >
          <div 
            className="w-full max-w-sm bg-[#0d131f] border border-blue-500/40 rounded-3xl p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <img src="/pwa-192x192.png" alt="Иконка" className="w-9 h-9 rounded-xl shadow border border-blue-500/30" />
                <div>
                  <h3 className="text-sm font-bold text-white">Установка на Android</h3>
                  <p className="text-[11px] text-slate-400">2 простых шага в браузере</p>
                </div>
              </div>
              <button
                onClick={() => setShowAndroidModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-200">
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0 border border-blue-500/30">
                  1
                </span>
                <div>
                  <div className="font-semibold text-white">
                    Нажмите меню Chrome:
                  </div>
                  <p className="text-slate-300 mt-0.5">
                    В правом верхнем углу браузера нажмите на значок <strong className="text-white">трёх точек (⋮)</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0 border border-blue-500/30">
                  2
                </span>
                <div>
                  <div className="font-semibold text-white">
                    Выберите пункт установки:
                  </div>
                  <p className="text-slate-300 mt-0.5">
                    В меню нажмите <strong className="text-blue-300">«Установить приложение»</strong> или <strong className="text-blue-300">«Добавить на главный экран»</strong>.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-[11px] flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Через 3 секунды синяя иконка появится на рабочем столе телефона!</span>
              </div>
            </div>

            <button
              onClick={() => setShowAndroidModal(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs active:scale-95 transition-all shadow-lg shadow-blue-900/40"
            >
              Всё понятно, устанавливаю!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
