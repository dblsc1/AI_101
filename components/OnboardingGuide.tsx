
import React, { useState } from 'react';

interface Step {
  id: number;
  title: string;
  description: string;
  target: 'scroll' | 'expand' | 'add' | 'core';
}

const STEPS: Step[] = [
  { id: 1, title: 'Explore the Galaxy', description: 'Scroll or swipe up/down to navigate through curriculum domains.', target: 'scroll' },
  { id: 2, title: 'Access Modules', description: 'Click or hover on a domain bubble to reveal its specific knowledge modules.', target: 'expand' },
  { id: 3, title: 'Build Your Registry', description: 'Use the "+" icon to add modules to your personalized learning queue.', target: 'add' },
  { id: 4, title: 'Generate Report', description: 'Open the Data Core at the bottom right to analyze your selection across all grade tiers.', target: 'core' },
];

const OnboardingGuide: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      onClose();
    }
  };

  const step = STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="relative glass-effect p-8 md:p-12 rounded-[2.5rem] max-w-sm w-full border-[#00d4ff]/30 shadow-[0_0_50px_rgba(0,212,255,0.1)] text-center">
        
        {/* Step Visual Indicator */}
        <div className="flex justify-center gap-1.5 mb-8">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === currentStep ? 'w-8 bg-[#00d4ff]' : 'w-2 bg-white/10'}`} />
          ))}
        </div>

        {/* Animated Target Visualizer (Conceptual) */}
        <div className="mb-6 h-20 flex items-center justify-center">
          {step.target === 'scroll' && (
             <div className="flex flex-col items-center gap-2 animate-bounce">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2"><path d="M7 13l5 5 5-5M7 6l5 5 5-5" /></svg>
                <span className="text-[8px] uppercase tracking-[0.3em] text-[#00d4ff]">Swipe Up/Down</span>
             </div>
          )}
          {step.target === 'expand' && (
             <div className="relative w-16 h-16 border-2 border-dashed border-[#00d4ff]/30 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-[#00d4ff]/20 border border-[#00d4ff]/40" />
                <span className="absolute -bottom-6 text-[8px] uppercase tracking-[0.3em] text-[#00d4ff]">Click Bubble</span>
             </div>
          )}
          {step.target === 'add' && (
             <div className="w-10 h-10 rounded-xl bg-[#00d4ff]/10 border border-[#00d4ff]/40 flex items-center justify-center animate-pulse">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="3"><path d="M12 5v14M5 12h14" /></svg>
             </div>
          )}
          {step.target === 'core' && (
             <div className="w-14 h-14 rounded-full border-2 border-[#00d4ff]/50 flex items-center justify-center animate-spin-slow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v10M7 12h10" /></svg>
             </div>
          )}
        </div>

        <h3 className="text-white text-xl font-light tracking-widest uppercase mb-4">{step.title}</h3>
        <p className="text-white/50 text-sm leading-relaxed mb-10 font-light">{step.description}</p>

        <button 
          onClick={next}
          className="w-full py-4 rounded-2xl bg-[#00d4ff]/10 hover:bg-[#00d4ff] text-[#00d4ff] hover:text-black border border-[#00d4ff]/30 text-[9px] tracking-[0.5em] font-black uppercase transition-all duration-500"
        >
          {currentStep === STEPS.length - 1 ? 'Start Exploration' : 'Next Step'}
        </button>

        <button 
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center text-white/20 hover:text-white transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default OnboardingGuide;
