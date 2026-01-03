
import React, { useState } from 'react';
import { Module } from '../constants';

interface ScheduleItem {
  day: string;
  content: string;
}

interface DemoData {
  grade: string;
  label: string;
  classTime: string;
  teacherResourceManual: string;
  teacherResourceAI: string;
  schedule: ScheduleItem[];
  promoTitles: string[];
  leverage: string;
}

interface CartOverlayProps {
  items: Module[];
  onRemove: (id: string) => void;
  onCalculate: () => Promise<void>;
  calculationResult: DemoData[] | null;
  onCloseResult: () => void;
  isCalculating: boolean;
}

const CartOverlay: React.FC<CartOverlayProps> = ({ items, onRemove, onCalculate, calculationResult, onCloseResult, isCalculating }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const activeData = calculationResult ? calculationResult[activeTabIndex] : null;

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[300] flex items-end gap-4 md:gap-6">
      
      {/* 1. Analysis Report Modal */}
      {calculationResult && activeData && (
        <div className="fixed inset-0 z-[800] flex items-center justify-center p-2 md:p-0 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-500">
          <div className="relative glass-effect w-full max-w-6xl h-full max-h-[95vh] md:max-h-[92vh] overflow-hidden rounded-[2.5rem] md:rounded-[3rem] border-[#00d4ff]/30 shadow-[0_0_100px_rgba(0,212,255,0.2)] flex flex-col md:flex-row">
            
            <div className="hidden lg:flex w-72 bg-white/[0.02] border-r border-white/5 p-8 flex-col shrink-0">
              <div className="mb-8">
                <span className="text-[#00d4ff]/40 text-[8px] tracking-[0.5em] uppercase font-bold">Registry Context // 环境节点</span>
                <h3 className="text-white text-lg font-light tracking-widest uppercase mt-1">输入模块清单</h3>
              </div>
              <div className="flex-grow overflow-y-auto scrollbar-hide space-y-4">
                {items.map(item => (
                  <div key={item.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="text-white/80 text-[10px] font-bold uppercase tracking-wider mb-1.5">{item.name}</div>
                    <div className="text-white/30 text-[9px] leading-relaxed line-clamp-2 italic">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-grow flex flex-col overflow-hidden relative">
              <div className="p-6 md:p-10 pb-4">
                <button 
                  onClick={onCloseResult}
                  className="absolute top-4 right-4 md:top-8 md:right-8 text-white/20 hover:text-[#00d4ff] transition-all p-2 bg-white/5 rounded-full border border-white/5 z-20"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>

                <div className="mb-4 md:mb-6 pr-10 md:pr-0">
                  <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-3">
                    <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-[#00d4ff]/10 text-[#00d4ff] text-[7px] md:text-[8px] tracking-[0.3em] font-bold uppercase border border-[#00d4ff]/20 shrink-0">Spec ID: CUR-RSC-X7</span>
                    <div className="h-[1px] flex-grow bg-gradient-to-r from-[#00d4ff]/20 to-transparent" />
                  </div>
                  <h2 className="text-white text-2xl md:text-4xl font-extralight tracking-tight leading-tight">资源规格方案 <span className="text-white/20 text-sm md:text-xl font-thin tracking-widest uppercase ml-2">Resource Specification</span></h2>
                </div>

                <div className="flex bg-white/5 p-1 rounded-xl md:rounded-2xl border border-white/5 overflow-x-auto scrollbar-hide touch-pan-x flex-nowrap">
                  {calculationResult.map((tier, idx) => (
                    <button
                      key={tier.grade}
                      onClick={() => setActiveTabIndex(idx)}
                      className={`flex-1 min-w-[100px] md:min-w-[110px] py-2.5 md:py-3.5 px-3 md:px-4 rounded-lg md:rounded-xl text-[8px] md:text-[9px] tracking-[0.2em] uppercase font-bold transition-all duration-500 whitespace-nowrap
                        ${activeTabIndex === idx ? 'bg-[#00d4ff] text-black shadow-[0_0_20px_rgba(0,212,255,0.4)]' : 'text-white/40 hover:text-white hover:bg-white/5'}
                      `}
                    >
                      {tier.grade}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-grow overflow-y-auto scrollbar-hide p-6 md:p-10 pt-2 space-y-8 animate-in slide-in-from-right-4 duration-500" key={activeTabIndex}>
                <section>
                  <span className="text-[#00d4ff] text-[9px] md:text-[10px] tracking-[0.4em] uppercase font-bold mb-4 block opacity-60">01 // 时间布局 <span className="opacity-40 ml-1">Temporal Configuration</span></span>
                  <div className="glass-effect p-5 rounded-3xl border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="text-white text-xl md:text-2xl font-light tracking-wide">{activeData.classTime}</div>
                    <div className="text-white/20 text-[8px] tracking-[0.3em] uppercase">已完成矩阵优化 Matrix Optimized</div>
                  </div>
                </section>

                <section>
                  <span className="text-[#00d4ff] text-[9px] md:text-[10px] tracking-[0.4em] uppercase font-bold mb-4 block opacity-60">02 // 师资资本 <span className="opacity-40 ml-1">Instructional Human Capital</span></span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5">
                      <span className="text-white/30 text-[8px] uppercase tracking-widest block mb-2">传统基准方案 (Manual)</span>
                      <p className="text-white/70 text-xs md:text-sm leading-relaxed">{activeData.teacherResourceManual}</p>
                    </div>
                    <div className="p-5 rounded-3xl bg-[#00d4ff]/5 border border-[#00d4ff]/20">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-ping" />
                        <span className="text-[#00d4ff] text-[8px] uppercase tracking-widest font-bold">AI101 赋能方案 Enhanced</span>
                      </div>
                      <p className="text-white/90 text-xs md:text-sm leading-relaxed">{activeData.teacherResourceAI}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <span className="text-[#00d4ff] text-[9px] md:text-[10px] tracking-[0.4em] uppercase font-bold mb-4 block opacity-60">03 // 部署进度 <span className="opacity-40 ml-1">Deployment Schedule</span></span>
                  <div className="space-y-2">
                    {activeData.schedule.map((day, dIdx) => (
                      <div key={dIdx} className="flex flex-col sm:flex-row gap-2 sm:gap-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="text-[#00d4ff] text-[10px] font-black uppercase tracking-tighter sm:w-20 shrink-0">{day.day}</div>
                        <div className="text-white/70 text-xs md:text-sm font-light leading-relaxed">{day.content}</div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="pb-10">
                  <span className="text-[#00d4ff] text-[9px] md:text-[10px] tracking-[0.4em] uppercase font-bold mb-4 block opacity-60">04 // 营销资产 <span className="opacity-40 ml-1">Marketing Assets</span></span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeData.promoTitles.map((title, tIdx) => (
                      <div key={tIdx} className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3">
                        <span className="text-[#00d4ff]/40 text-xs font-mono shrink-0">{String(tIdx + 1).padStart(2, '0')}</span>
                        <span className="text-white/60 text-xs leading-snug">{title}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. My Registry Sidebar - Floating Above Data Core on Mobile */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 left-4 md:bottom-32 md:right-0 md:left-auto glass-effect w-auto md:w-[380px] h-auto max-h-[65vh] md:max-h-[75vh] flex flex-col p-6 rounded-[2rem] border-white/10 animate-in slide-in-from-bottom-12 duration-500 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] overflow-hidden z-[400]">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <div>
              <h2 className="text-white text-base md:text-lg font-light tracking-widest uppercase">我的课程清单</h2>
              <p className="text-[#00d4ff]/40 text-[7px] md:text-[8px] tracking-[0.3em] uppercase">已选 {items.length} 个知识模块</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white transition-colors p-2 bg-white/5 rounded-full border border-white/5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex-grow overflow-y-auto scrollbar-hide space-y-3 mb-6">
            {items.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-2xl">
                <p className="text-white/10 text-[8px] uppercase tracking-[0.4em]">清单为空 Empty Queue</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="bg-white/[0.03] p-4 rounded-xl border border-white/5 flex justify-between items-center group">
                  <div className="flex flex-col pr-4 overflow-hidden">
                    <span className="text-white text-[10px] font-medium tracking-wide uppercase truncate">{item.name}</span>
                    <span className="text-white/20 text-[8px] italic truncate">{item.description}</span>
                  </div>
                  <button 
                    onClick={() => onRemove(item.id)} 
                    className="text-white/20 hover:text-red-500 transition-all p-2 bg-white/5 rounded-lg border border-white/10"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                  </button>
                </div>
              ))
            )}
          </div>

          <button 
            disabled={items.length === 0 || isCalculating}
            onClick={onCalculate}
            className={`w-full py-4 rounded-xl text-[8px] tracking-[0.4em] uppercase font-black transition-all duration-700 flex items-center justify-center gap-3 shrink-0
              ${isCalculating ? 'bg-white/5 text-white/20' : 'bg-[#00d4ff]/10 hover:bg-[#00d4ff] text-[#00d4ff] hover:text-black border border-[#00d4ff]/40 shadow-[0_0_30px_rgba(0,212,255,0.1)]'}
            `}
          >
            {isCalculating ? (
              <div className="w-3 h-3 border-2 border-[#00d4ff]/40 border-t-[#00d4ff] rounded-full animate-spin" />
            ) : (
              '生成分析报告 Generate Report'
            )}
          </button>
        </div>
      )}

      {/* 3. The Data Core Icon */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center shrink-0"
      >
        <div className="absolute inset-0 bg-[#00d4ff]/10 rounded-full blur-2xl group-hover:bg-[#00d4ff]/20 transition-all duration-700 animate-pulse" />
        <div className="relative w-full h-full glass-effect rounded-full border border-[#00d4ff]/20 flex items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(0,212,255,0.2)] hover:shadow-[0_0_80px_rgba(0,212,255,0.4)] transition-all duration-700 breathing-node">
          <div className="flex flex-col items-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-6 h-6 md:w-8 md:h-8 text-white/50 group-hover:text-[#00d4ff] transition-colors duration-500 mb-0.5">
               <circle cx="12" cy="12" r="9" />
               <path d="M12 7v10M7 12h10" opacity="0.5" />
            </svg>
            <span className="text-white/20 text-[5px] md:text-[6px] tracking-[0.2em] uppercase font-bold group-hover:text-[#00d4ff]/60 text-center px-1">数据核心<br/>Data Core</span>
          </div>
          {items.length > 0 && (
            <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-[#00d4ff] text-black text-[9px] md:text-[10px] font-black w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center shadow-[0_0_20px_#00d4ff] animate-in zoom-in duration-500 ring-4 ring-black/40">
              {items.length}
            </div>
          )}
        </div>
      </button>

      <style>{`
        .breathing-node {
          animation: breathing 5s ease-in-out infinite;
        }
        @keyframes breathing {
          0%, 100% { transform: scale(1); border-color: rgba(0, 212, 255, 0.2); }
          50% { transform: scale(1.06); border-color: rgba(0, 212, 255, 0.6); }
        }
      `}</style>
    </div>
  );
};

export default CartOverlay;
