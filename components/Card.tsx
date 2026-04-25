"use client"

import Image from "next/image"
import type { ReactNode } from "react"
import React from "react"

export type CardProps = {
  alt: string
  children?: ReactNode
  backfaceClassName?: string
  className?: string
  frontStyle?: React.CSSProperties
  frontContent?: ReactNode
  frontClipPath?: string
  backClipPath?: string
  style?: React.CSSProperties
}

const Card = ({
  alt,
  children,
  backfaceClassName = "",
  className = "",
  frontStyle = {},
  frontContent = null,
  frontClipPath,
  backClipPath,
  style = {},
}: CardProps) => {
  return (
    <div
      data-card-shell
      className={`z-0 overflow-visible bg-transparent perspective-[1200px] ${className.includes('absolute') ? '' : 'relative'} ${className}`}
      style={style}
    >
      <div
        data-flip-inner
        className="relative h-full w-full transform-3d will-change-transform"
      >
        <div
          data-card-face="front"
          className="absolute inset-0 overflow-hidden backface-hidden transform-[translateZ(4px)] bg-cover bg-no-repeat"
          style={{ ...frontStyle, WebkitClipPath: frontClipPath, clipPath: frontClipPath }}
          title={alt}
        >
          {frontContent}
        </div>

        <div
          data-card-face="back"
          className={`absolute inset-0 flex flex-col justify-center overflow-hidden py-6 px-6 sm:py-8 sm:px-8 backface-hidden transform-[rotateY(180deg)_translateZ(4px)] ${backfaceClassName}`}
          style={{ WebkitClipPath: backClipPath, clipPath: backClipPath }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default Card
