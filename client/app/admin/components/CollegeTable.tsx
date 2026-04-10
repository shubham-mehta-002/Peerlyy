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
import { Loader2, Trash2, RotateCcw, Pencil, Globe, School, Info } from 'lucide-react';
import { College } from '@/types/admin.types';
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

interface CollegeTableProps {
    data: College[] | undefined;
    isLoading: boolean;
    isError: boolean;
    onDelete: (id: string) => void;
    onToggleDomainStatus: (id: string, currentStatus: boolean) => void;
    onToggleCollegeStatus: (id: string, currentStatus: boolean) => void;
    onEdit: (college: College) => void;
}

export function CollegeTable({
    data,
    isLoading,
    isError,
    onDelete,
    onToggleDomainStatus,
    onToggleCollegeStatus,
    onEdit
}: CollegeTableProps) {
    const [collegeToDelete, setCollegeToDelete] = useState<string | null>(null);

    return (
        <div className="rounded-xl border bg-card/50 backdrop-blur-sm overflow-hidden border-border/40 shadow-sm">
            <Table>
                <TableHeader className="bg-muted/30">
                    <TableRow>
                        <TableHead className="font-bold">College Name</TableHead>
                        <TableHead className="font-bold">Campus</TableHead>
                        <TableHead className="font-bold">Domain</TableHead>
                        <TableHead className="font-bold text-center">College Status</TableHead>
                        <TableHead className="font-bold text-center">Domain Status</TableHead>
                        <TableHead className="font-bold">Created At</TableHead>
                        <TableHead className="text-right font-bold">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={7} className="h-32 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    <span className="text-sm text-muted-foreground font-medium">Loading colleges...</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : isError ? (
                        <TableRow>
                            <TableCell colSpan={7} className="h-32 text-center text-destructive">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                                        <Info className="h-5 w-5" />
                                    </div>
                                    <span className="font-semibold">Failed to load data</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : !data || data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                <div className="flex flex-col items-center gap-2">
                                    <School className="h-8 w-8 text-muted-foreground/30" />
                                    <span className="font-medium">No colleges found.</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((college) => (
                            <TableRow key={college.id} className="hover:bg-muted/20 transition-colors">
                                <TableCell className="font-semibold">{college.name}</TableCell>
                                <TableCell className="text-muted-foreground font-medium">{college.campus}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="px-2 py-0.5 font-mono text-[10px] bg-primary/5 border-primary/20 text-primary uppercase flex items-center gap-1">
                                        <Globe className={`h-2.5 w-2.5 ${college.domain.isActive ? 'text-emerald-500' : 'text-rose-500'}`} />
                                        {college.domain.domain}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge
                                        variant="outline"
                                        className={`${college.isActive ? 'bg-primary/20 text-primary border-primary/30' : 'bg-destructive/20 text-destructive border-destructive/30'}`}
                                    >
                                        {college.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge
                                        variant={college.domain.isActive ? 'outline' : 'outline'}
                                        className={`${college.domain.isActive ? 'bg-primary/20 text-primary border-primary/30' : 'bg-destructive/20 text-destructive border-destructive/30'}`}
                                    >
                                        {college.domain.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm font-medium">
                                    {new Date(college.createdAt).toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end items-center gap-1.5">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onToggleCollegeStatus(college.id, college.isActive)}
                                            className={`h-8 w-8 p-0 rounded-full transition-all ${college.isActive ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50' : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'}`}
                                            title={college.isActive ? "Deactivate College" : "Activate College"}
                                        >
                                            <RotateCcw className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onToggleDomainStatus(college.domain.id, college.domain.isActive)}
                                            className={`h-8 w-8 p-0 rounded-full transition-all ${college.domain.isActive ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50' : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'}`}
                                            title={college.domain.isActive ? "Deactivate Domain Globally" : "Activate Domain Globally"}
                                        >
                                            <Globe className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(college)}
                                            className="h-8 w-8 p-0 rounded-full text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                            title="Edit College"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>

                                        <AlertDialog open={collegeToDelete === college.id} onOpenChange={(isOpen) => !isOpen && setCollegeToDelete(null)}>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setCollegeToDelete(college.id)}
                                                    className="h-8 w-8 p-0 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    title="Delete College"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-red-600">Delete College?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently delete <strong>{college.name} ({college.campus})</strong>.
                                                        This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => {
                                                            onDelete(college.id);
                                                            setCollegeToDelete(null);
                                                        }}
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg shadow-lg hover:shadow-destructive/40 transition-all font-bold"
                                                    >
                                                        Delete College
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
