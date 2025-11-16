import Providers from "@/components/Providers/Providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "HardMode",
    description: "Ace your next technical or behavioral interview.",
    icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.className} min-h-screen overflow-x-hidden select-none`}
            >
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
