import { Notice, type TFile } from 'obsidian';
import type { VersionButtonsConfig } from '../types/config';
import type { FrontmatterService } from '../services/FrontmatterService';

/** Renders the configured action buttons using Obsidian's theme-aware DOM APIs. */
export class VersionButtonRenderer {
  private readonly frontmatterService: FrontmatterService;

  public constructor(frontmatterService: FrontmatterService) {
    this.frontmatterService = frontmatterService;
  }

  /** Render the button bar into the provided processor container. */
  public render(container: HTMLElement, file: TFile, config: VersionButtonsConfig): void {
    if (!config.showButtons) return;

    const visibleComponents = config.components
      .map((component, index) => ({ component, index }))
      .filter(({ component }) => component.showButton);
    if (visibleComponents.length === 0) return;

    const bar = container.createDiv({ cls: 'version-buttons-bar' });
    for (const { component, index } of visibleComponents) {
      const button = bar.createEl('button', {
        text: component.name,
        cls: 'version-buttons-button clickable-icon',
        attr: { type: 'button', 'aria-label': `Increment ${component.name}` },
      });
      button.addEventListener('click', () => {
        void this.handleClick(button, file, config, index);
      });
    }
  }

  private async handleClick(
    button: HTMLButtonElement,
    file: TFile,
    config: VersionButtonsConfig,
    componentIndex: number,
  ): Promise<void> {
    button.disabled = true;
    try {
      const version = await this.frontmatterService.increment(file, config, componentIndex);
      new Notice(`${config.property}: ${version}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
      new Notice(`Version Buttons: ${message}`);
    } finally {
      button.disabled = false;
    }
  }
}
