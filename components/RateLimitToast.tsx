// components/RateLimitToast.tsx
"use client"

import { useEffect } from "react"
import { toast } from "sonner"

export default function RateLimitToast({
  error,
  remaining,
  reset,
}: {
  error?: string
  remaining?: number
  reset?: number
}) {
  useEffect(() => {
    if (error === "rate_limited") {
      let message = "Too many login attempts."

      if (typeof reset === "number") {
        const seconds = Math.max(0, Math.ceil((reset - Date.now()) / 1000))
        message += ` Try again in ${seconds}s.`
      }

      toast.error(message)
    }
  }, [error, remaining, reset])

  return null
}
