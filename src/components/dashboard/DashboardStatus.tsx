
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database, Activity } from "lucide-react";

interface StatusResponse {
  dbConnection: boolean;
  simulationRunning: boolean;
}

interface ConsoleLog {
  timestamp: string;
  message: string;
}

export const DashboardStatus: React.FC = () => {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [logs, setLogs] = useState<ConsoleLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/status');
      if (!response.ok) throw new Error('Failed to fetch status');
      const data: StatusResponse = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Error fetching status:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/logs');
      if (!response.ok) throw new Error('Failed to fetch logs');
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchLogs();
    const statusInterval = setInterval(fetchStatus, 10000);
    const logsInterval = setInterval(fetchLogs, 5000);
    return () => {
      clearInterval(statusInterval);
      clearInterval(logsInterval);
    };
  }, []);

  if (loading) return <div>Loading status...</div>;
  if (!status) return <div>Error loading status...</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">System Status</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Database className={status.dbConnection ? "text-green-500" : "text-red-500"} />
            <span>Database: {status.dbConnection ? "Connected" : "Disconnected"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className={status.simulationRunning ? "text-green-500" : "text-yellow-500"} />
            <span>Simulation: {status.simulationRunning ? "Running" : "Stopped"}</span>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Simulation Logs</h2>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          {logs.map((log, index) => (
            <div key={index} className="text-sm mb-2">
              <span className="text-muted-foreground">{log.timestamp}</span>
              <span className="ml-2">{log.message}</span>
            </div>
          ))}
        </ScrollArea>
      </Card>
    </div>
  );
};
