import type { ParsedVersion, VersionPrecision } from '../types/config';

/** Pure version parsing and increment operations. */
export class VersionService {
  /** Parse a dot-separated non-negative integer version of the requested precision. */
  public static parse(value: string, precision: VersionPrecision): ParsedVersion {
    const parts = value.split('.');
    if (parts.length !== precision || parts.some((part) => !/^\d+$/.test(part))) {
      throw new Error(`Version must contain exactly ${precision} numeric component(s), separated by dots.`);
    }
    const components = parts.map((part) => Number(part));
    if (components.some((part) => !Number.isSafeInteger(part) || part < 0)) {
      throw new Error('Version components must be non-negative safe integers.');
    }
    return { components };
  }

  /** Increment one component and reset all less-significant components to zero. */
  public static increment(value: string, precision: VersionPrecision, componentIndex: number): string {
    if (!Number.isInteger(componentIndex) || componentIndex < 0 || componentIndex >= precision) {
      throw new Error('The requested version component is not configured for this note.');
    }
    const parsed = VersionService.parse(value, precision);
    const components = [...parsed.components];
    const current = components[componentIndex];
    if (current === undefined || current >= Number.MAX_SAFE_INTEGER) {
      throw new Error('Version component cannot be incremented safely.');
    }
    components[componentIndex] = current + 1;
    for (let index = componentIndex + 1; index < precision; index += 1) {
      components[index] = 0;
    }
    return components.join('.');
  }
}
