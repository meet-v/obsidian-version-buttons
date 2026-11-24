# Development notes

## Structure

```text
src/
├── main.ts
├── constants.ts
├── core/VersionButtonsPlugin.ts
├── commands/VersionCommands.ts
├── processors/VersionBlockProcessor.ts
├── services/
│   ├── ConfigurationService.ts
│   ├── FrontmatterService.ts
│   └── VersionService.ts
├── ui/VersionButtonRenderer.ts
├── types/config.ts
└── utils/
    ├── guards.ts
    └── MarkdownConfig.ts
```

- `ConfigurationService` parses untrusted JSON as `unknown` and validates it before use.
- `VersionService` contains pure version arithmetic.
- `FrontmatterService` uses `app.fileManager.processFrontMatter()` and serializes concurrent updates per note/property.
- `VersionButtonRenderer` owns button DOM and click handling.
- `VersionBlockProcessor` binds the public Markdown processor API to the renderer.
- `VersionCommands` reads the current active Markdown editor source, so commands do not depend on rendered controls.
- `VersionButtonsPlugin` is the composition root and lifecycle owner.

## API and safety decisions

- No Dataview dependency.
- No access to Obsidian's internal Properties DOM.
- No `innerHTML`, `eval`, global `app`, or default hotkeys.
- Frontmatter is modified through Obsidian's `FileManager.processFrontMatter()` API.
- Code-block output uses Obsidian's DOM creation helpers and theme CSS variables.
- Configuration is validated before it is used for rendering or mutation.

## Rendering roadmap

The current release uses `registerMarkdownCodeBlockProcessor()` for Reading View. Live Preview requires a CodeMirror 6 editor extension registered through Obsidian's editor-extension API. That extension should reuse the configuration, version, frontmatter, and renderer services rather than introduce a second versioning implementation. It is intentionally not included until it can be implemented and tested independently.

## Testing checklist

- [ ] One-, two-, and three-component configurations.
- [ ] Each component's button and command flags independently.
- [ ] `showButtons: false` with commands enabled.
- [ ] Missing frontmatter property and configured initial value.
- [ ] Valid and invalid existing frontmatter values.
- [ ] Major/minor reset semantics.
- [ ] Duplicate or malformed code blocks.
- [ ] Repeated clicks and command/button overlap.
- [ ] Reading View on desktop and mobile.
- [ ] Commands in Source mode.
