// lib/cached-auth.ts
import { auth } from "@/auth"
import { cache } from "react"

export const cachedAuth = cache(async () => {
  return auth()
})
