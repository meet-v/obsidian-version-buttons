import { CODE_BLOCK_LANGUAGE } from '../constants';

interface FenceState {
  readonly marker: '`' | '~';
  readonly length: number;
  readonly isTarget: boolean;
  readonly content: string[];
}

/** Extract exactly one top-level version-buttons fenced block from Markdown source. */
export function extractConfigurationBlock(markdown: string): string {
  const lines = markdown.split(/\r?\n/);
  const matches: string[] = [];
  let fence: FenceState | undefined;

  for (const line of lines) {
    if (fence === undefined) {
      const opening = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
      if (!opening) continue;

      const markerGroup = opening[1];
      const info = opening[2]?.trim() ?? '';
      if (markerGroup === undefined) continue;
      const marker = markerGroup.startsWith('`') ? '`' : '~';
      const infoLanguage = info.split(/\s+/, 1)[0] ?? '';
      fence = {
        marker,
        length: markerGroup.length,
        isTarget: infoLanguage === CODE_BLOCK_LANGUAGE,
        content: [],
      };
      continue;
    }

    const closing = new RegExp(`^ {0,3}${fence.marker === '`' ? '`' : '~'}{${fence.length},}[ \\t]*$`);
    if (closing.test(line)) {
      if (fence.isTarget) matches.push(fence.content.join('\n'));
      fence = undefined;
      continue;
    }

    if (fence.isTarget) fence.content.push(line);
  }

  if (matches.length === 0) {
    throw new Error('This note has no version-buttons configuration block.');
  }
  if (matches.length > 1) {
    throw new Error('This note contains more than one version-buttons block. Keep exactly one.');
  }
  return matches[0] ?? '';
}
