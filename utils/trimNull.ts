import { isNil } from "lodash";

export function trimNull(str: string): string;
export function trimNull(str: null): null;
export function trimNull(str: undefined): undefined;
export function trimNull(str: string | null | undefined) {
  if (isNil(str)) return str;
  return str.replace(/\0/g, "");
}
