"use client"
import { AppRouter } from "./routers/_app"
import {createTRPCReact} from "@trpc/react-query"

export const api = createTRPCReact<AppRouter>();