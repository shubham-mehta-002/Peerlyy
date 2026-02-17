import { useState, useEffect } from 'react';
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

interface EditCollegeDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    college: College | null;
    onSubmit: (id: string, data: { name: string; campus: string }) => void;
    isPending: boolean;
}

export function EditCollegeDialog({ isOpen, onOpenChange, college, onSubmit, isPending }: EditCollegeDialogProps) {
    const [name, setName] = useState('');
    const [campus, setCampus] = useState('');

    useEffect(() => {
        if (college) {
            setName(college.name);
            setCampus(college.campus);
        }
    }, [college]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!college || !name.trim() || !campus.trim()) return;
        onSubmit(college.id, { name, campus });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit College</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="grid gap-2">
                        <Label htmlFor="edit-name">College Name</Label>
                        <Input
                            id="edit-name"
                            placeholder="e.g. University of Technology"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="edit-campus">Campus</Label>
                        <Input
                            id="edit-campus"
                            placeholder="e.g. Main Campus"
                            value={campus}
                            onChange={(e) => setCampus(e.target.value)}
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
