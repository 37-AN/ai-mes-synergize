import { dbClient } from './DatabaseClient';
import { status } from '../status';

// Simple logging function. You can expand this if needed.
function addLog(message: string): void {
  console.log(message);
}

async function createTables() {
  try {
    // Ensure we're connected.
    await dbClient.connect();

    // Create ProductionMetrics table if it doesn't exist.
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

    // Create MachineStatus table if it doesn't exist.
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      addLog(`Error creating tables: ${error.message}`);
    } else {
      addLog(`Error creating tables: ${String(error)}`);
    }
  }
}

async function simulateProductionMetrics() {
  try {
    const productionCount = Math.floor(Math.random() * 1000);
    const qualityRate = 80 + Math.random() * 20; // Quality between 80 and 100%
    const insertQuery = `
      INSERT INTO ProductionMetrics (ProductionCount, QualityRate)
      VALUES (${productionCount}, ${qualityRate});
    `;
    await dbClient.query(insertQuery);
    addLog(`Inserted ProductionMetrics: Count=${productionCount}, QualityRate=${qualityRate.toFixed(2)}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      addLog(`Error inserting production metrics: ${error.message}`);
    } else {
      addLog(`Error inserting production metrics: ${String(error)}`);
    }
  }
}

async function simulateMachineStatus() {
  try {
    const machineNames = ['Machine A', 'Machine B', 'Machine C'];
    const statuses = ['Running', 'Stopped', 'Maintenance'];
    const machineName = machineNames[Math.floor(Math.random() * machineNames.length)];
    const statusStr = statuses[Math.floor(Math.random() * statuses.length)];
    const insertQuery = `
      INSERT INTO MachineStatus (MachineName, Status)
      VALUES ('${machineName}', '${statusStr}');
    `;
    await dbClient.query(insertQuery);
    addLog(`Inserted MachineStatus: ${machineName} is ${statusStr}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      addLog(`Error inserting machine status: ${error.message}`);
    } else {
      addLog(`Error inserting machine status: ${String(error)}`);
    }
  }
}

async function simulateData() {
  addLog('Simulating data insertion...');
  await simulateProductionMetrics();
  await simulateMachineStatus();
}

async function main() {
  addLog('Starting simulator...');
  await createTables();
  await simulateData();

  // Set simulation status flag to true.
  status.simulationRunning = true;
  addLog('Simulation status set to true.');

  // Then simulate data insertion every 10 seconds.
  setInterval(async () => {
    await simulateData();
  }, 10000);
}

main()
  .then(() => {
    addLog('Simulator started. Check your console for logs and your database for changes.');
  })
  .catch((error: unknown) => {
    if (error instanceof Error) {
      addLog(`Simulator failed to start: ${error.message}`);
    } else {
      addLog(`Simulator failed to start: ${String(error)}`);
    }
  });
