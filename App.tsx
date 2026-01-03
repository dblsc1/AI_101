
import React, { useState, useCallback, useEffect, useRef } from 'react';
import GalaxyBackground from './components/GalaxyBackground';
import BubbleNode from './components/BubbleNode';
import CartOverlay from './components/CartOverlay';
import OnboardingGuide from './components/OnboardingGuide';
import { CURRICULUM_DATA, Module } from './constants';

const App: React.FC = () => {
  const [activeDomainId, setActiveDomainId] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Cart State
  const [cartItems, setCartItems] = useState<Module[]>([]);
  const [flyingParticles, setFlyingParticles] = useState<{ id: number, x: number, y: number }[]>([]);
  const [calculationResult, setCalculationResult] = useState<any[] | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const hoverTimeoutRef = useRef<number | null>(null);
  const lastScrollTime = useRef<number>(0);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const hasVisited = localStorage.getItem('ai101_visited');
    if (!hasVisited) {
      setShowOnboarding(true);
      localStorage.setItem('ai101_visited', 'true');
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight
    });
  }, []);

  const handleAddToCart = (module: Module, x: number, y: number) => {
    if (!cartItems.find(i => i.id === module.id)) {
      setCartItems(prev => [...prev, module]);
    }
    const particleId = Date.now();
    setFlyingParticles(prev => [...prev, { id: particleId, x, y }]);
    setTimeout(() => {
      setFlyingParticles(prev => prev.filter(p => p.id !== particleId));
    }, 1000);
  };

  const handleCalculate = async () => {
    if (cartItems.length === 0) return;
    setIsCalculating(true);
    
    try {
      const response = await fetch('https://ynttqk3e5b.sealoshzh.site/test_schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          modules: cartItems.map(item => item.id)
        })
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Invalid server response format. Status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setCalculationResult(result.data);
      } else {
        const errorMsg = result.message || "服务器返回了未知的逻辑错误";
        alert(`计算失败: ${errorMsg}`);
      }
    } catch (error: any) {
      alert(`请求失败: ${error.message || '网络连接异常，请检查网络后再试'}`);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleWheel = useCallback((e: WheelEvent) => {
    if (selectedModule || calculationResult || showOnboarding || activeDomainId) return;
    let target = e.target as HTMLElement;
    while (target && target !== document.body) {
      if (target.classList.contains('overflow-y-auto')) return;
      target = target.parentElement as HTMLElement;
    }
    e.preventDefault();
    const now = Date.now();
    if (now - lastScrollTime.current < 450) return;
    if (Math.abs(e.deltaY) > 5) {
      lastScrollTime.current = now;
      setCurrentIndex(prev => {
        const direction = e.deltaY > 0 ? 1 : -1;
        const next = Math.round(prev) + direction;
        return Math.max(0, Math.min(CURRICULUM_DATA.length - 1, next));
      });
    }
  }, [selectedModule, calculationResult, showOnboarding, activeDomainId]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (selectedModule || calculationResult || showOnboarding || activeDomainId) return;
    let target = e.target as HTMLElement;
    while (target && target !== document.body) {
      if (target.classList.contains('overflow-y-auto')) return;
      target = target.parentElement as HTMLElement;
    }
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (selectedModule || touchStartY.current === null || calculationResult || showOnboarding || activeDomainId) return;
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
    if (id !== null) {
      setActiveDomainId(id);
    }
  }, []);

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-[#010204] flex items-center justify-center touch-none"
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <GalaxyBackground isFocused={activeDomainId !== null || selectedModule !== null || calculationResult !== null} mousePos={mousePos} />

      {/* Header */}
      <div className={`fixed top-8 md:top-12 left-6 right-6 md:left-auto md:right-12 z-40 text-center md:text-right transition-opacity duration-700 pointer-events-none ${activeDomainId ? 'opacity-0' : 'opacity-100'}`}>
        <h1 className="text-white text-xl md:text-3xl font-extralight tracking-[0.4em] mb-2 uppercase">AI101 课程生成器</h1>
        <div className="h-[1px] w-32 md:w-56 bg-gradient-to-l from-[#00d4ff] to-transparent mx-auto md:ml-auto opacity-30" />
        <p className="text-[#00d4ff]/40 text-[8px] tracking-[0.3em] uppercase mt-2 hidden md:block">Future Learning Architecture</p>
      </div>

      {/* Main UI */}
      <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '2000px' }}>
        {CURRICULUM_DATA.map((domain, index) => (
          <BubbleNode 
            key={domain.id}
            domain={domain}
            isActive={activeDomainId === domain.id}
            isGlobalActive={activeDomainId !== null}
            isDimmed={selectedModule !== null || calculationResult !== null}
            onHover={handleHover}
            onClose={() => setActiveDomainId(null)}
            onModuleClick={setSelectedModule}
            onAddToCart={handleAddToCart}
            index={index}
            currentIndex={currentIndex}
            total={CURRICULUM_DATA.length}
          />
        ))}
      </div>

      {/* Particles */}
      {flyingParticles.map(p => (
        <div 
          key={p.id}
          className="fixed pointer-events-none z-[500] w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#00d4ff] shadow-[0_0_20px_#00d4ff] animate-fly"
          style={{ '--start-x': `${p.x}px`, '--start-y': `${p.y}px` } as any}
        />
      ))}

      {/* Onboarding */}
      {showOnboarding && <OnboardingGuide onClose={() => setShowOnboarding(false)} />}

      {/* Detail Modal */}
      {selectedModule && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl cursor-pointer" onClick={() => setSelectedModule(null)} />
          <div className="relative glass-effect max-w-2xl w-full p-8 md:p-16 rounded-[2rem] border-white/5 animate-in fade-in zoom-in slide-in-from-bottom-12 duration-700 shadow-2xl">
            <button onClick={() => setSelectedModule(null)} className="absolute top-6 right-6 text-white/40 hover:text-[#00d4ff] transition-all p-2 bg-white/5 rounded-full border border-white/5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
            <div className="mb-8">
              <span className="text-[#00d4ff] text-[8px] md:text-[10px] tracking-[0.8em] font-bold uppercase mb-2 block opacity-50">Node Details // 详情</span>
              <h2 className="text-white text-2xl md:text-4xl font-extralight tracking-[0.15em] leading-tight">{selectedModule.name}</h2>
            </div>
            <p className="text-white/50 leading-relaxed font-light text-sm md:text-xl mb-10 pl-6 border-l-2 border-[#00d4ff]/10">{selectedModule.description}</p>
          </div>
        </div>
      )}

      {/* Global Overlay */}
      <CartOverlay 
        items={cartItems} 
        onRemove={(id) => setCartItems(prev => prev.filter(i => i.id !== id))}
        onCalculate={handleCalculate}
        calculationResult={calculationResult}
        onCloseResult={() => setCalculationResult(null)}
        isCalculating={isCalculating}
      />

      <style>{`
        @keyframes fly {
          0% { left: var(--start-x); top: var(--start-y); opacity: 1; transform: scale(1); }
          100% { left: calc(100vw - 80px); top: calc(100vh - 80px); opacity: 0; transform: scale(0.2) rotate(360deg); }
        }
        .animate-fly { animation: fly 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default App;
