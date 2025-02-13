
import { dbClient } from './DatabaseClient';
import { status } from '../lib/status'; // Import the status object

async function createTables() {
  try {
    // Ensure a connection is established.
    await dbClient.connect();

    // Create the ProductionMetrics table if it doesn't already exist.
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
    console.log('ProductionMetrics table checked/created.');

    // Create the MachineStatus table if it doesn't already exist.
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
    console.log('MachineStatus table checked/created.');
  } catch (error) {
    console.error('Error creating tables:', error);
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
    console.log(`Inserted ProductionMetrics: Count=${productionCount}, QualityRate=${qualityRate.toFixed(2)}`);
  } catch (error) {
    console.error('Error inserting into ProductionMetrics:', error);
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
    console.log(`Inserted MachineStatus: ${machineName} is ${statusStr}`);
  } catch (error) {
    console.error('Error inserting into MachineStatus:', error);
  }
}

async function simulateData() {
  console.log('Simulating data insertion...');
  await simulateProductionMetrics();
  await simulateMachineStatus();
}

async function main() {
  console.log('Starting simulator...');
  // Ensure the necessary tables exist.
  await createTables();

  // Run an initial simulation.
  await simulateData();

  // Mark simulation as running so that the API can see it.
  status.simulationRunning = true;

  // Then simulate data insertion every 10 seconds.
  setInterval(simulateData, 10000);
}

main().then(() => {
  console.log('Simulator started. Check your database and console logs for entries.');
}).catch((error) => {
  console.error('Simulator failed to start:', error);
});
