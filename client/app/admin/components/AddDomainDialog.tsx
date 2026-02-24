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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const addDomainSchema = z.object({
    domain: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/, 'Invalid domain format'),
    isActive: z.boolean(),
});

type AddDomainFormValues = {
    domain: string;
    isActive: boolean;
};

interface AddDomainDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (domain: string, isActive: boolean) => void;
    isPending: boolean;
}

export function AddDomainDialog({ isOpen, onOpenChange, onSubmit, isPending }: AddDomainDialogProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<AddDomainFormValues>({
        resolver: zodResolver(addDomainSchema),
        defaultValues: {
            domain: '',
            isActive: true,
        },
    });

    const isActive = watch('isActive');

    const onFormSubmit = (data: AddDomainFormValues) => {
        onSubmit(data.domain, data.isActive);
        if (!isPending) {
            reset();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            onOpenChange(open);
            if (!open) reset();
        }}>
            <DialogContent className="sm:max-w-[400px] border-border/50 bg-background/95 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle>Add New Domain</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 pt-6">
                    <div className="space-y-5">
                        <div className="grid gap-2 group">
                            <Label
                                htmlFor="domain"
                                className="text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors group-focus-within:text-primary"
                            >
                                Domain Name
                            </Label>
                            <Input
                                id="domain"
                                placeholder="college.edu"
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
                        </div>

                        <div className="group flex items-center justify-between p-3 rounded-lg border border-border/50 bg-secondary/30 transition-all duration-300 hover:bg-secondary/50">
                            <div className="space-y-0.5">
                                <Label htmlFor="active-mode" className="text-sm font-medium cursor-pointer">
                                    Active Status
                                </Label>
                                <p className="text-[0.7rem] text-muted-foreground italic">
                                    Enable this domain immediately
                                </p>
                            </div>
                            <Switch
                                id="active-mode"
                                checked={isActive}
                                onCheckedChange={(val) => setValue('isActive', val)}
                                className="data-[state=checked]:bg-primary"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full sm:w-auto font-bold tracking-tight hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Whitelist Domain
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

