import { Injectable } from "@nestjs/common";
import { createDatabase } from '../commands/create-database';
import { createDatabaseSchema } from '../commands/create-database-schema';
import { createDatabaseUser } from '../commands/create-database-user';
import { DatabaseConfig } from '../database.config';
import { PsqlService } from './psql.service';

@Injectable()
export class ProvisionerService {
    constructor(
        private readonly psql: PsqlService,
        private readonly config: DatabaseConfig
    ) { }

    provisionDb() {
        this.psql.exec(createDatabase(this.config.database));
    }

    provisionTenant () {
        this.psql.exec(createDatabaseUser(this.config.schema, this.config.schema));
        this.psql.exec(createDatabaseSchema(this.config.username, this.config.schema), this.config.database);
    }


}