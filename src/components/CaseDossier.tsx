import React from 'react';
import { Caso, Evidencia } from '../types';
import { FileSearch, Search, AlertCircle, ShieldAlert, User, Clock, MapPin, Briefcase, Eye } from 'lucide-react';

interface CaseDossierProps {
  caso: Caso;
  currentNervousness: 'tranquilo' | 'prevenido' | 'nervioso' | 'acorralado' | 'desmoronado';
  onInspectEvidence: (evidence: Evidencia) => void;
  onCiteEvidence: (evidence: Evidencia) => void;
}

export const CaseDossier: React.FC<CaseDossierProps> = ({
  caso,
  currentNervousness,
  onInspectEvidence,
  onCiteEvidence,
}) => {
  // Personality badge styling
  const getPersonalityBadgeClass = (p: string) => {
    switch (p.toLowerCase()) {
      case 'arrogante': return 'bg-zinc-800 text-zinc-300 border-zinc-700';
      case 'nervioso': return 'bg-zinc-800 text-amber-400 border-amber-900/50';
      case 'frío': return 'bg-zinc-800 text-blue-300 border-zinc-700';
      case 'encantador': return 'bg-zinc-800 text-emerald-300 border-zinc-700';
      case 'olvidadizo': return 'bg-zinc-800 text-purple-300 border-zinc-700';
      default: return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  // Nervousness meter calculation
  const getNervousnessConfig = (n: string) => {
    switch (n) {
      case 'tranquilo':
        return { label: 'Tranquilo y Seguro', percentage: 15, color: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-zinc-800' };
      case 'prevenido':
        return { label: 'Prevenido / Cauteloso', percentage: 40, color: 'bg-blue-500', text: 'text-blue-400', border: 'border-zinc-800' };
      case 'nervioso':
        return { label: 'Nervioso / Inquieto', percentage: 65, color: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-900/50' };
      case 'acorralado':
        return { label: 'Acorralado / Contradicho', percentage: 85, color: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-900/50' };
      case 'desmoronado':
        return { label: '¡Desmoronándose!', percentage: 100, color: 'bg-red-600 animate-pulse', text: 'text-red-400 font-bold', border: 'border-red-900/60' };
      default:
        return { label: 'Tranquilo', percentage: 20, color: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-zinc-800' };
    }
  };

  const stress = getNervousnessConfig(currentNervousness);

  return (
    <aside className="w-full lg:w-80 xl:w-96 flex flex-col gap-4 font-sans text-zinc-200">
      
      {/* SOSPECHOSO PROFILE & NERVOUSNESS GAUGE */}
      <div className={`bg-zinc-950 border ${stress.border} rounded-sm p-4 shadow-xl transition-all duration-300`}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
            <span className="w-2 h-[1px] bg-zinc-500"></span> SOSPECHOSO PROFILE
          </h2>
          <span className={`text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-sm border ${getPersonalityBadgeClass(caso.sospechoso.personalidad)}`}>
            {caso.sospechoso.personalidad}
          </span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-sm mb-3">
          <div className="flex gap-3 items-center">
            <div className="relative group shrink-0">
              <img
                src={caso.sospechoso.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
                alt={caso.sospechoso.nombre}
                className="w-16 h-20 rounded-sm object-cover border border-zinc-700 grayscale contrast-125 shadow-md group-hover:grayscale-0 transition duration-300"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif italic text-lg text-zinc-100 leading-tight truncate">
                {caso.sospechoso.nombre}
              </h3>
              <p className="text-[11px] font-mono text-zinc-400 flex items-center gap-1 mt-0.5 truncate">
                <Briefcase className="w-3 h-3 text-zinc-500 shrink-0" />
                {caso.sospechoso.ocupacion}
              </p>
              <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                {caso.sospechoso.descripcion}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Stress / Nervousness Level Meter */}
        <div className="pt-2 border-t border-zinc-800/80">
          <div className="flex justify-between items-center text-xs mb-1 font-mono">
            <span className="text-zinc-500 text-[10px] uppercase tracking-wider">Estrés del Sospechoso:</span>
            <span className={`font-semibold text-[11px] ${stress.text}`}>
              {stress.label}
            </span>
          </div>
          <div className="w-full bg-zinc-900 h-2 rounded-sm overflow-hidden border border-zinc-800 p-0.5">
            <div
              className={`h-full rounded-sm transition-all duration-500 ${stress.color}`}
              style={{ width: `${stress.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* EXPEDIENTE DEL CRIMEN */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-800">
          <FileSearch className="w-4 h-4 text-zinc-400" />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
            <span className="w-2 h-[1px] bg-zinc-500"></span> EXPEDIENTE DEL CASO
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider block mb-0.5">Crimen</span>
            <p className="text-zinc-200 bg-zinc-900/80 p-2.5 rounded-sm border border-zinc-800 leading-relaxed font-sans">
              {caso.expediente.quePaso}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 mb-0.5">
                <MapPin className="w-3 h-3 text-zinc-600" /> Dónde
              </span>
              <p className="text-zinc-300 bg-zinc-900/80 p-1.5 rounded-sm border border-zinc-800 text-[11px] truncate font-mono" title={caso.expediente.donde}>
                {caso.expediente.donde}
              </p>
            </div>
            <div>
              <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 mb-0.5">
                <Clock className="w-3 h-3 text-zinc-600" /> Cuándo
              </span>
              <p className="text-zinc-300 bg-zinc-900/80 p-1.5 rounded-sm border border-zinc-800 text-[11px] truncate font-mono" title={caso.expediente.cuando}>
                {caso.expediente.cuando}
              </p>
            </div>
          </div>

          <div>
            <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider block mb-0.5">Escena del crimen</span>
            <p className="text-zinc-400 text-[11px] italic bg-zinc-900/40 p-2 rounded-sm border border-zinc-800/60 leading-relaxed">
              "{caso.expediente.detalle}"
            </p>
          </div>
        </div>
      </div>

      {/* EVIDENCIAS FÍSICAS */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
            <span className="w-2 h-[1px] bg-zinc-500"></span> EVIDENCE LOG ({caso.evidencias.length})
          </h2>
          <span className="text-[9px] text-zinc-500 font-mono">Citar en interrogatorio</span>
        </div>

        <div className="space-y-2.5">
          {caso.evidencias.map((ev, index) => (
            <div
              key={ev.id}
              className="group bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 rounded-sm p-2.5 transition flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-500 font-bold">
                    0{index + 1}.
                  </span>
                  <h4 className="text-xs font-mono font-medium text-zinc-300 group-hover:text-zinc-100 transition">
                    {ev.nombre}
                  </h4>
                </div>
              </div>

              <p className="text-[11px] text-zinc-500 line-clamp-2 mb-2 italic">
                {ev.descripcion}
              </p>

              <div className="flex items-center justify-end gap-1.5 pt-1.5 border-t border-zinc-800/80">
                <button
                  onClick={() => onInspectEvidence(ev)}
                  className="text-[10px] font-mono text-zinc-400 hover:text-zinc-100 bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded-sm transition flex items-center gap-1 cursor-pointer"
                  title="Examinar detalle físico de la pista"
                >
                  <Eye className="w-3 h-3" /> Examinar
                </button>
                <button
                  onClick={() => onCiteEvidence(ev)}
                  className="text-[10px] font-mono font-bold text-zinc-100 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-2.5 py-1 rounded-sm transition flex items-center gap-1 cursor-pointer"
                  title="Confrontar al sospechoso con esta evidencia"
                >
                  Citar pista
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
};
