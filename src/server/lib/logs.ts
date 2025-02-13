export const simulationLogs: { timestamp: string; message: string }[] = [];

export const addLog = (message: string) => {
  const timestamp = new Date().toISOString();
  simulationLogs.unshift({ timestamp, message });
  
  // Keep only the last 100 logs
  if (simulationLogs.length > 100) {
    simulationLogs.pop();
  }
};
