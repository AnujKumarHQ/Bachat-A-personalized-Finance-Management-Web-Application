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
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED_OR_USER_EVENT' || event === 'USER_UPDATED') {
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
            const currentUser = authUtils.getCurrentUser()
            if (!currentUser) {
                setUser(null)
                setLoading(false)
                return
            }

            // Fetch latest profile data from Supabase
            const { data: profile } = await supabaseBrowser
                .from('profiles')
                .select('avatar_url, full_name')
                .eq('id', currentUser.id)
                .single()

            setUser({
                ...currentUser,
                name: profile?.full_name || currentUser.name,
                avatar_url: profile?.avatar_url
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
