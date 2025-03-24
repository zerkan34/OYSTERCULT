import * as React from "react"

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          className={`
            peer sr-only
            ${className}
          `}
          ref={ref}
          {...props}
        />
        <div className={`
          h-5 w-10 rounded-full
          bg-gray-300 dark:bg-gray-600
          shadow-inner
          peer-focus:ring-2 peer-focus:ring-blue-400 dark:peer-focus:ring-blue-600
          peer-focus:ring-offset-1 peer-focus:ring-offset-white dark:peer-focus:ring-offset-gray-900
          peer-checked:bg-blue-500 dark:peer-checked:bg-blue-600
          transition-colors
          after:content-[''] after:absolute after:top-0.5 after:left-0.5
          after:bg-white dark:after:bg-gray-100
          after:rounded-full after:h-4 after:w-4
          after:transition-all
          peer-checked:after:translate-x-5
          peer-disabled:cursor-not-allowed
          peer-disabled:opacity-50
        `}></div>
      </div>
    )
  }
)

Switch.displayName = "Switch"
