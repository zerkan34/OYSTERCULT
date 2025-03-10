import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border border-white/10 px-3 py-1.5",
      "text-sm text-white shadow-md animate-in fade-in-0 zoom-in-95",
      "bg-gradient-to-br from-brand-dark/95 to-brand-purple/95",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
      "data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2",
      "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
      "data-[side=top]:slide-in-from-bottom-2",
      "focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

interface TooltipComponentProps {
  content: React.ReactNode
  children: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  delayDuration?: number
  className?: string
}

const TooltipComponent = ({
  content,
  children,
  side = "top",
  align = "center",
  delayDuration = 200,
  className,
}: TooltipComponentProps) => (
  <Tooltip delayDuration={delayDuration}>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    <TooltipContent side={side} align={align} className={className}>
      {content}
    </TooltipContent>
  </Tooltip>
)

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipComponent as default,
}
