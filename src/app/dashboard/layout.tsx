import { Header } from "@/components/layout/header";
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
            <div className="sticky top-0 z-50 w-full border-b-2 bg-background/95 backdrop-blur px-10 md:px-20 supports-[backdrop-filter]:bg-background/60">
                <Header />
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div className="hidden w-20 shrink-0 border-r-2 bg-background p-4 z-10 flex-col sm:flex">
                    <Sidebar />
                </div>

                <main className="flex-1 overflow-y-auto px-10 bg-muted/20 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
