/**
 * 当前代码所理解的 schema 版本。
 *
 * 尚未正式发布；bold/italic/strike/code marks 与正文 heading(level 1–6) 保持版本 2，
 * 见 docs/design/heading.md 与 docs/changes/003-inline-marks/README.md。
 * 首次正式发布前确认版本基线与后续兼容策略，当前不提供迁移流程。
 *
 * 版本历史:
 *
 * - `1` — 只有 `doc > paragraph > text`
 * - `2` — 新增 `title` 节点,`doc` 的 content 从 `block+` 改为 `(title block*) | block+`
 */
export const CODE_SCHEMA_VERSION = 2
