import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface DomainFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    placeholder?: string;
}

export function DomainFilters({ search, onSearchChange, placeholder = "Search domains..." }: DomainFiltersProps) {
    return (
        <div className="flex items-center space-x-2 w-full">
            <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder={placeholder}
                    className="pl-10 h-10 bg-background/50 border-border/40 focus:bg-background transition-all"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
        </div>
    );
}
