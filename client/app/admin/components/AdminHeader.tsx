export function AdminHeader() {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 pb-6 border-b border-border/40">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-1 font-medium">Configure institutional access and campus details.</p>
            </div>
        </div>
    );
}
