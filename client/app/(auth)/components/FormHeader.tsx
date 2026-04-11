import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FormHeaderProps {
    description: string;
    subDescription?: React.ReactNode;
    className?: string;
}

export const FormHeader = ({ description, subDescription, className }: FormHeaderProps) => {
    return (
        <CardHeader className={cn("space-y-1 text-center", className)}>
            <CardTitle className="font-extrabold text-3xl flex items-center justify-center">
                <p className="text-primary">Peerly</p>
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground font-medium">
                {description}
            </CardDescription>
            {subDescription && (
                <div className="text-xs text-muted-foreground mt-1">
                    {subDescription}
                </div>
            )}
        </CardHeader>
    )
}


