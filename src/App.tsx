import React, { useState, useEffect } from 'react';
import { Caso, Message, FinalSolution, Evidencia } from './types';
import { PRESET_CASES } from './data/presetCases';
import { Header } from './components/Header';
import { CaseDossier } from './components/CaseDossier';
import { InterrogationChat } from './components/InterrogationChat';
import { EvidenceModal } from './components/EvidenceModal';
import { AccusationModal } from './components/AccusationModal';
import { FinalSolutionView } from './components/FinalSolutionView';
import { RulesModal } from './components/RulesModal';
import { DetectiveNotebook } from './components/DetectiveNotebook';
import { soundManager } from './utils/audio';

export default function App() {
  const [currentCaso, setCurrentCaso] = useState<Caso>(PRESET_CASES[0]);
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessageNumber, setCurrentMessageNumber] = useState<number>(1);
  const [currentNervousness, setCurrentNervousness] = useState<'tranquilo' | 'prevenido' | 'nervioso' | 'acorralado' | 'desmoronado'>('tranquilo');
  const [gameStatus, setGameStatus] = useState<'interrogando' | 'resuelto'>('interrogando');

  // Modals and UI overlays
  const [inspectingEvidence, setInspectingEvidence] = useState<Evidencia | null>(null);
  const [citingEvidence, setCitingEvidence] = useState<Evidencia | null>(null);
  const [isAccusationOpen, setIsAccusationOpen] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isNotebookOpen, setIsNotebookOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Loading states
  const [isWaitingResponse, setIsWaitingResponse] = useState<boolean>(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [finalSolution, setFinalSolution] = useState<FinalSolution | null>(null);

  // Mobile navigation tab state
  const [activeMobileTab, setActiveMobileTab] = useState<'chat' | 'dossier'>('chat');

  // Initialize case with Message 1 automatically according to prompt rules
  useEffect(() => {
    startNewCase(currentCaso, isAiGenerated);
  }, []);

  const startNewCase = (caso: Caso, aiGen: boolean = false) => {
    setCurrentCaso(caso);
    setIsAiGenerated(aiGen);
    setCurrentMessageNumber(1);
    setCurrentNervousness('tranquilo');
    setGameStatus('interrogando');
    setFinalSolution(null);

    // Message 1 formatting strictly adhering to REGLAS DE INICIO (Mensaje 1)
    const evidenciasFormatted = caso.evidencias
      .map((ev, i) => `   Pista #${i + 1}: ${ev.nombre} - ${ev.descripcion}`)
      .join('\n');

    const mensaje1Text = `🚨 NUEVO EXPEDIENTE DE INTERROGATORIO INICIADO 🚨

1. [EXPEDIENTE]:
   - Crimen: ${caso.expediente.quePaso}
   - Lugar: ${caso.expediente.donde}
   - Hora/Fecha: ${caso.expediente.cuando}
   - Detalles: ${caso.expediente.detalle}

2. [EVIDENCIAS]:
${evidenciasFormatted}

3. [SOSPECHOSO]:
   - Nombre: ${caso.sospechoso.nombre} (${caso.sospechoso.ocupacion})
   - Rasgo de personalidad: ${caso.sospechoso.personalidad.toUpperCase()}

4. [DECLARACIÓN INICIAL]:
   "${caso.declaracionInicial}"

(Mensaje 1/10)`;

    const initialMsg: Message = {
      id: `msg-1-${Date.now()}`,
      sender: 'sistema',
      text: mensaje1Text,
      mensajeNumero: 1,
      nervousnessLevel: 'tranquilo',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([initialMsg]);
    soundManager.playTypewriter();
  };

  // Handle user asking question / interrogating suspect
  const handleSendMessage = async (userQuestionText: string) => {
    if (isWaitingResponse || currentMessageNumber >= 11) return;

    soundManager.playTypewriter();

    // Add detective message
    const detectiveMsg: Message = {
      id: `det-${Date.now()}`,
      sender: 'detective',
      text: userQuestionText,
      mensajeNumero: currentMessageNumber,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextMsgNumber = currentMessageNumber + 1;
    setMessages((prev) => [...prev, detectiveMsg]);
    setIsWaitingResponse(true);

    try {
      const response = await fetch('/api/case/interrogate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caso: currentCaso,
          history: messages.map((m) => ({ sender: m.sender, text: m.text })),
          userQuestion: userQuestionText,
          messageNumber: nextMsgNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.contradictionDetected) {
          soundManager.playContradiction();
        } else {
          soundManager.playTypewriter();
        }

        const suspectMsg: Message = {
          id: `susp-${Date.now()}`,
          sender: 'sospechoso',
          text: data.text,
          mensajeNumero: nextMsgNumber,
          nervousnessLevel: data.nervousnessLevel || 'tranquilo',
          contradictionDetected: !!data.contradictionDetected,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, suspectMsg]);
        setCurrentMessageNumber(nextMsgNumber);
        if (data.nervousnessLevel) {
          setCurrentNervousness(data.nervousnessLevel);
        }

        // Auto-trigger accusation prompt on Message 10 if reached
        if (nextMsgNumber >= 10) {
          setIsAccusationOpen(true);
        }
      }
    } catch (err) {
      console.error('Error enviando pregunta:', err);
    } finally {
      setIsWaitingResponse(false);
    }
  };

  // Generate dynamic AI case
  const handleGenerateAiCase = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/case/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success && data.case) {
        startNewCase(data.case, !!data.isAiGenerated);
      }
    } catch (err) {
      console.error('Error generando caso IA:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Submit Final Verdict & Accusation
  const handleSubmitAccusation = async (verdictText: string) => {
    setIsWaitingResponse(true);
    soundManager.playGavel();

    try {
      const res = await fetch('/api/case/verdict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caso: currentCaso,
          userVerdict: verdictText,
          history: messages.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await res.json();
      if (data.success && data.finalSolution) {
        setFinalSolution(data.finalSolution);
        setGameStatus('resuelto');
        setIsAccusationOpen(false);
      }
    } catch (err) {
      console.error('Error al entregar veredicto:', err);
    } finally {
      setIsWaitingResponse(false);
    }
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.enabled = next;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-zinc-100">
      
      {/* Top Header */}
      <Header
        currentCaso={currentCaso}
        presetCases={PRESET_CASES}
        onSelectCase={(c) => startNewCase(c, false)}
        onGenerateAiCase={handleGenerateAiCase}
        isGeneratingAi={isGeneratingAi}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenNotebook={() => setIsNotebookOpen(true)}
        isAiGenerated={isAiGenerated}
      />

      {/* Main Content Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 lg:p-6 flex flex-col">
        {gameStatus === 'resuelto' && finalSolution ? (
          <FinalSolutionView
            finalSolution={finalSolution}
            caso={currentCaso}
            onNewGame={() => startNewCase(PRESET_CASES[0], false)}
            onNewAiGame={handleGenerateAiCase}
          />
        ) : (
          <>
            {/* Mobile View Switcher (Visible only on small screens) */}
            <div className="flex lg:hidden bg-zinc-900 p-1 rounded-sm border border-zinc-800 mb-3 font-mono text-xs">
              <button
                onClick={() => setActiveMobileTab('chat')}
                className={`flex-1 py-2 rounded-sm font-bold uppercase tracking-wider transition text-center ${
                  activeMobileTab === 'chat'
                    ? 'bg-zinc-100 text-zinc-950 shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                💬 Interrogatorio
              </button>
              <button
                onClick={() => setActiveMobileTab('dossier')}
                className={`flex-1 py-2 rounded-sm font-bold uppercase tracking-wider transition text-center ${
                  activeMobileTab === 'dossier'
                    ? 'bg-zinc-100 text-zinc-950 shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                📁 Expediente y Pistas
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-1">
              
              {/* Left Column: Dossier & Evidence */}
              <div className={`w-full lg:w-80 xl:w-96 ${activeMobileTab === 'dossier' ? 'block' : 'hidden lg:block'}`}>
                <CaseDossier
                  caso={currentCaso}
                  currentNervousness={currentNervousness}
                  onInspectEvidence={(ev) => setInspectingEvidence(ev)}
                  onCiteEvidence={(ev) => {
                    setCitingEvidence(ev);
                    setActiveMobileTab('chat');
                  }}
                />
              </div>

              {/* Right Column: Interrogation Chat Room */}
              <div className={`flex-1 ${activeMobileTab === 'chat' ? 'block' : 'hidden lg:block'}`}>
                <InterrogationChat
                  caso={currentCaso}
                  messages={messages}
                  currentMessageNumber={currentMessageNumber}
                  isWaitingResponse={isWaitingResponse}
                  onSendMessage={handleSendMessage}
                  onOpenVerdictModal={() => setIsAccusationOpen(true)}
                  selectedEvidenceToCite={citingEvidence}
                  onClearSelectedEvidence={() => setCitingEvidence(null)}
                />
              </div>

            </div>
          </>
        )}
      </div>

      {/* Overlays and Modals */}
      <EvidenceModal
        evidence={inspectingEvidence}
        onClose={() => setInspectingEvidence(null)}
        onCite={(ev) => setCitingEvidence(ev)}
      />

      <AccusationModal
        caso={currentCaso}
        isOpen={isAccusationOpen}
        onClose={() => setIsAccusationOpen(false)}
        onSubmitAccusation={handleSubmitAccusation}
        isSubmitting={isWaitingResponse}
        messageNumber={currentMessageNumber}
      />

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <DetectiveNotebook
        caso={currentCaso}
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
      />

      {/* Footer copyright */}
      <footer className="bg-zinc-950 border-t border-zinc-900 py-3 text-center text-[11px] font-mono text-zinc-600">
        POLICÍA JUDICIAL • SISTEMA DE INTERROGATORIOS CRIMINALES Y RESOLUCIÓN DE MISTERIOS
      </footer>

    </div>
  );
}
