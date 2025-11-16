"use client";

import { ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

type Option = {
    value: string;
    label: string;
};

interface TechStackComboboxProps {
    options: Option[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
}

export function TechStackCombobox({
    options,
    selected,
    onChange,
    placeholder = "Select technologies...",
}: TechStackComboboxProps) {
    const [open, setOpen] = React.useState(false);

    const toggleOption = (value: string) => {
        if (selected.includes(value))
            onChange(selected.filter((v) => v !== value));
        else onChange([...selected, value]);
    };

    const selectedLabels = options
        .filter((o) => selected.includes(o.value))
        .map((o) => o.label);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                >
                    {selectedLabels.length > 0
                        ? selectedLabels.join(", ")
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput
                        placeholder="Search tech..."
                        className="h-9"
                    />
                    <CommandList className="max-h-40 overflow-y-auto">
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    onSelect={() => toggleOption(option.value)}
                                    className="cursor-pointer"
                                >
                                    <Checkbox
                                        checked={selected.includes(
                                            option.value
                                        )}
                                        className="mr-2"
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
