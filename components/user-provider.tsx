"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { supabaseBrowser } from "@/lib/supabase/client"
import { authUtils, type AuthUser } from "@/lib/auth"

interface ExtendedUser extends AuthUser {
    avatar_url?: string | null
}

interface UserContextType {
    user: ExtendedUser | null
    loading: boolean
    refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<ExtendedUser | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        refreshUser()

        const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
                refreshUser()
            } else if (event === 'SIGNED_OUT') {
                setUser(null)
                setLoading(false)
                authUtils.logout()
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const refreshUser = async () => {
        try {
            // Get user directly from Supabase to avoid race conditions with localStorage
            const { data: { user: authUser } } = await supabaseBrowser.auth.getUser()

            if (!authUser) {
                setUser(null)
                setLoading(false)
                return
            }

            // Fetch latest profile data from Supabase
            const { data: profile } = await supabaseBrowser
                .from('profiles')
                .select('avatar_url, full_name')
                .eq('id', authUser.id)
                .single()

            const userData = {
                id: authUser.id,
                email: authUser.email || "",
                name: profile?.full_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || "User",
                avatar_url: profile?.avatar_url
            }

            setUser(userData)

            // Sync with authUtils for legacy compatibility
            authUtils.setCurrentUser({
                id: userData.id,
                email: userData.email,
                name: userData.name
            })
        } catch (error) {
            console.error("Failed to refresh user data:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <UserContext.Provider value={{ user, loading, refreshUser }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider")
    }
    return context
}
