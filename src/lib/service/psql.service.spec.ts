import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { DatabaseConfig } from '../database.config';
import { spawnSyncMock } from '../support/spawn-sync.mock';
import { PsqlService } from './psql.service';

describe(PsqlService.name, () => {
  let subject: PsqlService;
  let cmd: string;
  let actualOutput: string;
  let stdout: string;
  let config: DatabaseConfig;

  beforeEach(() => {
    config = new DatabaseConfig([], []);
    cmd = randomStringGenerator();
    stdout = randomStringGenerator();
    spawnSyncMock.mockReturnValue({ stdout });
  });

  describe(PsqlService.prototype.exec.name, () => {
    describe('when a container is specified', () => {
      beforeEach(() => {
        subject = new PsqlService(config, spawnSyncMock);
      });

      beforeEach(() => {
        actualOutput = subject.exec(cmd, config.database);
      });

      it('invokes psql with the specified command', () => {
        const expectedArgs = ['exec', config.container, 'psql', '-qtAX', '-U', config.username, '-d', config.database, '-c', cmd];
        expect(spawnSyncMock).toHaveBeenCalledWith('docker', expectedArgs);
      });

      it('returns the commands stdout', () => {
        expect(actualOutput).toEqual(stdout);
      });
    });

    describe('when a container is not specified', () => {
      beforeEach(() => {
        subject = new PsqlService(Object.assign({}, config, {container: ''}) as DatabaseConfig, spawnSyncMock);
      });

      beforeEach(() => {
        actualOutput = subject.exec(cmd, config.database);
      });

      it('invokes psql with the specified command', () => {
        const expectedArgs = ['-qtAX', '-U', config.username, '-d', config.database, '-c', cmd];
        expect(spawnSyncMock).toHaveBeenCalledWith('psql', expectedArgs);
      });

      it('returns the commands stdout', () => {
        expect(actualOutput).toEqual(stdout);
      });
    });
  });
});
