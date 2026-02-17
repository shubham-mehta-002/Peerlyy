import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface DomainFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
}

export function DomainFilters({ search, onSearchChange }: DomainFiltersProps) {
    return (
        <div className="flex items-center space-x-2 mb-6 max-w-sm">
            <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search domains..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
        </div>
    );
}
