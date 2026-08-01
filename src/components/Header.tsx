import React from 'react';
import { Shield, Sparkles, Volume2, VolumeX, HelpCircle, FolderPlus, RefreshCw, FileText } from 'lucide-react';
import { Caso } from '../types';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  currentCaso: Caso;
  presetCases: Caso[];
  onSelectCase: (caso: Caso) => void;
  onGenerateAiCase: () => void;
  isGeneratingAi: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenRules: () => void;
  onOpenNotebook: () => void;
  isAiGenerated: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentCaso,
  presetCases,
  onSelectCase,
  onGenerateAiCase,
  isGeneratingAi,
  soundEnabled,
  onToggleSound,
  onOpenRules,
  onOpenNotebook,
  isAiGenerated,
}) => {
  return (
    <header className="bg-zinc-900/90 border-b border-zinc-800 text-zinc-100 px-3 sm:px-6 py-2.5 sticky top-0 z-30 shadow-xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        
        {/* Brand & Badge */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse shrink-0" title="Sistema Activo" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-xs tracking-[0.2em] uppercase font-mono text-zinc-200">
                  CASOS // INTERROGATORIO
                </h1>
                {isAiGenerated && (
                  <span className="inline-flex items-center gap-1 text-[8px] uppercase tracking-wider font-semibold bg-zinc-800 text-amber-400 border border-zinc-700 px-1.5 py-0.5 rounded-sm">
                    <Sparkles className="w-2.5 h-2.5" /> IA
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick sound toggle on mobile right */}
          <button
            onClick={onToggleSound}
            className="sm:hidden p-1.5 rounded-sm bg-zinc-950 text-zinc-400 border border-zinc-800 transition cursor-pointer"
            title={soundEnabled ? 'Silenciar' : 'Activar Sonido'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-600" />}
          </button>
        </div>

        {/* Navigation & Controls */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end w-full sm:w-auto gap-2 text-xs font-mono">
          
          {/* Preset Selector */}
          <select
            value={currentCaso.id}
            onChange={(e) => {
              const selected = presetCases.find((c) => c.id === e.target.value);
              if (selected) onSelectCase(selected);
            }}
            className="bg-zinc-950 text-zinc-300 text-xs font-mono border border-zinc-800 rounded-sm px-2 py-1 focus:outline-none focus:border-zinc-600 cursor-pointer max-w-[140px] sm:max-w-[200px] truncate"
          >
            {presetCases.map((c) => (
              <option key={c.id} value={c.id}>
                📁 {c.titulo}
              </option>
            ))}
          </select>

          {/* AI Generator Button */}
          <button
            onClick={onGenerateAiCase}
            disabled={isGeneratingAi}
            className="flex items-center gap-1 bg-zinc-100 hover:bg-zinc-300 text-zinc-950 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm transition shadow-sm disabled:opacity-50 cursor-pointer"
            title="Generar caso con IA"
          >
            {isGeneratingAi ? (
              <RefreshCw className="w-3 h-3 animate-spin text-zinc-900" />
            ) : (
              <Sparkles className="w-3 h-3 text-zinc-950" />
            )}
            <span>{isGeneratingAi ? '...' : 'Caso IA'}</span>
          </button>

          {/* Detective Notebook */}
          <button
            onClick={onOpenNotebook}
            className="flex items-center gap-1 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded-sm border border-zinc-800 transition cursor-pointer"
            title="Libreta de Notas"
          >
            <FileText className="w-3 h-3 text-zinc-400" />
            <span>Notas</span>
          </button>

          {/* Rules Button */}
          <button
            onClick={onOpenRules}
            className="flex items-center gap-1 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded-sm border border-zinc-800 transition cursor-pointer"
            title="Reglas del Juego"
          >
            <HelpCircle className="w-3 h-3 text-zinc-400" />
            <span className="hidden xs:inline">Reglas</span>
          </button>

          {/* Desktop Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="hidden sm:block p-1 rounded-sm bg-zinc-950 text-zinc-400 border border-zinc-800 transition cursor-pointer"
            title={soundEnabled ? 'Silenciar' : 'Activar Sonido'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-600" />}
          </button>

        </div>

      </div>
    </header>
  );
};
