
import { useState } from "react";
import { KPICard } from "@/components/dashboard/KPICard";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { AIInsightCard } from "@/components/dashboard/AIInsightCard";

const Index = () => {
  const [mockData] = useState({
    kpis: [
      {
        title: "Production Efficiency",
        value: "94.5%",
        trend: 2.5,
        description: "from last period",
      },
      {
        title: "Quality Rate",
        value: "99.2%",
        trend: 0.8,
        description: "improvement",
      },
      {
        title: "Machine Uptime",
        value: "97.8%",
        trend: -0.5,
        description: "decrease detected",
      },
      {
        title: "Energy Efficiency",
        value: "86.4%",
        trend: 1.2,
        description: "optimization achieved",
      },
    ],
    machineStatuses: [
      {
        title: "Production Line A",
        status: "operational",
        metrics: [
          { label: "Output Rate", value: "150 units/hr" },
          { label: "Temperature", value: "23.5°C" },
          { label: "Pressure", value: "2.1 bar" },
        ],
      },
      {
        title: "Production Line B",
        status: "warning",
        metrics: [
          { label: "Output Rate", value: "142 units/hr" },
          { label: "Temperature", value: "24.8°C" },
          { label: "Pressure", value: "2.3 bar" },
        ],
      },
    ],
    aiInsights: [
      {
        type: "optimization",
        message: "Optimal production parameters calculated for Line A based on current conditions.",
        impact: "Estimated 3% efficiency increase",
      },
      {
        type: "prediction",
        message: "Maintenance required for Line B within 48 hours based on vibration patterns.",
        impact: "Prevent potential 4-hour downtime",
      },
      {
        type: "alert",
        message: "Quality variance detected in recent batches. Adjusting parameters automatically.",
        impact: "Maintaining 99.9% quality standard",
      },
    ],
  });

  return (
    <div className="min-h-screen bg-accent p-6">
      <div className="container mx-auto space-y-8">
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-bold">Manufacturing Execution Dashboard</h1>
          <p className="text-muted-foreground">Real-time monitoring and AI-driven insights</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {mockData.kpis.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            {mockData.machineStatuses.map((status, index) => (
              <StatusCard key={index} {...status} />
            ))}
          </div>
          <AIInsightCard insights={mockData.aiInsights} />
        </div>
      </div>
    </div>
  );
};

export default Index;
