import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "px-4 py-2 rounded-md bg-black text-white text-sm font-semibold hover:bg-gray-800 transition",
        className
      )}
      {...props}
    />
  )
)
Button.displayName = "Button"

export { Button } 