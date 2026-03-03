import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Loader2 } from 'lucide-react';
import { addCollegeSchema, type AddCollegeFormValues } from '../validators/admin.validator';

interface AddCollegeDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: AddCollegeFormValues) => void;
    isPending: boolean;
}

export function AddCollegeDialog({ isOpen, onOpenChange, onSubmit, isPending }: AddCollegeDialogProps) {
    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
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
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="name">
                                        College Name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="name"
                                        placeholder="University of Technology"
                                        className="bg-secondary/50 border-border/50 focus:border-primary/50 transition-all duration-300"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="campus"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="campus">
                                        Campus
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="campus"
                                        placeholder="Main Campus"
                                        className="bg-secondary/50 border-border/50 focus:border-primary/50 transition-all duration-300"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="domain"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="domain">
                                        Domain Name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="domain"
                                        placeholder="tech.edu"
                                        className="bg-secondary/50 border-border/50 focus:border-primary/50 transition-all duration-300"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                    <p className="text-[0.7rem] text-muted-foreground italic">
                                        This domain will be automatically whitelisted and linked.
                                    </p>
                                </Field>
                            )}
                        />
                    </FieldGroup>

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

