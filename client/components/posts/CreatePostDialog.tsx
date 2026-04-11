"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useCreatePost, useUploadMedia } from "@/hooks/posts.hooks";
import { toast } from "sonner";

const formSchema = z.object({
    caption: z.string().min(1, "Caption is required"),
    visibility: z.enum(["PUBLIC", "COLLEGE"]),
    isCollegeOnly: z.boolean(),
    isAnonymous: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export const CreatePostDialog = ({ onPostCreated }: { onPostCreated?: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const createPostMutation = useCreatePost();
    const uploadMediaMutation = useUploadMedia();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            caption: "",
            visibility: "PUBLIC",
            isCollegeOnly: false,
            isAnonymous: false,
        },
    });

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const clearFile = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const onSubmit = async (values: FormValues) => {
        try {
            let mediaUrl: string | undefined = undefined;
            let mediaType: "IMAGE" | "VIDEO" | undefined = undefined;
            let mediaFileId: string | undefined = undefined;

            // 1. Upload media if selected
            if (selectedFile) {
                const uploadData = await uploadMediaMutation.mutateAsync(selectedFile);
                mediaUrl = uploadData.data.url;
                mediaFileId = (uploadData.data as any).fileId;
                mediaType = uploadData.data.mediaType as "IMAGE" | "VIDEO";
            }

            // 2. Create post
            await createPostMutation.mutateAsync({
                ...values,
                ...(mediaUrl && { mediaUrl }),
                ...(mediaType && { mediaType }),
                ...(mediaFileId && { mediaFileId }),
            });

            setIsOpen(false);
            form.reset();
            clearFile();
            onPostCreated?.();
        } catch (error) {
            // Error is handled in the mutation hooks
            console.error(error);
        }
    };

    const isPending = uploadMediaMutation.isPending || createPostMutation.isPending;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg transition-all duration-300 transform hover:scale-[1.02] font-bold">
                    <ImagePlus className="mr-2 h-4 w-4" />
                    Create New Post
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">
                        Share something new
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="caption" className="text-sm font-semibold text-foreground/80 uppercase tracking-widest">Caption</Label>
                        <Textarea
                            id="caption"
                            placeholder="What's on your mind?"
                            className="resize-none min-h-[100px] bg-secondary/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-xl"
                            {...form.register("caption")}
                        />
                        {form.formState.errors.caption && (
                            <p className="text-sm text-destructive font-medium">{form.formState.errors.caption.message}</p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <Label className="text-sm font-semibold text-foreground/80 uppercase tracking-widest">Media</Label>
                        {!previewUrl ? (
                            <div className="group relative flex flex-col items-center justify-center h-64 border-2 border-dashed border-border/50 rounded-2xl bg-secondary/20 hover:bg-secondary/40 hover:border-primary/50 transition-all cursor-pointer overflow-hidden">
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    onChange={onFileSelect}
                                />
                                <div className="flex flex-col items-center space-y-3">
                                    <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                        <ImagePlus className="h-6 w-6" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-foreground/90">Click to upload</p>
                                        <p className="text-xs text-muted-foreground">Image or Video (up to 10MB)</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative group rounded-2xl overflow-hidden shadow-md border border-border/50">
                                {selectedFile?.type.startsWith("image") ? (
                                    <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover" />
                                ) : (
                                    <video src={previewUrl} className="w-full h-64 object-cover" controls />
                                )}
                                <button
                                    type="button"
                                    onClick={clearFile}
                                    className="absolute top-2 right-2 p-1.5 rounded-full bg-background/50 text-foreground backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/80"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/20 border border-border/30">
                        <div className="space-y-0.5">
                            <Label htmlFor="onlyCollege" className="text-sm font-bold text-foreground/90">College Only</Label>
                            <p className="text-xs text-muted-foreground">Only students from your college can see this</p>
                        </div>
                        <Switch
                            id="onlyCollege"
                            checked={form.watch("isCollegeOnly")}
                            onCheckedChange={(checked) => {
                                form.setValue("isCollegeOnly", checked);
                                form.setValue("visibility", checked ? "COLLEGE" : "PUBLIC");
                            }}
                        />
                    </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/20 border border-border/30">
                    <div className="space-y-0.5">
                        <Label htmlFor="isAnonymous" className="text-sm font-bold text-foreground/90">Post Anonymously</Label>
                        <p className="text-xs text-muted-foreground">Your identity will be hidden from other students</p>
                    </div>
                    <Switch
                        id="isAnonymous"
                        checked={form.watch("isAnonymous")}
                        onCheckedChange={(checked) => {
                            form.setValue("isAnonymous", checked);
                        }}
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/10 font-bold transition-all rounded-xl"
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {uploadMediaMutation.isPending ? "Uploading Media..." : "Posting..."}
                        </>
                    ) : (
                        "Share Post"
                    )}
                </Button>
            </form>
        </DialogContent>
        </Dialog>
    );
};
