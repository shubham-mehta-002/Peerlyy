'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { QUERY_KEYS } from '@/constants/query-keys';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AdminHeader } from './components/AdminHeader';
import { AddCollegeDialog } from './components/AddCollegeDialog';
import { EditCollegeDialog } from './components/EditCollegeDialog';
import { DomainFilters } from './components/DomainFilters';
import { CollegeTable } from './components/CollegeTable';
import { College } from '@/types/admin.types';

export default function AdminPage() {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingCollege, setEditingCollege] = useState<College | null>(null);

    const queryClient = useQueryClient();

    // Fetch Colleges
    const { data, isLoading, isError } = useQuery({
        queryKey: [QUERY_KEYS.ADMIN.COLLEGES, page, search],
        queryFn: () => adminService.getAllColleges(page, limit, search),
        placeholderData: (previousData) => previousData,
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: (data: { name: string; campus: string; domain: string }) =>
            adminService.createCollege(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN.COLLEGES] });
            toast.success('College added successfully');
            setIsAddModalOpen(false);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to add college');
        },
    });

    const toggleMutation = useMutation({
        mutationFn: (id: string) => adminService.toggleCollegeDomainStatus(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN.COLLEGES] });
            toast.success(`Domain ${data.data.isActive ? 'activated' : 'deactivated'}`);
        },
        onError: (error: any) => {
            toast.error('Failed to update status');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => adminService.deleteCollege(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN.COLLEGES] });
            toast.success('College deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete college');
        },
    });

    const editMutation = useMutation({
        mutationFn: (data: { id: string; name: string; campus: string }) =>
            adminService.updateCollege(data.id, { name: data.name, campus: data.campus }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN.COLLEGES] });
            toast.success('College updated successfully');
            setEditingCollege(null);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update college');
        },
    });

    const handleAddCollege = (data: { name: string; campus: string; domain: string }) => {
        createMutation.mutate(data);
    };

    const handleEditCollege = (id: string, data: { name: string; campus: string }) => {
        editMutation.mutate({ id, ...data });
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <AdminHeader onAddDomainClick={() => setIsAddModalOpen(true)} />

            <AddCollegeDialog
                isOpen={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                onSubmit={handleAddCollege}
                isPending={createMutation.isPending}
            />

            <EditCollegeDialog
                isOpen={!!editingCollege}
                onOpenChange={(open) => !open && setEditingCollege(null)}
                college={editingCollege}
                onSubmit={handleEditCollege}
                isPending={editMutation.isPending}
            />

            <DomainFilters
                search={search}
                onSearchChange={(val) => {
                    setSearch(val);
                    setPage(1);
                }}
            />

            <CollegeTable
                data={data?.data.items}
                isLoading={isLoading}
                isError={isError}
                onDelete={(id) => deleteMutation.mutate(id)}
                onToggleStatus={(domainId) => toggleMutation.mutate(domainId)}
                onEdit={(college) => setEditingCollege(college)}
            />

            {/* Pagination */}
            {data?.data?.pagination && data.data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <div className="text-sm text-muted-foreground">
                        Page {page} of {data.data.pagination.totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(data.data.pagination.totalPages, p + 1))}
                        disabled={page === data.data.pagination.totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
