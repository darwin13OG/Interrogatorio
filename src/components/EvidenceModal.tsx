import React from 'react';
import { Evidencia } from '../types';
import { Search, X, ShieldAlert, Sparkles, FileText } from 'lucide-react';

interface EvidenceModalProps {
  evidence: Evidencia | null;
  onClose: () => void;
  onCite: (evidence: Evidencia) => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  evidence,
  onClose,
  onCite,
}) => {
  if (!evidence) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-sm max-w-lg w-full p-6 shadow-2xl relative text-zinc-200 font-sans">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-100 p-1.5 rounded-sm bg-zinc-900 hover:bg-zinc-800 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-zinc-800">
          <div className="w-8 h-8 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-[0.2em] block">
              EVIDENCIA FÍSICA #0{evidence.id.replace('ev-', '')}
            </span>
            <h3 className="text-base font-bold font-mono text-zinc-100">
              {evidence.nombre}
            </h3>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1 font-semibold">
              Descripción General:
            </span>
            <p className="text-xs bg-zinc-900/80 p-3 rounded-sm border border-zinc-800 text-zinc-300 leading-relaxed font-sans">
              {evidence.descripcion}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" /> Examen Forense Detallado:
            </span>
            <p className="text-xs bg-zinc-900 border border-zinc-800 p-3 rounded-sm text-zinc-300 leading-relaxed italic font-serif">
              "{evidence.detalleFisico}"
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono bg-zinc-900 hover:bg-zinc-800 rounded-sm transition text-zinc-400 cursor-pointer border border-zinc-800"
          >
            Cerrar Inspector
          </button>
          <button
            onClick={() => {
              onCite(evidence);
              onClose();
            }}
            className="px-4 py-2 text-xs font-bold font-mono bg-zinc-100 hover:bg-zinc-300 text-zinc-950 rounded-sm transition flex items-center gap-1.5 shadow cursor-pointer uppercase tracking-wider"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Citar esta Pista</span>
          </button>
        </div>

      </div>
    </div>
  );
};
