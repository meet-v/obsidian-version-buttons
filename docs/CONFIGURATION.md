# Configuration reference

The plugin reads exactly one `version-buttons` fenced code block per note. Put it directly after YAML frontmatter so the rendered controls appear immediately below Obsidian's Properties section in Reading View.

## Schema

```json
{
  "digits": 3,
  "property": "version",
  "initialVersion": "1.0.0",
  "showButtons": true,
  "components": [
    { "name": "Major", "showButton": true, "enableCommand": true },
    { "name": "Minor", "showButton": true, "enableCommand": true },
    { "name": "Patch", "showButton": true, "enableCommand": true }
  ]
}
```

| Field | Required | Description |
|---|---:|---|
| `digits` | Yes | Version precision: `1`, `2`, or `3`. |
| `property` | No | Simple frontmatter property key to update. Defaults to `version`. |
| `initialVersion` | No | Starting version used when the property is missing. Defaults to `1`, `1.0`, or `1.0.0` according to precision. |
| `showButtons` | No | Shows/hides the complete button bar. Defaults to `true`. Does not disable commands. |
| `components` | Yes | Exactly `digits` component objects, in major/minor/patch order. |
| `components[].name` | Yes | Button label; 1–60 non-whitespace characters. |
| `components[].showButton` | No | Shows that component's button when the bar is visible. Defaults to `true`. |
| `components[].enableCommand` | No | Enables that component's native command. Defaults to `true`. |

## Precision examples

### One component

```json
{
  "digits": 1,
  "components": [
    { "name": "Revision", "showButton": true, "enableCommand": true }
  ]
}
```

The first component maps to the Major command. The configured name is the button label; native command names remain stable.

### Two components

```json
{
  "digits": 2,
  "property": "revision",
  "initialVersion": "1.0",
  "showButtons": true,
  "components": [
    { "name": "Document", "showButton": true, "enableCommand": true },
    { "name": "Review", "showButton": false, "enableCommand": true }
  ]
}
```

The first component maps to Major and the second to Minor. Patch is unavailable for this note.

### Hide all buttons but keep commands

Set `showButtons` to `false`. The code block produces no visible UI, but enabled commands continue to work from the active note.

## Increment rules

| Action | Before | After |
|---|---|---|
| Major | `1.4.8` | `2.0.0` |
| Minor | `1.4.8` | `1.5.0` |
| Patch | `1.4.8` | `1.4.9` |

For two-component versions, Major resets the second component and Minor increments the second. For one-component versions, Major increments the only component.

When a property is absent, the plugin first uses `initialVersion` and then applies the requested increment. For example, a missing `version` with `initialVersion: "1.0.0"` becomes `2.0.0` after a Major action.

## Validation

- `digits` must be the integer `1`, `2`, or `3`.
- `components` must contain exactly the configured number of entries.
- `property` must match `^[A-Za-z_][A-Za-z0-9_-]*$`.
- Versions must contain exactly the configured number of dot-separated non-negative integers.
- Numeric components must be JavaScript safe integers.
- Invalid existing values are rejected; they are not silently reset or overwritten.
- Exactly one configuration block is allowed in a note.
