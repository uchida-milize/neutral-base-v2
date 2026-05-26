import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // フワッとした hover を出すため transition-all → transition-colors + duration-200 ease-out に変更
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        // Figma: component/Button Standard/primary (#3b7eff) → hover #2f66d0
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-button-primary-hover",
        // Figma: component/Button Standard/danger (#f64c4c) → hover #e04545
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-button-danger-hover focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        // Figma: component/Button Standard/outline (#ffffff) → hover #f0f6ff
        outline:
          "border bg-background shadow-xs hover:bg-button-outline-hover hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // Figma: component/Button Standard — mobile 44px / desktop 36px (mobile-first)
        default: "h-11 md:h-9 px-4 py-2 has-[>svg]:px-3",
        // Figma: component/Button Small — mobile 36px / desktop 32px (mobile-first)
        sm: "h-9 md:h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 md:h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-11 md:size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
