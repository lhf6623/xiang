/* 二维数组都遵循 [x, y] 的规则 */

/**
 * 直线 上，左，下，右  车 跑 将 兵 卒 马脚
 */
export const lineRule: number[][] = [
  [0, -1],
  [-1, 0],
  [0, 1],
  [1, 0],
];
/**
 * ma 移动规则 八个位子 上[上左][上右]，左[左上][左下]，
 * 下[下左][下右]，右[右上][右下] ma 脚对应 lineRule
 */
export const maRule: number[][] = [
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
export const jiangSeat: number[] = [
  3, 4, 5, 12, 13, 14, 21, 22, 23, 66, 67, 68, 75, 76, 77, 84, 85, 86,
];
/**
 * xiang 移动规则
 */
export const xiangRule: number[][] = [
  [-2, -2],
  [2, -2],
  [-2, 2],
  [2, 2],
];
/**
 * xiang 脚对应 xiangRule
 */
export const xiangJiaoRule: number[][] = [
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
];
/**
 * shi 可移动位置
 */
export const shiSeat: number[] = [3, 5, 13, 21, 23, 66, 68, 76, 84, 86];
/**
 * shi 移动规则
 */
export const shiRule: number[][] = [
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
];
