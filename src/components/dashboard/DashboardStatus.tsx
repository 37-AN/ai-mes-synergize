import React, { useEffect, useState } from 'react';

interface StatusResponse {
  dbConnection: boolean;
  simulationRunning: boolean;
}

export const DashboardStatus: React.FC = () => {
  const [status, setStatus] = useState<StatusResponse | null>(null);
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

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // update every 10 secs
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading status...</div>;
  if (!status) return <div>Error loading status...</div>;

  return (
    <div>
      <h2>Dashboard Status</h2>
      <p>
        <strong>Database Connection:</strong> {status.dbConnection ? 'Connected' : 'Disconnected'}
      </p>
      <p>
        <strong>Simulation Status:</strong> {status.simulationRunning ? 'Running' : 'Stopped'}
      </p>
    </div>
  );
};