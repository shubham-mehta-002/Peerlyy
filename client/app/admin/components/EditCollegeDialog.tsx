import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { College } from '@/types/admin.types';
import { twMerge } from 'tailwind-merge';

const editCollegeSchema = z.object({
    name: z.string().min(2, 'College name must be at least 2 characters'),
    campus: z.string().min(2, 'Campus name must be at least 2 characters'),
});

type EditCollegeFormValues = z.infer<typeof editCollegeSchema>;

interface EditCollegeDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    college: College | null;
    onSubmit: (id: string, data: EditCollegeFormValues) => void;
    isPending: boolean;
}

export function EditCollegeDialog({ isOpen, onOpenChange, college, onSubmit, isPending }: EditCollegeDialogProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<EditCollegeFormValues>({
        resolver: zodResolver(editCollegeSchema),
        defaultValues: {
            name: '',
            campus: '',
        },
    });

    useEffect(() => {
        if (college) {
            reset({
                name: college.name,
                campus: college.campus,
            });
        }
    }, [college, reset]);

    const onFormSubmit = (data: EditCollegeFormValues) => {
        if (!college) return;
        onSubmit(college.id, data);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            onOpenChange(open);
            if (!open) reset();
        }}>
            <DialogContent className="sm:max-w-[425px] border-border/50 bg-background/95 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle>Edit College</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 pt-6">
                    <div className="space-y-4">
                        <div className="grid gap-2 group">
                            <Label
                                htmlFor="edit-name"
                                className="text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors group-focus-within:text-primary"
                            >
                                College Name
                            </Label>
                            <Input
                                id="edit-name"
                                placeholder="University of Technology"
                                className={twMerge(
                                    "bg-secondary/50 border-border/50 focus:border-primary/50 transition-all duration-300",
                                    errors.name && "border-destructive/50 focus:border-destructive"
                                )}
                                {...register('name')}
                            />
                            {errors.name && (
                                <p className="text-[0.8rem] font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2 group">
                            <Label
                                htmlFor="edit-campus"
                                className="text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors group-focus-within:text-primary"
                            >
                                Campus
                            </Label>
                            <Input
                                id="edit-campus"
                                placeholder="Main Campus"
                                className={twMerge(
                                    "bg-secondary/50 border-border/50 focus:border-primary/50 transition-all duration-300",
                                    errors.campus && "border-destructive/50 focus:border-destructive"
                                )}
                                {...register('campus')}
                            />
                            {errors.campus && (
                                <p className="text-[0.8rem] font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                                    {errors.campus.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full sm:w-auto font-bold tracking-tight hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update College
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

