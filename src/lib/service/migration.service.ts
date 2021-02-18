import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { Connection } from 'typeorm';
import { DatabaseConfig } from '../database.config';
import { DatabaseConnectionInjectToken } from '../token/database-connection-inject-token';

@Injectable()
export class MigrationService implements OnModuleInit {
  schema: any;

  constructor(
    @Inject(DatabaseConnectionInjectToken) private readonly connection: Connection,
    private readonly databaseConfig: DatabaseConfig
  ) {}

  async onModuleInit() {
    const version = new Date().getTime();
    await this.buildSchema(version);
    await this.applySchemaToDatabase(version);
  }

  async applySchemaToDatabase(_version: number) {
    await this.connection.runMigrations({ transaction: 'all' });
  }

  async buildSchema(version: number) {
    const { upSqls, downSqls } = await this.buildSchemaRaw();

    return this.writeSchemaToDisk(version, upSqls, downSqls);
  }

  private writeSchemaToDisk(version: number, upSqls: any[], downSqls: any[]) {
    const outDirectory: string = this.databaseConfig.cli.migrationsDir;
    const name = `V${version}`;
    const filename = name + '.ts';
    const fileContent = this.getTemplate(name, upSqls, downSqls.reverse());
    const path = resolve(outDirectory, filename);
    writeFileSync(path, fileContent, 'utf8');
  }

  private async buildSchemaRaw() {
    const sqlInMemory = await this.connection.driver.createSchemaBuilder().log();
    const upSqls: string[] = [];
    const downSqls: string[] = [];
    sqlInMemory.upQueries.forEach(upQuery => {
      upSqls.push(
        '        await queryRunner.query(`' +
          upQuery.query.replace(new RegExp('`', 'g'), '\\`') +
          '`, ' +
          JSON.stringify(upQuery.parameters) +
          ');'
      );
    });
    sqlInMemory.downQueries.forEach(downQuery => {
      downSqls.push(
        '        await queryRunner.query(`' +
          downQuery.query.replace(new RegExp('`', 'g'), '\\`') +
          '`, ' +
          JSON.stringify(downQuery.parameters) +
          ');'
      );
    });

    return { upSqls, downSqls };
  }

  private getTemplate(migrationName: string, upSqls: string[], downSqls: string[]): string {
    return `import {MigrationInterface, QueryRunner} from "typeorm";

export class ${migrationName} implements MigrationInterface {
    name = '${migrationName}'

    public async up(queryRunner: QueryRunner): Promise<void> {
${upSqls.join('\n')}
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
${downSqls.join('\n')}
    }
}\n`;
  }
}
