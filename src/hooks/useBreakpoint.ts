import { useState, useEffect } from "react";

type Breakpoint = "sm" | "md" | "lg" | "xl";

const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
} as const;

const GRID_COLUMNS = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
} as const;

const CARDS_PER_PAGE = {
    [GRID_COLUMNS.sm]: 50,
    [GRID_COLUMNS.md]: 50,
    [GRID_COLUMNS.lg]: 51,
    [GRID_COLUMNS.xl]: 52,
} as const;

export const useBreakpoint = () => {
    const [breakpoint, setBreakpoint] = useState<Breakpoint>("sm");
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const updateBreakpoint = () => {
            const currentWidth = window.innerWidth;
            setWidth(currentWidth);

            if (currentWidth >= BREAKPOINTS.xl) {
                setBreakpoint("xl");
            } else if (currentWidth >= BREAKPOINTS.lg) {
                setBreakpoint("lg");
            } else if (currentWidth >= BREAKPOINTS.sm) {
                setBreakpoint("md");
            } else {
                setBreakpoint("sm");
            }
        };

        updateBreakpoint();
        window.addEventListener("resize", updateBreakpoint);
        return () => window.removeEventListener("resize", updateBreakpoint);
    }, []);

    const columns = GRID_COLUMNS[breakpoint as keyof typeof GRID_COLUMNS];
    const cardsPerPage = CARDS_PER_PAGE[columns];

    return {
        breakpoint,
        width,
        columns,
        cardsPerPage,
        isMobile: breakpoint === "sm",
        isTablet: breakpoint === "md",
        isLaptop: breakpoint === "lg",
        isDesktop: breakpoint === "xl",
    };
};
