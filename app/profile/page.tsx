"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeftIcon, CameraIcon, Loader2Icon, SaveIcon, LockIcon, UserIcon, ShieldCheckIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { authUtils } from "@/lib/auth"
import { supabaseBrowser } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/components/user-provider"

export default function ProfilePage() {
    const { user, refreshUser, loading: userLoading } = useUser()
    const [uploading, setUploading] = useState(false)
    const [updating, setUpdating] = useState(false)
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    useEffect(() => {
        if (user) {
            setName(user.name)
        }
    }, [user])

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabaseBrowser.storage
                .from('avatars')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabaseBrowser.storage
                .from('avatars')
                .getPublicUrl(filePath)

            if (user) {
                const { error: updateError } = await supabaseBrowser
                    .from('profiles')
                    .update({ avatar_url: publicUrl })
                    .eq('id', user.id)

                if (updateError) throw updateError

                await refreshUser()
            }
        } catch (error) {
            alert('Error uploading avatar!')
            console.error(error)
        } finally {
            setUploading(false)
        }
    }

    const handleUpdateProfile = async () => {
        if (!user) return
        try {
            setUpdating(true)
            const { error } = await supabaseBrowser
                .from('profiles')
                .update({ full_name: name })
                .eq('id', user.id)

            if (error) throw error

            // Update local auth utils as well for consistency
            const currentUser = authUtils.getCurrentUser()
            if (currentUser) {
                authUtils.setCurrentUser({ ...currentUser, name })
            }

            await refreshUser()
            alert("Profile updated successfully!")
        } catch (error) {
            console.error(error)
            alert("Failed to update profile")
        } finally {
            setUpdating(false)
        }
    }

    const handleUpdatePassword = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match")
            return
        }
        if (password.length < 6) {
            alert("Password must be at least 6 characters")
            return
        }

        try {
            setUpdating(true)
            const { error } = await supabaseBrowser.auth.updateUser({
                password: password
            })

            if (error) throw error

            alert("Password updated successfully!")
            setPassword("")
            setConfirmPassword("")
        } catch (error: any) {
            console.error(error)
            alert(error.message || "Failed to update password")
        } finally {
            setUpdating(false)
        }
    }

    if (userLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <Loader2Icon className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        )
    }

    if (!user) {
        router.push("/login")
        return null
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-12">
            <header className="sticky top-0 z-10 border-b border-white/20 bg-white/80 backdrop-blur-xl">
                <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                                <ArrowLeftIcon className="h-5 w-5 text-slate-600" />
                            </Button>
                        </Link>
                        <div className="flex items-center gap-4">
                            <div className="relative h-12 w-12 overflow-hidden rounded-xl shadow-sm">
                                <Image
                                    src="/bachat-logo.png"
                                    alt="Bachat"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">Account Settings</h1>
                                <p className="text-xs text-slate-500 font-medium">Manage your profile and security</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <Tabs defaultValue="general" className="space-y-8">
                    <TabsList className="grid w-full grid-cols-2 lg:w-[400px] bg-white/50 p-1 rounded-xl">
                        <TabsTrigger value="general" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            <UserIcon className="h-4 w-4 mr-2" />
                            General
                        </TabsTrigger>
                        <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            <ShieldCheckIcon className="h-4 w-4 mr-2" />
                            Security
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-6">
                        <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm overflow-hidden">
                            <div className="h-32 bg-gradient-to-r from-slate-900 to-slate-800 relative">
                                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
                            </div>
                            <CardContent className="relative pt-0">
                                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-12 mb-8 px-4">
                                    <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                                        <Avatar className="h-32 w-32 border-4 border-white shadow-xl ring-1 ring-slate-100">
                                            <AvatarImage src={user.avatar_url || "/placeholder-user.jpg"} alt={user.name} className="object-cover" />
                                            <AvatarFallback className="bg-slate-100 text-slate-400 text-4xl">
                                                {user.name?.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                            <CameraIcon className="h-8 w-8 text-white" />
                                        </div>
                                        {uploading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                                                <Loader2Icon className="h-8 w-8 text-white animate-spin" />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </div>
                                    <div className="text-center sm:text-left pb-2">
                                        <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                                        <p className="text-sm text-slate-500">{user.email}</p>
                                    </div>
                                </div>

                                <div className="grid gap-6 max-w-xl px-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="bg-slate-50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" value={user.email} readOnly className="bg-slate-50 opacity-70" />
                                        <p className="text-[10px] text-slate-400">Email cannot be changed</p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-slate-50/50 border-t border-slate-100 px-8 py-4 flex justify-end">
                                <Button onClick={handleUpdateProfile} disabled={updating || name === user.name} className="gap-2">
                                    {updating ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <SaveIcon className="h-4 w-4" />}
                                    Save Changes
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="security" className="space-y-6">
                        <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle>Password</CardTitle>
                                <CardDescription>Change your password to keep your account secure</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <div className="relative">
                                        <LockIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="new-password"
                                            type="password"
                                            className="pl-9 bg-slate-50"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                    <div className="relative">
                                        <LockIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="confirm-password"
                                            type="password"
                                            className="pl-9 bg-slate-50"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-slate-50/50 border-t border-slate-100 px-8 py-4 flex justify-end">
                                <Button
                                    onClick={handleUpdatePassword}
                                    disabled={updating || !password || !confirmPassword}
                                    className="gap-2"
                                >
                                    {updating ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <SaveIcon className="h-4 w-4" />}
                                    Update Password
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
