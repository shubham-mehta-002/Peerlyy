import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Loader2, Plus, Trash2, Globe, School, Building2 } from 'lucide-react';
import { addDomainSchema, type AddDomainFormValues } from '../validators/admin.validator';

interface AddCollegeDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: AddDomainFormValues) => void;
    isPending: boolean;
}

export function AddCollegeDialog({ isOpen, onOpenChange, onSubmit, isPending }: AddCollegeDialogProps) {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<AddDomainFormValues>({
        resolver: zodResolver(addDomainSchema),
        defaultValues: {
            domain: '',
            colleges: [{ name: '', campus: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "colleges"
    });

    const onFormSubmit = (data: AddDomainFormValues) => {
        onSubmit(data);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            onOpenChange(open);
            if (!open) reset();
        }}>
            <DialogContent className="sm:max-w-[550px] border-border/40 bg-background/95 backdrop-blur-xl p-0 overflow-hidden shadow-2xl">
                <div className="bg-linear-to-br from-primary/10 via-transparent to-transparent p-6 pb-0">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Add New Domain & Colleges
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground/80">
                            Register new email domain and associate colleges
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col max-h-[80vh]">
                    <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-thin scrollbar-thumb-primary/20">
                        {/* Domain Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-primary/80 uppercase tracking-wider">
                                <Globe className="h-4 w-4" />
                                Domain Configuration
                            </div>
                            <Controller
                                name="domain"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor="domain" className="text-xs font-medium text-muted-foreground">
                                            Institutional Email Domain
                                        </FieldLabel>
                                        <div className="relative group">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                            <Input
                                                {...field}
                                                id="domain"
                                                placeholder="thapar.edu"
                                                className="pl-10 bg-secondary/30 border-border/50 focus:bg-secondary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-300"
                                            />
                                        </div>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </div>

                        {/* Colleges Section */}
                        <div className="mt-2 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm font-semibold text-primary/80 uppercase tracking-wider">
                                    <School className="h-4 w-4" />
                                    Associated Colleges
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({ name: '', campus: '' })}
                                    className="h-8 px-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 text-primary transition-all duration-200"
                                >
                                    <Plus className="h-4 w-4 mr-1.5" /> Add Another
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="relative p-5 rounded-xl border border-border/40 bg-secondary/20 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20 group/row"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                                                    {index + 1}
                                                </div>
                                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-tight">College Details</span>
                                            </div>
                                            {fields.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => remove(index)}
                                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                                                    title="Remove college"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <Controller
                                                name={`colleges.${index}.name`}
                                                control={control}
                                                render={({ field, fieldState }) => (
                                                    <Field>
                                                        <FieldLabel className="text-[10px] font-bold text-muted-foreground/70 uppercase">Name</FieldLabel>
                                                        <div className="relative">
                                                            <School className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                                            <Input
                                                                {...field}
                                                                placeholder="e.g. TIET"
                                                                className="pl-10 bg-background/50 border-border/40 focus:border-primary/40 focus:bg-background transition-all h-10 text-sm"
                                                            />
                                                        </div>
                                                        {fieldState.invalid && (
                                                            <FieldError errors={[fieldState.error]} />
                                                        )}
                                                    </Field>
                                                )}
                                            />
                                            <Controller
                                                name={`colleges.${index}.campus`}
                                                control={control}
                                                render={({ field, fieldState }) => (
                                                    <Field>
                                                        <FieldLabel className="text-[10px] font-bold text-muted-foreground/70 uppercase">Campus</FieldLabel>
                                                        <div className="relative">
                                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                                            <Input
                                                                {...field}
                                                                placeholder="e.g. Patiala"
                                                                className="pl-10 bg-background/50 border-border/40 focus:border-primary/40 focus:bg-background transition-all h-10 text-sm"
                                                            />
                                                        </div>
                                                        {fieldState.invalid && (
                                                            <FieldError errors={[fieldState.error]} />
                                                        )}
                                                    </Field>
                                                )}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-secondary/10 border-t border-border/40">
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-11 text-base font-bold tracking-tight shadow-md hover:shadow-primary/20 transition-all duration-300"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Registering...
                                    </>
                                ) : (
                                    "Register Domain & Colleges"
                                )}
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
