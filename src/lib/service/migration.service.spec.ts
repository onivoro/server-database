import { Connection } from 'typeorm';
import { DatabaseConfig } from '../database.config';
import { MigrationService } from './migration.service';

describe(MigrationService.name, () => {
  let subject: MigrationService;
  let connection: Connection;
  let config: DatabaseConfig;

  beforeEach(() => {
    config = new DatabaseConfig([], []);
    connection = { driver: {} } as any;
    subject = new MigrationService(connection, config);
  });

  describe(MigrationService.prototype.buildSchema.name, () => {
    it('is defined... and will do something soon', () => {
      expect(subject.buildSchema).toBeDefined();
    });
  });
});
