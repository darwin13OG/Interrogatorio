import React from 'react';
import { HelpCircle, X, Shield, Terminal, CheckCircle2, AlertTriangle, Scale } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-sm max-w-xl w-full p-6 shadow-2xl relative text-zinc-200 font-sans max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-100 p-1.5 rounded-sm bg-zinc-900 hover:bg-zinc-800 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-zinc-800">
          <div className="w-8 h-8 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-[0.2em] block">
              MANUAL DE PROCEDIMIENTO POLICIAL
            </span>
            <h3 className="text-base font-bold font-mono text-zinc-100">
              Reglas del Juego de Interrogatorio
            </h3>
          </div>
        </div>

        <div className="space-y-4 text-xs font-mono">
          
          <div className="bg-zinc-900/80 p-3.5 rounded-sm border border-zinc-800">
            <h4 className="font-bold text-zinc-300 uppercase text-[10px] tracking-widest mb-1.5 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-zinc-500" /> REGLAS DE INICIO (Mensaje 1)
            </h4>
            <p className="text-zinc-400 leading-relaxed text-[11px] font-sans">
              El juego inicia automáticamente generando un caso único con:
            </p>
            <ul className="list-disc list-inside text-zinc-500 mt-1 space-y-0.5 text-[11px]">
              <li><strong>[EXPEDIENTE]:</strong> Descripción del crimen, lugar y hora.</li>
              <li><strong>[EVIDENCIAS]:</strong> 3 pistas físicas examinables.</li>
              <li><strong>[SOSPECHOSO]:</strong> Nombre, ocupación y rasgo de personalidad.</li>
              <li><strong>[DECLARACIÓN INICIAL]:</strong> Versión previa del sospechoso.</li>
            </ul>
          </div>

          <div className="bg-zinc-900/80 p-3.5 rounded-sm border border-zinc-800">
            <h4 className="font-bold text-zinc-300 uppercase text-[10px] tracking-widest mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-zinc-500" /> REGLAS DE INTERROGATORIO (Máx 10 Mensajes)
            </h4>
            <ul className="space-y-1.5 text-zinc-400 text-[11px] leading-relaxed font-sans">
              <li>• El sospechoso responderá siempre en personaje variando el tono según su personalidad.</li>
              <li>• No confesará de inmediato. Solo se pondrá nervioso si encuentras una contradicción lógica entre tus preguntas, sus respuestas y las 3 evidencias.</li>
              <li>• Al final de cada respuesta verás el contador obligatorio: <strong>(Mensaje X/10)</strong>.</li>
            </ul>
          </div>

          <div className="bg-zinc-900/80 p-3.5 rounded-sm border border-zinc-800">
            <h4 className="font-bold text-red-400 uppercase text-[10px] tracking-widest mb-1.5 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-red-500" /> REGLAS DE CIERRE Y VEREDICTO
            </h4>
            <ul className="space-y-1.5 text-zinc-400 text-[11px] leading-relaxed font-sans">
              <li>• <strong>Mensaje 9:</strong> El sospechoso advertirá su impaciencia final.</li>
              <li>• <strong>Mensaje 10:</strong> El sospechoso exigirá tu acusación o veredicto definitivo.</li>
              <li>• Una vez entregado tu veredicto, el sistema revelará la <strong>[SOLUCIÓN FINAL]</strong> detallada y la calificación forense.</li>
            </ul>
          </div>

        </div>

        <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold font-mono bg-zinc-100 hover:bg-zinc-300 text-zinc-950 rounded-sm transition uppercase tracking-wider cursor-pointer"
          >
            ¡Entendido, Detective!
          </button>
        </div>

      </div>
    </div>
  );
};
