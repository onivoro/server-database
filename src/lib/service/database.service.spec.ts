import { DatabaseConfig } from '../database.config';
import { PsqlMock } from '../support/psql.mock';
import { DatabaseService } from './database.service';

describe(DatabaseService.name, () => {
  let psqlMock: PsqlMock;
  let svc: DatabaseService;
  let config: DatabaseConfig;

  beforeEach(() => {
    config = new DatabaseConfig([], []);
    psqlMock = new PsqlMock();
    svc = new DatabaseService(config, psqlMock as any);
  });

  describe(DatabaseService.prototype.createDb.name, () => {
    it('creates a database', () => {
      svc.createDb();
      expect(psqlMock.exec).toHaveBeenCalledWith(expect.stringContaining(config.database));
    });
  });

  describe(DatabaseService.prototype.doesDbExist.name, () => {
    describe('when the database does not exist', () => {
      beforeEach(() => {
        psqlMock.exec.mockReturnValue('0');
      });

      it('returns false', () => {
        expect(svc.doesDbExist()).toEqual(false);
      });
    });

    describe('when the database does exist', () => {
      beforeEach(() => {
        psqlMock.exec.mockReturnValue('1');
      });

      it('returns true', () => {
        expect(svc.doesDbExist()).toEqual(true);
      });
    });
  });
});
