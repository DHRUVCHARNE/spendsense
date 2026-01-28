"use client"
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
export default function ToggleTheme() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);//resolvedTheme is undefined on first render so check mounted
    if (!mounted) return null;

    const isDark = resolvedTheme === "dark";

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
        >
       {
        isDark ? <Moon className="size-5" /> :<Sun className="size-5" />
       }
       <span className="sr-only">Toggle Theme</span>
        </Button>
    )

}