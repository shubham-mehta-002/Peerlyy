'use client';

import { useState } from 'react';
import { AdminHeader } from './components/AdminHeader';
import { DomainManagement } from './components/DomainManagement';
import { CollegeManagement } from './components/CollegeManagement';
import { Globe, School } from 'lucide-react';

type TabType = 'domains' | 'colleges';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<TabType>('domains');

    return (
        <div className="container mx-auto py-10 px-4 max-w-7xl animate-in fade-in duration-500">
            <AdminHeader />

            <div className="relative mb-12">
                <div className="flex items-center gap-3 bg-muted/10 rounded-2xl border border-border/40 backdrop-blur-md w-fit p-2 mt-2">
                    <button
                        onClick={() => setActiveTab('domains')}
                        className={`relative flex items-center gap-3 px-8 py-3.5 rounded-xl text-sm transition-all duration-300 z-10 ${activeTab === 'domains'
                            ? 'text-white font-bold scale-[1.02]'
                            : 'text-muted-foreground opacity-40 hover:opacity-100 font-medium'
                            }`}
                    >
                        {activeTab === 'domains' && (
                            <div className="absolute inset-0 rounded-xl z-[-1] animate-in fade-in zoom-in-95 duration-200" />
                        )}
                        <Globe className={`h-4.5 w-4.5 transition-colors duration-300 ${activeTab === 'domains' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={activeTab === 'domains' ? 'text-primary' : 'text-muted-foreground'}>Domain Management</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('colleges')}
                        className={`relative flex items-center gap-3 px-8 py-3.5 rounded-xl text-sm transition-all duration-300 z-10 ${activeTab === 'colleges'
                            ? 'text-white font-bold scale-[1.02]'
                            : 'text-muted-foreground opacity-40 hover:opacity-100 font-medium'
                            }`}
                    >
                        {activeTab === 'colleges' && (
                            <div className="absolute inset-0 rounded-xl z-[-1] animate-in fade-in zoom-in-95 duration-200" />
                        )}
                        <School className={`h-4.5 w-4.5 transition-colors duration-300 ${activeTab === 'colleges' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={activeTab === 'colleges' ? 'text-primary' : 'text-muted-foreground'}>College Directory</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="animate-in slide-in-from-bottom-2 duration-300">
                {activeTab === 'domains' ? (
                    <DomainManagement />
                ) : (
                    <CollegeManagement />
                )}
            </div>
        </div>
    );
}
