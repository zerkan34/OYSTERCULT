import * as React from "react"
import { Dialog as HeadlessDialog, Transition } from "@headlessui/react"
import { cn } from "@/lib/utils"

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  className?: string;
}

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(({ 
  open, 
  onClose, 
  children, 
  className
}, ref) => (
  <Transition appear show={open} as={React.Fragment}>
    <HeadlessDialog 
      as="div" 
      className={cn("relative z-50", className)} 
      onClose={onClose}
    >
      <Transition.Child
        as={React.Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm" 
          onClick={onClose}
        />
      </Transition.Child>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <HeadlessDialog.Panel
              ref={ref}
              className={cn(
                "w-full max-w-lg transform overflow-hidden rounded-lg bg-[rgb(var(--color-brand-surface)_/_var(--glass-opacity))] p-6 text-left align-middle shadow-xl transition-all",
                className
              )}
            >
              {children}
            </HeadlessDialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </HeadlessDialog>
  </Transition>
))
Dialog.displayName = "Dialog"

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative z-50 w-full max-w-lg rounded-lg bg-[rgb(var(--color-brand-surface)_/_var(--glass-opacity))] p-6 shadow-lg backdrop-blur-md border border-white/10",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
DialogContent.displayName = "DialogContent"

const DialogHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props}
  >
    {children}
  </div>
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof HeadlessDialog.Title>
>(({ className, children, ...props }, ref) => (
  <HeadlessDialog.Title
    ref={ref}
    className={cn("text-xl font-semibold text-white", className)}
    {...props}
  >
    {children}
  </HeadlessDialog.Title>
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof HeadlessDialog.Description>
>(({ className, children, ...props }, ref) => (
  <HeadlessDialog.Description
    ref={ref}
    className={cn("text-sm text-white/70", className)}
    {...props}
  >
    {children}
  </HeadlessDialog.Description>
))
DialogDescription.displayName = "DialogDescription"

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription }
