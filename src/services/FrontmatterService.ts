import type { App, TFile } from 'obsidian';
import type { VersionButtonsConfig } from '../types/config';
import { VersionService } from './VersionService';

/** Performs serialized, atomic updates to the configured frontmatter property. */
export class FrontmatterService {
  private readonly app: App;
  private readonly inFlight = new Set<string>();

  public constructor(app: App) {
    this.app = app;
  }

  /** Increment a configured version component and return the resulting version string. */
  public async increment(
    file: TFile,
    config: VersionButtonsConfig,
    componentIndex: number,
  ): Promise<string> {
    const lockKey = `${file.path}::${config.property}`;
    if (this.inFlight.has(lockKey)) {
      throw new Error('A version update is already in progress for this note.');
    }

    this.inFlight.add(lockKey);
    let updatedVersion = '';
    try {
      await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
        const currentValue: unknown = frontmatter[config.property];
        let currentVersion: string;

        if (currentValue === undefined || currentValue === null || currentValue === '') {
          currentVersion = config.initialVersion;
        } else if (typeof currentValue === 'string') {
          currentVersion = currentValue;
        } else if (typeof currentValue === 'number' && config.digits === 1 && Number.isSafeInteger(currentValue)) {
          currentVersion = String(currentValue);
        } else {
          throw new Error(`Frontmatter property "${config.property}" must be a version string.`);
        }

        updatedVersion = VersionService.increment(currentVersion, config.digits, componentIndex);
        frontmatter[config.property] = config.digits === 1 ? Number(updatedVersion) : updatedVersion;
      });
      return updatedVersion;
    } finally {
      this.inFlight.delete(lockKey);
    }
  }
}
