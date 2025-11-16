"use client";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type Option = {
    label: string;
    value: string;
};

interface MultiSelectProps {
    options: Option[];
    selected: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Select options...",
}: MultiSelectProps) {
    const handleSelect = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((v) => v !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    const clearAll = () => onChange([]);

    const selectedOptions = options.filter((opt) =>
        selected.includes(opt.value)
    );

    const unselectedOptions = options.filter(
        (opt) => !selected.includes(opt.value)
    );

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full flex-wrap justify-start gap-2"
                >
                    {selected.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-full">
                            {selectedOptions.map((opt) => (
                                <Badge
                                    key={opt.value}
                                    variant="secondary"
                                    className="flex items-center space-x-1"
                                >
                                    <span className="truncate max-w-[100px]">
                                        {opt.label}
                                    </span>
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSelect(opt.value);
                                        }}
                                    />
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <span className="text-muted-foreground">
                            {placeholder}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandGroup heading="Selected">
                        {selectedOptions.length > 0 ? (
                            <>
                                {selectedOptions.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() =>
                                            handleSelect(option.value)
                                        }
                                        className="cursor-pointer"
                                    >
                                        <div
                                            className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary bg-primary text-primary-foreground"
                                            )}
                                        >
                                            <Check className="h-4 w-4" />
                                        </div>
                                        {option.label}
                                    </CommandItem>
                                ))}
                                <div
                                    className="px-3 py-2 text-sm text-red-600 cursor-pointer hover:underline"
                                    onClick={clearAll}
                                >
                                    Clear All
                                </div>
                            </>
                        ) : (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                                Nothing selected
                            </div>
                        )}
                    </CommandGroup>

                    {unselectedOptions.length > 0 && (
                        <CommandGroup heading="Available">
                            {unselectedOptions.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    onSelect={() => handleSelect(option.value)}
                                    className="cursor-pointer"
                                >
                                    <div
                                        className={cn(
                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary bg-background text-primary"
                                        )}
                                    >
                                        {/* Empty box */}
                                    </div>
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    );
}
