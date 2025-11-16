"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Search,
    Bell,
    Moon,
    Sun,
    Menu,
    User,
    Settings,
    LogOut,
    FileText,
    X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useThemeContext } from "@/context/ThemeContext";
import { useNotifications } from "@/context/NotificationContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function EnhancedHeader() {
    const { data: session } = useSession();
    const { theme, toggleTheme } = useThemeContext();
    const { unreadCount, notifications, markAllAsRead } = useNotifications();
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const router = useRouter();
    const searchRef = useRef<HTMLInputElement>(null);

    // Keyboard shortcut for search (Cmd/Ctrl + K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                searchRef.current?.focus();
                setIsSearchFocused(true);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = () => {
            if (isProfileOpen) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isProfileOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/problems?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery("");
            setIsSearchFocused(false);
        }
    };

    const navLinks = [
        { href: "/problems", label: "Problems" },
        { href: "/contests", label: "Contests" },
        { href: "/discuss", label: "Discuss" },
        { href: "/interview", label: "Interview" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-[#667eea] to-[#764ba2] shadow-lg backdrop-blur supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-[#667eea]/95 supports-[backdrop-filter]:to-[#764ba2]/95">
            <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-lg font-bold text-white transition-transform hover:scale-105"
                    >
                        <Image
                            src="/logo.svg"
                            height={32}
                            width={32}
                            alt="HardCode Logo"
                            className="h-8 w-8"
                        />
                        <span className="hidden sm:inline">HardCode</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative px-4 py-2 text-sm font-medium text-white/90 transition-all hover:text-white hover:translate-y-[-2px] group"
                            >
                                {link.label}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full" />
                            </Link>
                        ))}
                    </nav>

                    {/* Search Bar */}
                    <form
                        onSubmit={handleSearch}
                        className="hidden lg:flex flex-1 max-w-md mx-8"
                    >
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                ref={searchRef}
                                type="text"
                                placeholder="Search problems, contests, users... (Ctrl+K)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    <X className="h-4 w-4 text-white/60 hover:text-white" />
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2">
                        {/* Mobile Search Icon */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden text-white hover:bg-white/20"
                            onClick={() => setIsSearchFocused(!isSearchFocused)}
                        >
                            <Search className="h-5 w-5" />
                        </Button>

                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="text-white hover:bg-white/20"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </Button>

                        {/* Notifications */}
                        <Popover
                            open={isNotificationOpen}
                            onOpenChange={setIsNotificationOpen}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative text-white hover:bg-white/20"
                                    aria-label="Notifications"
                                >
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <Badge
                                            variant="destructive"
                                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                                        >
                                            {unreadCount > 9 ? "9+" : unreadCount}
                                        </Badge>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0" align="end">
                                <div className="p-4 border-b flex items-center justify-between">
                                    <h3 className="font-semibold">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={markAllAsRead}
                                        >
                                            Mark all as read
                                        </Button>
                                    )}
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-4 text-center text-muted-foreground">
                                            No notifications
                                        </div>
                                    ) : (
                                        notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className="p-4 border-b hover:bg-muted/50 transition-colors"
                                            >
                                                <p className="text-sm">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {new Date(
                                                        notification.timestamp
                                                    ).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* User Profile */}
                        <DropdownMenu
                            open={isProfileOpen}
                            onOpenChange={setIsProfileOpen}
                        >
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-9 w-9 rounded-full border-2 border-white/30 hover:border-white/60"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={session?.user?.image || undefined}
                                        />
                                        <AvatarFallback className="bg-white/20 text-white">
                                            {session?.user?.name
                                                ?.charAt(0)
                                                .toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-56"
                                align="end"
                                forceMount
                            >
                                <div className="p-2 border-b">
                                    <p className="text-sm font-semibold">
                                        {session?.user?.name || "User"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {session?.user?.email}
                                    </p>
                                </div>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/profile" className="flex items-center">
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/dashboard/submissions"
                                        className="flex items-center"
                                    >
                                        <FileText className="mr-2 h-4 w-4" />
                                        Submissions
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/dashboard/settings"
                                        className="flex items-center"
                                    >
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() =>
                                        signOut({ callbackUrl: "/auth/login" })
                                    }
                                    className="text-destructive focus:text-destructive"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Mobile Menu */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden text-white hover:bg-white/20"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {isSearchFocused && (
                    <div className="lg:hidden pb-4">
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    <X className="h-4 w-4 text-white/60" />
                                </button>
                            )}
                        </form>
                    </div>
                )}

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <nav className="md:hidden pb-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
        </header>
    );
}

