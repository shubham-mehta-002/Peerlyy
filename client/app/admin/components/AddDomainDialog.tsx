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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface AddDomainDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (domain: string, isActive: boolean) => void;
    isPending: boolean;
}

export function AddDomainDialog({ isOpen, onOpenChange, onSubmit, isPending }: AddDomainDialogProps) {
    const [newDomain, setNewDomain] = useState('');
    const [newDomainActive, setNewDomainActive] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDomain.trim()) return;
        onSubmit(newDomain, newDomainActive);
        // Reset local state if needed, or handle in parent on success
        if (!isPending) {
            setNewDomain('');
            setNewDomainActive(true);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Domain</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="grid gap-2">
                        <Label htmlFor="domain">Domain Name</Label>
                        <Input
                            id="domain"
                            placeholder="e.g. college.edu"
                            value={newDomain}
                            onChange={(e) => setNewDomain(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="active-mode"
                            checked={newDomainActive}
                            onCheckedChange={setNewDomainActive}
                        />
                        <Label htmlFor="active-mode">Active immediately</Label>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Domain
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
