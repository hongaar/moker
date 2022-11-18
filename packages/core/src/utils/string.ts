export function toCamelCase(str: string) {
  return str
    .toLowerCase()
    .replace(/[-_][a-z]/g, (group) => group.slice(-1).toUpperCase());
}
