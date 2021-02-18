export const createDatabaseSchema = (databaseUser: string, databaseSchema: string) =>
`CREATE SCHEMA ${databaseSchema} AUTHORIZATION ${databaseUser}`;