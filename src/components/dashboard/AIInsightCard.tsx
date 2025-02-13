import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Loader2 } from "lucide-react";
import { AIInsightService } from "@/services/aiInsightService";
import { AIInsight } from '@/types/ai';

export function AIInsightCard() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const newInsights = await AIInsightService.generateInsights();
        setInsights(newInsights);
      } catch (error) {
        console.error('Failed to fetch AI insights:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchInsights();

    // Refresh every 5 minutes
    const interval = setInterval(fetchInsights, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

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
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
        </div>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.length === 0 && !loading ? (
            <p className="text-sm text-muted-foreground">No insights available</p>
          ) : (
            insights.map((insight, index) => (
              <div key={index} className="space-y-1">
                <h4 className={`text-sm font-medium ${getTypeColor(insight.type)}`}>
                  {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                </h4>
                <p className="text-sm text-muted-foreground">{insight.message}</p>
                <p className="text-xs text-muted-foreground">Impact: {insight.impact}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
