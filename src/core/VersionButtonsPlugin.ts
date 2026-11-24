import { Plugin } from 'obsidian';
import { VersionCommands } from '../commands/VersionCommands';
import { CODE_BLOCK_LANGUAGE } from '../constants';
import { VersionBlockProcessor } from '../processors/VersionBlockProcessor';
import { ConfigurationService } from '../services/ConfigurationService';
import { FrontmatterService } from '../services/FrontmatterService';
import { VersionButtonRenderer } from '../ui/VersionButtonRenderer';

/** Plugin composition root and Obsidian lifecycle owner. */
export default class VersionButtonsPlugin extends Plugin {
  public override onload(): void {
    const configurationService = new ConfigurationService();
    const frontmatterService = new FrontmatterService(this.app);
    const renderer = new VersionButtonRenderer(frontmatterService);
    const processor = new VersionBlockProcessor(this.app, configurationService, renderer);
    const commands = new VersionCommands(this, configurationService, frontmatterService);

    this.registerMarkdownCodeBlockProcessor(CODE_BLOCK_LANGUAGE, processor.process);
    commands.register();
  }
}
