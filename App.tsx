
import React, { useState, useCallback, useEffect, useRef } from 'react';
import GalaxyBackground from './components/GalaxyBackground';
import BubbleNode from './components/BubbleNode';
import { CURRICULUM_DATA, Module } from './constants';

const App: React.FC = () => {
  const [activeDomainId, setActiveDomainId] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  
  const hoverTimeoutRef = useRef<number | null>(null);
  const lastScrollTime = useRef<number>(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight
    });
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (selectedModule) return;
    e.preventDefault();

    const now = Date.now();
    // 350ms cooldown to ensure purposeful, single-step navigation
    if (now - lastScrollTime.current < 350) return;

    if (Math.abs(e.deltaY) > 5) {
      lastScrollTime.current = now;
      setCurrentIndex(prev => {
        const direction = e.deltaY > 0 ? 1 : -1;
        const next = Math.round(prev) + direction;
        return Math.max(0, Math.min(CURRICULUM_DATA.length - 1, next));
      });
    }
  }, [selectedModule]);

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const handleHover = useCallback((id: string | null) => {
    if (hoverTimeoutRef.current) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    if (id === null) {
      // Retention/Retraction delay: 3s as requested
      // This keeps the bubble expanded and sub-bubbles visible for 3s after mouse leave
      hoverTimeoutRef.current = window.setTimeout(() => {
        setActiveDomainId(null);
      }, 3000);
    } else {
      setActiveDomainId(id);
    }
  }, []);

  const focusedIndex = Math.round(currentIndex);

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-[#010204] flex items-center justify-center"
      onMouseMove={handleMouseMove}
    >
      <GalaxyBackground 
        isFocused={activeDomainId !== null || selectedModule !== null} 
        mousePos={mousePos} 
      />

      {/* Header Info */}
      <div className="fixed top-12 right-12 z-40 text-right pointer-events-none">
        <h1 className="text-white text-3xl font-extralight tracking-[0.4em] mb-2 uppercase">
          AI 101 课程总览
        </h1>
        <div className="h-[1px] w-56 bg-gradient-to-l from-[#00d4ff] to-transparent ml-auto opacity-30" />
        <p className="text-[#00d4ff]/40 text-[9px] tracking-[0.6em] mt-3 uppercase font-medium">
          Universal Knowledge Constellation
        </p>
      </div>

      {/* Snap Indicator */}
      <div className="fixed bottom-24 right-12 z-40 text-right pointer-events-none overflow-hidden h-6">
        <div 
          className="transition-transform duration-700 ease-out"
          style={{ transform: `translateY(-${focusedIndex * 24}px)` }}
        >
          {CURRICULUM_DATA.map((d) => (
            <div key={d.id} className="h-6 text-[#00d4ff]/30 text-[9px] tracking-[0.5em] uppercase font-bold">
              Current Horizon: {d.title}
            </div>
          ))}
        </div>
      </div>

      {/* 3D Content Stack */}
      <div 
        className="relative w-full h-full flex items-center justify-center"
        style={{ perspective: '2000px' }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {CURRICULUM_DATA.map((domain, index) => (
            <BubbleNode 
              key={domain.id}
              domain={domain}
              isActive={activeDomainId === domain.id && Math.abs(index - currentIndex) < 0.4}
              isDimmed={selectedModule !== null}
              onHover={handleHover}
              onModuleClick={setSelectedModule}
              index={index}
              currentIndex={currentIndex}
              total={CURRICULUM_DATA.length}
            />
          ))}
        </div>
      </div>

      {/* Detail Modal Overlay */}
      {selectedModule && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/95 backdrop-blur-3xl cursor-pointer"
            onClick={() => setSelectedModule(null)}
          />
          <div className="relative glass-effect max-w-2xl w-full p-16 rounded-[3rem] border-white/5 shadow-2xl animate-in fade-in zoom-in slide-in-from-bottom-12 duration-700">
            <button 
              onClick={() => setSelectedModule(null)}
              className="absolute top-12 right-12 text-white/10 hover:text-[#00d4ff] transition-all p-2"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            
            <div className="mb-12">
              <span className="text-[#00d4ff] text-[10px] tracking-[1em] font-bold uppercase mb-4 block opacity-50">
                Core Logic Specification
              </span>
              <h2 className="text-white text-4xl font-extralight tracking-[0.15em] leading-tight">
                {selectedModule.name}
              </h2>
            </div>
            
            <p className="text-white/50 leading-relaxed font-light text-xl mb-16 pl-10 border-l-2 border-[#00d4ff]/10">
              {selectedModule.description}
            </p>
            
            <button 
              onClick={() => setSelectedModule(null)}
              className="group flex items-center gap-6 text-[9px] tracking-[0.7em] text-white/30 uppercase hover:text-white transition-all ml-auto"
            >
              <span>Exit Entry</span>
              <div className="w-10 h-[1px] bg-white/10 group-hover:w-20 group-hover:bg-[#00d4ff] transition-all" />
            </button>
          </div>
        </div>
      )}

      {/* Progress Timeline (Left) */}
      <div className="fixed left-12 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-10">
        <div className="text-white/10 text-[8px] tracking-[0.5em] rotate-90 uppercase whitespace-nowrap mb-6">Course Evolution</div>
        <div className="flex flex-col gap-5">
          {CURRICULUM_DATA.map((_, idx) => {
            const isActive = Math.abs(idx - currentIndex) < 0.5;
            return (
              <div key={idx} className="relative flex items-center justify-center">
                <div 
                  className={`w-1 transition-all duration-700 rounded-full ${
                    isActive ? 'h-12 bg-[#00d4ff] shadow-[0_0_20px_#00d4ff]' : 'h-3 bg-white/5'
                  }`}
                />
                {isActive && (
                   <div className="absolute left-8 text-[#00d4ff] font-light text-xl opacity-60 tracking-widest">{idx + 1}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="fixed bottom-12 left-12 z-40 pointer-events-none opacity-40">
        <div className="flex flex-col gap-1">
          <p className="text-white/40 text-[7px] tracking-[0.5em] uppercase font-light">
            Telemetry Stream // Sector {focusedIndex + 1}
          </p>
        </div>
      </div>

      {/* Navigation Hint */}
      <div className={`fixed bottom-12 right-12 transition-all duration-1000 ${selectedModule ? 'opacity-0' : 'opacity-100'}`}>
        <p className="text-white/10 text-[8px] tracking-[0.5em] uppercase flex items-center gap-4">
           Scroll once to navigate constellation
           <div className="w-12 h-[1px] bg-white/5" />
        </p>
      </div>
    </div>
  );
};

export default App;
