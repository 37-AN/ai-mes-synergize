
import { dbClient } from './DatabaseClient';
import { status } from './status';
import { addLog } from './logs';

async function createTables() {
  try {
    await dbClient.connect();
    await dbClient.query(`
      IF OBJECT_ID('dbo.ProductionMetrics', 'U') IS NULL
      BEGIN
        CREATE TABLE ProductionMetrics (
          id INT IDENTITY(1,1) PRIMARY KEY,
          [Timestamp] DATETIME DEFAULT GETDATE(),
          ProductionCount INT,
          QualityRate DECIMAL(5,2)
        );
      END
    `);
    addLog('ProductionMetrics table checked/created.');

    await dbClient.query(`
      IF OBJECT_ID('dbo.MachineStatus', 'U') IS NULL
      BEGIN
        CREATE TABLE MachineStatus (
          id INT IDENTITY(1,1) PRIMARY KEY,
          [Timestamp] DATETIME DEFAULT GETDATE(),
          MachineName NVARCHAR(100),
          Status NVARCHAR(50)
        );
      END
    `);
    addLog('MachineStatus table checked/created.');
  } catch (error) {
    addLog(`Error creating tables: ${error.message}`);
  }
}

async function simulateProductionMetrics() {
  try {
    const productionCount = Math.floor(Math.random() * 1000);
    const qualityRate = 80 + Math.random() * 20;

    await dbClient.query(`
      INSERT INTO ProductionMetrics (ProductionCount, QualityRate)
      VALUES (${productionCount}, ${qualityRate});
    `);
    addLog(`New production metrics: Count=${productionCount}, Quality=${qualityRate.toFixed(2)}%`);
  } catch (error) {
    addLog(`Error inserting production metrics: ${error.message}`);
  }
}

async function simulateMachineStatus() {
  try {
    const machineNames = ['Machine A', 'Machine B', 'Machine C'];
    const statuses = ['Running', 'Stopped', 'Maintenance'];
    const machineName = machineNames[Math.floor(Math.random() * machineNames.length)];
    const statusStr = statuses[Math.floor(Math.random() * statuses.length)];

    await dbClient.query(`
      INSERT INTO MachineStatus (MachineName, Status)
      VALUES ('${machineName}', '${statusStr}');
    `);
    addLog(`Machine status update: ${machineName} is ${statusStr}`);
  } catch (error) {
    addLog(`Error inserting machine status: ${error.message}`);
  }
}

async function simulateData() {
  addLog('Starting new simulation cycle...');
  await simulateProductionMetrics();
  await simulateMachineStatus();
}

async function main() {
  addLog('Initializing simulation system...');
  await createTables();
  await simulateData();
  
  status.simulationRunning = true;
  addLog('Simulation system initialized and running');
  
  setInterval(simulateData, 10000);
}

main().then(() => {
  addLog('Simulator started successfully');
}).catch((error) => {
  addLog(`Simulator failed to start: ${error.message}`);
});
