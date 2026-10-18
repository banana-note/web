import { getExtensionField, type AnyExtension } from '@tiptap/core'

/**
 * 把内核默认集和扩展贡献的清单拼成一个扁平有序数组,并**按名字摘除被覆盖的内置项**
 * (`contributed` 那一组赢)。schema 合成到此为止,`Schema` 由 tiptap 自己建。
 *
 * 不用 tiptap 的 `priority` 决胜(实测方向与直觉相反),也不用数组顺序(隐式契约)。
 * 理由与已知的静默失败点(两个覆盖方同名时后者静默赢)见 ADR-0003。
 */
export function composeExtensions(
  builtins: readonly AnyExtension[],
  contributed: readonly AnyExtension[],
): AnyExtension[] {
  const overridden = new Set(contributed.map((extension) => getExtensionField(extension, 'name')))

  return [
    ...builtins.filter((extension) => !overridden.has(getExtensionField(extension, 'name'))),
    ...contributed,
  ]
}
