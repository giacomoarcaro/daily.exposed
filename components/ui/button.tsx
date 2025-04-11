import * as React from "react"

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className = "", ...props }, ref) => (
    <button
      ref={ref}
      className={`px-4 py-2 rounded-md bg-black text-white text-sm font-semibold hover:bg-gray-800 ${className}`}
      {...props}
    />
  )
)
Button.displayName = "Button" 