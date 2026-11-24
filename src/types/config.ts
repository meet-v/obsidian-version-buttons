export type VersionPrecision = 1 | 2 | 3;

export interface VersionComponentConfig {
  readonly name: string;
  readonly showButton: boolean;
  readonly enableCommand: boolean;
}

export interface VersionButtonsConfig {
  readonly digits: VersionPrecision;
  readonly property: string;
  readonly initialVersion: string;
  readonly showButtons: boolean;
  readonly components: readonly VersionComponentConfig[];
}

export interface ParsedVersion {
  readonly components: readonly number[];
}
