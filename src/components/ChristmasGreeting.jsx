import React, { useEffect, useRef, useState } from "react";

const ChristmasGreeting = () => {
  const [snowflakes, setSnowflakes] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  const [hearts, setHearts] = useState([]);
  const [stars, setStars] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [countdown, setCountdown] = useState("");

  const audioRef = useRef(null);

  /* 🎵 Playlist */
  const playlist = [
    {
      title: "Feliz Navidad – Instrumental",
      url: "https://www.singing-bell.com/wp-content/uploads/2014/11/Feliz-Navidad.mp3",
    },
  ];

  /* ❄ Snow, ✨ Sparkles, ❤️ Hearts */
  useEffect(() => {
    const snowInterval = setInterval(() => {
      setSnowflakes((prev) => [
        ...prev.slice(-30),
        {
          id: Date.now() + Math.random(),
          left: Math.random() * 100,
          size: Math.random() * 18 + 14,
          duration: Math.random() * 6 + 6,
        },
      ]);
    }, 250);

    const sparkleInterval = setInterval(() => {
      setSparkles((prev) => [
        ...prev.slice(-12),
        {
          id: Date.now() + Math.random(),
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: Math.random() * 6 + 4,
        },
      ]);
    }, 700);

    const heartInterval = setInterval(() => {
      setHearts((prev) => [
        ...prev.slice(-6),
        {
          id: Date.now() + Math.random(),
          left: Math.random() * 80 + 10,
          duration: Math.random() * 4 + 6,
        },
      ]);
    }, 1600);

    return () => {
      clearInterval(snowInterval);
      clearInterval(sparkleInterval);
      clearInterval(heartInterval);
    };
  }, []);

  /* ⭐ Click burst */
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = 0; i < 8; i++) {
      const id = Date.now() + Math.random() + i;
      setStars((prev) => [...prev, { id, x, y }]);
      setTimeout(
        () => setStars((prev) => prev.filter((s) => s.id !== id)),
        1200
      );
    }
  };

  /* 🎶 AUTOPLAY + STOP WHEN PAGE HIDDEN */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = playlist[currentTrack].url;
    audio.volume = 0.6;

    const autoPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    };

    autoPlay();

    const handleVisibility = () => {
      if (document.hidden) {
        audio.pause();
      } else {
        audio.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      audio.pause();
      audio.currentTime = 0;
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [currentTrack]);

  /* ▶ / ⏸ */
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      await audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  /* ⏭ */
  const nextTrack = () => {
    setCurrentTrack((p) => (p + 1) % playlist.length);
  };

  /* ⏮ */
  const prevTrack = () => {
    setCurrentTrack((p) => (p - 1 + playlist.length) % playlist.length);
  };

  /* ⏳ COUNTDOWN TO 2026 */
  useEffect(() => {
    const target = new Date("January 1, 2026 00:00:00").getTime();

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setCountdown("🎆 Welcome to 2026! 🎆");
        clearInterval(timer);
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setCountdown(`${d}d ${h}h ${m}m ${s}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#071b14] via-[#0b3d2e] to-[#14532d]">

      {/* ❄ Snow */}
      {snowflakes.map((f) => (
        <div
          key={f.id}
          className="absolute text-white pointer-events-none"
          style={{
            left: `${f.left}%`,
            fontSize: `${f.size}px`,
            animation: `fall ${f.duration}s linear infinite`,
          }}
        >
          ❄
        </div>
      ))}

      {/* ✨ Sparkles */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute bg-yellow-300 rounded-full animate-ping"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
          }}
        />
      ))}

      {/* 🎄 CARD */}
      <div
        onClick={handleClick}
        className="relative z-10 max-w-3xl mx-4 p-12 rounded-3xl bg-white/90 backdrop-blur-xl shadow-2xl"
      >
        {hearts.map((h) => (
          <div
            key={h.id}
            className="absolute bottom-0 text-3xl animate-rise-heart"
            style={{ left: `${h.left}%`, animationDuration: `${h.duration}s` }}
          >
            ❤️
          </div>
        ))}

        {stars.map((s) => (
          <div
            key={s.id}
            className="absolute text-xl animate-ping"
            style={{ left: s.x, top: s.y }}
          >
            ✨
          </div>
        ))}

        <h1 className="text-6xl font-extrabold text-center bg-gradient-to-r from-red-600 to-green-700 bg-clip-text text-transparent mb-6">
          Merry Christmas 🎄
        </h1>

        <p className="text-center text-xl mb-8 text-gray-700">
          Thank you for trusting <strong>AquaGas Delivery-App</strong> to keep
          your home warm and safe 🔥
        </p>

        <div className="text-center p-6 rounded-2xl bg-green-50 mb-8">
          <p className="text-2xl font-bold text-green-700">
            Countdown to 2026 🎆
          </p>
          <p className="text-3xl mt-3 font-mono text-red-600">{countdown}</p>
        </div>

        <div className="text-center">
          <a
            href="https://www.aquagas.co.ke"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 rounded-full text-white font-bold text-xl bg-gradient-to-r from-green-600 to-emerald-500 hover:scale-105 transition"
          >
            Visit AquaGas 🎁
          </a>
        </div>
      </div>

      {/* 🎵 MUSIC BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur shadow-lg p-4 flex items-center justify-between z-30">
        <button onClick={prevTrack} className="text-3xl">⏮</button>
        <button onClick={togglePlay} className="text-4xl">
          {isPlaying ? "⏸" : "▶"}
        </button>
        <button onClick={nextTrack} className="text-3xl">⏭</button>
      </div>

      <audio ref={audioRef} onEnded={nextTrack} />

      <style>{`
        @keyframes fall {
          to { transform: translateY(110vh); }
        }
        @keyframes rise-heart {
          from { opacity: 0; transform: translateY(0) scale(.5); }
          to { opacity: 0; transform: translateY(-300px) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ChristmasGreeting;
