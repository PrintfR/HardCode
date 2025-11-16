"use client";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { navItems } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col items-center gap-4 px-2 py-4">
            {navItems.map((item) => (
                <Tooltip key={item.name}>
                    <TooltipTrigger asChild>
                        <Link href={item.href}>
                            <Button
                                variant={
                                    pathname.endsWith(item.href)
                                        ? "default"
                                        : "ghost"
                                }
                                size="icon"
                                className="rounded-lg"
                                aria-label={item.name}
                            >
                                <item.icon className="h-5 w-5" />
                            </Button>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.name}</TooltipContent>
                </Tooltip>
            ))}
        </nav>
    );
}
