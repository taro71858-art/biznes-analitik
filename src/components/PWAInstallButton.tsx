import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X, Smartphone, Check } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showGeneralGuide, setShowGeneralGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* Button for Chromium / Android native flow */}
      {isInstallable && (
        <button
          type="button"
          onClick={install}
          title="Установить приложение на телефон"
          className="h-8 px-2.5 flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg shadow-md shadow-blue-900/30 active:scale-95 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Установить</span>
        </button>
      )}

      {/* Button for iOS Safari */}
      {!isInstallable && isIOS && (
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          title="Инструкция по установке на iPhone / iPad"
          className="h-8 px-2.5 flex items-center gap-1.5 text-xs font-semibold text-blue-300 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-500/40 rounded-lg active:scale-95 transition-all"
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-400" />
          <span>На экран</span>
        </button>
      )}

      {/* Button for other browsers / desktop fallback when beforeinstallprompt hasn't fired */}
      {!isInstallable && !isIOS && (
        <button
          type="button"
          onClick={() => setShowGeneralGuide(true)}
          title="Как установить приложение"
          className="h-8 px-2.5 flex items-center gap-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg active:scale-95 transition-all"
        >
          <Download className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden xs:inline">Установить</span>
        </button>
      )}

      {/* iOS Safari Installation Guide Modal */}
      {showIOSGuide && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowIOSGuide(false)}
        >
          <div 
            className="w-full max-w-sm bg-[#0d131f] border border-blue-500/30 rounded-3xl p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <img src="/pwa-192x192.png" alt="Иконка" className="w-8 h-8 rounded-xl shadow" />
                <div>
                  <h3 className="text-sm font-bold text-white">Установка на iPhone / iPad</h3>
                  <p className="text-[11px] text-slate-400">Бизнес-аналитик PWA</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-200">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0">1</span>
                <p>
                  В браузере Safari нажмите кнопку <strong>«Поделиться»</strong> <Share2 className="w-3.5 h-3.5 inline mx-1 text-blue-400" /> в нижней панели.
                </p>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0">2</span>
                <p>
                  Прокрутите список действий вниз и выберите <strong>«На экран «Домой»</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-emerald-400" />.
                </p>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0">3</span>
                <p>
                  Нажмите <strong>«Добавить»</strong> в правом верхнем углу. Значок появится рядом с вашими приложениями!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs active:scale-95 transition-all"
            >
              Понятно
            </button>
          </div>
        </div>
      )}

      {/* General Guide Modal */}
      {showGeneralGuide && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowGeneralGuide(false)}
        >
          <div 
            className="w-full max-w-sm bg-[#0d131f] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <img src="/pwa-192x192.png" alt="Иконка" className="w-8 h-8 rounded-xl shadow" />
                <div>
                  <h3 className="text-sm font-bold text-white">Установка приложения</h3>
                  <p className="text-[11px] text-slate-400">«Бизнес-аналитик» на главный экран</p>
                </div>
              </div>
              <button
                onClick={() => setShowGeneralGuide(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <p>
                Вы можете установить это приложение как полноценное PWA на смартфон или компьютер:
              </p>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>В Chrome / Яндекс Браузере:</span>
                </div>
                <p className="text-slate-400 pl-3.5">
                  Откройте меню браузера (три точки) и выберите <strong>«Установить приложение»</strong> или <strong>«Добавить на главный экран»</strong>.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>В Safari (iOS):</span>
                </div>
                <p className="text-slate-400 pl-3.5">
                  Нажмите <strong>«Поделиться»</strong> → <strong>«На экран «Домой»</strong>.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowGeneralGuide(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs active:scale-95 transition-all"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
};
