import React, { useEffect, useState } from 'react';

const ChristmasGreeting = () => {
  const [sparkles, setSparkles] = useState([]);
  const [hearts, setHearts] = useState([]);
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    // Generate snowflakes
    const snowInterval = setInterval(() => {
      setSnowflakes(prev => {
        const newSnowflake = {
          id: Date.now() + Math.random(),
          left: Math.random() * 100,
          duration: Math.random() * 3 + 4,
          opacity: Math.random() * 0.5 + 0.5,
          size: Math.random() * 15 + 10
        };
        return [...prev.slice(-20), newSnowflake];
      });
    }, 250);

    // Generate sparkles
    const sparkleInterval = setInterval(() => {
      setSparkles(prev => {
        const newSparkle = {
          id: Date.now() + Math.random(),
          left: Math.random() * 100,
          top: Math.random() * 100
        };
        return [...prev.slice(-5), newSparkle];
      });
    }, 800);

    // Generate hearts
    const heartInterval = setInterval(() => {
      setHearts(prev => {
        const newHeart = {
          id: Date.now() + Math.random(),
          left: Math.random() * 90 + 5
        };
        return [...prev.slice(-3), newHeart];
      });
    }, 2000);

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
    
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const star = document.createElement('div');
        star.innerHTML = '⭐';
        star.style.position = 'absolute';
        star.style.left = x + 'px';
        star.style.top = y + 'px';
        star.style.fontSize = '20px';
        star.style.pointerEvents = 'none';
        star.style.zIndex = '9999';
        star.className = 'animate-float-away';
        e.currentTarget.appendChild(star);
        
        setTimeout(() => star.remove(), 2000);
      }, i * 100);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" 
         style={{background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)'}}>
      
      {/* Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[300px] h-[300px] rounded-full opacity-10 animate-float"
             style={{background: '#ff6b6b', top: '10%', left: '-10%'}} />
        <div className="absolute w-[200px] h-[200px] rounded-full opacity-10 animate-float"
             style={{background: '#4ecdc4', bottom: '20%', right: '-5%', animationDelay: '5s'}} />
        <div className="absolute w-[250px] h-[250px] rounded-full opacity-10 animate-float"
             style={{background: '#ffe66d', top: '50%', left: '50%', animationDelay: '10s'}} />
      </div>

      {/* Snowflakes */}
      {snowflakes.map(flake => (
        <div
          key={flake.id}
          className="absolute pointer-events-none"
          style={{
            left: `${flake.left}%`,
            top: '-10px',
            fontSize: `${flake.size}px`,
            opacity: flake.opacity,
            animation: `fall ${flake.duration}s linear`,
            textShadow: '0 0 5px rgba(255, 255, 255, 0.5)'
          }}
        >
          ❄
        </div>
      ))}

      {/* Main Container */}
      <div 
        onClick={handleClick}
        className="relative z-10 w-full max-w-2xl rounded-[30px] p-10 shadow-2xl animate-slide-in overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fef9f3 100%)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
        }}
      >
        {/* Top Border Animation */}
        <div className="absolute top-0 left-0 right-0 h-1.5 animate-shimmer"
             style={{background: 'linear-gradient(90deg, #c41e3a, #2c5f2d, #c41e3a)', backgroundSize: '200% 100%'}} />

        {/* Sparkles */}
        {sparkles.map(sparkle => (
          <div
            key={sparkle.id}
            className="absolute w-1.5 h-1.5 rounded-full animate-sparkle"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              background: '#ffd700',
              boxShadow: '0 0 15px #ffd700'
            }}
          />
        ))}

        {/* Hearts */}
        {hearts.map(heart => (
          <div
            key={heart.id}
            className="absolute bottom-0 text-xl animate-float-heart pointer-events-none"
            style={{left: `${heart.left}%`}}
          >
            ❤️
          </div>
        ))}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-5 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <span className="text-4xl animate-bounce-slow">🔵</span>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              AquaGas
            </span>
          </div>
          
          <div className="text-7xl mb-5 inline-block animate-sway" style={{filter: 'drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2))'}}>
            🎄
          </div>
          
          <h1 className="text-5xl font-bold mb-3 animate-fade-in" 
              style={{
                fontFamily: 'Dancing Script, cursive',
                color: '#c41e3a',
                textShadow: '3px 3px 6px rgba(196, 30, 58, 0.2)',
                animationDelay: '0.5s'
              }}>
            Merry Christmas!
          </h1>
          
          <p className="text-lg font-semibold animate-fade-in" 
             style={{color: '#2c5f2d', animationDelay: '0.7s'}}>
            From Your Trusted Gas Delivery Partner
          </p>
        </div>

        {/* Message */}
        <p className="text-center text-gray-700 leading-relaxed mb-6 animate-fade-in" style={{animationDelay: '0.9s'}}>
          As we celebrate this joyful season, we'd like to thank you for trusting{' '}
          <strong className="text-blue-600">AquaGas Delivery-App</strong> to keep your home warm and your kitchen running. 🏠💙
        </p>

        {/* Highlight Box */}
        <div className="rounded-2xl p-5 mb-6 border-l-4 animate-fade-in shadow-lg"
             style={{
               background: 'linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%)',
               borderColor: '#c41e3a',
               animationDelay: '1.1s'
             }}>
          <div className="flex items-center justify-center text-gray-700">
            <span className="text-3xl mr-3 animate-pulse-slow">✨</span>
            <span>May your Christmas be filled with peace, happiness, and plenty of warmth</span>
          </div>
        </div>

        {/* Gas Section */}
        <div className="text-center my-6 p-6 rounded-2xl animate-fade-in"
             style={{
               background: 'linear-gradient(135deg, #e8f4f8 0%, #d4e9f7 100%)',
               animationDelay: '1.5s'
             }}>
          <div className="text-6xl mb-2 animate-bounce-slow" 
               style={{filter: 'drop-shadow(0 5px 15px rgba(0, 102, 204, 0.3))'}}>
            🔵
          </div>
          <div className="text-blue-600 font-semibold">Always Ready to Serve You</div>
        </div>

        {/* Fire Icon Line */}
        <div className="flex items-center justify-center text-gray-700 mb-6 animate-fade-in" style={{animationDelay: '1.3s'}}>
          <span className="text-3xl mr-3 animate-flicker">🔥</span>
          <span>We're always here to deliver safe, fast, and reliable gas right to your doorstep</span>
        </div>

        {/* CTA Button */}
        <div className="text-center mb-6 animate-fade-in" style={{animationDelay: '1.9s'}}>
          <a 
            href="https://aquagas.co.ke" 
            className="inline-block px-10 py-4 rounded-full text-white font-semibold text-base transition-all hover:-translate-y-1 hover:shadow-2xl active:translate-y-0"
            style={{
              background: 'linear-gradient(135deg, #0066cc, #0099ff)',
              boxShadow: '0 10px 30px rgba(0, 102, 204, 0.3)'
            }}
          >
            Visit AquaGas.co.ke
          </a>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 mt-8 border-t-2 border-dashed animate-fade-in" 
             style={{borderColor: 'rgba(196, 30, 58, 0.2)', animationDelay: '1.7s'}}>
          <div className="text-4xl font-bold mb-3" 
               style={{
                 fontFamily: 'Dancing Script, cursive',
                 color: '#c41e3a',
                 textShadow: '2px 2px 4px rgba(196, 30, 58, 0.2)'
               }}>
            Merry Christmas & Happy New Year!
          </div>
          
          <div className="text-4xl my-4 animate-swing">🎅🎁❤️</div>
          
          <div className="text-lg font-semibold mb-4" style={{color: '#2c5f2d'}}>
            — The AquaGas Delivery-App Team
          </div>
          
          <div className="text-sm text-gray-600">
            🌟 Thank you for being part of our family 🌟
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Dancing+Script:wght@700&display=swap');

        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; filter: brightness(1); }
          50% { opacity: 0.85; filter: brightness(1.2); }
        }

        @keyframes swing {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes float-heart {
          0% { 
            opacity: 0;
            transform: translateY(0) scale(0);
          }
          10% {
            opacity: 0.8;
            transform: translateY(-20px) scale(1);
          }
          90% {
            opacity: 0.8;
            transform: translateY(-100px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-120px) scale(0);
          }
        }

        @keyframes float-away {
          0% { 
            opacity: 0;
            transform: translateY(0) scale(0);
          }
          10% {
            opacity: 0.8;
            transform: translateY(-20px) scale(1);
          }
          90% {
            opacity: 0.8;
            transform: translateY(-100px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-120px) scale(0);
          }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .animate-slide-in {
          animation: slide-in 1s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out both;
        }

        .animate-sway {
          animation: sway 4s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2.5s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-flicker {
          animation: flicker 1.5s ease-in-out infinite;
        }

        .animate-swing {
          animation: swing 2s ease-in-out infinite;
        }

        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 20s infinite ease-in-out;
        }

        .animate-float-heart {
          animation: float-heart 4s ease-in-out forwards;
        }

        .animate-float-away {
          animation: float-away 2s ease-out forwards;
        }

        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ChristmasGreeting;
