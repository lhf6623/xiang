export { makingChess } from './making-chess';
export { initMap } from './data';
export { isInCheck, isCheckmate, isStalemate, getSafeMoves } from './check';

import pkg from '../../package.json';

const { version, name } = pkg;
export const version_key = `${name}_${version}`.toLocaleUpperCase();

/**
 * 获取在区间内的数值
 * @param value
 * @param start
 * @param end
 * @returns
 */
export const getRange = (value: number, start: number, end?: number) => {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  if (start > end) {
    [start, end] = [end, start];
  }
  return Math.min(Math.max(value, start), end);
};
