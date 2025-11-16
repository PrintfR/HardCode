import { Button } from "@/components/ui/button";
import { landingPageFeatures } from "@/lib/constants";
import Link from "next/link";

export default function Home() {
    return (
        <div className="relative flex flex-col snap-y snap-mandatory overflow-y-scroll h-screen">
            <main className="flex-1">
                {/* Hero Section */}
                <section className="snap-start h-screen flex flex-col items-center justify-center text-center px-4">
                    <div className="flex max-w-[980px] flex-col items-center gap-2">
                        <h1 className="text-4xl font-extrabold leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                            Ace Your Next Tech Interview{" "}
                            <br className="hidden sm:inline" />
                            with AI-Powered Practice
                        </h1>
                        <p className="max-w-[700px] text-lg text-muted-foreground">
                            Get realistic interview simulations, instant
                            feedback, and personalized coaching to land your
                            dream job.
                        </p>
                    </div>

                    <div className="mt-6 flex gap-4">
                        <Button asChild size="lg">
                            <Link href="/auth/login">Get Started</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href="#features">Learn More</Link>
                        </Button>
                    </div>
                </section>

                {/* Features Section */}
                <section
                    id="features"
                    className="snap-start h-screen flex flex-col items-center justify-center px-4 bg-slate-50 dark:bg-transparent"
                >
                    <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
                        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-4xl">
                            Features
                        </h2>
                        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                            Everything you need to prepare for technical and
                            behavioral interviews
                        </p>
                    </div>

                    <div className="mt-10 grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
                        {landingPageFeatures.map((feature) => (
                            <div
                                key={feature.title}
                                className="relative overflow-hidden rounded-lg border bg-background p-2"
                            >
                                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                                    <div className="flex justify-center">
                                        <feature.icon className="h-10 w-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-bold">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
