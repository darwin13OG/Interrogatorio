import React, { useState, useEffect } from 'react';
import { FileText, X, CheckSquare, Edit3, Trash2, Plus } from 'lucide-react';
import { Caso } from '../types';

interface DetectiveNotebookProps {
  caso: Caso;
  isOpen: boolean;
  onClose: () => void;
}

export const DetectiveNotebook: React.FC<DetectiveNotebookProps> = ({
  caso,
  isOpen,
  onClose,
}) => {
  const storageKey = `detective-notes-${caso.id}`;
  const [notes, setNotes] = useState<string>('');
  const [checklist, setChecklist] = useState<{ id: string; text: string; done: boolean }[]>([]);
  const [newItemText, setNewItemText] = useState('');

  // Load notes on case change
  useEffect(() => {
    const savedNotes = localStorage.getItem(storageKey);
    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes);
        setNotes(parsed.notes || '');
        setChecklist(parsed.checklist || []);
      } catch {
        setNotes('');
      }
    } else {
      // Default initial checklist items
      setNotes('');
      setChecklist([
        { id: '1', text: 'Verificar la coartada horaria del sospechoso', done: false },
        { id: '2', text: 'Citar la Evidencia #1 respecto a la escena', done: false },
        { id: '3', text: 'Buscar contradicción entre la declaración e informe', done: false },
      ]);
    }
  }, [caso.id, storageKey]);

  // Auto-save notes
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ notes, checklist }));
  }, [notes, checklist, storageKey]);

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    setChecklist((prev) => [...prev, { id: Date.now().toString(), text: newItemText.trim(), done: false }]);
    setNewItemText('');
  };

  const toggleCheck = (id: string) => {
    setChecklist((prev) => prev.map((item) => (item.id === item.id ? { ...item, done: !item.done } : item)));
  };

  const removeItem = (id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-zinc-950 border-l border-zinc-800 p-6 shadow-2xl flex flex-col font-sans text-zinc-200">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-zinc-400" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-zinc-300">
            LIBRETA DEL DETECTIVE
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-200 p-1.5 rounded-sm bg-zinc-900 hover:bg-zinc-800 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-1">
        
        {/* Notes Textarea */}
        <div>
          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2 font-bold flex items-center gap-1.5">
            <Edit3 className="w-3.5 h-3.5 text-zinc-400" /> APUNTES Y SOSPECHAS:
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={8}
            placeholder="Anota contradicciones, horarios o mentiras detectadas..."
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-sm p-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none transition leading-relaxed font-mono"
          />
        </div>

        {/* Checklist */}
        <div>
          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2 font-bold flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-zinc-400" /> LISTA DE COMPROBACIÓN:
          </label>

          <form onSubmit={handleAddChecklist} className="flex gap-2 mb-3">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="Nueva tarea o hipótesis..."
              className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-sm px-3 py-1.5 text-xs text-zinc-100 focus:outline-none font-mono"
            />
            <button
              type="submit"
              disabled={!newItemText.trim()}
              className="bg-zinc-100 hover:bg-zinc-300 text-zinc-950 px-3 py-1.5 rounded-sm font-bold transition text-xs disabled:opacity-40 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>

          <div className="space-y-2">
            {checklist.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 bg-zinc-900/80 p-2.5 rounded-sm border border-zinc-800 text-xs font-mono"
              >
                <label className="flex items-center gap-2 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => setChecklist((prev) => prev.map((i) => (i.id === item.id ? { ...i, done: !i.done } : i)))}
                    className="rounded-none border-zinc-700 bg-zinc-950 text-zinc-100 focus:ring-0 cursor-pointer"
                  />
                  <span className={item.done ? 'line-through text-zinc-600' : 'text-zinc-300'}>
                    {item.text}
                  </span>
                </label>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-zinc-600 hover:text-red-400 transition cursor-pointer p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
