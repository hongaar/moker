export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

export function isPlainObject(value: any) {
  return value?.constructor === Object;
}
