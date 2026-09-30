import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-50 flex items-center justify-between gap-2.5 rounded-2xl bg-amber-600/95 text-white px-4 py-2.5 text-xs font-semibold shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
        <span>Вы офлайн. Расчёт формул работает без интернета.</span>
      </div>
      <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" />
    </div>
  );
};
