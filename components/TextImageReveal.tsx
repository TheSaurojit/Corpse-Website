"use client"

import { useRef } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

export default function TextImageReveal({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const lines = gsap.utils.toArray<HTMLElement>('.reveal-line')

      lines.forEach((line) => {
        const imgSpan = line.querySelector('.img-span')

        if (imgSpan) {
          gsap.to(imgSpan, {
            width: "clamp(120px, 22vw, 400px)", // Restored large width
            ease: "none",
            scrollTrigger: {
              trigger: line,
              start: "top 90%",
              end: "top 40%",
              scrub: 1,
            }
          })
        }
      })
    },
    { scope: containerRef }
  )

  const textClasses = "text-4xl md:text-7xl lg:text-[7.5rem] font-bold tracking-tighter whitespace-nowrap uppercase"
  const imgSpanClasses = "img-span relative h-[50px] md:h-[80px] lg:h-[110px] w-0 rounded-[5px] overflow-hidden"
  const imgClasses = "absolute left-1/2 -translate-x-1/2 h-full w-[clamp(120px,22vw,400px)] max-w-none rounded-[5px] object-cover object-center"

  return (
    <section ref={containerRef} style={{ fontFamily: "'Suisse', monospace" }} className={`w-full min-h-screen flex flex-col justify-center items-center py-20 bg-black text-white overflow-hidden ${className}`}>
      <div className="flex flex-col items-center justify-center gap-2 md:gap-4 lg:gap-6 w-full px-4">

        {/* Line 1 */}
        <div className="reveal-line flex justify-center items-center gap-[8px] md:gap-[16px]">

          <span className={textClasses}>World's First</span>

          <span className={imgSpanClasses}>
            <img
              src="https://i.pinimg.com/1200x/93/27/65/932765c7cd00055218ba7398119d7d4d.jpg"
              alt="Visual 1"
              className={imgClasses}
            />
          </span>
        </div>

        {/* Line 2 */}
        <div className="reveal-line flex justify-center items-center gap-[8px] md:gap-[16px]">
          <span className={textClasses}>Platform</span>
          <span className={imgSpanClasses}>
            <img
              src="https://i.pinimg.com/736x/a9/f1/19/a9f11909a9644d7bfd5102fabcd8310c.jpg"
              alt="Visual 2"
              className={imgClasses}
            />
          </span>
          <span className={textClasses}>for</span>
        </div>

        {/* Line 3 */}
        <div className="reveal-line flex justify-center items-center gap-[8px] md:gap-[16px]">
          <span className={textClasses}>Esports</span>
          <span className={imgSpanClasses}>
            <img
              src="https://i.pinimg.com/1200x/48/09/77/480977567d6b4503c8f642728f266b72.jpg"
              alt="Visual 3"
              className={imgClasses}
            />
          </span>
          <span className={textClasses}>players</span>
        </div>

        {/* Line 4 */}
        {/* <div className="reveal-line flex justify-center items-center gap-[8px] md:gap-[16px]">
          <span className={textClasses}>do you believe</span>
          <span className={imgSpanClasses}>
            <img
              src="https://i.pinimg.com/1200x/9e/f2/b7/9ef2b73b1e2ff489f99bc0a90196fbea.jpg"
              alt="Visual 4"
              className={imgClasses}
            />
          </span>
          <span className={textClasses}>you are?</span>
        </div> */}

      </div>
    </section>
  )
}
