export function deepFreeze<T>(obj: T) {
  const propNames = Object.getOwnPropertyNames(obj);
  
  for (const name of propNames) {
    const value = obj[name as keyof T];

    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }

  return Object.freeze(obj);
}
