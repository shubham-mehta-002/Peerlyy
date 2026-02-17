import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, RotateCcw, Trash2 } from 'lucide-react';
import { CollegeDomain } from '@/types/admin.types';

interface CollegeDomainTableProps {
    data: CollegeDomain[] | undefined;
    isLoading: boolean;
    isError: boolean;
    onToggleStatus: (id: string) => void;
    onDelete: (id: string) => void;
}

export function CollegeDomainTable({
    data,
    isLoading,
    isError,
    onToggleStatus,
    onDelete
}: CollegeDomainTableProps) {
    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Domain</TableHead>
                        <TableHead>Colleges Linked</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                <Loader2 className="mr-2 h-6 w-6 animate-spin inline-block" />
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : isError ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-red-500">
                                Failed to load data.
                            </TableCell>
                        </TableRow>
                    ) : !data || data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                No domains found. Be the first to add one!
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((domain) => (
                            <TableRow key={domain.id}>
                                <TableCell className="font-medium">{domain.domain}</TableCell>
                                <TableCell>
                                    {domain.colleges && domain.colleges.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {domain.colleges.map((c, i) => (
                                                <Badge key={i} variant="secondary" className="text-xs">
                                                    {c.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground text-sm">No colleges</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={domain.isActive ? 'default' : 'destructive'}>
                                        {domain.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {new Date(domain.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onToggleStatus(domain.id)}
                                            title={domain.isActive ? "Deactivate" : "Activate"}
                                        >
                                            <RotateCcw className={`h-4 w-4 ${domain.isActive ? 'text-yellow-600' : 'text-green-600'}`} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this domain?')) {
                                                    onDelete(domain.id);
                                                }
                                            }}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
