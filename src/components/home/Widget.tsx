import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function Widget({ title, description, icon, children, className }: { title: string, description: string, icon: React.ReactNode, children: React.ReactNode, className?: string }) {
  return (
    <Card className={cn("shadow-md hover:shadow-lg transition-shadow", className)}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
          <span className="text-primary shrink-0">{icon && icon}</span>
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-sm sm:text-base mt-1">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="text-sm sm:text-base">
        {children}
      </CardContent>
    </Card>
  )
}
