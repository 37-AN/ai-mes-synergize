
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  trend: number;
  description: string;
}

export function KPICard({ title, value, trend, description }: KPICardProps) {
  const isPositive = trend >= 0;

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {isPositive ? (
          <TrendingUp className="h-4 w-4 text-secondary" />
        ) : (
          <TrendingDown className="h-4 w-4 text-destructive" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {isPositive ? "+" : ""}
          {trend}% {description}
        </p>
      </CardContent>
    </Card>
  );
}
