export type JSONValue =
  | string
  | number
  | boolean
  | { [key: string]: JSONValue }
  | Array<JSONValue>;

export type StringableJSONValue =
  | string
  | number
  | boolean
  | { [key: string]: StringableJSONValue }
  | Array<StringableJSONValue>
  | undefined;

export function isPlainObject(value: any) {
  return value?.constructor === Object;
}

export type Undefinable<T> = {
  [P in keyof T]?: T[P] | undefined;
};

export type NonUndefinable<T> = {
  [P in keyof T]?: Exclude<T[P], undefined>;
};
