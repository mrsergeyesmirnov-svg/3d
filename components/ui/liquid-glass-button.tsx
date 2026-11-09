"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Polished Liquid Glass controls for FORMA.
 * Based on the supplied LiquidButton reference; adds keyboard focus,
 * reduced-motion behavior and a frosted-glass fallback for browsers
 * without SVG backdrop-filter support.
 */
const liquidbuttonVariants = cva("forma-liquid", {
  variants: {
    variant: {
      default: "forma-liquid--light",
      cool: "forma-liquid--cool",
      contrast: "forma-liquid--contrast",
      ghost: "forma-liquid--ghost",
      secondary: "forma-liquid--secondary",
    },
    size: {
      sm: "forma-liquid--sm",
      default: "forma-liquid--default",
      lg: "forma-liquid--lg",
      xl: "forma-liquid--xl",
      xxl: "forma-liquid--xxl",
      icon: "forma-liquid--icon",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
})

export type LiquidButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof liquidbuttonVariants> & { asChild?: boolean }

function GlassFilter({ id }: { id: string }) {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" className="forma-liquid-filter">
      <defs>
        <filter id={id} x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="1" result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="36" xChannelSelector="R" yChannelSelector="B" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="3" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  )
}

const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
  ({ asChild = false, className, variant, size, children, type = "button", ...props }, ref) => {
    const filterId = React.useId().replace(/:/g, "") + "-forma-glass"
    // Slot is safe here because Slottable wraps exactly one consumer element.
    if (asChild) {
      return (
        <Slot className={cn(liquidbuttonVariants({ variant, size }), className)} {...props}>
          {children}
        </Slot>
      )
    }
    return (
      <button
        ref={ref}
        type={type}
        data-slot="liquid-button"
        className={cn(liquidbuttonVariants({ variant, size }), className)}
        {...props}
      >
        <span aria-hidden="true" className="forma-liquid__rim" />
        <span
          aria-hidden="true"
          className="forma-liquid__lens"
          style={{ backdropFilter: 'url("#' + filterId + '") blur(14px) saturate(1.5)' }}
        />
        <span className="forma-liquid__shine" aria-hidden="true" />
        <span className="forma-liquid__content">{children}</span>
        <GlassFilter id={filterId} />
      </button>
    )
  }
)
LiquidButton.displayName = "LiquidButton"

export type MetalButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "success" | "error" | "gold" | "bronze"
}

const MetalButton = React.forwardRef<HTMLButtonElement, MetalButtonProps>(
  ({ className, variant = "default", children, type = "button", ...props }, ref) => (
    <span className={cn("forma-metal", "forma-metal--" + variant)}>
      <button ref={ref} type={type} className={cn("forma-metal__button", className)} {...props}>
        <span className="forma-metal__shine" aria-hidden="true" />
        <span className="forma-metal__content">{children}</span>
      </button>
    </span>
  )
)
MetalButton.displayName = "MetalButton"

export { LiquidButton, liquidbuttonVariants, MetalButton }
