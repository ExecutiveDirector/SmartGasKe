import React, { useEffect, useState, useCallback, useMemo } from 'react';

const HappyNewYearMessage = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [fireworks, setFireworks] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Calculate real countdown to New Year 2026
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const newYear = new Date('2026-01-01T00:00:00');
      const diff = newYear - now;

      if (diff <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds, total: diff });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, []);

  const startCelebration = useCallback(() => {
    if (started) return;
    setStarted(true);
    
    // Check if it's already New Year or very close
    if (timeRemaining && timeRemaining.total <= 10000) {
      setCountdown(Math.max(1, Math.ceil(timeRemaining.total / 1000)));
    } else {
      setCountdown(10);
    }
  }, [started, timeRemaining]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      setShowCelebration(true);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  // Generate realistic firework explosions
  useEffect(() => {
    if (!showCelebration) return;

    const launchFirework = () => {
      const colors = ['#fbbf24', '#ec4899', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const x = 20 + Math.random() * 60;
      const y = 20 + Math.random() * 40;
      const particleCount = 40 + Math.floor(Math.random() * 40);
      
      const particles = [];
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 150 + Math.random() * 100;
        const life = 800 + Math.random() * 700;
        
        particles.push({
          id: `${Date.now()}-${i}`,
          angle,
          velocity,
          life,
          color,
          x,
          y
        });
      }

      setFireworks(prev => [...prev, {
        id: Date.now(),
        particles,
        timestamp: Date.now()
      }]);
    };

    launchFirework();
    const interval1 = setInterval(launchFirework, 600);
    const interval2 = setTimeout(() => {
      const interval = setInterval(launchFirework, 800);
      setTimeout(() => clearInterval(interval), 8000);
    }, 3000);

    return () => {
      clearInterval(interval1);
      clearTimeout(interval2);
    };
  }, [showCelebration]);

  // Clean up old fireworks
  useEffect(() => {
    const cleanup = setInterval(() => {
      setFireworks(prev => prev.filter(fw => Date.now() - fw.timestamp < 3000));
    }, 1000);
    return () => clearInterval(cleanup);
  }, []);

  // Optimized bubble generation
  const bubbles = useMemo(() => 
    [...Array(18)].map((_, i) => ({
      id: i,
      size: 25 + Math.random() * 45,
      startX: Math.random() * 100,
      endX: Math.random() * 100,
      duration: 18000 + Math.random() * 12000,
      delay: Math.random() * 8000,
      opacity: 0.08 + Math.random() * 0.12
    })), []
  );

  // Optimized confetti generation
  const confetti = useMemo(() => {
    if (!showCelebration) return [];
    const colors = ['#10b981', '#fbbf24', '#3b82f6', '#ec4899', '#8b5cf6'];
    return [...Array(100)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 400,
      duration: 2800 + Math.random() * 1800,
      rotation: Math.random() * 360,
      drift: -60 + Math.random() * 120
    }));
  }, [showCelebration]);

  return (
    <div
      onClick={!started ? startCelebration : undefined}
      className="relative min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white cursor-pointer"
    >
      {/* Smooth animated background gradients */}
      <div 
        className="absolute inset-0 opacity-40 animate-pulse-slow"
        style={{
          background: 'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)',
          animation: 'pulse-gradient 8s ease-in-out infinite'
        }}
      />
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 80% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
          animation: 'pulse-gradient-delay 10s ease-in-out infinite'
        }}
      />
      <div 
        className="absolute inset-0 opacity-25"
        style={{
          background: 'radial-gradient(circle at 50% 80%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)',
          animation: 'pulse-gradient-slow 12s ease-in-out infinite'
        }}
      />

      <style>{`
        @keyframes pulse-gradient {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.5; }
        }
        @keyframes pulse-gradient-delay {
          0%, 100% { transform: scale(1.2); opacity: 0.4; }
          50% { transform: scale(1); opacity: 0.6; }
        }
        @keyframes pulse-gradient-slow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.3); opacity: 0.5; }
        }
        @keyframes float-bubble {
          from { transform: translateY(0) translateX(0); }
          to { transform: translateY(-100vh) translateX(var(--drift)); }
        }
        @keyframes confetti-fall {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 1; }
          30% { opacity: 1; }
          70% { opacity: 0.8; }
          100% { transform: translateY(105vh) translateX(var(--drift)) rotate(720deg); opacity: 0; }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          30% { opacity: 1; transform: scale(1.5); }
          70% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes countdown-bounce {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.6); opacity: 1; }
          100% { transform: scale(1.5); opacity: 1; }
        }
        @keyframes countdown-exit {
          from { transform: scale(1.5); opacity: 1; }
          to { transform: scale(2.2); opacity: 0; }
        }
        @keyframes fade-scale-in {
          from { opacity: 0; transform: scale(0.85) translateY(40px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes title-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes glow-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes instruction-fade {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Smooth floating bubbles */}
      {bubbles.map((bubble) => (
        <div
          key={`bubble-${bubble.id}`}
          className="absolute rounded-full backdrop-blur-sm"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.startX}vw`,
            bottom: -100,
            background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, ${bubble.opacity * 1.5}), rgba(255, 255, 255, ${bubble.opacity * 0.5}))`,
            boxShadow: `inset 0 0 ${bubble.size * 0.3}px rgba(255, 255, 255, 0.3)`,
            '--drift': `${bubble.endX - bubble.startX}vw`,
            animation: `float-bubble ${bubble.duration}ms linear infinite`,
            animationDelay: `${bubble.delay}ms`
          }}
        />
      ))}

      {/* Smooth confetti */}
      {confetti.map((piece) => (
        <div
          key={`confetti-${piece.id}`}
          className="absolute rounded-sm"
          style={{ 
            width: 8,
            height: 12,
            backgroundColor: piece.color,
            left: `${piece.x}%`,
            top: '-5%',
            '--drift': `${piece.drift}px`,
            animation: `confetti-fall ${piece.duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
            animationDelay: `${piece.delay}ms`
          }}
        />
      ))}

      {/* Realistic radial fireworks */}
      {fireworks.map((firework) => (
        <div key={firework.id} className="absolute inset-0 pointer-events-none">
          {firework.particles.map((particle) => {
            const distance = particle.velocity;
            const x = Math.cos(particle.angle) * distance;
            const y = Math.sin(particle.angle) * distance + 120;
            
            return (
              <div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  width: 5,
                  height: 5,
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  backgroundColor: particle.color,
                  boxShadow: `0 0 10px ${particle.color}, 0 0 20px ${particle.color}`,
                  animation: `firework-particle ${particle.life}ms cubic-bezier(0.33, 0, 0.67, 1) forwards`,
                  '--end-x': `${x}px`,
                  '--end-y': `${y}px`
                }}
              />
            );
          })}
          {/* Core flash */}
          <div
            className="absolute rounded-full"
            style={{
              width: 30,
              height: 30,
              left: `${firework.particles[0].x}%`,
              top: `${firework.particles[0].y}%`,
              background: `radial-gradient(circle, ${firework.particles[0].color}, transparent)`,
              transform: 'translate(-50%, -50%)',
              filter: 'blur(4px)',
              animation: 'firework-flash 700ms ease-out forwards'
            }}
          />
        </div>
      ))}

      <style>{`
        @keyframes firework-particle {
          0% { transform: translate(0, 0); opacity: 1; }
          20% { opacity: 1; }
          60% { opacity: 0.5; }
          100% { transform: translate(var(--end-x), var(--end-y)); opacity: 0; }
        }
        @keyframes firework-flash {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          60% { opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(12); opacity: 0; }
        }
      `}</style>

      {/* Smooth sparkles */}
      {showCelebration && [...Array(30)].map((_, i) => {
        const delay = Math.random() * 3000;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        return (
          <div
            key={`sparkle-${i}`}
            className="absolute rounded-full"
            style={{
              width: 3,
              height: 3,
              background: 'radial-gradient(circle, #fbbf24, transparent)',
              left: `${x}%`,
              top: `${y}%`,
              filter: 'blur(0.5px)',
              animation: `sparkle 2s ease-in-out infinite`,
              animationDelay: `${delay}ms`
            }}
          />
        );
      })}

      {/* Countdown animation */}
      {countdown !== null && countdown > 0 && (
        <div
          key={countdown}
          className="absolute z-20 text-[10rem] md:text-[16rem] font-black text-emerald-400"
          style={{
            textShadow: '0 0 60px rgba(16,185,129,0.9), 0 0 120px rgba(16,185,129,0.5)',
            animation: countdown > 0 ? 'countdown-bounce 400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'countdown-exit 400ms ease-out forwards'
          }}
        >
          {countdown}
        </div>
      )}

      {/* Main celebration content */}
      {showCelebration && (
        <div
          className="relative z-10 text-center max-w-5xl px-6 py-12"
          style={{
            animation: 'fade-scale-in 1s ease-out forwards'
          }}
        >
          <h1
            className="text-5xl md:text-8xl lg:text-9xl font-black mb-8"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #fbbf24 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 10px 40px rgba(16,185,129,0.3))',
              animation: 'title-pulse 2.5s ease-in-out infinite'
            }}
          >
            Happy New Year
            <br />
            <span className="text-yellow-400">2026</span> 🎆
          </h1>

          <div
            className="text-2xl md:text-5xl font-bold mb-10 text-emerald-300"
            style={{ 
              filter: 'drop-shadow(0 4px 20px rgba(16,185,129,0.5))',
              animation: 'fade-scale-in 700ms ease-out 400ms backwards'
            }}
          >
            From AquaGas Delivery App 💧
          </div>

          <div
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl mb-10"
            style={{
              animation: 'fade-scale-in 700ms ease-out 700ms backwards'
            }}
          >
            <p className="text-lg md:text-2xl lg:text-3xl leading-relaxed mb-6">
              <strong className="text-emerald-300">Dear Valued Customers,</strong>
            </p>
            <p className="text-base md:text-xl lg:text-2xl leading-relaxed mb-6">
              As we step into the promising year of <strong className="text-yellow-300">2026</strong>, 
              AquaGas thanks you for trusting us with reliable gas and pure water delivery.
            </p>
            <p className="text-base md:text-xl lg:text-2xl leading-relaxed">
              May this year bring prosperity, health, and success to you and your family.
            </p>
          </div>

          <div
            className="text-3xl md:text-6xl font-black mb-8"
            style={{
              background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 5px 30px rgba(251,191,36,0.5))',
              animation: 'glow-pulse 2s ease-in-out infinite, fade-scale-in 700ms ease-out 1s backwards'
            }}
          >
            Cheers to a Powerful 2026! 🥂✨
          </div>

          <p
            className="text-lg md:text-2xl italic text-emerald-100"
            style={{
              animation: 'fade-scale-in 700ms ease-out 1.3s backwards'
            }}
          >
            — The AquaGas Delivery App Team
          </p>
        </div>
      )}

      {/* Start button */}
      {!started && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          style={{
            animation: 'fade-scale-in 700ms ease-out 500ms backwards'
          }}
        >
          <button
            className="bg-gradient-to-r from-emerald-500 to-teal-600 px-10 py-5 rounded-full text-xl font-bold shadow-[0_10px_40px_rgba(16,185,129,0.6)] hover:shadow-[0_15px_50px_rgba(16,185,129,0.8)] hover:scale-105 active:scale-95 transition-all"
          >
            🎇 Start New Year Countdown
          </button>
        </div>
      )}

      {/* Instruction text */}
      {!started && timeRemaining && (
        <div
          className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-10 max-w-2xl px-4"
          style={{
            animation: 'instruction-fade 2.5s ease-in-out infinite, fade-scale-in 700ms ease-out 1s backwards'
          }}
        >
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-emerald-500/30">
            <div className="text-emerald-200 text-2xl md:text-4xl font-bold mb-4">
              ⏰ Countdown to 2026
            </div>
            <div className="grid grid-cols-4 gap-2 md:gap-4 mb-4">
              <div className="bg-emerald-500/20 rounded-xl p-3 md:p-4 border border-emerald-500/40">
                <div className="text-3xl md:text-5xl font-black text-yellow-300">{timeRemaining.days}</div>
                <div className="text-xs md:text-sm text-emerald-200 mt-1">Days</div>
              </div>
              <div className="bg-emerald-500/20 rounded-xl p-3 md:p-4 border border-emerald-500/40">
                <div className="text-3xl md:text-5xl font-black text-yellow-300">{String(timeRemaining.hours).padStart(2, '0')}</div>
                <div className="text-xs md:text-sm text-emerald-200 mt-1">Hours</div>
              </div>
              <div className="bg-emerald-500/20 rounded-xl p-3 md:p-4 border border-emerald-500/40">
                <div className="text-3xl md:text-5xl font-black text-yellow-300">{String(timeRemaining.minutes).padStart(2, '0')}</div>
                <div className="text-xs md:text-sm text-emerald-200 mt-1">Minutes</div>
              </div>
              <div className="bg-emerald-500/20 rounded-xl p-3 md:p-4 border border-emerald-500/40">
                <div className="text-3xl md:text-5xl font-black text-yellow-300">{String(timeRemaining.seconds).padStart(2, '0')}</div>
                <div className="text-xs md:text-sm text-emerald-200 mt-1">Seconds</div>
              </div>
            </div>
            <p className="text-emerald-200 text-sm md:text-lg font-medium">
              Click anywhere to begin the celebration! 🎉
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HappyNewYearMessage;
