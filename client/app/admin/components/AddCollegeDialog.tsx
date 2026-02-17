import { useState } from 'react';
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

interface AddCollegeDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: { name: string; campus: string; domain: string }) => void;
    isPending: boolean;
}

export function AddCollegeDialog({ isOpen, onOpenChange, onSubmit, isPending }: AddCollegeDialogProps) {
    const [name, setName] = useState('');
    const [campus, setCampus] = useState('');
    const [domain, setDomain] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !campus.trim() || !domain.trim()) return;
        onSubmit({ name, campus, domain });

        if (!isPending) {
            setName('');
            setCampus('');
            setDomain('');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New College</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">College Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. University of Technology"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="campus">Campus</Label>
                        <Input
                            id="campus"
                            placeholder="e.g. Main Campus"
                            value={campus}
                            onChange={(e) => setCampus(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="domain">Domain Name</Label>
                        <Input
                            id="domain"
                            placeholder="e.g. tech.edu"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            This domain will be automatically whitelisted and linked to this college.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add College
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
