import { ThemeProvider as NextThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/Providers/AuthProvider";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/context/ThemeContext";
import { EditorProvider } from "@/context/EditorContext";
import { FilterProvider } from "@/context/FilterContext";
import { NotificationProvider } from "@/context/NotificationContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <AuthProvider>
            <NextThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <ThemeProvider>
                    <NotificationProvider>
                        <FilterProvider>
                            <EditorProvider>
                                {children}
                                <Toaster position="top-center" />
                            </EditorProvider>
                        </FilterProvider>
                    </NotificationProvider>
                </ThemeProvider>
            </NextThemeProvider>
        </AuthProvider>
    );
};

export default Providers;
