
import React from 'react';
import { Domain, Module } from '../constants';

interface BubbleNodeProps {
  domain: Domain;
  isActive: boolean;
  isDimmed: boolean;
  onHover: (id: string | null) => void;
  onModuleClick: (module: Module) => void;
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
  index, 
  currentIndex,
  total 
}) => {
  const diff = index - currentIndex;
  const absDiff = Math.abs(diff);
  
  // Visibility threshold for primary bubble content
  const showContent = absDiff < 0.3;
  
  // 3D Stack positioning logic - Responsive adjustments
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  const scale = isActive ? 1.05 : Math.max(0.4, 1 - absDiff * 0.28);
  const opacity = isActive ? 1 : Math.max(0, 0.45 - absDiff * 0.3);
  const zIndex = 100 - Math.round(absDiff * 30);
  
  // Responsive translation
  // On mobile, we move the bubble UP (negative translateY) to make room for sub-bubbles
  const translateY = diff * (isMobile ? 120 : 140) + (isMobile && isActive ? -80 : 0); 
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
        <div className={`transition-all duration-[800ms] flex flex-col items-center ${showContent ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-90 blur-2xl'}`}>
          <span className="text-[#00d4ff] text-[8px] md:text-[9px] tracking-[0.6em] md:tracking-[0.8em] font-bold mb-4 md:mb-6 uppercase opacity-40">
            PHASE // 0{index + 1}
          </span>
          <span className="text-white font-bold text-xl md:text-3xl tracking-[0.15em] md:tracking-[0.2em] px-8 md:px-12 leading-tight">
            {domain.title}
          </span>
          <div className="mt-6 md:mt-10 w-16 md:w-20 h-[1px] bg-gradient-to-r from-transparent via-[#00d4ff]/40 to-transparent" />
        </div>

        {!showContent && (
           <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
        )}
      </div>

      {/* Vertical Module List - Responsive Position */}
      {isActive && (
        <div 
          className={`
            absolute flex flex-col gap-4 pointer-events-auto overflow-y-auto scrollbar-hide py-8 touch-pan-y
            ${isMobile 
              ? 'left-1/2 -translate-x-1/2 top-[85%] w-[90vw] max-h-[45vh] items-center' 
              : 'left-[125%] top-1/2 -translate-y-1/2 w-[340px] max-h-[60vh] pr-6'
            }
          `}
          // Partitioning: stop propagation so inner scroll doesn't affect outer navigation
          onWheel={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            maskImage: isMobile 
              ? 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
              : 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
          }}
        >
           {domain.modules.map((module, mIdx) => (
              <div
                key={module.id}
                className="flex-shrink-0 w-full"
                style={{
                  animation: `moduleEnter 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${mIdx * 0.12}s forwards`,
                  opacity: 0,
                  transform: isMobile ? 'translateY(20px)' : 'translateX(60px)'
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onModuleClick(module);
                  }}
                  className={`
                    group relative glass-effect w-full flex items-center justify-between transition-all duration-700
                    ${isMobile ? 'px-6 py-4 rounded-2xl' : 'pl-10 pr-8 py-5 rounded-3xl'}
                    border-white/5 hover:border-[#00d4ff]/40 hover:bg-white/5
                  `}
                >
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[7px] text-[#00d4ff]/40 tracking-[0.5em] uppercase mb-1">Module Node</span>
                    <span className="text-white/70 group-hover:text-[#00d4ff] text-sm font-light tracking-[0.2em] md:tracking-[0.25em] uppercase transition-colors">
                      {module.name}
                    </span>
                  </div>
                  
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-[#00d4ff]/30 group-hover:scale-110 transition-all duration-500">
                    <svg width="10" height="10" md:width="12" md:height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/5 group-hover:text-[#00d4ff] transition-colors">
                      <path d="M13 5l7 7-7 7M5 12h14" />
                    </svg>
                  </div>

                  {!isMobile && (
                    <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-10 h-[1px] bg-gradient-to-r from-transparent to-[#00d4ff]/20" />
                  )}
                </button>
              </div>
           ))}
        </div>
      )}

      <style>{`
        @keyframes moduleEnter {
          from { 
            opacity: 0; 
            transform: ${isMobile ? 'translateY(20px)' : 'translateX(60px)'} scale(0.9); 
            filter: blur(10px); 
          }
          to { 
            opacity: 1; 
            transform: ${isMobile ? 'translateY(0)' : 'translateX(0)'} scale(1); 
            filter: blur(0); 
          }
        }
      `}</style>
    </div>
  );
};

export default BubbleNode;
