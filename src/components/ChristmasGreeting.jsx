     import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChristmasGreeting = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

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

  const startCelebration = () => {
    if (started) return;
    setStarted(true);
    setCountdown(10);
  };

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

  // Confetti particles
  const confettiPieces = showCelebration ? [...Array(150)].map((_, i) => ({
    id: i,
    x: Math.random() * dimensions.width,
    color: ['#10b981', '#fbbf24', '#3b82f6', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)],
    delay: Math.random() * 0.5,
    duration: 3 + Math.random() * 2
  })) : [];

  return (
    <div
      onClick={!started ? startCelebration : undefined}
      className="relative min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-800 text-white cursor-pointer"
    >
      {/* Animated background gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-emerald-600/20 to-transparent"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Floating bubbles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="absolute rounded-full bg-white/15 backdrop-blur-sm"
          style={{
            width: 30 + Math.random() * 50,
            height: 30 + Math.random() * 50,
            left: `${Math.random() * 100}%`,
          }}
          initial={{ y: dimensions.height + 100 }}
          animate={{ y: -200, x: [0, Math.random() * 100 - 50, 0] }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 5
          }}
        />
      ))}

      {/* Confetti */}
      <AnimatePresence>
        {confettiPieces.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute w-3 h-3 rounded-sm"
            style={{ 
              backgroundColor: piece.color,
              left: piece.x,
              top: 0
            }}
            initial={{ y: -50, opacity: 1, rotate: 0 }}
            animate={{ 
              y: dimensions.height + 50, 
              opacity: 0,
              rotate: 360 * 3,
              x: [0, Math.random() * 200 - 100]
            }}
            transition={{ 
              duration: piece.duration,
              delay: piece.delay,
              ease: 'easeIn'
            }}
          />
        ))}
      </AnimatePresence>

      {/* Firework bursts */}
      {showCelebration &&
        [...Array(8)].map((_, i) => (
          <motion.div
            key={`firework-${i}`}
            className="absolute rounded-full"
            style={{
              width: 8,
              height: 8,
              top: `${20 + Math.random() * 60}%`,
              left: `${20 + Math.random() * 60}%`,
              background: `radial-gradient(circle, ${['#fbbf24', '#ec4899', '#3b82f6', '#10b981'][i % 4]} 0%, transparent 70%)`
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 40, opacity: 0 }}
            transition={{ duration: 1.5, delay: i * 0.3 }}
          />
        ))}

      {/* Sparkles */}
      {showCelebration && [...Array(40)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-2 h-2 bg-yellow-300 rounded-full shadow-lg"
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: 1.5 + Math.random() * 1.5,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Countdown animation */}
      <AnimatePresence>
        {countdown !== null && countdown > 0 && (
          <motion.div
            key={countdown}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.8, opacity: 1 }}
            exit={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute text-9xl md:text-[12rem] font-black text-emerald-300 drop-shadow-[0_0_40px_rgba(16,185,129,0.8)]"
          >
            {countdown}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main celebration content */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="relative z-10 text-center max-w-5xl px-6 py-12"
          >
            <motion.h1
              className="text-5xl md:text-8xl lg:text-9xl font-black mb-8 bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl"
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              Happy New Year
              <br />
              <span className="text-yellow-300">2026</span> 🎆
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-2xl md:text-5xl font-bold mb-10 text-emerald-200 drop-shadow-lg"
            >
              From AquaGas Delivery App 💧
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl mb-10"
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                delay: 1.2,
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }
              }}
              className="text-3xl md:text-6xl font-black text-transparent bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-400 bg-clip-text drop-shadow-lg mb-8"
            >
              Cheers to a Powerful 2026! 🥂✨
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-lg md:text-2xl italic text-emerald-100"
            >
              — The AquaGas Delivery App Team
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start button */}
      {!started && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 px-10 py-5 rounded-full text-xl font-bold shadow-[0_10px_40px_rgba(16,185,129,0.5)] hover:shadow-[0_15px_50px_rgba(16,185,129,0.7)] transition-all"
          >
            🎇 Start New Year Countdown
          </motion.button>
        </motion.div>
      )}

      {/* Instruction text */}
      {!started && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute top-8 left-1/2 -translate-x-1/2 text-center"
        >
          <p className="text-emerald-200 text-lg md:text-xl font-medium drop-shadow-lg">
            Click anywhere to begin the celebration! 🎉
          </p>
        </motion.div>
      )}
    </div>
  );
};

      {/*export default HappyNewYearMessage;*/ }    
export default ChristmasGreeting; 
