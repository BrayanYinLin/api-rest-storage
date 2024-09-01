export function formatFields(element) {
  return Object.keys(element)
    .map((e) => `${e} = ?`)
    .join(', ')
}
