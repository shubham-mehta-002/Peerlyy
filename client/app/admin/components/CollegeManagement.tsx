'use client';

import { useState } from 'react';
import { useColleges, useDeleteCollege, useToggleCollegeStatus, useToggleDomainStatus, useUpdateCollege } from '@/hooks/admin.hooks';
import { useDebounce } from '@/hooks/use-debounce';
import { ADMIN_COLLEGES_PAGE_LIMIT } from '@/constants/variables';
import { Button } from '@/components/ui/button';
import { DomainFilters } from './DomainFilters';
import { CollegeTable } from './CollegeTable';
import { EditCollegeDialog } from './EditCollegeDialog';
import { College } from '@/types/admin.types';

export function CollegeManagement() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [editingCollege, setEditingCollege] = useState<College | null>(null);

    const { data, isLoading, isError } = useColleges(page, ADMIN_COLLEGES_PAGE_LIMIT, debouncedSearch);

    const deleteMutation = useDeleteCollege();
    const toggleCollegeMutation = useToggleCollegeStatus();
    const toggleDomainMutation = useToggleDomainStatus();
    const editMutation = useUpdateCollege();

    const handleEditCollege = (id: string, data: { name: string; campus: string; isActive: boolean }) => {
        editMutation.mutate({ id, ...data }, {
            onSuccess: () => setEditingCollege(null)
        });
    };

    return (
        <div className="space-y-6">
            <EditCollegeDialog
                isOpen={!!editingCollege}
                onOpenChange={(open) => !open && setEditingCollege(null)}
                college={editingCollege}
                onSubmit={handleEditCollege}
                isPending={editMutation.isPending}
            />

            <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">Colleges & Campuses</h2>
                    <p className="text-sm text-muted-foreground whitespace-nowrap">
                        Manage individual colleges and their specific campus statuses.
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full md:max-w-2xl justify-end">
                    <div className="md:max-w-md">
                        <DomainFilters
                            search={search}
                            onSearchChange={(val) => {
                                setSearch(val);
                                setPage(1);
                            }}
                            placeholder="Search colleges..."
                        />
                    </div>
                </div>
            </div>

            <CollegeTable
                data={data?.data.items}
                isLoading={isLoading}
                isError={isError}
                onDelete={(id) => deleteMutation.mutate(id)}
                onToggleDomainStatus={(domainId) => toggleDomainMutation.mutate(domainId)}
                onToggleCollegeStatus={(collegeId) => toggleCollegeMutation.mutate(collegeId)}
                onEdit={(college) => setEditingCollege(college)}
            />

            {/* Pagination */}
            {data?.data?.pagination && data.data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="h-9 px-4 hover:bg-primary/5 transition-colors"
                    >
                        Previous
                    </Button>
                    <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-primary">{page}</span>
                        <span className="text-sm text-muted-foreground">of {data.data.pagination.totalPages}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPage(p => Math.min(data.data.pagination.totalPages, p + 1))}
                        disabled={page === data.data.pagination.totalPages}
                        className="h-9 px-4 hover:bg-primary/5 transition-colors"
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
