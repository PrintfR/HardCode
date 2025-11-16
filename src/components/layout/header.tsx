"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export function Header() {
    const { data: session } = useSession();
    const { setTheme, theme } = useTheme();

    return (
        <div className="container flex h-14 items-center justify-between">
            <Link
                href="/dashboard"
                className="flex items-center gap-2 text-lg font-bold tracking-tight"
            >
                <Image
                    src={"/logo.svg"}
                    height={150}
                    width={150}
                    alt="logo.svg"
                />
            </Link>
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        setTheme(theme === "light" ? "dark" : "light")
                    }
                >
                    {theme === "light" ? (
                        <Moon className="h-4 w-4" />
                    ) : (
                        <Sun className="h-4 w-4" />
                    )}
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="relative h-8 w-8 rounded-full"
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src={session?.user.image || undefined}
                                />
                                <AvatarFallback>
                                    {session?.user.name
                                        ?.charAt(0)
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-56"
                        align="end"
                        forceMount
                    >
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/settings">Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                signOut({ callbackUrl: "/auth/login" })
                            }
                            className="text-destructive focus:text-destructive"
                        >
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
