'use client';

import { useEffect, useRef, useState } from 'react';

const MASK_BOXES = [
  { id: 'box1', className: "w-[35vw] h-[20vw] top-[15vh] left-[8vw]" },
  { id: 'box2', className: "w-[35vw] h-[20vw] bottom-[3vh] left-[15vw]" },
  { id: 'box3', className: "w-[35vw] h-[20vw] top-[15vh] right-[5vw]" },
  { id: 'box4', className: "w-[20vw] h-[10vw] bottom-[23vh] left-[5vw]" },
  { id: 'box5', className: "w-[22vw] h-[12vw] top-[28vh] left-[6vw]" },
  { id: 'box6', className: "w-[60vw] h-[35vw] top-[20vh] right-[10vw]" },
];

import { Spotlight } from '@/components/ui/spotlight-new';

export default function HeroSection({ className = "" }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const globalHudRef = useRef<HTMLDivElement>(null);
  const masksRef = useRef<{ root: HTMLDivElement | null, canvas: HTMLCanvasElement | null, coords: HTMLDivElement | null, state: any }[]>([]);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const globalHud = globalHudRef.current;
    if (!video || !globalHud) return;

    let isHoveringMask = false;
    let animationFrameId: number;
    let draggingMaskIndex = -1;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    const handleCanPlay = () => {
      setLoaded(true);

      masksRef.current.forEach((mask) => {
        if (!mask.root || !mask.canvas) return;
        const r = mask.root.getBoundingClientRect();
        mask.state = {
          x: r.left + window.scrollX,
          y: r.top + window.scrollY,
          w: r.width,
          h: r.height
        };

        mask.root.style.left = "0px";
        mask.root.style.top = "0px";
        mask.root.style.transform = `translate3d(${mask.state.x}px, ${mask.state.y}px, 0)`;

        mask.canvas.width = r.width;
        mask.canvas.height = r.height;
      });

      startRenderLoop();
    };

    const drawClipped = (ctx: CanvasRenderingContext2D, video: HTMLVideoElement, rect: any) => {
      if (video.videoWidth === 0 || video.videoHeight === 0) return;
      const videoAspect = video.videoWidth / video.videoHeight;
      const windowAspect = window.innerWidth / window.innerHeight;

      let dw, dh, dx, dy;

      if (videoAspect > windowAspect) {
        dh = window.innerHeight;
        dw = dh * videoAspect;
        dx = (window.innerWidth - dw) / 2;
        dy = 0;
      } else {
        dw = window.innerWidth;
        dh = dw / videoAspect;
        dx = 0;
        dy = (window.innerHeight - dh) / 2;
      }

      const scaleX = video.videoWidth / dw;
      const scaleY = video.videoHeight / dh;

      ctx.drawImage(
        video,
        (rect.x - dx) * scaleX,
        (rect.y - dy) * scaleY,
        rect.w * scaleX,
        rect.h * scaleY,
        0,
        0,
        rect.w,
        rect.h
      );
    };

    const startRenderLoop = () => {
      const draw = () => {
        masksRef.current.forEach(mask => {
          if (!mask.root || !mask.canvas || !mask.coords || !mask.state) return;
          const ctx = mask.canvas.getContext('2d');
          if (!ctx) return;

          ctx.clearRect(0, 0, mask.canvas.width, mask.canvas.height);
          const viewportRect = {
            ...mask.state,
            x: mask.state.x - window.scrollX,
            y: mask.state.y - window.scrollY
          };
          drawClipped(ctx, video, viewportRect);

          mask.coords.textContent = `X: ${Math.round(mask.state.x)}px Y: ${Math.round(mask.state.y)}px`;
        });
        animationFrameId = requestAnimationFrame(draw);
      };
      draw();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHoveringMask) {
        globalHud.innerHTML = `X: ${e.clientX}px <br/> Y: ${e.clientY}px`;
      }
      globalHud.style.transform = `translate3d(${e.clientX + 16}px, ${e.clientY + 16}px, 0)`;

      if (draggingMaskIndex > -1) {
        const mask = masksRef.current[draggingMaskIndex];
        if (!mask || !mask.root || !mask.state) return;

        mask.state.x = e.pageX - dragOffsetX;
        mask.state.y = e.pageY - dragOffsetY;
        mask.root.style.transform = `translate3d(${mask.state.x}px, ${mask.state.y}px, 0)`;
      }
    };

    const handleMouseUp = () => {
      if (draggingMaskIndex > -1) {
        const mask = masksRef.current[draggingMaskIndex];
        if (mask && mask.root) mask.root.style.cursor = 'grab';
      }
      draggingMaskIndex = -1;
    };

    const cleanupListeners: Array<() => void> = [];

    masksRef.current.forEach((mask, index) => {
      if (!mask.root) return;
      const root = mask.root;

      const onEnter = () => {
        isHoveringMask = true;
        globalHud.textContent = "GRAB";
      };
      const onLeave = () => {
        isHoveringMask = false;
      };
      const onDown = (e: MouseEvent) => {
        draggingMaskIndex = index;
        if (mask.state) {
          dragOffsetX = e.pageX - mask.state.x;
          dragOffsetY = e.pageY - mask.state.y;
        }
        root.style.cursor = "grabbing";
      };

      root.addEventListener('mouseenter', onEnter);
      root.addEventListener('mouseleave', onLeave);
      root.addEventListener('mousedown', onDown);

      cleanupListeners.push(() => {
        root.removeEventListener('mouseenter', onEnter);
        root.removeEventListener('mouseleave', onLeave);
        root.removeEventListener('mousedown', onDown);
      });
    });

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    video.addEventListener('canplay', handleCanPlay);
    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      cancelAnimationFrame(animationFrameId);
      cleanupListeners.forEach(c => c());
    };
  }, []);

  const baseTrans = "transition-all duration-700 ease-out";
  const hidden = "opacity-0 translate-y-4";
  const visible = "opacity-100 translate-y-0";

  return (
    <section
      id="home"
      aria-label="Arena hero"
      className={`relative w-full h-[100svh] overflow-hidden bg-black text-white ${className}`}
      onMouseEnter={() => { if (globalHudRef.current) globalHudRef.current.style.opacity = '1'; }}
      onMouseLeave={() => { if (globalHudRef.current) globalHudRef.current.style.opacity = '0'; }}
    >

      <div
        ref={globalHudRef}
        className="fixed top-0 left-0 text-white font-mono text-[13px] pointer-events-none z-[9999] will-change-transform opacity-0"
        style={{ transition: 'opacity 0.45s ease' }}
      />

      <video
        ref={videoRef}
        className="fixed opacity-0 pointer-events-none w-[1px] h-[1px]"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/0411.webm" type="video/webm" />
        <source src="/0411.mp4" type="video/mp4" />
      </video>

      {/* Render the hidden drifting masks */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-[900ms] ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        {MASK_BOXES.map((box, i) => (
          <div
            key={box.id}
            ref={el => {
              if (el && !masksRef.current[i]) masksRef.current[i] = { root: null, canvas: null, coords: null, state: null };
              if (masksRef.current[i]) masksRef.current[i].root = el;
            }}
            className={`absolute border-2 border-[#434343] cursor-grab will-change-transform origin-top-left ${box.className}`}
          >
            <canvas
              ref={el => { if (masksRef.current[i]) masksRef.current[i].canvas = el; }}
              className="w-full h-full block bg-[#050505]"
            />
            <div
              ref={el => { if (masksRef.current[i]) masksRef.current[i].coords = el; }}
              className="absolute -top-[18px] -left-[2px] font-mono text-[11px] text-white bg-[#313030]/65 px-1.5 py-0.5 pointer-events-none whitespace-nowrap"
            />
          </div>
        ))}
      </div>

      <div className={`absolute inset-0 z-10 flex items-center justify-center pointer-events-none select-none mix-blend-difference ${baseTrans} delay-[300ms] ${loaded ? visible : hidden}`}>
        <h2
          className="m-0 text-zinc-500 font-black tracking-tighter text-4xl md:text-6xl lg:text-[3.5rem] leading-none"
          style={{ fontFamily: "'Natson', var(--font-display), sans-serif" }}
        >

        </h2>
      </div>

    </section>
  );
}
