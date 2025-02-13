
import { dbClient } from './DatabaseClient';
<<<<<<< Updated upstream
import { status } from './status';
import { addLog } from './logs';

async function createTables() {
  try {
    await dbClient.connect();
=======
import { status } from '../status';

async function createTables() {
  try {
    // Ensure we're connected
    await dbClient.connect();

    // Create the ProductionMetrics table if it doesn’t exist.
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
=======
    // Create the MachineStatus table if it doesn’t exist.
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream

    await dbClient.query(`
      INSERT INTO ProductionMetrics (ProductionCount, QualityRate)
      VALUES (${productionCount}, ${qualityRate});
    `);
    addLog(`New production metrics: Count=${productionCount}, Quality=${qualityRate.toFixed(2)}%`);
=======
    const insertQuery = `
      INSERT INTO ProductionMetrics (ProductionCount, QualityRate)
      VALUES (${productionCount}, ${qualityRate});
    `;
    await dbClient.query(insertQuery);
    console.log(`Inserted ProductionMetrics: Count=${productionCount}, QualityRate=${qualityRate.toFixed(2)}`);
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream

    await dbClient.query(`
=======
    const insertQuery = `
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
  console.log('Starting simulator...');
  await createTables();
  await simulateData(); // Run once initially

  // Set simulation status flag
  status.simulationRunning = true;
  console.log('Simulation status set to true.');

  // Then simulate data insertion every 10 seconds.
  setInterval(async () => {
    await simulateData();
  }, 10000);
}

main()
  .then(() => console.log('Simulator started. Check your console for logs and your database for changes.'))
  .catch((error) => console.error('Simulator failed to start:', error));
>>>>>>> Stashed changes
