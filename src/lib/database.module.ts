import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { spawnSync } from 'child_process';
import { createConnection } from 'typeorm';
import { DatabaseConfig } from './database.config';
import { DatabaseService } from './service/database.service';
import { MigrationService } from './service/migration.service';
import { ProvisionerService } from './service/provisioner.service';
import { PsqlService } from './service/psql.service';
import { DatabaseConnectionInjectToken } from './token/database-connection-inject-token';
import { spawnSyncInjectToken } from './token/spawn-sync-inject-token';

@Module({})
export class DatabaseModule {
  static async forRoot(entities: any[], migrations: any[]): Promise<DynamicModule> {
    const databaseConfig = new DatabaseConfig(entities, migrations);
    const psqlService = new PsqlService(databaseConfig, spawnSync);
    const databaseService = new DatabaseService(databaseConfig, psqlService);
    const provisionerService = new ProvisionerService(psqlService, databaseConfig);
    const dbCreated = databaseService.doesDbExist();

    if (!dbCreated) {
      databaseService.createDb();
    }

    const providers = [
      { provide: spawnSyncInjectToken, useValue: spawnSync },
      { provide: DatabaseConfig, useValue: databaseConfig },
      DatabaseService,
      MigrationService,
      { provide: ProvisionerService, useValue: provisionerService },
      { provide: PsqlService, useValue: psqlService },
      { provide: DatabaseConnectionInjectToken, useFactory: async () => await createConnection(databaseConfig) }
    ];

    return {
      imports: [TypeOrmModule.forRoot(databaseConfig)],
      module: DatabaseModule,
      providers,
      exports: providers
    };
  }
}
