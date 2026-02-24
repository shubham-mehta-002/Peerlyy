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
import { twMerge } from 'tailwind-merge';

const addCollegeSchema = z.object({
    name: z.string().min(2, 'College name must be at least 2 characters'),
    campus: z.string().min(2, 'Campus name must be at least 2 characters'),
    domain: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/, 'Invalid domain format'),
});

type AddCollegeFormValues = z.infer<typeof addCollegeSchema>;

interface AddCollegeDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: AddCollegeFormValues) => void;
    isPending: boolean;
}

export function AddCollegeDialog({ isOpen, onOpenChange, onSubmit, isPending }: AddCollegeDialogProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<AddCollegeFormValues>({
        resolver: zodResolver(addCollegeSchema),
        defaultValues: {
            name: '',
            campus: '',
            domain: '',
        },
    });

    const onFormSubmit = (data: AddCollegeFormValues) => {
        onSubmit(data);
        if (!isPending) {
            reset();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            onOpenChange(open);
            if (!open) reset();
        }}>
            <DialogContent className="sm:max-w-[425px] border-border/50 bg-background/95 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle>Add New College</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 pt-6">
                    <div className="space-y-4">
                        <div className="grid gap-2 group">
                            <Label
                                htmlFor="name"
                                className="text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors group-focus-within:text-primary"
                            >
                                College Name
                            </Label>
                            <Input
                                id="name"
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
                                htmlFor="campus"
                                className="text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors group-focus-within:text-primary"
                            >
                                Campus
                            </Label>
                            <Input
                                id="campus"
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

                        <div className="grid gap-2 group">
                            <Label
                                htmlFor="domain"
                                className="text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors group-focus-within:text-primary"
                            >
                                Domain Name
                            </Label>
                            <Input
                                id="domain"
                                placeholder="tech.edu"
                                className={twMerge(
                                    "bg-secondary/50 border-border/50 focus:border-primary/50 transition-all duration-300",
                                    errors.domain && "border-destructive/50 focus:border-destructive"
                                )}
                                {...register('domain')}
                            />
                            {errors.domain && (
                                <p className="text-[0.8rem] font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                                    {errors.domain.message}
                                </p>
                            )}
                            <p className="text-[0.7rem] text-muted-foreground italic">
                                This domain will be automatically whitelisted and linked.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full sm:w-auto font-bold tracking-tight hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Register College
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

