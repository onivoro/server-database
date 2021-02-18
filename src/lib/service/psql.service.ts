import { Inject, Injectable } from '@nestjs/common';
import { spawnSync } from 'child_process';
import { DatabaseConfig } from '../database.config';
import { spawnSyncInjectToken } from '../token/spawn-sync-inject-token';

@Injectable()
export class PsqlService {
  constructor(
    private readonly config: DatabaseConfig,
    @Inject(spawnSyncInjectToken) private readonly spawnPsqlSync?: typeof spawnSync
  ) {}

  exec(cmd: string, db?: string) {
    const dbOptions = db ? ['-d', db] : [];
    const commonArgs = ['-qtAX', '-U', this.config.username, ...dbOptions, '-c', cmd];
    const binaryRunner = this.spawnPsqlSync || spawnSync;
    const binaryName = 'psql';
    const process = this.config.container
      ? binaryRunner('docker', ['exec', this.config.container, binaryName, ...commonArgs])
      : binaryRunner(binaryName, commonArgs);

    return process.stdout.toString();
  }
}
