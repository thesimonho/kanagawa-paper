---
agent:
  instruction: Preserve these baselines and their documented behavior differences; do not refresh them to make a regression pass.
  on-change: tests/fixtures/**
---

# Regression fixtures

These fixtures capture reference Lua behavior and generated application output:

- `colors.json`: all 140 palette names/hexes and 141 default roles in each variant.
- `math.json`: 840 outputs from the original Lua color helper.
- `artifacts.json`: SHA-256 of 39 extras and two VS Code theme JSON files.
- `runtime.json`: hashes of sorted JSON snapshots from `tests/neovim/runtime_snapshot.lua`, covering both variants with defaults, palette/role/callback overrides, and color balance.

The runtime fixture records the theme's calculated groups, not editor-version-specific builtin highlights. Fixtures are verification evidence, not source inputs. Change an expectation only when the intended behavior changes, and document the difference.

UI emphasis shares the primary accent. Ink's `ui.special` changes from `#8ea49e` to `#658594`; Canvas stays unchanged. The color fixture, three Ink runtime hashes, and Ink artifact hashes for VS Code, fzf, Lazygit and WezTerm include this change. Palette values, syntax special roles and independent public overrides remain intact.

Nushell `shape_garbage` resolves its foreground from `ui.text.secondary` (legacy `ui.fg_dim`), and Zellij resolves its three header metadata fields. The four affected Ink/Canvas artifact hashes include these resolved values.

VS Code line-number colors use the dedicated shared roles: Ink `#54546D`/`#c4b28a` and Canvas `#92928b`/`#6c828c` for normal/active numbers. The two VS Code artifact hashes include these values. Neovim's original role and runtime comparisons omit the additive `ui.line_numbers` fields, which have separate default, palette, and override checks; existing highlight snapshots remain unchanged.

VS Code diagnostic info/hint colors, matched-bracket foreground, inlay background, and status-bar foreground use the corresponding Neovim roles. The VS Code artifact hashes include those mappings. Zed's special punctuation and built-in variables use the symbol and constant colors, respectively.

VS Code editor and terminal selections use the opaque shared selection color. Hover backgrounds use the floating-window surface. Both VS Code artifact hashes include these values; occurrence and other-search highlights retain their separate transparency.

Neovim runtime snapshots use the dedicated indent-scope color for `IblScope`, `IndentBlanklineContextChar`, and `IndentBlanklineContextStart`, matching Snacks. Ordinary guide colors and the legacy context underline style remain unchanged.

Mini.hipatterns NOTE/TODO backgrounds match the corresponding Tree-sitter comment captures. nvim-cmp completion borders and thumbs use the same menu roles as Blink. Tree-sitter context line numbers consume the dedicated default line-number role while retaining the context background. Runtime hashes include the comment and completion color changes; default context line-number colors remain unchanged.

Active indent defaults match the ordinary guide colors used by Mini: Ink `#363646`, Canvas `#d1cfc5`. The color fixture, runtime hashes, and VS Code artifact hashes include these defaults. Mini.indentscope consumes the active scope role, matching Snacks and indent-blankline while preserving independent ordinary-guide overrides.

Blink and nvim-cmp scrollbar tracks use the dedicated menu track background. Blink signature-help borders link to `FloatBorder`, matching its documentation popup. Runtime hashes include these highlight changes.

Neo-tree directory names and icons link to `Directory`, matching Nvim-tree and Mini. Mini picker match ranges link to `Search`, matching Snacks. Runtime hashes include these link changes.

Scrollview TODO markers link to `DiagnosticSignInfo`; XXX markers link to `DiagnosticSignHint`, matching Tree-sitter comment semantics. Runtime hashes include these link changes.

Floaterm border backgrounds follow `FloatBorder`; Mini's active signature parameter follows `LspSignatureActiveParameter`. Runtime hashes include those changes. VS Code hover borders use the floating-border foreground, and active list selections use the alternate current-line background shared by Neovim pickers; VS Code artifact hashes include both changes.

Built-in function, tag, and selector roles are additive shared semantics; the color fixture includes their Neovim projections. Runtime hashes include shared bold function/type defaults, italic Tree-sitter comments, parser-style built-in functions, the selected completion/tree/debugger/icon treatments, rainbow headings on the p1 surface, and the editor-background foreground for legacy TODO markers. The three Mini icon changes use the selected error, warning, and terminal-magenta colors; other icon families remain unchanged. VS Code artifact hashes include the floating Quick Open surface/text, picker focus surface, conflict error color, parser-style built-ins and markup tags, and bold string escapes. Zed uses those shared syntax colors/styles, type-colored CSS selectors, and error severity for conflicts.

Telescope field results link to `@variable.member`, and Grug-far command headers link to `@markup.link.url`. Runtime hashes include these current capture links.

VS Code maps generic import/declaration scopes, modules, built-in types and variables, booleans, and builtin-qualified semantic tokens to Neovim’s corresponding roles and emphasis. The two VS Code artifact hashes include these selector changes. Broad builtin constants retain fallback styling because some providers use the same classification for booleans and null values. Built-in variable italics use specific scopes: grammars can classify both a receiver value and a type such as Rust `Self` under `variable.language.self`. Neovim colors and runtime hashes remain unchanged.

VS Code semantic variables marked `classMember` use the member foreground, including declarations; readonly class members retain the constant foreground. Parameter declarations and definitions inherit the base parameter role so custom subtypes retain their own foregrounds. Both VS Code artifact hashes include these general selectors.

VS Code import `from` and `export` scopes and storage types inside variable-declaration expressions use keyword roles. Semantic properties use Neovim’s LSP property/Identifier color; property accesses without semantic tokens use the Tree-sitter member color. Readonly properties retain the constant role. Both VS Code artifact hashes include these mappings.

VS Code semantic static variables use the shared constant foreground, matching Neovim. Both VS Code artifact hashes include this mapping.

Zed structural and focused borders use the shared m3 surface tone. The Zed theme artifact hash includes this mapping.

Canvas active line numbers use canvasBlue1 across targets; Ink retains dragonYellow. Canvas runtime and VS Code hashes include this change.

Zed keyword.import captures use the shared preprocessor foreground instead of falling back to the ordinary keyword style.

Zed gutter backgrounds match the editor surface, corresponding to Neovim default gutter=false and VS Code. The dedicated shared gutter role remains available to Neovim gutter=true.

Named text-style policy supplies syntax, markup, and UI emphasis. Comments and documentation/docstrings are italic; deprecated text uses strikethrough where supported. Structural function names, calls, declaration names, and control flow are bold; supporting data and general type references remain plain. Neovim runtime and VS Code artifact hashes include these intentional style changes; colors are unchanged. VS Code retains whole-style replacement semantics for base tokens, with style-only deprecated overlays that outrank those resets. Its built-in member reset uses equivalent explicit false attributes.

Zed emits normal weight/style for disabled attributes and accepts disabled unsupported decorations without extra fields. Documentation styles are italic; strikethrough remains unsupported by the pinned theme format. Bundled Lualine inactive sections consume the shared inactiveStatusline role. Diagnostic and spelling decorations remain separate.

Structural bold adds parser call/definition captures and style-only semantic declaration/definition modifiers. Generic function tokens use a bold fallback; semantic keywords in Neovim leave parser control-flow emphasis intact. Existing color values are unchanged. The six runtime and two VS Code artifact hashes include this style-only change.
