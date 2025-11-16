"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { ProblemFilter, SortOption } from "@/lib/constants/problems";

interface FilterContextType {
    filters: ProblemFilter;
    sortBy: SortOption;
    setFilters: (filters: ProblemFilter) => void;
    setSortBy: (sort: SortOption) => void;
    resetFilters: () => void;
    activeFilterCount: number;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const defaultFilters: ProblemFilter = {
    difficulties: [],
    statuses: [],
    tags: [],
    companies: [],
};

export function FilterProvider({ children }: { children: ReactNode }) {
    const [filters, setFilters] = useState<ProblemFilter>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("problem-filters");
            return saved ? JSON.parse(saved) : defaultFilters;
        }
        return defaultFilters;
    });
    const [sortBy, setSortBy] = useState<SortOption>(() => {
        if (typeof window !== "undefined") {
            return (localStorage.getItem("problem-sort") as SortOption) || "newest";
        }
        return "newest";
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("problem-filters", JSON.stringify(filters));
        }
    }, [filters]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("problem-sort", sortBy);
        }
    }, [sortBy]);

    const resetFilters = () => {
        setFilters(defaultFilters);
    };

    const activeFilterCount =
        filters.difficulties.length +
        filters.statuses.length +
        filters.tags.length +
        filters.companies.length;

    return (
        <FilterContext.Provider
            value={{
                filters,
                sortBy,
                setFilters,
                setSortBy,
                resetFilters,
                activeFilterCount,
            }}
        >
            {children}
        </FilterContext.Provider>
    );
}

export function useFilters() {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error("useFilters must be used within FilterProvider");
    }
    return context;
}

