import ogDeepmerge from "deepmerge";

export function deepmerge<T>(source1: Partial<T>, source2: Partial<T>) {
  return ogDeepmerge<T>(source1, source2, {
    arrayMerge,
  });
}

function arrayMerge<T>(source1: T[], source2: T[]) {
  return [...new Set([...source1, ...source2])];
}
