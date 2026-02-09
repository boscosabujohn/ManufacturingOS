"use client";

import * as React from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { useUserPreference } from "@/contexts/UserPreferenceContext";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function DensityToggle() {
    const { preferences, setDensity } = useUserPreference();
    const isCompact = preferences.density === "compact";

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDensity(isCompact ? "relaxed" : "compact")}
                        className="h-8 w-8"
                    >
                        {isCompact ? (
                            <Maximize2 className="h-4 w-4" />
                        ) : (
                            <Minimize2 className="h-4 w-4" />
                        )}
                        <span className="sr-only">Toggle density</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{isCompact ? "Switch to Relaxed View" : "Switch to Compact View"}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
