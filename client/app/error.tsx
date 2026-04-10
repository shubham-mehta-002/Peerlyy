"use client";

// import { useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { AlertTriangle } from "lucide-react";

// export default function Error({
//     error,
//     reset,
// }: {
//     error: Error & { digest?: string };
//     reset: () => void;
// }) {
//     useEffect(() => {
//         // Log the error to an error reporting service
//         console.error(error);
//     }, [error]);

//     return (
//         <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 text-center">
//             <div className="space-y-6 max-w-md w-full bg-card/50 backdrop-blur-sm p-8 rounded-[2rem] border border-border/50 shadow-xl shadow-primary/5">
//                 <div className="flex justify-center">
//                     <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
//                         <AlertTriangle className="h-8 w-8" />
//                     </div>
//                 </div>
//                 <div className="space-y-2">
//                     <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
//                     <p className="text-sm text-muted-foreground">
//                         An unexpected error occurred. Our team has been notified and is working on a fix.
//                     </p>
//                 </div>
//                 <div className="flex gap-4 pt-4">
//                     <Button
//                         onClick={() => window.location.reload()}
//                         variant="outline"
//                         className="w-full rounded-xl"
//                     >
//                         Go Home
//                     </Button>
//                     <Button
//                         onClick={() => reset()}
//                         className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl"
//                     >
//                         Try again
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     );
// }
