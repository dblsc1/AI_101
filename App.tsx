
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
  const touchStartY = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight
    });
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (selectedModule) return;
    
    // Check if the wheel event target is inside a scrollable container (the module list)
    let target = e.target as HTMLElement;
    while (target && target !== document.body) {
      if (target.classList.contains('overflow-y-auto')) {
        // If we're inside the scrollable sub-bubble area, don't trigger phase shift
        return;
      }
      target = target.parentElement as HTMLElement;
    }

    e.preventDefault();
    const now = Date.now();
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

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (selectedModule) return;
    
    // Partitioning: If the touch starts inside the module list, don't start the global swipe tracker
    let target = e.target as HTMLElement;
    while (target && target !== document.body) {
      if (target.classList.contains('overflow-y-auto')) {
        return;
      }
      target = target.parentElement as HTMLElement;
    }

    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (selectedModule || touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;

    if (Math.abs(deltaY) > 50) {
      const direction = deltaY > 0 ? 1 : -1;
      setCurrentIndex(prev => {
        const next = Math.round(prev) + direction;
        return Math.max(0, Math.min(CURRICULUM_DATA.length - 1, next));
      });
    }
    touchStartY.current = null;
  };

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
      // Retention/Retraction delay: 3s
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
      className="relative w-screen h-screen overflow-hidden bg-[#010204] flex items-center justify-center touch-none"
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <GalaxyBackground 
        isFocused={activeDomainId !== null || selectedModule !== null} 
        mousePos={mousePos} 
      />

      {/* Header Info - Responsive Scaling */}
      <div className="fixed top-8 md:top-12 left-6 right-6 md:left-auto md:right-12 z-40 text-center md:text-right pointer-events-none">
        <h1 className="text-white text-xl md:text-3xl font-extralight tracking-[0.4em] mb-2 uppercase">
          AI 101 课程总览
        </h1>
        <div className="h-[1px] w-32 md:w-56 bg-gradient-to-l from-[#00d4ff] to-transparent mx-auto md:ml-auto opacity-30" />
        <p className="text-[#00d4ff]/40 text-[7px] md:text-[9px] tracking-[0.4em] md:tracking-[0.6em] mt-2 md:mt-3 uppercase font-medium">
          Universal Knowledge Constellation
        </p>
      </div>

      {/* Snap Indicator */}
      <div className="hidden md:block fixed bottom-24 right-12 z-40 text-right pointer-events-none overflow-hidden h-6">
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
          <div className="relative glass-effect max-w-2xl w-full p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] border-white/5 shadow-2xl animate-in fade-in zoom-in slide-in-from-bottom-12 duration-700">
            <button 
              onClick={() => setSelectedModule(null)}
              className="absolute top-6 right-6 md:top-12 md:right-12 text-white/10 hover:text-[#00d4ff] transition-all p-2"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            
            <div className="mb-8 md:mb-12">
              <span className="text-[#00d4ff] text-[8px] md:text-[10px] tracking-[0.8em] md:tracking-[1em] font-bold uppercase mb-2 md:mb-4 block opacity-50">
                Core Logic Specification
              </span>
              <h2 className="text-white text-2xl md:text-4xl font-extralight tracking-[0.1em] md:tracking-[0.15em] leading-tight">
                {selectedModule.name}
              </h2>
            </div>
            
            <p className="text-white/50 leading-relaxed font-light text-sm md:text-xl mb-10 md:mb-16 pl-6 md:pl-10 border-l-2 border-[#00d4ff]/10">
              {selectedModule.description}
            </p>
            
            <button 
              onClick={() => setSelectedModule(null)}
              className="group flex items-center gap-4 md:gap-6 text-[7px] md:text-[9px] tracking-[0.5em] md:tracking-[0.7em] text-white/30 uppercase hover:text-white transition-all ml-auto"
            >
              <span>Exit Entry</span>
              <div className="w-8 md:w-10 h-[1px] bg-white/10 group-hover:w-16 md:group-hover:w-20 group-hover:bg-[#00d4ff] transition-all" />
            </button>
          </div>
        </div>
      )}

      {/* Progress Timeline */}
      <div className="fixed left-4 md:left-12 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-6 md:gap-10">
        <div className="hidden md:block text-white/10 text-[8px] tracking-[0.5em] rotate-90 uppercase whitespace-nowrap mb-6">Course Evolution</div>
        <div className="flex flex-col gap-4 md:gap-5">
          {CURRICULUM_DATA.map((_, idx) => {
            const isActive = Math.abs(idx - currentIndex) < 0.5;
            return (
              <div key={idx} className="relative flex items-center justify-center">
                <div 
                  className={`w-0.5 md:w-1 transition-all duration-700 rounded-full ${
                    isActive ? 'h-8 md:h-12 bg-[#00d4ff] shadow-[0_0_20px_#00d4ff]' : 'h-2 md:h-3 bg-white/5'
                  }`}
                />
                {isActive && (
                   <div className="absolute left-4 md:left-8 text-[#00d4ff] font-light text-sm md:text-xl opacity-60 tracking-widest">{idx + 1}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="fixed bottom-6 left-6 md:bottom-12 md:left-12 z-40 pointer-events-none opacity-40">
        <div className="flex flex-col gap-1">
          <p className="text-white/40 text-[6px] md:text-[7px] tracking-[0.4em] md:tracking-[0.5em] uppercase font-light">
            Telemetry Stream // Sector {focusedIndex + 1}
          </p>
        </div>
      </div>

      {/* Navigation Hint */}
      <div className={`fixed bottom-6 right-6 md:bottom-12 md:right-12 transition-all duration-1000 ${selectedModule ? 'opacity-0' : 'opacity-100'}`}>
        <p className="text-white/10 text-[6px] md:text-[8px] tracking-[0.3em] md:tracking-[0.5em] uppercase flex items-center gap-2 md:gap-4">
           {window.innerWidth < 768 ? 'Swipe to navigate constellation' : 'Scroll once to navigate constellation'}
           <div className="w-8 md:w-12 h-[1px] bg-white/5" />
        </p>
      </div>
    </div>
  );
};

export default App;
