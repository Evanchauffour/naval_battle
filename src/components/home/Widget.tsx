import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function Widget({ title, description, icon, children, className }: { title: string, description: string, icon: React.ReactNode, children: React.ReactNode, className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><span>{icon && icon}</span> {title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}
