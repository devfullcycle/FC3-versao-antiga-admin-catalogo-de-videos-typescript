export function deepFreeze<T>(obj: T) {
  try {
    const propNames = Object.getOwnPropertyNames(obj);

    for (const name of propNames) {
      const value = obj[name as keyof T];

      if (value && typeof value === "object") {
        deepFreeze(value);
      }
    }

    return Object.freeze(obj);
  } catch (e) {
    return obj;
  }
}
