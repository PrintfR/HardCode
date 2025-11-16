"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
    return (
        <nav
            className={cn(
                "flex items-center gap-2 text-sm text-muted-foreground",
                className
            )}
            aria-label="Breadcrumb"
        >
            <Link
                href="/dashboard"
                className="hover:text-foreground transition-colors"
                aria-label="Home"
            >
                <Home className="h-4 w-4" />
            </Link>
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                return (
                    <div key={index} className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4" />
                        {isLast ? (
                            <span className="font-semibold text-foreground">
                                {item.label}
                            </span>
                        ) : item.href ? (
                            <Link
                                href={item.href}
                                className="hover:text-foreground transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span>{item.label}</span>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}

