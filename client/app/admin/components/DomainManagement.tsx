'use client';

import { useState } from 'react';
import { useCollegeDomains, useDeleteDomain, useToggleDomainStatus, useCreateDomain } from '@/hooks/admin.hooks';
import { useDebounce } from '@/hooks/use-debounce';
import { ADMIN_COLLEGES_PAGE_LIMIT } from '@/constants/variables';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DomainFilters } from './DomainFilters';
import { DomainTable } from './DomainTable';
import { AddCollegeDialog } from './AddCollegeDialog';

export function DomainManagement() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const { data, isLoading, isError } = useCollegeDomains(page, ADMIN_COLLEGES_PAGE_LIMIT, debouncedSearch);

    const deleteMutation = useDeleteDomain();
    const toggleStatusMutation = useToggleDomainStatus();
    const createMutation = useCreateDomain();

    const handleAddDomain = (data: { domain: string; colleges: { name: string; campus: string }[] }) => {
        createMutation.mutate(data, {
            onSuccess: () => setIsAddModalOpen(false)
        });
    };

    return (
        <div className="space-y-6">
            <AddCollegeDialog
                isOpen={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                onSubmit={handleAddDomain}
                isPending={createMutation.isPending}
            />

            <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">Email Domains</h2>
                    <p className="text-sm text-muted-foreground whitespace-nowrap">
                        Manage institutional email domains and their global access status.
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
                        />
                    </div>
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="cursor-pointer shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-bold whitespace-nowrap h-10 bg-primary"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Domain
                    </Button>
                </div>
            </div>

            <DomainTable
                data={data?.data.items}
                isLoading={isLoading}
                isError={isError}
                onDelete={(id) => deleteMutation.mutate(id)}
                onToggleStatus={(domainId) => toggleStatusMutation.mutate(domainId)}
            />

            {/* Pagination */}
            {
                data?.data?.pagination && data.data.pagination.totalPages > 1 && (
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
                )
            }
        </div >
    );
}
