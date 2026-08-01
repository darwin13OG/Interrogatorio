import React, { useState, useEffect } from 'react';
import { ShieldAlert, Terminal, Lock, CheckCircle2, Loader2 } from 'lucide-react';

interface AppSplashScreenProps {
  onComplete: () => void;
}

export const AppSplashScreen: React.FC<AppSplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('INICIALIZANDO TERMINAL POLICIAL...');
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const steps = [
      { p: 20, text: 'ESTABLECIENDO CONEXIÓN SEGURA CON BASE DE DATOS...' },
      { p: 45, text: 'DECODIFICANDO EXPEDIENTES DE LA POLICÍA JUDICIAL...' },
      { p: 75, text: 'CARGANDO REGISTRO DE EVIDENCIAS FÍSICAS Y PERFILES...' },
      { p: 100, text: 'SISTEMA DE INTERROGATORIO LISTO.' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p);
        setStatusText(steps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsReady(true);
        // Auto complete after reaching 100%
        setTimeout(() => {
          onComplete();
        }, 600);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center p-4 font-mono text-zinc-100 select-none">
      
      {/* BACKGROUND DECORATIVE GRID */}
      <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-sm p-6 shadow-2xl relative z-10 space-y-6">
        
        {/* POLICE BADGE HEADER */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-zinc-950 border border-zinc-800 flex items-center justify-center text-red-500 shadow-inner">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-bold block">
                POLICÍA JUDICIAL
              </span>
              <h1 className="text-xs font-bold text-zinc-200 tracking-wider uppercase">
                SISTEMA DE INTERROGATORIOS
              </h1>
            </div>
          </div>
          <Lock className="w-4 h-4 text-zinc-600" />
        </div>

        {/* TERMINAL STATUS MONITOR */}
        <div className="bg-zinc-950 p-4 rounded-sm border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-zinc-500" /> STATUS:
            </span>
            <span className="font-bold text-zinc-200">{progress}%</span>
          </div>

          {/* PROGRESS BAR */}
          <div className="w-full bg-zinc-900 border border-zinc-800 h-2.5 rounded-none overflow-hidden p-0.5">
            <div
              className="bg-zinc-100 h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="text-[10px] text-zinc-500 uppercase tracking-widest min-h-[18px] flex items-center gap-1.5 pt-1">
            {!isReady ? (
              <Loader2 className="w-3 h-3 text-zinc-400 animate-spin shrink-0" />
            ) : (
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            )}
            <span className="truncate">{statusText}</span>
          </div>
        </div>

        {/* ACTION BUTTON ONCE READY */}
        {isReady && (
          <button
            onClick={onComplete}
            className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-300 text-zinc-950 font-bold text-xs uppercase tracking-[0.2em] rounded-sm transition shadow cursor-pointer flex items-center justify-center gap-2"
          >
            <span>INGRESAR A LAS SALAS</span>
          </button>
        )}

      </div>

      <div className="mt-8 text-[10px] text-zinc-600 tracking-widest uppercase">
        SISTEMA CLASIFICADO • ACCESO RESTRINGIDO
      </div>

    </div>
  );
};
