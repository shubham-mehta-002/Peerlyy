import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
import { College } from '@/types/admin.types';
import { editCollegeSchema, type EditCollegeFormValues } from '../validators/admin.validator';

interface EditCollegeDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    college: College | null;
    onSubmit: (id: string, data: EditCollegeFormValues) => void;
    isPending: boolean;
}

export function EditCollegeDialog({ isOpen, onOpenChange, college, onSubmit, isPending }: EditCollegeDialogProps) {
    const {
        control,
        handleSubmit,
        reset,
    } = useForm<EditCollegeFormValues>({
        resolver: zodResolver(editCollegeSchema),
        defaultValues: {
            name: '',
            campus: '',
            isActive: true,
        },
    });

    useEffect(() => {
        if (college) {
            reset({
                name: college.name,
                campus: college.campus,
                isActive: college.isActive,
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
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="edit-name">
                                        College Name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="edit-name"
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
                                    <FieldLabel htmlFor="edit-campus">
                                        Campus
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="edit-campus"
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
                            name="isActive"
                            control={control}
                            render={({ field }) => (
                                <Field className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm border-border/50">
                                    <div className="space-y-0.5">
                                        <FieldLabel>Active Status</FieldLabel>
                                        <p className="text-[0.7rem] text-muted-foreground">
                                            Allow registrations from this campus.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
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
                            Update College
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

