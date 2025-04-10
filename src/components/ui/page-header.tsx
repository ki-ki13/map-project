import React from "react"
import { cn } from "@/lib/utils"

export function PageHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col items-start gap-2", className)} {...props}>
      {children}
    </div>
  )
}

export function PageHeaderHeading({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "text-3xl font-bold tracking-tight sm:text-4xl",
        className
      )}
      {...props}
    />
  )
}

export function PageHeaderDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-muted-foreground text-lg",
        className
      )}
      {...props}
    />
  )
}