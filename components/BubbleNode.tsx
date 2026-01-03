
import React from 'react';
import { Domain, Module } from '../constants';

interface BubbleNodeProps {
  domain: Domain;
  isActive: boolean;
  isGlobalActive: boolean;
  isDimmed: boolean;
  onHover: (id: string | null) => void;
  onClose: () => void;
  onModuleClick: (module: Module) => void;
  onAddToCart: (module: Module, x: number, y: number) => void;
  index: number;
  currentIndex: number;
  total: number;
}

const BubbleNode: React.FC<BubbleNodeProps> = ({ 
  domain, 
  isActive,
  isGlobalActive,
  isDimmed, 
  onHover, 
  onClose,
  onModuleClick, 
  onAddToCart,
  index, 
  currentIndex,
  total 
}) => {
  const diff = index - currentIndex;
  const absDiff = Math.abs(diff);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  // Show only 3 nodes: previous, current, next
  const isVisibleInWheel = absDiff < 1.5;
  const isCentered = absDiff < 0.2;
  
  // High-performance styling
  const scale = isCentered ? 1.15 : (isVisibleInWheel ? 0.75 : 0.5);
  const opacity = isCentered ? 1 : (isVisibleInWheel ? 0.4 : 0);
  const zIndex = isCentered ? 100 : 50;
  
  const translateY = diff * (isMobile ? 180 : 260); 
  const translateZ = -absDiff * (isMobile ? 100 : 300);
  const translateX = isMobile ? 0 : -200 - (absDiff * 80); 

  if (!isVisibleInWheel && !isActive) return null;

  return (
    <div 
      className={`${isActive && isMobile ? 'fixed inset-0 z-[500]' : 'absolute'} flex items-center justify-center transition-all duration-[800ms] ease-[cubic-bezier(0.16, 1, 0.3, 1)] ${isGlobalActive && !isActive ? 'pointer-events-none' : 'pointer-events-auto'}`}
      style={isActive && isMobile ? {} : {
        transform: `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) scale(${scale})`,
        opacity: isGlobalActive && !isActive ? 0 : opacity,
        zIndex: zIndex,
        willChange: 'transform, opacity'
      }}
    >
      {/* Primary Knowledge Node Bubble */}
      {!isActive && (
        <div 
          onClick={() => !isGlobalActive && onHover(domain.id)}
          className={`
            relative w-64 h-64 md:w-80 md:h-80 rounded-full flex flex-col items-center justify-center 
            text-center cursor-pointer no-select transition-all duration-[600ms]
            ${isCentered ? 'border-[#00d4ff]/60 bg-[#00d4ff]/5 shadow-[0_0_80px_rgba(0,212,255,0.15)]' : 'border-white/10 bg-white/[0.02]'}
            border
          `}
        >
          <div className={`flex flex-col items-center transition-all duration-500 ${isCentered ? 'opacity-90' : 'opacity-40'}`}>
            <span className="text-[#00d4ff] text-[8px] md:text-[9px] tracking-[0.6em] md:tracking-[0.8em] font-bold mb-4 md:mb-6 uppercase">
              PHASE // 0{index + 1}
            </span>
            <span className={`text-white font-bold tracking-[0.05em] md:tracking-[0.2em] px-2 md:px-12 leading-tight transition-all duration-500 whitespace-nowrap overflow-visible ${isCentered ? 'text-[1.1rem] md:text-4xl' : 'text-xl md:text-2xl'}`}>
              {domain.title}
            </span>
            <div className={`mt-6 md:mt-10 w-16 md:w-20 h-[1px] bg-gradient-to-r from-transparent via-[#00d4ff]/40 to-transparent`} />
          </div>
        </div>
      )}

      {/* Module List Popup - Shifted upwards on mobile */}
      {isActive && (
        <div 
          className={`
            flex flex-col pointer-events-auto transition-all duration-700 animate-in fade-in zoom-in
            ${isMobile 
              ? 'fixed left-4 right-4 top-[8vh] bottom-[32vh] w-auto max-h-none h-auto' 
              : 'absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[480px] max-h-[80vh]'
            }
          `}
        >
          {/* Backdrop for mobile active state */}
          {isMobile && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm -z-10" onClick={onClose} />}
          
          <div className="glass-effect p-6 md:p-8 rounded-[2rem] border-white/10 flex flex-col shadow-2xl relative overflow-hidden h-full">
            <div className="flex items-center justify-between mb-6 shrink-0">
               <div className="flex flex-col">
                  <span className="text-[#00d4ff]/60 text-[8px] tracking-[0.5em] uppercase font-bold mb-1">Knowledge Cluster // 知识集群</span>
                  <h3 className="text-white text-lg md:text-2xl font-light tracking-widest uppercase">{domain.title}</h3>
               </div>
               <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-[#00d4ff] hover:bg-white/10 transition-all border border-white/5 z-20"
               >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
               </button>
            </div>

            <div 
              className="flex flex-col gap-3 overflow-y-auto scrollbar-hide py-2 pr-2 touch-pan-y flex-grow"
              onWheel={(e) => e.stopPropagation()}
              style={{ scrollbarWidth: 'none' }}
            >
               {domain.modules.map((module, mIdx) => (
                  <div
                    key={module.id}
                    className="flex-shrink-0 w-full"
                    style={{
                      animation: `moduleEnter 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${mIdx * 0.1}s forwards`,
                      opacity: 0,
                      transform: 'translateY(20px)',
                      willChange: 'transform, opacity'
                    }}
                  >
                    <div
                      className={`
                        group relative glass-effect w-full flex items-center justify-between transition-all duration-500
                        px-5 py-4 rounded-2xl border-white/5 hover:border-[#00d4ff]/30 hover:bg-white/5
                      `}
                    >
                      <div className="flex flex-col items-start text-left cursor-pointer flex-grow pr-4" onClick={() => onModuleClick(module)}>
                        <span className="text-[7px] text-[#00d4ff]/30 tracking-[0.4em] uppercase mb-0.5 font-bold">NODE // 模块 {mIdx + 1}</span>
                        <span className="text-white/80 group-hover:text-white text-xs md:text-sm font-light tracking-wider transition-colors">
                          {module.name}
                        </span>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                          onAddToCart(module, rect.left + rect.width / 2, rect.top + rect.height / 2);
                        }}
                        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 hover:border-[#00d4ff]/60 hover:bg-[#00d4ff]/20 text-[#00d4ff]/40 hover:text-[#00d4ff] transition-all bg-white/[0.02]"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                      </button>
                    </div>
                  </div>
               ))}
            </div>
            
            <div className="mt-6 flex justify-center opacity-20 shrink-0">
               <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-white" />
                  <div className="w-1 h-1 rounded-full bg-white" />
                  <div className="w-1 h-1 rounded-full bg-white" />
               </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes moduleEnter {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default BubbleNode;
