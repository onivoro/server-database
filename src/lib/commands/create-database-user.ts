export const createDatabaseUser = (databaseUser: string, databaseSchema: string) =>
    `CREATE USER ${databaseUser} WITH PASSWORD '${databaseSchema}'`;