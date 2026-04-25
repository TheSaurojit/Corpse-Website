'use client';
import { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';

export default function SpotlightSection() {
    const spotlightRef = useRef<HTMLElement>(null);
    const lottieContainerRef = useRef<HTMLDivElement>(null);
    const lottieRef = useRef<HTMLDivElement>(null);
    const spotlightMaskRef = useRef<HTMLDivElement>(null);

    const [cursorDetected, setCursorDetected] = useState(false);
    const isTrackingRef = useRef(false);

    const pos = useRef({
        mouse: {
            target: { x: 0, y: 0 },
            current: { x: 0, y: 0 },
            last: { x: 0, y: 0 },
        },
        lottie: {
            current: { x: 0, y: 0 },
            center: { x: 0, y: 0 },
        },
    });

    useEffect(() => {
        if (!lottieRef.current) return;

        const animation = lottie.loadAnimation({
            container: lottieRef.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            path: "/Fire.json",
        });

        return () => animation.destroy();
    }, []);

    useEffect(() => {
        const spotlight = spotlightRef.current;
        const lottieContainer = lottieContainerRef.current;
        const spotlightMask = spotlightMaskRef.current;

        if (!spotlight || !lottieContainer || !spotlightMask) return;

        const init = () => {
            const spotlightRect = spotlight.getBoundingClientRect();
            const lottieRect = lottieContainer.getBoundingClientRect();

            pos.current.lottie.center.x =
                lottieRect.left - spotlightRect.left + lottieRect.width / 2;
            pos.current.lottie.center.y =
                lottieRect.top - spotlightRect.top + lottieRect.height / 2;

            pos.current.mouse.current.x = pos.current.mouse.target.x = spotlightRect.width / 2;
            pos.current.mouse.current.y = pos.current.mouse.target.y = spotlightRect.height / 2;
        };

        const updateCursor = (x: number, y: number) => {
            if (!cursorDetected) return;

            pos.current.mouse.last.x = x;
            pos.current.mouse.last.y = y;

            const spotlightRect = spotlight.getBoundingClientRect();
            const isInsideSpotlight =
                x >= spotlightRect.left &&
                x <= spotlightRect.right &&
                y >= spotlightRect.top &&
                y <= spotlightRect.bottom;

            if (isInsideSpotlight) {
                pos.current.mouse.target.x = x - spotlightRect.left;
                pos.current.mouse.target.y = y - spotlightRect.top;
                isTrackingRef.current = true;
                spotlightMask.classList.add("active");
            } else {
                isTrackingRef.current = false;
                spotlightMask.classList.remove("active");
            }
        };

        const handleMouseEnter = (e: MouseEvent) => {
            setCursorDetected(true);
            updateCursor(e.clientX, e.clientY);
        };
        
        const handleMouseMove = (e: MouseEvent) => {
            setCursorDetected(true);
            updateCursor(e.clientX, e.clientY);
        };
        
        const handleScroll = () => {
            if (cursorDetected) {
                updateCursor(pos.current.mouse.last.x, pos.current.mouse.last.y);
            }
        };

        window.addEventListener("mouseenter", handleMouseEnter, { once: true });
        window.addEventListener("mouseover", handleMouseEnter, { once: true });
        document.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", init);

        let animationFrameId: number;

        const animate = () => {
            pos.current.mouse.current.x += (pos.current.mouse.target.x - pos.current.mouse.current.x) * 0.1;
            pos.current.mouse.current.y += (pos.current.mouse.target.y - pos.current.mouse.current.y) * 0.1;

            spotlight.style.setProperty("--mouse-x", `${pos.current.mouse.current.x}px`);
            spotlight.style.setProperty("--mouse-y", `${pos.current.mouse.current.y}px`);

            const targetX = isTrackingRef.current
                ? pos.current.mouse.current.x - pos.current.lottie.center.x
                : 0;

            const targetY = isTrackingRef.current
                ? pos.current.mouse.current.y - pos.current.lottie.center.y
                : 0;

            pos.current.lottie.current.x += (targetX - pos.current.lottie.current.x) * 0.1;
            pos.current.lottie.current.y += (targetY - pos.current.lottie.current.y) * 0.1;

            lottieContainer.style.transform = `translate(${pos.current.lottie.current.x}px, ${pos.current.lottie.current.y}px)`;

            animationFrameId = requestAnimationFrame(animate);
        };

        setTimeout(init, 100);
        animate();

        return () => {
            window.removeEventListener("mouseenter", handleMouseEnter);
            window.removeEventListener("mouseover", handleMouseEnter);
            document.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", init);
            cancelAnimationFrame(animationFrameId);
        };
    }, [cursorDetected]);

    return (
        <section ref={spotlightRef} className="spotlight">
            <div ref={lottieContainerRef} className="lottie-container">
                <div ref={lottieRef} className="lottie"></div>
                <div className="fire-glow"></div>
            </div>

            <h1 className="font-serif italic tracking-tighter text-[clamp(3rem,5vw,7rem)] leading-none text-center block mb-4">Guided By Interaction</h1>
            <p className="text-2xl w-full lg:w-[60%] text-center text-white/80">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe, nihil debitis reprehenderit blanditiis iste
                minus amet ducimus dolorum rem velit doloremque a adipisci, tempora molestias quisquam eum ipsa consectetur
                maxime illo placeat! Nihil, natus commodi quae cum placeat laboriosam reiciendis magnam doloremque alias
                veritatis? Corporis.
            </p>
            <div ref={spotlightMaskRef} className="spotlight-mask"></div>
        </section>
    );
}
