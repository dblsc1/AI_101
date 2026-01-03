
import React, { useMemo } from 'react';

interface GalaxyBackgroundProps {
  isFocused: boolean;
  mousePos: { x: number; y: number };
}

const GalaxyBackground: React.FC<GalaxyBackgroundProps> = ({ isFocused, mousePos }) => {
  const stars = useMemo(() => {
    return Array.from({ length: 350 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.6 + 0.4,
      opacity: Math.random() * 0.7 + 0.3,
      depth: Math.random() * 3 + 1,
      color: ['#ffffff', '#e0f2fe', '#ffffff', '#bfdbfe'][Math.floor(Math.random() * 4)]
    }));
  }, []);

  const parallaxX = (mousePos.x - 0.5);
  const parallaxY = (mousePos.y - 0.5);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#010204]">
      {/* 1. Deep Space Nebula - Optimized filter blur */}
      <div 
        className="absolute inset-0 opacity-60 transition-transform duration-[2500ms] ease-out"
        style={{ 
          transform: `scale(${isFocused ? 1.08 : 1}) translate(${parallaxX * -10}px, ${parallaxY * -10}px)`,
          filter: 'blur(60px)',
          willChange: 'transform'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#050816] via-[#020408] to-[#0d0714]" />
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[600px] bg-blue-900/10 rounded-full mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[1000px] h-[700px] bg-indigo-900/15 rounded-full mix-blend-screen" />
      </div>

      {/* 2. Galactic Swirl */}
      <div 
        className="absolute inset-0 transition-transform duration-[4000ms] ease-out flex items-center justify-center opacity-20"
        style={{ 
          transform: `scale(${isFocused ? 1.15 : 1.05}) translate(${parallaxX * -30}px, ${parallaxY * -30}px)`,
          willChange: 'transform'
        }}
      >
        <div className="relative w-[2000px] h-[1000px] animate-spin-ultra-slow">
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400/10 via-transparent to-transparent rotate-[30deg] scale-y-[0.4]" />
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-400/5 via-transparent to-transparent rotate-[-30deg] scale-y-[0.3]" />
        </div>
      </div>

      {/* 3. Starfield - Optimized with will-change */}
      {[1, 2, 3].map((layer) => (
        <div 
          key={layer}
          className="absolute inset-0"
          style={{ 
            transform: `translate(${parallaxX * -layer * 30}px, ${parallaxY * -layer * 30}px) scale(${1 + (layer * 0.03)})`,
            transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'transform'
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
                boxShadow: star.size > 1.2 ? `0 0 4px ${star.color}` : 'none'
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
        .animate-spin-ultra-slow {
          animation: spin-ultra-slow 240s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default GalaxyBackground;
