import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, variant = 'default', size = 'default', ...props}, ref) => {

    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-400 disabled:pointer-events-none disabled:opacity-50"

    const variantStyles = {
      default: "bg-orange-500 text-white shadow hover:bg-orange-600",
      outline: "border border-gray-300 bg-white shadow-sm hover:bg-gray-50 hover:text-gray-900",
      ghost: "hover:bg-gray-100 hover:text-gray-900",
      destructive: "bg-red-500 text-white shadow-sm hover:bg-red-600"
    };
    
    const sizeStyles = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-8",
      icon: "h-9 w-9"
    };
    const buttonClasses = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className
    );
    
    return (
      <button
        className={buttonClasses}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"
