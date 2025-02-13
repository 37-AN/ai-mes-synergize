import { DatabaseClient } from './DatabaseClient';
import { sqlServerConfig } from '../config/database';

export const databaseInstance = DatabaseClient.getInstance(sqlServerConfig);

module.exports = databaseInstance; 