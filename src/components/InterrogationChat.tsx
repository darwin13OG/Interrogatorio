import React, { useState, useEffect, useRef } from 'react';
import { Message, Caso, Evidencia } from '../types';
import { Send, AlertTriangle, Scale, ShieldAlert, Sparkles, MessageSquare, Terminal, CheckCircle2 } from 'lucide-react';

interface InterrogationChatProps {
  caso: Caso;
  messages: Message[];
  currentMessageNumber: number;
  isWaitingResponse: boolean;
  onSendMessage: (text: string) => void;
  onOpenVerdictModal: () => void;
  selectedEvidenceToCite?: Evidencia | null;
  onClearSelectedEvidence?: () => void;
}

export const InterrogationChat: React.FC<InterrogationChatProps> = ({
  caso,
  messages,
  currentMessageNumber,
  isWaitingResponse,
  onSendMessage,
  onOpenVerdictModal,
  selectedEvidenceToCite,
  onClearSelectedEvidence,
}) => {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isWaitingResponse]);

  // If evidence was selected from dossier, append to input
  useEffect(() => {
    if (selectedEvidenceToCite) {
      setInputText((prev) => {
        const citeStr = `Respecto a la evidencia "${selectedEvidenceToCite.nombre}": ${selectedEvidenceToCite.descripcion}. `;
        return prev ? `${citeStr}${prev}` : citeStr;
      });
      if (onClearSelectedEvidence) onClearSelectedEvidence();
    }
  }, [selectedEvidenceToCite, onClearSelectedEvidence]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isWaitingResponse || currentMessageNumber > 10) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickCite = (ev: Evidencia) => {
    setInputText(`Le presento la evidencia #${ev.id.replace('ev-', '')}: "${ev.nombre}" (${ev.detalleFisico}). ¿Qué tiene que decir al respecto?`);
  };

  return (
    <main className="flex-1 bg-zinc-950 border border-zinc-800 rounded-sm flex flex-col h-[520px] sm:h-[600px] lg:h-[720px] shadow-2xl overflow-hidden font-sans">
      
      {/* CHAT TOP HEADER WITH 10-MESSAGE PROGRESS TRACKER */}
      <div className="bg-zinc-900/90 px-3 sm:px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Terminal className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-zinc-300 truncate">
            INTERROGATORIO: <span className="text-zinc-100 font-normal">{caso.sospechoso.nombre}</span>
          </span>
        </div>

        {/* 10-Step Message Counter */}
        <div className="flex items-center gap-1.5 bg-zinc-950 px-2.5 py-1 rounded-sm border border-zinc-800 shrink-0">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest hidden sm:inline">
            PROGRESO:
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: 10 }).map((_, idx) => {
              const msgNum = idx + 1;
              const isPast = msgNum < currentMessageNumber;
              const isCurrent = msgNum === currentMessageNumber;
              return (
                <div
                  key={msgNum}
                  className={`w-2 h-2 rounded-none transition-all duration-300 ${
                    isPast
                      ? 'bg-zinc-200'
                      : isCurrent
                      ? 'bg-red-600 animate-pulse'
                      : 'bg-zinc-800'
                  }`}
                  title={`Mensaje ${msgNum}/10`}
                />
              );
            })}
          </div>
          <span className="font-mono font-bold text-xs text-zinc-300 ml-0.5">
            ({Math.min(currentMessageNumber, 10)}/10)
          </span>
        </div>
      </div>

      {/* CHAT MESSAGES TIMELINE */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-5 bg-zinc-900/30">
        
        {messages.map((msg) => {
          const isDetective = msg.sender === 'detective';
          const isSystem = msg.sender === 'sistema';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-3">
                <div className="bg-zinc-950/90 border border-zinc-800 text-zinc-300 text-xs font-mono p-4 rounded-sm max-w-xl shadow-lg leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isDetective ? 'items-end' : 'items-start'} my-2`}
            >
              {/* Message Header */}
              <div className="flex items-center gap-2 mb-1 text-[10px] font-mono text-zinc-500 px-1">
                {!isDetective && (
                  <span className="font-bold text-zinc-400 uppercase tracking-wider">
                    SUSPECT // {caso.sospechoso.nombre}
                  </span>
                )}
                {isDetective && (
                  <span className="font-bold text-zinc-400 uppercase tracking-wider">
                    DETECTIVE // YOU
                  </span>
                )}
                <span>• {msg.timestamp}</span>
                {msg.nervousnessLevel && !isDetective && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-sm font-mono font-semibold uppercase tracking-wider ${
                    msg.nervousnessLevel === 'tranquilo' ? 'bg-zinc-800 text-emerald-400 border border-zinc-700' :
                    msg.nervousnessLevel === 'prevenido' ? 'bg-zinc-800 text-blue-400 border border-zinc-700' :
                    msg.nervousnessLevel === 'nervioso' ? 'bg-zinc-800 text-amber-400 border border-zinc-700' :
                    'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                  }`}>
                    {msg.nervousnessLevel}
                  </span>
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-2xl p-4 shadow-xl text-sm leading-relaxed ${
                  isDetective
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-tl-sm rounded-bl-sm rounded-br-sm'
                    : 'bg-zinc-950 text-zinc-200 border border-zinc-800 rounded-tr-sm rounded-br-sm rounded-bl-sm italic font-serif'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Contradiction callout badge if suspect flustered */}
                {msg.contradictionDetected && !isDetective && (
                  <div className="mt-3 pt-2 border-t border-zinc-800 flex items-center gap-1.5 text-[11px] text-amber-400 font-mono font-medium not-italic">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                    Contradicción detectada: el sospechoso pierde la compostura.
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Spinner */}
        {isWaitingResponse && (
          <div className="flex items-center gap-3 text-zinc-400 text-xs font-mono bg-zinc-950 p-3 rounded-sm border border-zinc-800 w-fit">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-zinc-400 rounded-full animate-ping" />
              <div className="w-2 h-2 bg-zinc-400 rounded-full animate-ping delay-100" />
              <div className="w-2 h-2 bg-zinc-400 rounded-full animate-ping delay-200" />
            </div>
            <span>{caso.sospechoso.nombre} está respondiendo...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* QUICK EVIDENCE SHORTCUTS */}
      <div className="bg-zinc-950 px-3 sm:px-4 py-2 border-t border-zinc-800 flex items-center gap-2 overflow-x-auto text-xs shrink-0 no-scrollbar">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest whitespace-nowrap shrink-0">
          CITAR:
        </span>
        {caso.evidencias.map((ev, index) => (
          <button
            key={ev.id}
            onClick={() => handleQuickCite(ev)}
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 border border-zinc-800 hover:border-zinc-700 px-2.5 py-1 rounded-sm transition whitespace-nowrap text-[11px] font-mono flex items-center gap-1 cursor-pointer shrink-0"
          >
            <ShieldAlert className="w-3 h-3 text-zinc-500" />
            0{index + 1}. {ev.nombre}
          </button>
        ))}
      </div>

      {/* INPUT FORM & VERDICT TRIGGER */}
      <div className="bg-zinc-950 p-3 sm:p-4 border-t border-zinc-800 shrink-0">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          
          <div className="flex gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <div className="absolute left-3 top-3 text-zinc-600 font-mono text-xs">DET:</div>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  currentMessageNumber >= 10
                    ? 'Escribe tu acusación final...'
                    : `Escribe tu pregunta o señala una evidencia...`
                }
                disabled={isWaitingResponse}
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-sm py-2.5 pl-11 pr-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={!inputText.trim() || isWaitingResponse}
              className="bg-zinc-100 hover:bg-zinc-300 text-zinc-950 font-bold px-4 sm:px-6 py-2.5 rounded-sm transition disabled:opacity-40 flex items-center gap-1.5 shadow cursor-pointer text-xs uppercase tracking-widest font-mono shrink-0 min-h-[44px]"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Enviar</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-zinc-600 text-[10px] font-mono uppercase tracking-wider">
              Pregunta {Math.min(currentMessageNumber, 10)}/10
            </span>

            <button
              type="button"
              onClick={onOpenVerdictModal}
              className="flex items-center gap-1.5 bg-red-950/90 hover:bg-red-900 text-red-200 border border-red-800 font-mono font-bold px-3 py-1.5 rounded-sm transition text-[11px] uppercase tracking-wider cursor-pointer min-h-[36px]"
            >
              <Scale className="w-3.5 h-3.5 text-red-400" />
              <span>Formular Acusación</span>
            </button>
          </div>

        </form>
      </div>

    </main>
  );
};
