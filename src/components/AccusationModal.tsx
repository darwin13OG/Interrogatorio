import React, { useState } from 'react';
import { Caso } from '../types';
import { Scale, AlertTriangle, X, ShieldCheck } from 'lucide-react';

interface AccusationModalProps {
  caso: Caso;
  isOpen: boolean;
  onClose: () => void;
  onSubmitAccusation: (verdictText: string) => void;
  isSubmitting: boolean;
  messageNumber: number;
}

export const AccusationModal: React.FC<AccusationModalProps> = ({
  caso,
  isOpen,
  onClose,
  onSubmitAccusation,
  isSubmitting,
  messageNumber,
}) => {
  const [isGuilty, setIsGuilty] = useState<boolean>(true);
  const [reasoning, setReasoning] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasoning.trim() || isSubmitting) return;

    const verdictFormatted = `Declaración del Detective: Acuso formalmente a ${
      caso.sospechoso.nombre
    } como ${isGuilty ? 'CULPABLE' : 'INOCENTE'}. Motivo y pruebas: ${reasoning.trim()}`;

    onSubmitAccusation(verdictFormatted);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-sm max-w-xl w-full p-6 shadow-2xl relative text-zinc-200 font-sans">
        
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-100 p-1.5 rounded-sm bg-zinc-900 hover:bg-zinc-800 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-zinc-800">
          <div className="w-8 h-8 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-red-500 uppercase font-bold tracking-[0.2em] block">
              VEREDICTO FINAL DE LA POLICÍA (Mensaje {Math.min(messageNumber, 10)}/10)
            </span>
            <h3 className="text-base font-bold font-mono text-zinc-100">
              Formular Acusación Oficial
            </h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2 font-bold">
              1. Determinar culpabilidad de {caso.sospechoso.nombre}:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsGuilty(true)}
                className={`p-3 rounded-sm border text-center transition flex items-center justify-center gap-2 cursor-pointer font-mono text-xs ${
                  isGuilty
                    ? 'bg-red-950/80 border-red-700 text-red-300 font-bold shadow'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>ES CULPABLE</span>
              </button>

              <button
                type="button"
                onClick={() => setIsGuilty(false)}
                className={`p-3 rounded-sm border text-center transition flex items-center justify-center gap-2 cursor-pointer font-mono text-xs ${
                  !isGuilty
                    ? 'bg-zinc-900 border-emerald-600 text-emerald-400 font-bold shadow'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>ES INOCENTE</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1.5 font-bold">
              2. Explica qué evidencias sustentan tu acusación:
            </label>
            <textarea
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              rows={4}
              placeholder="Ejemplo: Lo acuso porque la evidencia #3 demuestra que mintió sobre su coartada..."
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-sm p-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none transition font-mono"
              required
            />
          </div>

          <div className="bg-zinc-900/80 p-3 rounded-sm border border-zinc-800 text-xs text-zinc-500 flex items-start gap-2 font-mono">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Al enviar tu acusación, el interrogatorio concluirá y el sistema revelará la{' '}
              <strong className="text-zinc-300">[SOLUCIÓN FINAL]</strong>.
            </span>
          </div>

          <div className="pt-3 border-t border-zinc-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-mono bg-zinc-900 hover:bg-zinc-800 rounded-sm transition text-zinc-400 cursor-pointer border border-zinc-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!reasoning.trim() || isSubmitting}
              className="px-5 py-2 text-xs font-bold font-mono bg-red-600 hover:bg-red-500 text-white rounded-sm transition flex items-center gap-2 shadow cursor-pointer uppercase tracking-wider disabled:opacity-50"
            >
              <Scale className="w-4 h-4" />
              <span>{isSubmitting ? 'Procesando Veredicto...' : 'Entregar Veredicto Final'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
