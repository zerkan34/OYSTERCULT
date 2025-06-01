import React, { useState, useEffect } from "react";
import { SlideQuestion } from "./SlideQuestion";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

// Types
export type ZoneType = "MEDITERRANEE" | "ATLANTIQUE";

export const OnboardingFlow: React.FC = () => {
  // Steps: 0 = zone, 1 = nb tables, 2 = tables schema, 3 = nb cordes, 4 = nb mètres, 5 = nb huîtres, 6 = récapitulatif
  const [step, setStep] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0);
  const [zone, setZone] = useState<ZoneType | null>(null);
  const [nbTables, setNbTables] = useState<number>(1);
  const [tablesSelected, setTablesSelected] = useState<boolean[]>([]);
  const [cordesParPerche, setCordesParPerche] = useState<number | null>(null);
  const [metres, setMetres] = useState<number | null>(null);
  const [huitresParCorde, setHuitresParCorde] = useState<number | null>(null);

  const navigate = useNavigate();

  // Mettre à jour maxStepReached automatiquement si on avance
  useEffect(() => {
    if (step > maxStepReached) {
      setMaxStepReached(step);
    }
  }, [step, maxStepReached]);

  // Handlers for each step
  const handleZone = (value: ZoneType) => {
    setZone(value);
    setStep(1); // Passe directement à la question suivante
  };

  const handleNbTables = (value: number) => {
    setNbTables(value);
    setTablesSelected(Array(value).fill(false));
  };

  const handleTableToggle = (idx: number) => {
    setTablesSelected((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  const handleCordes = (value: number) => {
    setCordesParPerche(value);
  };

  const handleMetres = (value: number) => {
    setMetres(value);
  };

  const handleHuitres = (value: number) => {
    setHuitresParCorde(value);
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center min-h-[480px]">
      {/* Flèche retour si possible */}
      {step > 0 && step <= 6 && (
        <button
          className="absolute top-8 left-8 z-20 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 bg-white/10 rounded-full p-2 shadow"
          onClick={() => setStep(step - 1)}
          aria-label="Retour à l'étape précédente"
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </button>
      )}
      {/* Flèche suivant si on est revenu en arrière (pas sur la première étape) */}
      {step > 0 && step < maxStepReached && step < 6 && (
        <button
          className="absolute top-8 right-8 z-20 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 bg-white/10 rounded-full p-2 shadow"
          onClick={() => setStep(step + 1)}
          aria-label="Aller à l'étape suivante"
        >
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      )}
      {step === 0 && <SlideQuestion onSelect={handleZone} onSkip={() => navigate('/dashboard')} />}
      {step === 1 && (
        <div
          className="flex flex-col items-center justify-center min-h-[440px] py-1.5 px-12 border border-white/10 rounded-lg relative w-full max-w-5xl mx-auto animate-fade-in"
          style={{ opacity: 1, transform: 'none' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tables-question-title"
        >
          {/* Overlay glassy-gradient */}
          <div className="absolute -inset-[1px] rounded-lg z-0" style={{ background: 'linear-gradient(90deg, rgba(34, 211, 238, 0.03), rgba(56, 189, 248, 0.05), rgba(34, 211, 238, 0.03))', boxShadow: 'rgba(34, 211, 238, 0.263) 0px 0px 3.25px, rgba(34, 211, 238, 0.263) 0px 0px 2.62px inset' }} aria-hidden="true" />
          <div className="flex flex-col items-center w-full relative z-10 py-6 md:py-10 px-4">
            <div className="w-full flex flex-col items-center gap-8 mb-10">
              <motion.span 
                className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-xl animate-pop mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Sparkles size={48} className="text-white drop-shadow-[0_0_16px_rgba(34,211,238,0.95)]" aria-hidden="true" />
              </motion.span>
              <motion.h2 
                id="tables-question-title" 
                className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_0_24px_rgba(34,211,238,0.8)] text-center mb-0 whitespace-nowrap" 
                style={{ letterSpacing: '0.04em' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                Combien de tables de production avez-vous&nbsp;?
              </motion.h2>
              <motion.p 
                className="text-white/70 text-xl md:text-2xl text-center mb-4 max-w-3xl mx-auto whitespace-nowrap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                Indiquez le nombre total de tables actives sur votre site.
              </motion.p>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                aria-label="Diminuer le nombre de tables"
                onClick={() => handleNbTables(Math.max(1, nbTables - 1))}
                disabled={nbTables <= 1}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12" /></svg>
              </button>
              <input
                type="number"
                min={1}
                max={20}
                className="text-xl text-center w-20 p-2 rounded-lg bg-white/20 text-cyan-600 border-2 border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 appearance-none hide-spin"
                aria-label="Nombre de tables de production"
                value={nbTables}
                onChange={e => handleNbTables(Math.max(1, Math.min(20, Number(e.target.value))))}
                style={{ MozAppearance: 'textfield' }}
              />
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                aria-label="Augmenter le nombre de tables"
                onClick={() => handleNbTables(Math.min(20, nbTables + 1))}
                disabled={nbTables >= 20}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              </button>
            </div>
            <button
              className="mt-2 px-6 py-2 rounded-full bg-cyan-500/20 text-cyan-400 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-cyan-400/40 text-base transition-all duration-300"
              onClick={() => {
                handleNbTables(nbTables); // force la synchro
                setStep(2);
              }}
            >
              Suivant
            </button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div
          className="flex flex-col items-center justify-center min-h-[440px] py-1.5 px-12 border border-white/10 rounded-lg relative w-full max-w-5xl mx-auto animate-fade-in"
          style={{ opacity: 1, transform: 'none' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tables-select-title"
        >
          {/* Overlay glassy-gradient */}
          <div className="absolute -inset-[1px] rounded-lg z-0" style={{ background: 'linear-gradient(90deg, rgba(34, 211, 238, 0.03), rgba(56, 189, 248, 0.05), rgba(34, 211, 238, 0.03))', boxShadow: 'rgba(34, 211, 238, 0.263) 0px 0px 3.25px, rgba(34, 211, 238, 0.263) 0px 0px 2.62px inset' }} aria-hidden="true" />
          <div className="flex flex-col items-center w-full relative z-10 py-6 md:py-10 px-4">
            <div className="w-full flex flex-col items-center gap-8 mb-10">
              <span className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-xl animate-pop mb-2">
                <Sparkles size={48} className="text-white drop-shadow-[0_0_16px_rgba(34,211,238,0.95)]" aria-hidden="true" />
              </span>
              <h2 id="tables-select-title" className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_0_24px_rgba(34,211,238,0.8)] text-center mb-0 whitespace-nowrap" style={{ letterSpacing: '0.04em' }}>
                Sélectionnez vos tables de production
              </h2>
              <p className="text-white/70 text-xl md:text-2xl text-center mb-4 max-w-3xl mx-auto whitespace-nowrap">
                Cliquez sur chaque table pour valider qu'elle contient bien 100 perches.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center mb-4">
              {Array.from({ length: nbTables }).map((_, i) => (
                <motion.button
                  type="button"
                  className={`w-14 h-20 rounded-lg border-2 transition-all duration-200 flex items-center justify-center text-base font-bold select-none focus:outline-none focus:ring-2 focus:ring-cyan-400/40 shadow-md ${tablesSelected[i] ? 'bg-cyan-400/30 border-cyan-400 text-cyan-900 shadow-lg scale-105' : 'bg-white/10 border-white/30 text-white/70 hover:border-cyan-400/40'}`}
                  aria-pressed={tablesSelected[i]}
                  aria-label={`Table ${i + 1}`}
                  onClick={() => handleTableToggle(i)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                >
                  Table {i + 1}
                </motion.button>
              ))}
            </div>
            <motion.button
              className="mt-2 px-6 py-2 rounded-full bg-cyan-500/20 text-cyan-400 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-cyan-400/40 text-base transition-all duration-300"
              onClick={() => setStep(3)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              Suivant
            </motion.button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div
          className="flex flex-col items-center justify-center min-h-[440px] py-1.5 px-12 border border-white/10 rounded-lg relative w-full max-w-5xl mx-auto animate-fade-in"
          style={{ opacity: 1, transform: 'none' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cordes-question-title"
        >
          {/* Overlay glassy-gradient */}
          <div className="absolute -inset-[1px] rounded-lg z-0" style={{ background: 'linear-gradient(90deg, rgba(34, 211, 238, 0.03), rgba(56, 189, 248, 0.05), rgba(34, 211, 238, 0.03))', boxShadow: 'rgba(34, 211, 238, 0.263) 0px 0px 3.25px, rgba(34, 211, 238, 0.263) 0px 0px 2.62px inset' }} aria-hidden="true" />
          <div className="flex flex-col items-center w-full relative z-10 py-6 md:py-10 px-4">
            <div className="w-full flex flex-col items-center gap-8 mb-10">
              <span className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-xl animate-pop mb-2">
                <Sparkles size={48} className="text-white drop-shadow-[0_0_16px_rgba(34,211,238,0.95)]" aria-hidden="true" />
              </span>
              <h2 id="cordes-question-title" className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_0_24px_rgba(34,211,238,0.8)] text-center mb-0 whitespace-nowrap" style={{ letterSpacing: '0.04em' }}>
                Combien de cordes pendez-vous par perche&nbsp;?
              </h2>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                aria-label="Diminuer le nombre de cordes"
                onClick={() => setCordesParPerche(Math.max(1, (cordesParPerche ?? 1) - 1))}
                disabled={cordesParPerche <= 1}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
              </button>
              <input
                type="number"
                min={1}
                max={10}
                value={cordesParPerche ?? ''}
                onChange={e => setCordesParPerche(Math.max(1, Math.min(10, Number(e.target.value))))}
                className="text-xl text-center w-20 p-2 rounded-lg bg-white/20 text-cyan-600 border-2 border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 appearance-none hide-spin"
                aria-label="Nombre de cordes par perche"
                style={{ MozAppearance: 'textfield' }}
                onKeyDown={e => {
                  if (["Enter", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) e.stopPropagation();
                }}
                onWheel={e => e.stopPropagation()}
              />
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                aria-label="Augmenter le nombre de cordes"
                onClick={() => setCordesParPerche(Math.min(10, (cordesParPerche ?? 1) + 1))}
                disabled={cordesParPerche >= 10}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              </button>
            </div>
            <button
              type="button"
              className="mt-2 px-6 py-2 rounded-full bg-cyan-500/20 text-cyan-400 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-cyan-400/40 text-base transition-all duration-300 disabled:opacity-60"
              onClick={() => cordesParPerche && setStep(4)}
              disabled={!cordesParPerche}
            >
              Suivant
            </button>
          </div>
        </div>
      )}
      {step === 4 && (
        <div
          className="flex flex-col items-center justify-center min-h-[440px] py-1.5 px-12 border border-white/10 rounded-lg relative w-full max-w-5xl mx-auto animate-fade-in"
          style={{ opacity: 1, transform: 'none' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="metres-question-title"
        >
          {/* Overlay glassy-gradient */}
          <div className="absolute -inset-[1px] rounded-lg z-0" style={{ background: 'linear-gradient(90deg, rgba(34, 211, 238, 0.03), rgba(56, 189, 248, 0.05), rgba(34, 211, 238, 0.03))', boxShadow: 'rgba(34, 211, 238, 0.263) 0px 0px 3.25px, rgba(34, 211, 238, 0.263) 0px 0px 2.62px inset' }} aria-hidden="true" />
          <div className="flex flex-col items-center w-full relative z-10 py-6 md:py-10 px-4">
            <div className="w-full flex flex-col items-center gap-8 mb-10">
              <span className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-xl animate-pop mb-2">
                <Sparkles size={48} className="text-white drop-shadow-[0_0_16px_rgba(34,211,238,0.95)]" aria-hidden="true" />
              </span>
              <h2 id="metres-question-title" className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_0_24px_rgba(34,211,238,0.8)] text-center mb-0 whitespace-nowrap" style={{ letterSpacing: '0.04em' }}>
                Sur combien de mètres collez-vous&nbsp;?
              </h2>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                aria-label="Diminuer le nombre de mètres"
                onClick={() => setMetres(Math.max(1, (metres ?? 1) - 1))}
                disabled={metres <= 1}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
              </button>
              <input
                type="number"
                min={1}
                max={100}
                value={metres ?? ''}
                onChange={e => setMetres(Math.max(1, Math.min(100, Number(e.target.value))))}
                className="text-xl text-center w-20 p-2 rounded-lg bg-white/20 text-cyan-600 border-2 border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 appearance-none hide-spin"
                aria-label="Nombre de mètres"
                style={{ MozAppearance: 'textfield' }}
                onKeyDown={e => {
                  if (["Enter", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) e.stopPropagation();
                }}
                onWheel={e => e.stopPropagation()}
              />
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                aria-label="Augmenter le nombre de mètres"
                onClick={() => setMetres(Math.min(100, (metres ?? 1) + 1))}
                disabled={metres >= 100}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              </button>
            </div>
            <button
              type="button"
              className="mt-2 px-6 py-2 rounded-full bg-cyan-500/20 text-cyan-400 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-cyan-400/40 text-base transition-all duration-300 disabled:opacity-60"
              onClick={() => metres && setStep(5)}
              disabled={!metres}
            >
              Suivant
            </button>
          </div>
        </div>
      )}
      {step === 5 && (
        <div
          className="flex flex-col items-center justify-center min-h-[440px] py-1.5 px-12 border border-white/10 rounded-lg relative w-full max-w-5xl mx-auto animate-fade-in"
          style={{ opacity: 1, transform: 'none' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="huitres-question-title"
        >
          {/* Overlay glassy-gradient */}
          <div className="absolute -inset-[1px] rounded-lg z-0" style={{ background: 'linear-gradient(90deg, rgba(34, 211, 238, 0.03), rgba(56, 189, 248, 0.05), rgba(34, 211, 238, 0.03))', boxShadow: 'rgba(34, 211, 238, 0.263) 0px 0px 3.25px, rgba(34, 211, 238, 0.263) 0px 0px 2.62px inset' }} aria-hidden="true" />
          <div className="flex flex-col items-center w-full relative z-10 py-6 md:py-10 px-4">
            <div className="w-full flex flex-col items-center gap-8 mb-10">
              <span className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-xl animate-pop mb-2">
                <Sparkles size={48} className="text-white drop-shadow-[0_0_16px_rgba(34,211,238,0.95)]" aria-hidden="true" />
              </span>
              <h2 id="huitres-question-title" className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_0_24px_rgba(34,211,238,0.8)] text-center mb-0 whitespace-nowrap" style={{ letterSpacing: '0.04em' }}>
                Combien d’huîtres par corde&nbsp;?
              </h2>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                aria-label="Diminuer le nombre d’huîtres"
                onClick={() => setHuitresParCorde(Math.max(1, (huitresParCorde ?? 1) - 1))}
                disabled={huitresParCorde <= 1}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
              </button>
              <input
                type="number"
                min={1}
                max={10000}
                value={huitresParCorde ?? ''}
                onChange={e => setHuitresParCorde(Math.max(1, Math.min(10000, Number(e.target.value))))}
                className="text-xl text-center w-20 p-2 rounded-lg bg-white/20 text-cyan-600 border-2 border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 appearance-none hide-spin"
                aria-label="Nombre d’huîtres par corde"
                style={{ MozAppearance: 'textfield' }}
                onKeyDown={e => {
                  if (["Enter", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) e.stopPropagation();
                }}
                onWheel={e => e.stopPropagation()}
              />
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                aria-label="Augmenter le nombre d’huîtres"
                onClick={() => setHuitresParCorde(Math.min(10000, (huitresParCorde ?? 1) + 1))}
                disabled={huitresParCorde >= 10000}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              </button>
            </div>
            <button
              type="button"
              className="mt-2 px-6 py-2 rounded-full bg-cyan-500/20 text-cyan-400 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-cyan-400/40 text-base transition-all duration-300 disabled:opacity-60"
              onClick={() => huitresParCorde && setStep(6)}
              disabled={!huitresParCorde}
            >
              Suivant
            </button>
          </div>
        </div>
      )}
      {step === 6 && (
        <div
          className="flex flex-col items-center justify-center min-h-[440px] py-1.5 px-12 border border-white/10 rounded-lg relative w-full max-w-5xl mx-auto animate-fade-in"
          style={{ opacity: 1, transform: 'none' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="recap-question-title"
        >
          {/* Overlay glassy-gradient */}
          <div className="absolute -inset-[1px] rounded-lg z-0" style={{ background: 'linear-gradient(90deg, rgba(34, 211, 238, 0.03), rgba(56, 189, 248, 0.05), rgba(34, 211, 238, 0.03))', boxShadow: 'rgba(34, 211, 238, 0.263) 0px 0px 3.25px, rgba(34, 211, 238, 0.263) 0px 0px 2.62px inset' }} aria-hidden="true" />
          <div className="flex flex-col items-center w-full relative z-10 py-6 md:py-10 px-4">
            <div className="w-full flex flex-col items-center gap-8 mb-10">
              <span className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-xl animate-pop mb-2">
                <Sparkles size={48} className="text-white drop-shadow-[0_0_16px_rgba(34,211,238,0.95)]" aria-hidden="true" />
              </span>
              <h2 id="recap-question-title" className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_0_24px_rgba(34,211,238,0.8)] text-center mb-0 whitespace-nowrap" style={{ letterSpacing: '0.04em' }}>
                Récapitulatif de vos paramètres
              </h2>
            </div>
            <p className="text-white/80 text-base md:text-lg text-center mb-6 max-w-lg mx-auto">
              Voici un résumé de votre configuration de production. Vous pourrez la modifier à tout moment dans l'onglet <span className='text-cyan-400 font-semibold'>Configuration</span>.
            </p>
            <div className="w-full bg-white/10 rounded-xl p-4 mb-6 flex flex-col gap-2 border border-white/10">
              <div className="flex justify-between text-white/90"><span className="font-semibold">Zone de production :</span> <span className="text-cyan-300 font-bold">{zone}</span></div>
              <div className="flex justify-between text-white/90"><span className="font-semibold">Nombre de tables :</span> <span>{nbTables}</span></div>
              <div className="flex justify-between text-white/90"><span className="font-semibold">Tables sélectionnées :</span> <span>{tablesSelected.filter(Boolean).length} / {nbTables}</span></div>
              <div className="flex justify-between text-white/90"><span className="font-semibold">Cordes par perche :</span> <span>{cordesParPerche}</span></div>
              <div className="flex justify-between text-white/90"><span className="font-semibold">Mètres par corde :</span> <span>{metres}</span></div>
              <div className="flex justify-between text-white/90"><span className="font-semibold">Huîtres par corde :</span> <span>{huitresParCorde}</span></div>
            </div>
            <button
              type="button"
              className="mt-2 px-8 py-3 rounded-full bg-cyan-500/20 text-cyan-400 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-cyan-400/40 text-lg transition-all duration-300 disabled:opacity-60"
              onClick={() => navigate("/dashboard")}
              aria-label="Terminer et accéder au dashboard"
            >
              Terminer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
