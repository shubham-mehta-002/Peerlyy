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
import { Loader2, Trash2, RotateCcw, Info, Globe } from 'lucide-react';
import { CollegeDomain } from '@/types/admin.types';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from 'react';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

interface DomainTableProps {
    data: CollegeDomain[] | undefined;
    isLoading: boolean;
    isError: boolean;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string, currentStatus: boolean) => void;
}

export function DomainTable({
    data,
    isLoading,
    isError,
    onDelete,
    onToggleStatus,
}: DomainTableProps) {
    const [domainToDelete, setDomainToDelete] = useState<string | null>(null);

    return (
        <div className="rounded-xl border bg-card/50 backdrop-blur-sm overflow-hidden border-border/40 shadow-sm">
            <Table>
                <TableHeader className="bg-muted/30">
                    <TableRow>
                        <TableHead className="font-bold">Institutional Domain</TableHead>
                        <TableHead className="font-bold">Colleges</TableHead>
                        <TableHead className="font-bold text-center">Global Status</TableHead>
                        <TableHead className="font-bold">Created At</TableHead>
                        <TableHead className="text-right font-bold">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-32 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    <span className="text-sm text-muted-foreground font-medium">Loading domains...</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : isError ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-32 text-center text-destructive">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                                        <Info className="h-5 w-5" />
                                    </div>
                                    <span className="font-semibold">Failed to load domain data</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : !data || data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                <div className="flex flex-col items-center gap-2">
                                    <Info className="h-8 w-8 text-muted-foreground/30" />
                                    <span className="font-medium">No domains found.</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((domain) => (
                            <TableRow key={domain.id} className="hover:bg-muted/20 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className={`px-2 py-1 font-mono text-xs bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 transition-colors flex items-center gap-1.5`}>
                                            <Globe className={`h-3 w-3`} />
                                            {domain.domain}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <Button variant="link" className="p-0 h-auto font-medium text-inherit hover:text-primary">
                                                {domain.colleges?.length || 0} Registered
                                            </Button>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-80 p-4">
                                            <div className="space-y-4">
                                                <h4 className="text-sm font-bold flex items-center gap-2">
                                                    Colleges under {domain.domain}
                                                </h4>
                                                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin">
                                                    {domain.colleges && domain.colleges.length > 0 ? (
                                                        domain.colleges.map((college) => (
                                                            <div key={college.id} className="flex flex-col p-2 rounded-lg bg-secondary/30 border border-border/40 text-xs">
                                                                <span className="font-bold">{college.name}</span>
                                                                <span className="text-muted-foreground">{college.campus}</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-xs text-muted-foreground italic">No colleges associated yet.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge
                                        variant={domain.isActive ? 'secondary' : 'outline'}
                                        className={`${domain.isActive ? 'bg-primary/10 text-primary border-primary/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}
                                    >
                                        {domain.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm font-medium">
                                    {new Date(domain.createdAt).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onToggleStatus(domain.id, domain.isActive)}
                                            className={`h-8 w-8 p-0 rounded-full transition-all ${domain.isActive ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50' : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'}`}
                                            title={domain.isActive ? "Deactivate Globally" : "Activate Globally"}
                                        >
                                            <RotateCcw className="h-4 w-4" />
                                        </Button>

                                        <AlertDialog open={domainToDelete === domain.id} onOpenChange={(isOpen) => !isOpen && setDomainToDelete(null)}>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setDomainToDelete(domain.id)}
                                                    className="h-8 w-8 p-0 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-red-600">Delete Institutional Domain?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently delete the domain <strong>{domain.domain}</strong> and ALL associated colleges.
                                                        <br /><br />
                                                        <strong>Warning:</strong> This cannot be undone and will fail if any students are registered under this domain.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => {
                                                            onDelete(domain.id);
                                                            setDomainToDelete(null);
                                                        }}
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg shadow-lg hover:shadow-destructive/40 transition-all font-bold"
                                                    >
                                                        Delete Domain
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
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
