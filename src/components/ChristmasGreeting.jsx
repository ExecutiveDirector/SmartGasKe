import React, { useEffect, useRef, useState } from 'react';

const ChristmasGreeting = () => {
  const [sparkles, setSparkles] = useState([]);
  const [hearts, setHearts] = useState([]);
  const [snowflakes, setSnowflakes] = useState([]);
  const [stars, setStars] = useState([]);
  const [balloons, setBalloons] = useState([]);
  const [fireworks, setFireworks] = useState([]);
  const [confetti, setConfetti] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

  const audioRef = useRef(null);

  const playlist = [
    {
      title: 'Jingle Bells (Upbeat Instrumental)',
      url: 'https://scottholmesmusic.com/wp-content/uploads/2018/10/Jingle-Bells.mp3',
    },
    {
      title: 'We Wish You a Merry Christmas (Orchestral)',
      url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/United_States_Marine_Band/Holiday_Music_Selections/United_States_Marine_Band_-_07_-_We_Wish_You_a_Merry_Christmas.mp3',
    },
    {
      title: 'Feliz Navidad (Festive Instrumental)',
      url: 'https://www.singing-bell.com/wp-content/uploads/2014/11/Feliz-Navidad.mp3',
    },
  ];

  // Initial burst on first load with CONFETTI!
  useEffect(() => {
    const colors = ['#ff0000', '#ff69b4', '#00ff00', '#ffff00', '#00ffff', '#ff00ff', '#ffd700', '#ff4500'];
    
    // Confetti Burst
    for (let i = 0; i < 120; i++) {
      setTimeout(() => {
        const newConfetti = {
          id: Date.now() + i,
          left: Math.random() * 100,
          rotation: Math.random() * 360,
          duration: Math.random() * 4 + 4,
          delay: Math.random() * 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 10 + 8,
        };
        setConfetti(prev => [...prev, newConfetti]);
        setTimeout(() => setConfetti(prev => prev.filter(c => c.id !== newConfetti.id)), 8000);
      }, i * 20);
    }

    // Balloons
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const newBalloon = {
          id: Date.now() + i + 10000,
          left: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 1,
        };
        setBalloons(prev => [...prev, newBalloon]);
        setTimeout(() => setBalloons(prev => prev.filter(b => b.id !== newBalloon.id)), 6000);
      }, i * 50);
    }

    // Extra sparkles
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const newSparkle = {
          id: Date.now() + i + 20000,
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: Math.random() * 12 + 6,
        };
        setSparkles(prev => [...prev.slice(-20), newSparkle]);
        setTimeout(() => setSparkles(prev => prev.filter(s => s.id !== newSparkle.id)), 3000);
      }, i * 30);
    }

    // Fireworks
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const newFirework = {
          id: Date.now() + i + 30000,
          left: Math.random() * 100,
        };
        setFireworks(prev => [...prev, newFirework]);
        setTimeout(() => setFireworks(prev => prev.filter(f => f.id !== newFirework.id)), 3000);
      }, i * 200);
    }

    // Hearts
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const newHeart = {
          id: Date.now() + i + 40000,
          left: Math.random() * 80 + 10,
          duration: 4,
        };
        setHearts(prev => [...prev.slice(-10), newHeart]);
      }, i * 100);
    }
  }, []);

  // Regular ongoing effects
  useEffect(() => {
    const snowInterval = setInterval(() => {
      setSnowflakes(prev => {
        const newFlake = {
          id: Date.now() + Math.random(),
          left: Math.random() * 100,
          duration: Math.random() * 5 + 5,
          delay: Math.random() * 5,
          size: Math.random() * 20 + 15,
        };
        return [...prev.slice(-30), newFlake];
      });
    }, 200);

    const sparkleInterval = setInterval(() => {
      setSparkles(prev => {
        const newSparkle = {
          id: Date.now() + Math.random(),
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: Math.random() * 8 + 4,
        };
        return [...prev.slice(-10), newSparkle];
      });
    }, 600);

    const heartInterval = setInterval(() => {
      setHearts(prev => {
        const newHeart = {
          id: Date.now() + Math.random(),
          left: Math.random() * 80 + 10,
          duration: Math.random() * 4 + 6,
        };
        return [...prev.slice(-6), newHeart];
      });
    }, 1500);

    return () => {
      clearInterval(snowInterval);
      clearInterval(sparkleInterval);
      clearInterval(heartInterval);
    };
  }, []);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = 0; i < 8; i++) {
      const newStar = {
        id: Date.now() + Math.random() + i,
        x,
        y,
        angle: (i / 8) * 360 + Math.random() * 30,
        distance: Math.random() * 100 + 50,
      };
      setStars(prev => [...prev, newStar]);
      setTimeout(() => setStars(prev => prev.filter(s => s.id !== newStar.id)), 1500);
    }
  };

  const togglePlay = () => setIsPlaying(prev => !prev);

  const nextTrack = () => {
    setCurrentTrack(prev => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrack(prev => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = playlist[currentTrack].url;
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrack, isPlaying, playlist]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = nextTrack;
    }
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#0a1a2f] via-[#1e3a5f] to-[#2c5282]">
      
      {/* Confetti Burst */}
      {confetti.map(piece => (
        <div
          key={piece.id}
          className="absolute pointer-events-none"
          style={{
            left: `${piece.left}%`,
            top: '-20px',
            width: `${piece.size}px`,
            height: `${piece.size * 3}px`,
            backgroundColor: piece.color,
            animationName: 'confetti-fall',
            animationDuration: `${piece.duration}s`,
            animationTimingFunction: 'linear',
            animationFillMode: 'forwards',
            animationDelay: `${piece.delay}s`,
            transform: `rotate(${piece.rotation}deg)`,
            borderRadius: '10%',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        />
      ))}

      {/* Balloons */}
      {balloons.map(balloon => (
        <div
          key={balloon.id}
          className="absolute text-5xl pointer-events-none"
          style={{
            left: `${balloon.left}%`,
            bottom: '-100px',
            animation: `rise-balloon 6s ease-out forwards`,
            animationDelay: `${balloon.delay}s`,
          }}
        >
          <span style={{ color: balloon.color }}>🎈</span>
        </div>
      ))}

      {/* Fireworks */}
      {fireworks.map(fw => (
        <div key={fw.id} className="absolute pointer-events-none" style={{ left: `${fw.left}%`, top: '50%' }}>
          <div className="relative" style={{ animation: 'firework-burst 2s ease-out' }}>
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: ['#ffd700', '#ff69b4', '#00ff00'][i % 3],
                  boxShadow: `0 0 15px ${['#ffd700', '#ff69b4', '#00ff00'][i % 3]}`,
                  transform: `rotate(${i * 30}deg) translateY(-100px)`,
                  animation: 'firework-particle 2s ease-out forwards',
                }}
              />
            ))}
            <div className="text-6xl">💥</div>
          </div>
        </div>
      ))}

      {/* Snowflakes */}
      {snowflakes.map(flake => (
        <div
          key={flake.id}
          className="absolute text-white/90 pointer-events-none"
          style={{
            left: `${flake.left}%`,
            fontSize: `${flake.size}px`,
            animation: `fall ${flake.duration}s linear infinite`,
            animationDelay: `${flake.delay}s`,
          }}
        >
          <span style={{ display: 'inline-block', animation: `sway ${flake.duration}s ease-in-out infinite alternate` }}>❄️</span>
        </div>
      ))}

      {/* Sparkles */}
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="absolute rounded-full bg-yellow-300 animate-ping"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            boxShadow: '0 0 20px #ffdd00',
          }}
        />
      ))}

      {/* Main Card */}
      <div
        onClick={handleClick}
        className="relative z-10 w-full max-w-3xl mx-4 rounded-3xl p-12 shadow-2xl cursor-pointer backdrop-blur-lg bg-white/85 border border-white/40 mb-24"
      >
        <div className="absolute top-0 left-0 right-0 h-2 rounded-t-3xl bg-gradient-to-r from-red-600 via-green-600 to-red-600" style={{ backgroundSize: '200% 100%', animation: 'shimmer 3s linear infinite' }} />

        {/* Hearts */}
        {hearts.map(heart => (
          <div
            key={heart.id}
            className="absolute text-3xl pointer-events-none"
            style={{
              left: `${heart.left}%`,
              bottom: '-50px',
              animation: `rise-heart ${heart.duration}s ease-out forwards`,
            }}
          >
            ❤️
          </div>
        ))}

        {/* Click Stars */}
        {stars.map(star => (
          <div
            key={star.id}
            className="absolute text-2xl pointer-events-none"
            style={{
              left: `${star.x}px`,
              top: `${star.y}px`,
              animation: `starBurst 1.5s ease-out forwards`,
            }}
          >
            ✨
          </div>
        ))}

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-6 mb-6">
            <span className="text-5xl" style={{ animation: 'bounce-slow 2.5s ease-in-out infinite' }}>🔵</span>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
              AquaGas
            </h2>
            <span className="text-5xl" style={{ animation: 'bounce-slow 2.5s ease-in-out infinite', animationDelay: '0.3s' }}>🔵</span>
          </div>

          <div className="text-8xl mb-6 drop-shadow-2xl" style={{ animation: 'sway-slow 6s ease-in-out infinite' }}>🎄</div>

          <h1 className="text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-700"
              style={{ fontFamily: '"Dancing Script", cursive', textShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
            Merry Christmas!
          </h1>

          <p className="text-xl font-medium text-green-700">
            From Your Trusted Gas Delivery Partner
          </p>
        </div>

        <p className="text-center text-lg text-gray-800 leading-relaxed mb-8">
          This festive season, we extend our heartfelt gratitude for choosing <strong className="text-blue-600">AquaGas Delivery-App</strong> to keep your homes warm, cozy, and full of delicious meals. 🏠💙🔥
        </p>

        <div className="rounded-3xl p-8 mb-10 bg-gradient-to-br from-red-50 to-pink-50 border-l-8 border-red-600 shadow-xl">
          <p className="text-center text-xl font-medium text-gray-800 flex items-center justify-center gap-4">
            <span className="text-4xl animate-pulse">✨</span>
            May your Christmas sparkle with moments of love, laughter, and goodwill — filled with peace, joy, and endless warmth.
            <span className="text-4xl animate-pulse" style={{animationDelay: '0.5s'}}>❤️</span>
          </p>
        </div>

        <div className="text-center py-8 rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 mb-8">
          <div className="text-7xl mb-4" style={{ animation: 'bounce-slow 2.5s ease-in-out infinite' }}>🔵</div>
          <p className="text-2xl font-bold text-blue-700">Always Here, Always Ready</p>
          <p className="text-lg text-blue-600 mt-2 flex items-center justify-center gap-3">
            <span style={{ animation: 'flicker 1.5s ease-in-out infinite' }}>🔥</span> Safe • Fast • Reliable Delivery to Your Doorstep
          </p>
        </div>

        <div className="text-center mb-10">
          <a
            href="https://www.aquagas.co.ke"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-12 py-5 text-xl font-bold text-white rounded-full shadow-2xl transition-all hover:scale-110 hover:shadow-3xl bg-gradient-to-r from-blue-600 to-cyan-500"
          >
            Visit AquaGas.co.ke 🎁
          </a>
        </div>

        <div className="text-center pt-10 border-t-4 border-dashed border-red-200/50">
          <h3 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-700"
              style={{ fontFamily: '"Dancing Script", cursive' }}>
            Merry Christmas & A Happy New Year!
          </h3>
          <div className="text-5xl mb-6" style={{ animation: 'swing 2s ease-in-out infinite' }}>🎅🎄🎁✨❤️</div>
          <p className="text-xl font-semibold text-green-700 mb-4">— The AquaGas Delivery-App Team</p>
          <p className="text-lg text-gray-600 flex items-center justify-center gap-2">
            🌟 Thank you for being part of our family 🌟
          </p>
        </div>
      </div>

      {/* Music Player */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-lg shadow-2xl border-t border-gray-300">
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={prevTrack} className="text-3xl text-gray-700 hover:text-red-600 transition">⏮</button>
            <button onClick={togglePlay} className="text-5xl text-red-600 hover:scale-110 transition">
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button onClick={nextTrack} className="text-3xl text-gray-700 hover:text-red-600 transition">⏭</button>
          </div>
          <div className="flex-1 text-center">
            <div className="text-lg font-semibold text-gray-800">{playlist[currentTrack].title}</div>
            <div className="text-sm text-gray-600">Festive Christmas Instrumental 🎵</div>
          </div>
          <div className="text-4xl animate-pulse">🎄✨</div>
        </div>
      </div>

      <audio ref={audioRef} />

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Dancing+Script:wght@700&display=swap');

        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }

        @keyframes fall {
          to { transform: translateY(110vh); }
        }

        @keyframes sway {
          0% { transform: translateX(-10px); }
          100% { transform: translateX(10px); }
        }

        @keyframes rise-heart {
          0% { opacity: 0; transform: translateY(0) scale(0.5); }
          20% { opacity: 1; transform: translateY(-30px) scale(1.2); }
          80% { opacity: 1; transform: translateY(-300px) scale(1); }
          100% { opacity: 0; transform: translateY(-350px) scale(0.8); }
        }

        @keyframes starBurst {
          0% { opacity: 1; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.5); }
          100% { opacity: 0; transform: scale(0); }
        }

        @keyframes rise-balloon {
          0% { opacity: 0; transform: translateY(0); }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-120vh); }
        }

        @keyframes firework-burst {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }

        @keyframes firework-particle {
          0% { transform: rotate(var(--angle)) translateY(0); opacity: 1; }
          100% { transform: rotate(var(--angle)) translateY(-150px); opacity: 0; }
        }

        @keyframes sway-slow {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        @keyframes swing {
          0%, 100% { transform: rotate(0); }
          25% { transform: rotate(-15deg); }
          75% { transform: rotate(15deg); }
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; filter: brightness(1.5); }
        }

        @keyframes shimmer {
          0% { background-position: -400% center; }
          100% { background-position: 400% center; }
        }
      `}</style>
    </div>
  );
};

export default ChristmasGreeting;
