import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AdminHeaderProps {
    onAddDomainClick: () => void;
}

export function AdminHeader({ onAddDomainClick }: AdminHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Domain Management</h1>
                <p className="text-muted-foreground mt-1">Manage whitelisted email domains for colleges.</p>
            </div>
            <Button onClick={onAddDomainClick}>
                <Plus className="mr-2 h-4 w-4" /> Add Domain
            </Button>
        </div>
    );
}
