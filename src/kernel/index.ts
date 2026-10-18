/**
 * 内核的公开出口。外部只从这里 import,不深链到内部模块(依赖方向与违规后果见
 * docs/architecture/web.md)。这里不允许出现任何 React(ADR-0002)。
 */
export { Doc, Paragraph, Text } from './schema/nodes'
export { composeExtensions } from './schema/composeExtensions'
export { KERNEL_BUILTIN_EXTENSIONS } from './editor/builtins'
export { EmptyBlockMarker } from './editor/emptyBlockMarker'
export { buildEditorOptions } from './editor/buildEditorOptions'
export { toggleInlineMark } from './editor/toggleInlineMark'
export type { BuildEditorOptionsInput } from './editor/buildEditorOptions'
export { CODE_SCHEMA_VERSION } from './storage/schemaVersion'
export type { Note, NoteStore } from './storage/NoteStore'
