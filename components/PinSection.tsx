"use client"

import { useRef } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import Card from "./Card"
import Text from "./Text"

const COPY = {
  titleLight:
    "text-xl! font-semibold tracking-tight text-white drop-shadow-md sm:text-2xl!",
  bodyLight:
    "mt-auto text-sm! font-serif font-normal text-zinc-300 drop-shadow-sm sm:text-base!",
  titleStone:
    "text-xl! font-semibold tracking-tight text-stone-100 drop-shadow-md sm:text-2xl!",
  bodyStone:
    "mt-auto text-sm! font-serif font-normal text-stone-300 drop-shadow-sm sm:text-base!",
} as const

type ShardCardData = {
  id: string
  left: string
  width: string
  frontClipPath: string
  backClipPath: string
  frontBgSize: string
  frontBgPos: string
  backface: string
  number: string
  title: string
  body: string
  textStyle: "Light" | "Stone"
}

const shardCards: ShardCardData[] = [
  {
    id: "card-1",
    left: "0%",
    width: "25%",
    frontClipPath: "polygon(0% 0%, 100% 0%, 60% 100%, 0% 100%)",
    backClipPath: "polygon(0% 0%, 100% 0%, 60% 100%, 0% 100%)",
    frontBgSize: "400% 100%",
    frontBgPos: "0% 0%",
    backface: "bg-zinc-800",
    number: "01",
    title: "Split the canvas",
    body: "Break apart a solid foundation to reveal what is inside.",
    textStyle: "Light",
  },
  {
    id: "card-2",
    left: "15%",
    width: "30%",
    frontClipPath: "polygon(33.333% 0%, 100% 0%, 66.666% 100%, 0% 100%)",
    backClipPath: "polygon(33.333% 0%, 100% 0%, 66.666% 100%, 0% 100%)",
    frontBgSize: "333.333% 100%",
    frontBgPos: "21.428% 0%",
    backface: "bg-emerald-900",
    number: "02",
    title: "Fluid motion",
    body: "Every piece flows naturally to its place in the grid.",
    textStyle: "Light",
  },
  {
    id: "card-3",
    left: "35%",
    width: "30%",
    frontClipPath: "polygon(33.333% 0%, 100% 0%, 66.666% 100%, 0% 100%)",
    backClipPath: "polygon(33.333% 0%, 100% 0%, 66.666% 100%, 0% 100%)",
    frontBgSize: "333.333% 100%",
    frontBgPos: "50% 0%",
    backface: "bg-zinc-950",
    number: "03",
    title: "Hidden depths",
    body: "A twist of perspective introduces new layers.",
    textStyle: "Stone",
  },
  {
    id: "card-4",
    left: "55%",
    width: "30%",
    frontClipPath: "polygon(33.333% 0%, 100% 0%, 66.666% 100%, 0% 100%)",
    backClipPath: "polygon(33.333% 0%, 100% 0%, 66.666% 100%, 0% 100%)",
    frontBgSize: "333.333% 100%",
    frontBgPos: "78.571% 0%",
    backface: "bg-blue-900",
    number: "04",
    title: "Bento layouts",
    body: "Structured yet playful asymmetric grids.",
    textStyle: "Light",
  },
  {
    id: "card-5",
    left: "75%",
    width: "25%",
    frontClipPath: "polygon(40% 0%, 100% 0%, 100% 100%, 0% 100%)",
    backClipPath: "polygon(40% 0%, 100% 0%, 100% 100%, 0% 100%)",
    frontBgSize: "400% 100%",
    frontBgPos: "100% 0%",
    backface: "bg-orange-950",
    number: "05",
    title: "The bigger picture",
    body: "Span across limits to make hero statements.",
    textStyle: "Light",
  },
]

const PinSection = ({ className = "" }: { className?: string }) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      const row = rowRef.current
      if (!section || !row) return

      const cards = row.querySelectorAll<HTMLElement>("[data-card-shell]")
      const flippers = row.querySelectorAll<HTMLElement>("[data-flip-inner]")
      const backFaces = row.querySelectorAll<HTMLElement>("[data-card-face='back']")

      gsap.set(flippers, { rotationY: 0, transformStyle: "preserve-3d" })
      gsap.set(backFaces, { visibility: "hidden" })

      const flipTl = gsap.timeline({ paused: true })

      // Flip the cards in place inside the grid
      flippers.forEach((flipper, i) => {
        flipTl.to(
          flipper,
          {
            rotationY: 180,
            boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 8px 16px rgba(0,0,0,0.2)",
            duration: 0.8,
            ease: "power2.inOut",
            force3D: true,
          },
          i * 0.08 // smooth stagger for the flip
        )
      })

      // Toggle visibility halfway through each card's flip
      flippers.forEach((flipper, i) => {
        const front = flipper.querySelector("[data-card-face='front']")
        const back = flipper.querySelector("[data-card-face='back']")

        flipTl.set(front, { visibility: "hidden" }, i * 0.08 + 0.4)
        flipTl.set(back, { visibility: "visible" }, i * 0.08 + 0.4)
      })

      let flipped = false

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=350%",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (self.progress > 0.55 && !flipped) {
              flipped = true
              flipTl.play()
            } else if (self.progress <= 0.55 && flipped) {
              flipped = false
              flipTl.reverse()
            }
          },
        },
      })

      // 1. Zoom out slightly
      tl.to(row, { scale: 0.85, duration: 1, ease: "power1.inOut" }, 0)

      // 2. The Split - separate them horizontally
      const xOffsets = [-40, -20, 0, 20, 40]
      cards.forEach((card, i) => {
        tl.to(card, { x: `${xOffsets[i]}px`, duration: 1.5, ease: "power2.inOut" }, 1)
      })

      tl.to({}, { duration: 2 }, 2.5) // padding at end of scroll
    },
    { scope: sectionRef }
  )

  return (
    <div
      ref={sectionRef}
      className={`relative z-20 flex min-h-[100svh] w-full items-center justify-center overflow-visible px-4 py-8 sm:px-8 md:px-12 lg:px-20 ${className}`}
    >
      <div
        ref={rowRef}
        className="relative w-[95vw] md:w-[85vw] max-w-[1100px] overflow-visible perspective-[1200px]"
        style={{ aspectRatio: "16 / 9" }}
      >
        {shardCards.map((card) => (
          <Card
            key={card.id}
            className="absolute top-0 bottom-0 will-change-transform"
            style={{ left: card.left, width: card.width }}
            alt={card.title}
            backfaceClassName={card.backface}
            frontClipPath={card.frontClipPath}
            backClipPath={card.backClipPath}
            frontStyle={{
              backgroundImage: "url('/header_test.png')",
              backgroundSize: card.frontBgSize,
              backgroundPosition: card.frontBgPos,
            }}
          >
            <Text className="mt-auto mb-4 text-4xl! font-light opacity-50">
              ({card.number})
            </Text>
            <Text className={COPY[`title${card.textStyle}`]}>
              {card.title}
            </Text>
            <Text className={COPY[`body${card.textStyle}`]}>
              {card.body}
            </Text>
          </Card>
        ))}
      </div>
    </div>
  )
}
export default PinSection
