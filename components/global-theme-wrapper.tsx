"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { getThemeSettings } from "@/app/admin/actions"

export function GlobalThemeWrapper({ children }: { children: React.ReactNode }) {
    const { setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const syncTheme = async () => {
            // Retrieve global settings from server
            const settings = await getThemeSettings();

            // Apply Dark Mode Preference
            if (settings?.darkMode) {
                setTheme('dark')
            } else {
                setTheme('light')
            }

            // Apply Campaign Theme Class
            // Remove any existing theme classes first
            document.body.classList.remove('theme-rosa', 'theme-azul', 'theme-laranja');
            if (settings?.theme) {
                document.body.classList.add(settings.theme);
            }
        }

        syncTheme();

        // Poll for changes every 5 seconds (Simple "Real-time" for now)
        const interval = setInterval(syncTheme, 5000);
        return () => clearInterval(interval);

    }, [setTheme]);

    if (!mounted) {
        return <>{children}</>
    }

    return <>{children}</>
}
