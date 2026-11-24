import { DEFAULT_VERSION_PROPERTY } from '../constants';
import type {
  VersionButtonsConfig,
  VersionComponentConfig,
  VersionPrecision,
} from '../types/config';
import { isRecord } from '../utils/guards';
import { VersionService } from './VersionService';

/** Parses and validates the JSON stored in a version-buttons block. */
export class ConfigurationService {
  /** Parse JSON and normalize optional configuration fields. */
  public parse(source: string): VersionButtonsConfig {
    let raw: unknown;
    try {
      raw = JSON.parse(source) as unknown;
    } catch {
      throw new Error('Configuration is not valid JSON.');
    }

    if (!isRecord(raw)) {
      throw new Error('Configuration must be a JSON object.');
    }

    const digits = raw.digits;
    if (digits !== 1 && digits !== 2 && digits !== 3) {
      throw new Error('"digits" must be 1, 2, or 3.');
    }
    const precision: VersionPrecision = digits;

    const property = raw.property === undefined ? DEFAULT_VERSION_PROPERTY : raw.property;
    if (typeof property !== 'string' || !/^[A-Za-z_][A-Za-z0-9_-]*$/.test(property)) {
      throw new Error('"property" must be a simple frontmatter key.');
    }

    const initialVersion = raw.initialVersion === undefined
      ? Array.from({ length: precision }, (_, index) => index === 0 ? '1' : '0').join('.')
      : raw.initialVersion;
    if (typeof initialVersion !== 'string') {
      throw new Error('"initialVersion" must be a version string.');
    }
    VersionService.parse(initialVersion, precision);

    const showButtons = raw.showButtons === undefined ? true : raw.showButtons;
    if (typeof showButtons !== 'boolean') {
      throw new Error('"showButtons" must be a boolean.');
    }

    if (!Array.isArray(raw.components) || raw.components.length !== precision) {
      throw new Error(`"components" must contain exactly ${precision} item(s).`);
    }

    const components: VersionComponentConfig[] = raw.components.map((item: unknown, index: number) => {
      if (!isRecord(item)) {
        throw new Error(`Component ${index + 1} must be an object.`);
      }
      const name = item.name;
      const showButton = item.showButton === undefined ? true : item.showButton;
      const enableCommand = item.enableCommand === undefined ? true : item.enableCommand;
      if (typeof name !== 'string' || name.trim().length === 0 || name.length > 60) {
        throw new Error(`Component ${index + 1} must have a name of 1–60 characters.`);
      }
      if (typeof showButton !== 'boolean' || typeof enableCommand !== 'boolean') {
        throw new Error(`Component ${index + 1} has an invalid showButton or enableCommand value.`);
      }
      return { name: name.trim(), showButton, enableCommand };
    });

    return { digits: precision, property, initialVersion, showButtons, components };
  }
}
