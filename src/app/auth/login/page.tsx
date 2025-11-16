import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FaEnvelope } from "react-icons/fa";

export default async function LoginPage() {
    const session = await getServerSession(authOptions);
    if (session) redirect("/dashboard");

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted px-4 py-12">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-background p-10 shadow-2xl border border-border">
                <div className="space-y-2 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Welcome to HardMode
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Start practicing realistic interviews.
                    </p>
                </div>

                <div className="space-y-4">
                    <GoogleSignInButton />

                    <div className="relative text-center">
                        <span className="text-xs text-muted-foreground uppercase tracking-wide px-2 bg-background z-10 relative">
                            or
                        </span>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-px bg-border" />
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        size="lg"
                        disabled
                        className="w-full justify-center gap-2"
                    >
                        <FaEnvelope className="h-4 w-4" />
                        Continue with Email
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                        Email sign-in coming soon...
                    </p>
                </div>
            </div>
        </div>
    );
}
