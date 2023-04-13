
export function checkIsIterable(value: any): boolean {
   return typeof value[Symbol.iterator] === 'function';
}