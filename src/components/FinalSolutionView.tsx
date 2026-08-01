import React from 'react';
import { FinalSolution, Caso } from '../types';
import { Award, CheckCircle, XCircle, FileText, Sparkles, RefreshCw, ShieldAlert, Key } from 'lucide-react';

interface FinalSolutionViewProps {
  finalSolution: FinalSolution;
  caso: Caso;
  onNewGame: () => void;
  onNewAiGame: () => void;
}

export const FinalSolutionView: React.FC<FinalSolutionViewProps> = ({
  finalSolution,
  caso,
  onNewGame,
  onNewAiGame,
}) => {
  const isCorrectGrade = ['A+', 'A'].includes(finalSolution.calificacion);

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8 font-sans text-zinc-200">
      
      {/* Top Banner with Verdict Stamp */}
      <div className={`rounded-sm p-6 lg:p-8 border shadow-2xl mb-6 relative overflow-hidden ${
        finalSolution.esCulpable
          ? 'bg-zinc-950 border-red-900/60'
          : 'bg-zinc-950 border-emerald-900/60'
      }`}>
        
        {/* Stamp Background Accent */}
        <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none select-none">
          <ShieldAlert className="w-64 h-64 text-zinc-100" />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500 font-bold block mb-1">
              [SOLUCIÓN FINAL DEL CASO]
            </span>
            <h1 className="text-xl md:text-2xl font-bold font-mono text-zinc-100">
              {caso.titulo}
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              SOSPECHOSO INVESTIGADO: <strong className="text-zinc-200 font-mono">{caso.sospechoso.nombre}</strong>
            </p>
          </div>

          {/* Stamp Badge */}
          <div className="flex items-center gap-3 bg-zinc-900 p-3 rounded-sm border border-zinc-800 shadow-inner">
            <div className={`text-xl font-bold font-mono px-3 py-1 rounded-sm border ${
              isCorrectGrade ? 'bg-zinc-800 text-zinc-100 border-zinc-700' : 'bg-zinc-900 text-red-400 border-red-900/50'
            }`}>
              {finalSolution.calificacion}
            </div>
            <div>
              <span className="text-[9px] font-mono text-zinc-500 uppercase block tracking-widest">CALIFICACIÓN</span>
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase">
                {isCorrectGrade ? 'Deducción Maestra' : 'Caso Inconcluso'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* DETAILED SOLUTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Secret & Guilt Status */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
            <Key className="w-4 h-4 text-zinc-400" />
            <h3 className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold text-zinc-500">
              VERDAD Y ESTATUTO DEL SOSPECHOSO
            </h3>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <span className="text-zinc-500 uppercase text-[10px] block mb-1">Estatus Real:</span>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border font-bold uppercase text-xs ${
                finalSolution.esCulpable
                  ? 'bg-red-950/80 text-red-300 border-red-800'
                  : 'bg-zinc-900 text-emerald-400 border-zinc-700'
              }`}>
                {finalSolution.esCulpable ? <XCircle className="w-4 h-4 text-red-400" /> : <CheckCircle className="w-4 h-4 text-emerald-400" />}
                <span>{finalSolution.esCulpable ? 'EL SOSPECHOSO ES CULPABLE' : 'EL SOSPECHOSO ES INOCENTE'}</span>
              </div>
            </div>

            <div>
              <span className="text-zinc-500 uppercase text-[10px] block mb-1">Secreto Oculto / Móvil:</span>
              <p className="bg-zinc-900 p-3 rounded-sm border border-zinc-800 text-zinc-200 leading-relaxed italic font-serif">
                "{finalSolution.secretoOculto}"
              </p>
            </div>
          </div>
        </div>

        {/* How Evidence Connected */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
            <FileText className="w-4 h-4 text-zinc-400" />
            <h3 className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold text-zinc-500">
              CONEXIÓN DE LAS EVIDENCIAS
            </h3>
          </div>

          <div className="text-xs space-y-2">
            <p className="bg-zinc-900 p-3 rounded-sm border border-zinc-800 text-zinc-300 leading-relaxed font-sans">
              {finalSolution.explicacionPistas}
            </p>
          </div>
        </div>

      </div>

      {/* DETECTIVE EVALUATION */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-5 shadow-xl mb-8">
        <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 mb-3">
          <Award className="w-4 h-4 text-zinc-400" />
          <h3 className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold text-zinc-500">
            EVALUACIÓN DE DESEMPEÑO DEL DETECTIVE
          </h3>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed font-mono bg-zinc-900 p-4 rounded-sm border border-zinc-800">
          {finalSolution.evaluacionDetective}
        </p>
      </div>

      {/* RESTART BUTTONS */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <button
          onClick={onNewGame}
          className="w-full sm:w-auto px-6 py-2.5 rounded-sm bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold uppercase font-mono border border-zinc-800 transition flex items-center justify-center gap-2 cursor-pointer shadow"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Elegir Otro Caso Predeterminado</span>
        </button>

        <button
          onClick={onNewAiGame}
          className="w-full sm:w-auto px-6 py-2.5 rounded-sm bg-zinc-100 hover:bg-zinc-300 text-zinc-950 text-xs font-bold uppercase font-mono transition flex items-center justify-center gap-2 cursor-pointer shadow tracking-wider"
        >
          <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
          <span>Generar Caso Único con IA</span>
        </button>
      </div>

    </div>
  );
};
