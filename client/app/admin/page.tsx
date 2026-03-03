'use client';

import { useState } from 'react';
import { useColleges, useCreateCollege, useToggleDomainStatus, useDeleteCollege, useUpdateCollege } from '@/hooks/admin.hooks';
import { useDebounce } from '@/hooks/use-debounce';
import { ADMIN_COLLEGES_PAGE_LIMIT } from '@/constants/variables';
import { Button } from '@/components/ui/button';
import { AdminHeader } from './components/AdminHeader';
import { AddCollegeDialog } from './components/AddCollegeDialog';
import { EditCollegeDialog } from './components/EditCollegeDialog';
import { DomainFilters } from './components/DomainFilters';
import { CollegeTable } from './components/CollegeTable';
import { College } from '@/types/admin.types';

export default function AdminPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingCollege, setEditingCollege] = useState<College | null>(null);

    // Fetch Colleges
    const { data, isLoading, isError } = useColleges(page, ADMIN_COLLEGES_PAGE_LIMIT, debouncedSearch);

    // Mutations
    const createMutation = useCreateCollege();
    const toggleMutation = useToggleDomainStatus();
    const deleteMutation = useDeleteCollege();
    const editMutation = useUpdateCollege();

    const handleAddCollege = (data: { name: string; campus: string; domain: string }) => {
        createMutation.mutate(data, {
            onSuccess: () => setIsAddModalOpen(false)
        });
    };

    const handleEditCollege = (id: string, data: { name: string; campus: string }) => {
        editMutation.mutate({ id, ...data }, {
            onSuccess: () => setEditingCollege(null)
        });
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
