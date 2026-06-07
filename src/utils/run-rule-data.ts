/* 二维数组都遵循 [x, y] 的规则 */

import { xyToIndex } from './data';

/**
 * 直线 上，左，下，右  车 跑 将 兵 卒 马脚
 */
export const lineRule = [
  [0, -1],
  [-1, 0],
  [0, 1],
  [1, 0],
];
/**
 * ma 移动规则 八个位子 上[上左][上右]，左[左上][左下]，
 * 下[下左][下右]，右[右上][右下] ma 脚对应 lineRule
 */
export const maRule = [
  [-1, -2],
  [1, -2],
  [-2, -1],
  [-2, 1],
  [-1, 2],
  [1, 2],
  [2, -1],
  [2, 1],
];
/**
 * jiang 可移动位置
 */
export const jiangSeat = [
  [3, 0],
  [4, 0],
  [5, 0],
  [3, 1],
  [4, 1],
  [5, 1],
  [3, 2],
  [4, 2],
  [5, 2],
  [3, 7],
  [4, 7],
  [5, 7],
  [3, 8],
  [4, 8],
  [5, 8],
  [3, 9],
  [4, 9],
  [5, 9],
].map(([x, y]) => xyToIndex(x, y));

/**
 * xiang 移动规则
 */
export const xiangRule = [
  [-2, -2],
  [2, -2],
  [-2, 2],
  [2, 2],
];
/**
 * xiang 脚对应 xiangRule
 */
export const xiangJiaoRule = [
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
];
/**
 * shi 可移动位置
 */
export const shiSeat = [
  [3, 0],
  [5, 0],
  [4, 1],
  [3, 2],
  [5, 2],
  [3, 7],
  [5, 7],
  [4, 8],
  [3, 9],
  [5, 9],
].map(([x, y]) => xyToIndex(x, y));

/**
 * shi 移动规则
 */
export const shiRule = [
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
];
