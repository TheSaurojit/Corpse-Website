"use client"

import { useRef } from "react"
import SplitText from "gsap/SplitText"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

type TextProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  scrub?: boolean | number
  toggleActions?: string
  style?: React.CSSProperties
}

const Text = ({
  children,
  className = "",
  delay = 0,
  scrub = false,
  toggleActions = "play none none reverse",
  style,
}: TextProps) => {
  const textRef = useRef<HTMLDivElement | null>(null)

  useGSAP(
    () => {
      const text = textRef.current
      if (!text) return

      const split = SplitText.create(text, {
        type: "words",
        mask: "words",
      })

      gsap.set(split.words, { opacity: 0, yPercent: 110 })

      gsap.to(split.words, {
        scrollTrigger: {
          trigger: text,
          start: 'top 85%',
          end: scrub ? 'bottom 35%' : undefined,
          scrub: scrub,
          toggleActions: scrub ? undefined : toggleActions,
        },
        yPercent: 0,
        opacity: 1,
        stagger: scrub ? 0.2 : 0.05,
        ease: "power2.inOut",
        duration: scrub ? undefined : 1,
        delay,
      })

    },
    { dependencies: [children, delay, scrub, toggleActions] }
  )

  return (
    <div ref={textRef} className={`text-4xl ${className}`} style={style}>
      {children}
    </div>
  )
}

export default Text
