import { EnhancedHeader } from "@/components/layout/EnhancedHeader";
import { Sidebar } from "@/components/layout/sidebar";
import { authOptions } from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/auth/login");

    return (
        <div className="flex h-screen flex-col">
            <EnhancedHeader />

            <div className="flex flex-1 overflow-hidden">
                <div className="hidden w-20 shrink-0 border-r-2 bg-background p-4 z-10 flex-col sm:flex">
                    <Sidebar />
                </div>

                <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 bg-muted/20 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
