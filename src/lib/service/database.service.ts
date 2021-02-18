import { Injectable } from '@nestjs/common';
import { execSync } from 'child_process';
import { resolve } from 'path';
import { DatabaseConfig } from '../database.config';
import { PsqlService } from './psql.service';

type ArtifactId = 'code' | 'db';

const LATEST = 'latest';

@Injectable()
export class DatabaseService {
  readonly metaTable = 'asa_metadata';
  readonly migrationDirectory = 'libs/server/database/src/migration';

  constructor(private readonly config: DatabaseConfig, private readonly psql: PsqlService) {}

  createDb() {
    return this.psql.exec(`CREATE DATABASE ${this.config.database}`);
  }

  createMetaTable() {
    return this.psql.exec(`CREATE TABLE ${this.metaTable} (id varchar(10) NOT NULL, version varchar(40) NOT NULL)`);
  }

  doesDbExist() {
    const count = this.psql.exec(`select count(*) from pg_catalog.pg_database where datname='${this.config.database}'`);

    return Number(count) > 0;
  }

  getVersion(artifactId: ArtifactId): string {
    return this.psql.exec(`SELECT version FROM ${this.metaTable} WHERE id='${artifactId}'`);
  }

  migrate(requestedVersion = LATEST) {
    if (requestedVersion === LATEST) {
      return execSync('typeorm migration:run', { cwd: resolve(this.migrationDirectory) }).toString();
    }

    return `migrating to a specific version (like ${requestedVersion}) has not been implemented yet`;
  }

  setVersion(artifactId: ArtifactId, artifactVersion: string) {
    return this.psql.exec(
      [
        `DELETE FROM ${this.metaTable} WHERE id='${artifactId}'`,
        `INSERT INTO ${this.metaTable} (id, version) VALUES ('${artifactId}', '${artifactVersion}')`
      ].join(';\n')
    );
  }
}
