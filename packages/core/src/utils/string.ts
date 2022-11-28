export function toCamelCase(str: string) {
  return str
    .toLowerCase()
    .replace(/[-_][a-z]/g, (group) => group.slice(-1).toUpperCase());
}

export function toSnakeCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
}
