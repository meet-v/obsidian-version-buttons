import { MarkdownView, Notice, type Plugin } from 'obsidian';
import { COMMAND_COMPONENTS } from '../constants';
import type { ConfigurationService } from '../services/ConfigurationService';
import type { FrontmatterService } from '../services/FrontmatterService';
import { extractConfigurationBlock } from '../utils/MarkdownConfig';

/** Registers contextual major, minor, and patch commands. */
export class VersionCommands {
  private readonly plugin: Plugin;
  private readonly configurationService: ConfigurationService;
  private readonly frontmatterService: FrontmatterService;

  public constructor(
    plugin: Plugin,
    configurationService: ConfigurationService,
    frontmatterService: FrontmatterService,
  ) {
    this.plugin = plugin;
    this.configurationService = configurationService;
    this.frontmatterService = frontmatterService;
  }

  /** Register commands without default hotkeys; users assign shortcuts in Obsidian settings. */
  public register(): void {
    for (const command of COMMAND_COMPONENTS) {
      this.plugin.addCommand({
        id: `increment-${command.id}`,
        name: `Increment ${command.name} version component`,
        callback: () => {
          void this.execute(command.index, command.name);
        },
      });
    }
  }

  private async execute(componentIndex: number, commandName: string): Promise<void> {
    const view = this.plugin.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view?.file) {
      new Notice('Version buttons: Open a Markdown note first.');
      return;
    }

    try {
      const block = extractConfigurationBlock(view.editor.getValue());
      const config = this.configurationService.parse(block);
      if (componentIndex >= config.digits) {
        throw new Error(`This note does not define a ${commandName} component.`);
      }
      const component = config.components[componentIndex];
      if (!component?.enableCommand) {
        throw new Error(`The ${commandName} command is disabled for this note.`);
      }
      const version = await this.frontmatterService.increment(view.file, config, componentIndex);
      new Notice(`${config.property}: ${version}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
      new Notice(`Version Buttons: ${message}`);
    }
  }
}
