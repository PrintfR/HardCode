"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FaGoogle, FaSpinner } from "react-icons/fa";
import { useState } from "react";

export function GoogleSignInButton() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleClick = () => {
        setIsLoading(true);
        signIn("google", { callbackUrl: "/dashboard" });
    };

    return (
        <Button
            variant="outline"
            type="button"
            disabled={isLoading}
            onClick={handleClick}
            className="w-full"
        >
            {isLoading ? (
                <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <FaGoogle className="mr-2 h-4 w-4" />
            )}
            Continue with Google
        </Button>
    );
}
