import { Notice, TFile, type App, type MarkdownPostProcessorContext } from 'obsidian';
import type { ConfigurationService } from '../services/ConfigurationService';
import type { VersionButtonRenderer } from '../ui/VersionButtonRenderer';

/** Connects the version-buttons fenced block to the shared renderer in Reading View. */
export class VersionBlockProcessor {
  private readonly app: App;
  private readonly configurationService: ConfigurationService;
  private readonly renderer: VersionButtonRenderer;

  public constructor(
    app: App,
    configurationService: ConfigurationService,
    renderer: VersionButtonRenderer,
  ) {
    this.app = app;
    this.configurationService = configurationService;
    this.renderer = renderer;
  }

  /** Process one fenced block. Register this method with registerMarkdownCodeBlockProcessor. */
  public process = (source: string, element: HTMLElement, context: MarkdownPostProcessorContext): void => {
    try {
      const config = this.configurationService.parse(source);
      if (!config.showButtons) return;

      const abstractFile = this.app.vault.getAbstractFileByPath(context.sourcePath);
      if (!(abstractFile instanceof TFile)) {
        throw new Error('The source note could not be resolved.');
      }
      this.renderer.render(element, abstractFile, config);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Invalid configuration.';
      element.createEl('p', { text: `Version Buttons: ${message}`, cls: 'version-buttons-error' });
      new Notice(`Version Buttons: ${message}`);
    }
  };
}
