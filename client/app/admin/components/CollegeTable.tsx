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
import { Loader2, Trash2, RotateCcw, Pencil } from 'lucide-react';
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
    onToggleStatus: (id: string, currentStatus: boolean) => void;
    onEdit: (college: College) => void;
}

export function CollegeTable({
    data,
    isLoading,
    isError,
    onDelete,
    onToggleStatus,
    onEdit
}: CollegeTableProps) {
    const [collegeToDelete, setCollegeToDelete] = useState<string | null>(null);

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>College Name</TableHead>
                        <TableHead>Campus</TableHead>
                        <TableHead>Domain</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                <Loader2 className="mr-2 h-6 w-6 animate-spin inline-block" />
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : isError ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-red-500">
                                Failed to load data.
                            </TableCell>
                        </TableRow>
                    ) : !data || data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                No colleges found. Be the first to add one!
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((college) => (
                            <TableRow key={college.id}>
                                <TableCell className="font-medium">{college.name}</TableCell>
                                <TableCell>{college.campus}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">
                                        {college.domain.domain}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={college.domain.isActive ? 'default' : 'destructive'}>
                                        {college.domain.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {new Date(college.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onToggleStatus(college.domain.id, college.domain.isActive)}
                                            title={college.domain.isActive ? "Deactivate Domain" : "Activate Domain"}
                                        >
                                            <RotateCcw className={`h-4 w-4 ${college.domain.isActive ? 'text-yellow-600' : 'text-green-600'}`} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(college)}
                                            title="Edit College"
                                        >
                                            <Pencil className="h-4 w-4 text-blue-500" />
                                        </Button>
                                        <AlertDialog open={collegeToDelete === college.id} onOpenChange={(isOpen) => !isOpen && setCollegeToDelete(null)}>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setCollegeToDelete(college.id)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the college
                                                        <strong> {college.name}</strong> from the system.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => {
                                                            onDelete(college.id);
                                                            setCollegeToDelete(null);
                                                        }}
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    >
                                                        Delete
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
