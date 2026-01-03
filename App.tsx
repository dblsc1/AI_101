
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
    // Check if onboarding was already shown
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
      // MOCK POST logic
      await new Promise(r => setTimeout(r, 2200));
      const moduleCount = cartItems.length;
      
      const mockApiResponse = [
        {
          grade: 'Grade 1-3',
          label: 'Foundation Discovery Tier',
          classTime: `${moduleCount * 2} * 35 min/节 (高互动)`,
          teacherResourceManual: '需 2 名高级教师。需准备 12 小时教具制作与游戏流程设计。',
          teacherResourceAI: '仅需 1 名教师。利用 AI101 自动生成数字化教学关卡，备课缩短至 2 小时。',
          schedule: [
            { day: 'Day 1', content: 'AI 初探：通过“寻找隐藏的机器人”游戏理解感知与识别。' },
            { day: 'Day 2', content: '创意工坊：使用 AI 工具协助绘制并分享自己的第一个科幻故事。' },
            { day: 'Day 3', content: '逻辑迷宫：在导师引导下通过简易可视化代码完成小车避障任务。' }
          ],
          promoTitles: ['启迪未来：为 1-3 年级量身定制的 AI 探险', '玩转科技：在游戏中掌握 AI 基础逻辑', '小小架构师：用 AI 开启孩子的第一份作品集'],
          leverage: '65% 效率提升'
        },
        {
          grade: 'Grade 3-6',
          label: 'Logical Framework Tier',
          classTime: `45 min * ${moduleCount} /节 (标准周期)`,
          teacherResourceManual: '需要具备编程素养的教师。手动编写 8 套练习及 3 个综合案例解析。',
          teacherResourceAI: 'AI101 系统自动生成的个性化批改与动态案例库可解决 80% 的疑难解答。',
          schedule: [
            { day: 'Day 1', content: '神经网络可视化：拆解“大脑”如何学习分类猫与狗。' },
            { day: 'Day 2', content: '数据炼金术：收集并清理小型数据集，体验机器学习完整流程。' },
            { day: 'Day 3', content: '团队挑战：合作开发一个基于视觉识别的校园环保监测站。' }
          ],
          promoTitles: ['逻辑觉醒：培养跨学科解决问题的 AI 思维', '从零到一：让孩子真正理解算法规律', '精英课程：掌握 Generative AI'],
          leverage: '82% 效率提升'
        },
        {
          grade: 'Grade 6-9',
          label: 'Junior Innovator Tier',
          classTime: `60 min * ${Math.ceil(moduleCount * 0.8)} /节 (项目制)`,
          teacherResourceManual: '需 Python 基础讲师。需花费 15 小时搭建课程所需的实验服务器环境。',
          teacherResourceAI: '云端沙盒与实时代码纠错。1 名普通学科教师即可轻松带班。',
          schedule: [
            { day: 'Day 1', content: '大语言模型进阶：编写高质量 Prompt 实现任务自动化。' },
            { day: 'Day 2', content: '多模态实验室：整合音频与文本，创建一个虚拟向导。' },
            { day: 'Day 3', content: '项目发布会：针对社区痛点演示基于 AI 的优化方案。' }
          ],
          promoTitles: ['创变者：初中生的生成式 AI 进阶实验', '科技领导力：从 Prompt 到项目管理的跨越', '未来社区：用 AI 解决真实世界难题'],
          leverage: '88% 效率提升'
        },
        {
          grade: 'Grade 9-12',
          label: 'Advanced Tech Tier',
          classTime: `90 min * ${Math.ceil(moduleCount * 0.5)} /节 (深核研讨)`,
          teacherResourceManual: '需计算机专业背景资深专家。针对不同学生的模型需求进行一对一指导。',
          teacherResourceAI: '系统自动处理 90% 的部署报错。教师可专注于高阶理论讲解。',
          schedule: [
            { day: 'Day 1', content: 'Transformer 架构剖析：从注意力机制到万亿参数。' },
            { day: 'Day 2', content: '前沿探索：LoRA 微调实战，训练属于你自己的模型。' },
            { day: 'Day 3', content: '伦理与未来：研讨 AI 安全性及其对未来职业布局的影响。' }
          ],
          promoTitles: ['技术巅峰：构建大学预科的高阶 AI 体系', '研究者计划：从原理到微调实战专家路径', '智领未来：高二/高三提前锁定的科技竞争力'],
          leverage: '94% 效率提升'
        }
      ];

      setCalculationResult(mockApiResponse);
    } catch (error) {
      console.error("Calculation Matrix Failure", error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleWheel = useCallback((e: WheelEvent) => {
    if (selectedModule || calculationResult || showOnboarding) return;
    let target = e.target as HTMLElement;
    while (target && target !== document.body) {
      if (target.classList.contains('overflow-y-auto')) return;
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
  }, [selectedModule, calculationResult, showOnboarding]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (selectedModule || calculationResult || showOnboarding) return;
    let target = e.target as HTMLElement;
    while (target && target !== document.body) {
      if (target.classList.contains('overflow-y-auto')) return;
      target = target.parentElement as HTMLElement;
    }
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (selectedModule || touchStartY.current === null || calculationResult || showOnboarding) return;
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
      hoverTimeoutRef.current = window.setTimeout(() => setActiveDomainId(null), 3000);
    } else {
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
      <div className="fixed top-8 md:top-12 left-6 right-6 md:left-auto md:right-12 z-40 text-center md:text-right pointer-events-none">
        <h1 className="text-white text-xl md:text-3xl font-extralight tracking-[0.4em] mb-2 uppercase">AI 101 Curriculum</h1>
        <div className="h-[1px] w-32 md:w-56 bg-gradient-to-l from-[#00d4ff] to-transparent mx-auto md:ml-auto opacity-30" />
      </div>

      {/* Main UI */}
      <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '2000px' }}>
        {CURRICULUM_DATA.map((domain, index) => (
          <BubbleNode 
            key={domain.id}
            domain={domain}
            isActive={activeDomainId === domain.id && Math.abs(index - currentIndex) < 0.4}
            isDimmed={selectedModule !== null || calculationResult !== null}
            onHover={handleHover}
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
        <div className="fixed inset-0 z-[400] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl cursor-pointer" onClick={() => setSelectedModule(null)} />
          <div className="relative glass-effect max-w-2xl w-full p-8 md:p-16 rounded-[2rem] border-white/5 animate-in fade-in zoom-in slide-in-from-bottom-12 duration-700 shadow-2xl">
            <button onClick={() => setSelectedModule(null)} className="absolute top-6 right-6 text-white/40 hover:text-[#00d4ff] transition-all p-2 bg-white/5 rounded-full border border-white/5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
            <div className="mb-8">
              <span className="text-[#00d4ff] text-[8px] md:text-[10px] tracking-[0.8em] font-bold uppercase mb-2 block opacity-50">Node Details</span>
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
