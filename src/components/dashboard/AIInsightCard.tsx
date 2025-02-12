
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

interface AIInsight {
  type: "optimization" | "prediction" | "alert";
  message: string;
  impact: string;
}

interface AIInsightCardProps {
  insights: AIInsight[];
}

export function AIInsightCard({ insights }: AIInsightCardProps) {
  const getTypeColor = (type: AIInsight["type"]) => {
    switch (type) {
      case "optimization":
        return "text-secondary";
      case "prediction":
        return "text-primary";
      case "alert":
        return "text-destructive";
      default:
        return "text-foreground";
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center space-x-2 pb-2">
        <Brain className="h-5 w-5 text-primary" />
        <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="space-y-1">
              <h4 className={`text-sm font-medium ${getTypeColor(insight.type)}`}>
                {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
              </h4>
              <p className="text-sm text-muted-foreground">{insight.message}</p>
              <p className="text-xs text-muted-foreground">Impact: {insight.impact}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
