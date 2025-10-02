import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement,React.InputHTMLAttributes<HTMLInputElement>>(({className, type, ...props}, ref) => {
  return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors text-black",
          
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          
          "placeholder:text-black",
          
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-400 focus-visible:border-orange-400",
          
          "disabled:cursor-not-allowed disabled:opacity-50",
          
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
