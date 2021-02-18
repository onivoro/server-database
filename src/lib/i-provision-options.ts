import { DatabaseConfig } from './database.config';

export interface IProvisionOptions extends DatabaseConfig {
    customer: string;
    environment: string;
    // schema: string;
    // dbUser: string;
    // dbName: string;
    // dbPw: string;
}