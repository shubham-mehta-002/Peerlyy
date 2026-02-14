import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const FormHeader = ({ description }: { description: string }) => {
    return (
        <CardHeader>
            <CardTitle className="font-extrabold text-3xl flex items-center justify-center"><p className="text-primary">Peerly</p></CardTitle>
            <CardDescription className="flex items-center justify-center">
                {description}
            </CardDescription>
        </CardHeader>
    )
}


export default FormHeader;