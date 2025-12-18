
import React, { useMemo } from 'react';

interface GalaxyBackgroundProps {
  isFocused: boolean;
  mousePos: { x: number; y: number };
}

const GalaxyBackground: React.FC<GalaxyBackgroundProps> = ({ isFocused, mousePos }) => {
  const stars = useMemo(() => {
    return Array.from({ length: 500 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.7 + 0.3,
      depth: Math.random() * 3 + 1,
      color: ['#ffffff', '#e0f2fe', '#ffffff', '#f0f9ff', '#bfdbfe', '#fff7ed'][Math.floor(Math.random() * 6)]
    }));
  }, []);

  const parallaxX = (mousePos.x - 0.5);
  const parallaxY = (mousePos.y - 0.5);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#010204]">
      {/* 1. Deep Space Base Nebula - Enhanced Complexity */}
      <div 
        className="absolute inset-0 opacity-70 transition-transform duration-[2500ms] ease-out"
        style={{ 
          transform: `scale(${isFocused ? 1.1 : 1}) translate(${parallaxX * -15}px, ${parallaxY * -15}px)`,
          filter: 'blur(80px)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#050816] via-[#020408] to-[#0d0714]" />
        
        {/* Soft Nebula Clouds */}
        <div className="absolute top-1/4 left-1/4 w-[1000px] h-[800px] bg-blue-900/10 rounded-full mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[1200px] h-[900px] bg-indigo-900/15 rounded-full mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1000px] bg-cyan-950/5 rounded-full rotate-12" />
      </div>

      {/* 2. Galactic Dust Lanes & Arms (Subtle Swirl) */}
      <div 
        className="absolute inset-0 transition-transform duration-[4000ms] ease-out flex items-center justify-center opacity-30"
        style={{ 
          transform: `scale(${isFocused ? 1.2 : 1.05}) rotate(${parallaxX * 3}deg) translate(${parallaxX * -40}px, ${parallaxY * -40}px)`,
        }}
      >
        <div className="relative w-[2400px] h-[1200px] animate-spin-ultra-slow">
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400/10 via-transparent to-transparent rotate-[30deg] scale-y-[0.4]" />
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-400/5 via-transparent to-transparent rotate-[-30deg] scale-y-[0.3]" />
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-400/5 via-transparent to-transparent rotate-[160deg] scale-y-[0.35]" />
        </div>
      </div>

      {/* 3. Multi-layered Starfield - More Stars, Better Depth */}
      {[1, 2, 3].map((layer) => (
        <div 
          key={layer}
          className="absolute inset-0"
          style={{ 
            transform: `translate(${parallaxX * -layer * 40}px, ${parallaxY * -layer * 40}px) scale(${1 + (layer * 0.04)})`,
            transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {stars.filter(s => Math.floor(s.depth) === layer).map((star) => (
            <div 
              key={star.id}
              className="absolute rounded-full"
              style={{
                top: `${star.y}%`,
                left: `${star.x}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                backgroundColor: star.color,
                opacity: star.opacity,
                boxShadow: star.size > 1.2 ? `0 0 6px ${star.color}` : 'none'
              }}
            />
          ))}
        </div>
      ))}

      <style>{`
        @keyframes spin-ultra-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.05); }
        }
        .animate-spin-ultra-slow {
          animation: spin-ultra-slow 180s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default GalaxyBackground;
