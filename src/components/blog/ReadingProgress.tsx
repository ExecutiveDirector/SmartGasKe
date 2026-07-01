import { useEffect, useState } from 'react';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = (el.scrollHeight || document.body.scrollHeight) - el.clientHeight;
      setProgress(scrollHeight > 0 ? Math.min(100, (scrollTop / scrollHeight) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ position: 'sticky', top: 68, zIndex: 40, height: '3px', background: 'rgba(10,61,43,0.08)' }}>
      <div
        style={{
          height: '100%', width: `${progress}%`,
          background: 'linear-gradient(90deg, #C9A44A, #E8621A)',
          transition: 'width 0.1s linear',
        }}
      />
    </div>
  );
}
