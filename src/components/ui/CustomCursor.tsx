'use client';
import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (isMobile) return;

    let mx = -200;
    let my = -200;
    let cx = -200;
    let cy = -200;

    const ring = ringRef.current;
    const dot = dotRef.current;

    if (!ring || !dot) return;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    document.addEventListener('mousemove', onMove);

    let raf: number;

    const tick = () => {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;

      ring.style.left = `${cx}px`;
      ring.style.top = `${cy}px`;

      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    const onEnter = () => {
      ring.style.width = '52px';
      ring.style.height = '52px';
      ring.style.borderColor = 'rgba(232,25,26,0.9)';
    };

    const onLeave = () => {
      ring.style.width = '32px';
      ring.style.height = '32px';
      ring.style.borderColor = 'rgba(232,25,26,0.5)';
    };

    const attachHovers = () => {
      document.querySelectorAll('a,button,[data-hover]').forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);

        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    attachHovers();

    const observer = new MutationObserver(attachHovers);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [isMobile]);

  // Hide custom cursor on mobile
  if (isMobile) return null;

  return (
    <>
      <div id="ca-cursor" ref={ringRef} />
      <div id="ca-cursor-dot" ref={dotRef} />
    </>
  );
}