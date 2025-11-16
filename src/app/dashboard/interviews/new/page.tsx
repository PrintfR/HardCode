"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { TechStackCombobox } from "@/components/ui/techstack-combobox";
import { newInterviewFormSchema, techStackOptions } from "@/lib/constants";
import { useInterviewStore } from "@/lib/store/zustand";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type InterviewFormData = z.infer<typeof newInterviewFormSchema>;

export default function NewInterviewPage() {
    const router = useRouter();
    const { setStatus, setCurrentInterview } = useInterviewStore();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting, isValid },
    } = useForm<InterviewFormData>({
        resolver: zodResolver(newInterviewFormSchema),
        defaultValues: {
            title: "",
            position: "",
            type: "technical",
            techStack: [],
            numberOfQuestions: 5,
            difficulty: "easy",
        },
        mode: "onChange",
    });

    const onSubmit = async (formData: InterviewFormData) => {
        setStatus("generating");

        try {
            const res = await fetch("/api/interviews/new", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to generate interview");
            const data = await res.json();
            toast.success(
                "Interview generated successfully, redirecting to active session."
            );

            const session = data.session;
            setCurrentInterview(session.interview);

            router.push(`/dashboard/active/${session.id}`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to generate interview questions");
        }
    };

    return (
        <div className="container h-full mx-auto py-8 gap-4">
            <h1 className="text-3xl font-bold mb-6">Create New Interview</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                <div className="space-y-2">
                    <Label htmlFor="title">Interview Title</Label>
                    <Input
                        id="title"
                        {...register("title")}
                        placeholder="e.g. Senior Frontend Engineer Interview"
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm">
                            {errors.title.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                        id="position"
                        {...register("position")}
                        placeholder="e.g. Frontend Developer"
                    />
                    {errors.position && (
                        <p className="text-red-500 text-sm">
                            {errors.position.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="numberOfQuestions">
                        Number of Questions
                    </Label>
                    <Input
                        id="numberOfQuestions"
                        {...register("numberOfQuestions")}
                        type="number"
                        min="1"
                        max="10"
                        placeholder="5"
                    />
                    {errors.numberOfQuestions && (
                        <p className="text-red-500 text-sm">
                            {errors.numberOfQuestions.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Difficulty</Label>
                    <Controller
                        name="difficulty"
                        control={control}
                        render={({ field }) => (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="easy">Easy</SelectItem>
                                    <SelectItem value="medium">
                                        Medium
                                    </SelectItem>
                                    <SelectItem value="hard">Hard</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.difficulty && (
                        <p className="text-red-500 text-sm">
                            {errors.difficulty.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Interview Type</Label>
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="technical">
                                        Technical
                                    </SelectItem>
                                    <SelectItem value="behavioral">
                                        Behavioral
                                    </SelectItem>
                                    <SelectItem value="mix">Mixed</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.type && (
                        <p className="text-red-500 text-sm">
                            {errors.type.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label>Technologies</Label>
                    <Controller
                        name="techStack"
                        control={control}
                        render={({ field }) => (
                            <TechStackCombobox
                                options={techStackOptions}
                                selected={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    {errors.techStack && (
                        <p className="text-red-500 text-sm">
                            {errors.techStack.message}
                        </p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <Button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className="w-full md:w-auto"
                    >
                        {isSubmitting ? "Generating..." : "Generate Interview"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
