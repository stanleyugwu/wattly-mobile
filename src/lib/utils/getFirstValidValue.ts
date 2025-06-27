/**
 * Returns first truthy argument that's not "N/A"
 */
export const getFirstValidValue = (...args: any[]) => {
  for (let a of args) if (a && a != "N/A") return a;
};
