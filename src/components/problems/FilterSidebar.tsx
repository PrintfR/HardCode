"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useFilters } from "@/context/FilterContext";
import {
    Difficulty,
    ProblemStatus,
    PROBLEM_TAGS,
    COMPANY_NAMES,
} from "@/lib/constants/problems";
import { cn } from "@/lib/utils";

export function FilterSidebar() {
    const { filters, setFilters, resetFilters, activeFilterCount } = useFilters();
    const [openSections, setOpenSections] = useState({
        difficulty: true,
        status: true,
        tags: true,
        companies: true,
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const toggleDifficulty = (difficulty: Difficulty) => {
        setFilters({
            ...filters,
            difficulties: filters.difficulties.includes(difficulty)
                ? filters.difficulties.filter((d) => d !== difficulty)
                : [...filters.difficulties, difficulty],
        });
    };

    const toggleStatus = (status: ProblemStatus) => {
        setFilters({
            ...filters,
            statuses: filters.statuses.includes(status)
                ? filters.statuses.filter((s) => s !== status)
                : [...filters.statuses, status],
        });
    };

    const toggleTag = (tag: string) => {
        setFilters({
            ...filters,
            tags: filters.tags.includes(tag)
                ? filters.tags.filter((t) => t !== tag)
                : [...filters.tags, tag],
        });
    };

    const toggleCompany = (company: string) => {
        setFilters({
            ...filters,
            companies: filters.companies.includes(company)
                ? filters.companies.filter((c) => c !== company)
                : [...filters.companies, company],
        });
    };

    const difficultyCounts = {
        Easy: 450,
        Medium: 800,
        Hard: 350,
    };

    return (
        <div className="w-64 shrink-0 border-r bg-background p-4 space-y-4 overflow-y-auto h-full">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                {activeFilterCount > 0 && (
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">{activeFilterCount}</Badge>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetFilters}
                            className="h-6 px-2 text-xs"
                        >
                            Reset
                        </Button>
                    </div>
                )}
            </div>

            {/* Difficulty Filter */}
            <Collapsible
                open={openSections.difficulty}
                onOpenChange={() => toggleSection("difficulty")}
            >
                <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-medium">
                    <span>Difficulty</span>
                    {openSections.difficulty ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 pt-2">
                    {(["Easy", "Medium", "Hard"] as Difficulty[]).map(
                        (difficulty) => (
                            <div
                                key={difficulty}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`difficulty-${difficulty}`}
                                        checked={filters.difficulties.includes(
                                            difficulty
                                        )}
                                        onCheckedChange={() =>
                                            toggleDifficulty(difficulty)
                                        }
                                    />
                                    <label
                                        htmlFor={`difficulty-${difficulty}`}
                                        className="text-sm font-medium cursor-pointer flex items-center gap-2"
                                    >
                                        <span
                                            className={cn(
                                                "w-3 h-3 rounded-full",
                                                difficulty === "Easy" &&
                                                    "bg-[#00b8a3]",
                                                difficulty === "Medium" &&
                                                    "bg-[#ffc01e]",
                                                difficulty === "Hard" &&
                                                    "bg-[#ef4743]"
                                            )}
                                        />
                                        {difficulty}
                                    </label>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {difficultyCounts[difficulty]}
                                </span>
                            </div>
                        )
                    )}
                </CollapsibleContent>
            </Collapsible>

            {/* Status Filter */}
            <Collapsible
                open={openSections.status}
                onOpenChange={() => toggleSection("status")}
            >
                <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-medium">
                    <span>Status</span>
                    {openSections.status ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 pt-2">
                    {(["solved", "attempted", "todo"] as ProblemStatus[]).map(
                        (status) => (
                            <div
                                key={status}
                                className="flex items-center space-x-2"
                            >
                                <Checkbox
                                    id={`status-${status}`}
                                    checked={filters.statuses.includes(status)}
                                    onCheckedChange={() => toggleStatus(status)}
                                />
                                <label
                                    htmlFor={`status-${status}`}
                                    className="text-sm font-medium cursor-pointer capitalize"
                                >
                                    {status}
                                </label>
                            </div>
                        )
                    )}
                </CollapsibleContent>
            </Collapsible>

            {/* Tags Filter */}
            <Collapsible
                open={openSections.tags}
                onOpenChange={() => toggleSection("tags")}
            >
                <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-medium">
                    <span>Topics</span>
                    {openSections.tags ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 pt-2 max-h-64 overflow-y-auto">
                    {PROBLEM_TAGS.map((tag) => (
                        <div
                            key={tag}
                            className="flex items-center space-x-2"
                        >
                            <Checkbox
                                id={`tag-${tag}`}
                                checked={filters.tags.includes(tag)}
                                onCheckedChange={() => toggleTag(tag)}
                            />
                            <label
                                htmlFor={`tag-${tag}`}
                                className="text-sm cursor-pointer"
                            >
                                {tag}
                            </label>
                        </div>
                    ))}
                </CollapsibleContent>
            </Collapsible>

            {/* Companies Filter */}
            <Collapsible
                open={openSections.companies}
                onOpenChange={() => toggleSection("companies")}
            >
                <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-medium">
                    <span>Companies</span>
                    {openSections.companies ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 pt-2 max-h-64 overflow-y-auto">
                    {COMPANY_NAMES.map((company) => (
                        <div
                            key={company}
                            className="flex items-center space-x-2"
                        >
                            <Checkbox
                                id={`company-${company}`}
                                checked={filters.companies.includes(company)}
                                onCheckedChange={() => toggleCompany(company)}
                            />
                            <label
                                htmlFor={`company-${company}`}
                                className="text-sm cursor-pointer"
                            >
                                {company}
                            </label>
                        </div>
                    ))}
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}

