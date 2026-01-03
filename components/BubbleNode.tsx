
import React from 'react';
import { Domain, Module } from '../constants';

interface BubbleNodeProps {
  domain: Domain;
  isActive: boolean;
  isDimmed: boolean;
  onHover: (id: string | null) => void;
  onModuleClick: (module: Module) => void;
  onAddToCart: (module: Module, x: number, y: number) => void;
  index: number;
  currentIndex: number;
  total: number;
}

const BubbleNode: React.FC<BubbleNodeProps> = ({ 
  domain, 
  isActive, 
  isDimmed, 
  onHover, 
  onModuleClick, 
  onAddToCart,
  index, 
  currentIndex,
  total 
}) => {
  const diff = index - currentIndex;
  const absDiff = Math.abs(diff);
  const showContent = absDiff < 0.3;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  const scale = isActive ? 1.05 : Math.max(0.4, 1 - absDiff * 0.28);
  const opacity = isActive ? 1 : Math.max(0, 0.45 - absDiff * 0.3);
  const zIndex = 100 - Math.round(absDiff * 30);
  
  const translateY = diff * (isMobile ? 120 : 140) + (isMobile && isActive ? -140 : 0); 
  const translateZ = -absDiff * (isMobile ? 150 : 250);
  const translateX = isMobile ? 0 : -200; 

  return (
    <div 
      className="absolute flex items-center justify-center transition-all duration-[1000ms] ease-[cubic-bezier(0.16, 1, 0.3, 1)]"
      style={{
        transform: `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) scale(${scale})`,
        opacity: opacity,
        zIndex: zIndex,
        pointerEvents: absDiff > 0.6 ? 'none' : 'auto' 
      }}
      onMouseEnter={() => !isMobile && absDiff < 0.5 && onHover(domain.id)}
      onMouseLeave={() => !isMobile && onHover(null)}
      onClick={() => isMobile && absDiff < 0.5 && onHover(isActive ? null : domain.id)}
    >
      {/* Primary Knowledge Node Bubble */}
      <div 
        className={`
          relative glass-effect w-56 h-56 md:w-80 md:h-80 rounded-full flex flex-col items-center justify-center 
          text-center cursor-pointer no-select transition-all duration-[1000ms]
          ${isActive ? 'border-[#00d4ff]/40 shadow-[0_0_120px_rgba(0,212,255,0.1)] bg-white/5' : 'border-white/5 bg-transparent'}
        `}
      >
        {/* Click Hint for Desktop */}
        {!isActive && !isMobile && absDiff < 0.3 && (
          <div className="absolute inset-0 rounded-full border border-[#00d4ff]/20 animate-ping opacity-20" />
        )}

        <div className={`transition-all duration-[800ms] flex flex-col items-center ${showContent ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-90 blur-2xl'}`}>
          <span className="text-[#00d4ff] text-[8px] md:text-[9px] tracking-[0.6em] md:tracking-[0.8em] font-bold mb-4 md:mb-6 uppercase opacity-40">
            PHASE // 0{index + 1}
          </span>
          <span className="text-white font-bold text-xl md:text-3xl tracking-[0.15em] md:tracking-[0.2em] px-8 md:px-12 leading-tight">
            {domain.title}
          </span>
          <div className="mt-6 md:mt-10 w-16 md:w-20 h-[1px] bg-gradient-to-r from-transparent via-[#00d4ff]/40 to-transparent" />
          
          {/* Swipe Hint for mobile */}
          {isMobile && !isActive && absDiff < 0.2 && (
            <div className="mt-4 flex flex-col items-center gap-1 opacity-20">
               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
               <span className="text-[6px] uppercase tracking-[0.2em]">Swipe</span>
            </div>
          )}
        </div>
        {!showContent && <div className="w-1.5 h-1.5 rounded-full bg-white/5" />}
      </div>

      {/* Module List Popup */}
      {isActive && (
        <div 
          className={`
            absolute flex flex-col pointer-events-auto transition-all duration-700
            ${isMobile 
              ? 'left-1/2 -translate-x-1/2 top-[65%] w-[92vw] max-h-[45vh]' 
              : 'left-[125%] top-1/2 -translate-y-1/2 w-[360px] max-h-[60vh]'
            }
          `}
        >
          <div className="flex items-center justify-between mb-4 px-4">
             <span className="text-[#00d4ff]/60 text-[8px] tracking-[0.4em] uppercase font-bold">Knowledge Modules</span>
             <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onHover(null);
                }}
                className="w-8 h-8 rounded-full glass-effect flex items-center justify-center text-white/40 hover:text-white transition-colors border-white/5"
             >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
             </button>
          </div>

          <div 
            className="flex flex-col gap-3 overflow-y-auto scrollbar-hide py-2 px-1 touch-pan-y"
            onWheel={(e) => e.stopPropagation()}
            style={{ 
              scrollbarWidth: 'none', 
              maskImage: 'linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)'
            }}
          >
             {domain.modules.map((module, mIdx) => (
                <div
                  key={module.id}
                  className="flex-shrink-0 w-full"
                  style={{
                    animation: `moduleEnter 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${mIdx * 0.1}s forwards`,
                    opacity: 0,
                    transform: isMobile ? 'translateY(15px)' : 'translateX(40px)'
                  }}
                >
                  <div
                    className={`
                      group relative glass-effect w-full flex items-center justify-between transition-all duration-500
                      ${isMobile ? 'px-4 py-3 rounded-xl' : 'pl-8 pr-4 py-4 rounded-3xl'}
                      border-white/5 hover:border-[#00d4ff]/30 hover:bg-white/5
                    `}
                  >
                    <div className="flex flex-col items-start text-left cursor-pointer flex-grow pr-4" onClick={() => onModuleClick(module)}>
                      <span className="text-[6px] text-[#00d4ff]/30 tracking-[0.4em] uppercase mb-0.5 font-bold">Node {mIdx + 1}</span>
                      <span className="text-white/80 group-hover:text-white text-[10px] md:text-sm font-light tracking-[0.1em] md:tracking-[0.15em] uppercase transition-colors">
                        {module.name}
                      </span>
                    </div>
                    
                    <button 
                      title="Add to Curriculum"
                      onClick={(e) => {
                        e.stopPropagation();
                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        onAddToCart(module, rect.left + rect.width / 2, rect.top + rect.height / 2);
                      }}
                      className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-2xl flex items-center justify-center border border-white/5 hover:border-[#00d4ff]/60 hover:bg-[#00d4ff]/20 text-[#00d4ff]/40 hover:text-[#00d4ff] transition-all bg-white/[0.02]"
                    >
                      <svg width="14" height="14" md:width="16" md:height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                    </button>
                  </div>
                </div>
             ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes moduleEnter {
          from { opacity: 0; transform: ${isMobile ? 'translateY(15px)' : 'translateX(40px)'} scale(0.95); filter: blur(8px); }
          to { opacity: 1; transform: ${isMobile ? 'translateY(0)' : 'translateX(0)'} scale(1); filter: blur(0); }
        }
      `}</style>
    </div>
  );
};

export default BubbleNode;
