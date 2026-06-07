import {
  lineRule,
  maRule,
  jiangSeat,
  xiangRule,
  xiangJiaoRule,
  shiRule,
  shiSeat,
} from './run-rule-data';
import {
  indexToXY,
  isInMap,
  isPass,
  getIndex,
  isNULL,
  isBLACK,
  isRED,
  isAcrossRiver,
} from './data';
// 找出这个棋子下一步的所有可能位置
export const run_rule: RunRule = {
  che: (map, { index: pieceIndex, type: pieceType }) => {
    const { x, y } = indexToXY(pieceIndex);
    return lineRule.flatMap(([col, row]) => {
      const result: number[] = [];
      for (let i = 1; ; i++) {
        const _x = x + i * col;
        const _y = y + i * row;
        const index = getIndex(_y, _x);
        if (!isInMap(_x, _y) || map[index]?.type === pieceType) break;
        result.push(index);
        if (!isNULL(map[index])) break;
      }
      return result;
    });
  },
  pao(map, { type, index }) {
    const { x, y } = indexToXY(index);
    return lineRule.flatMap(([col, row]) => {
      let obstacle = 0; // 障碍物，长度等于两个停止循环
      const result: number[] = [];
      for (let i = 1; ; i++) {
        const _x = x + i * col;
        const _y = y + i * row;
        if (!isInMap(_x, _y)) break;

        const index = getIndex(_y, _x);
        if (obstacle === 0 && isNULL(map[index])) {
          result.push(index);
        } else if (!isNULL(map[index])) {
          obstacle += 1;
          if (obstacle === 2) {
            if (map[index]?.type !== type) result.push(index);
            break;
          }
        }
      }
      return result;
    });
  },
  jiang(map, { type, index }) {
    const { x, y } = indexToXY(index);
    return lineRule.flatMap(([col, row]) => {
      const _x = x + col;
      const _y = y + row;
      if (!isInMap(_x, _y)) return [];
      const index = getIndex(_y, _x);
      if (jiangSeat.includes(index) && isPass(map, index, type)) {
        return [index];
      }
      return [];
    });
  },
  ma(map, { type, index }) {
    const { x, y } = indexToXY(index);
    return maRule.flatMap(([col, row], i) => {
      const _x = x + col;
      const _y = y + row;
      const index = getIndex(_y, _x);
      // 马脚
      const [bX, bY] = lineRule[Math.ceil((i + 1) / 2) - 1];
      const bIndex = getIndex(y + bY, x + bX);
      if (isInMap(_x, _y) && isNULL(map[bIndex]) && isPass(map, index, type)) {
        return [index];
      }
      return [];
    });
  },
  xiang(map, { type, index }) {
    const { x, y } = indexToXY(index);
    // 不能过河
    return xiangRule.flatMap(([col, row], i) => {
      const _col = x + col;
      const _row = y + row;
      if (!isInMap(_col, _row)) return [];

      const index = getIndex(_row, _col);
      // 象脚
      const [bX, bY] = xiangJiaoRule[i];
      const bIndex = getIndex(y + bY, x + bX);

      if (
        isAcrossRiver(index, type) &&
        isNULL(map[bIndex]) &&
        isPass(map, index, type)
      ) {
        return [index];
      }
      return [];
    });
  },
  shi(map, { type, index }) {
    const { x, y } = indexToXY(index);
    return shiRule.flatMap(([col, row]) => {
      const _col = x + col;
      const _row = y + row;
      if (!isInMap(_col, _row)) return [];

      const index = getIndex(_row, _col);
      if (shiSeat.includes(index) && isPass(map, index, type)) {
        return [index];
      }
      return [];
    });
  },
  bing(map, { type, index }) {
    const result: number[] = [];
    const { x, y } = indexToXY(index);

    // 不能后退，过河之前不能左右移动
    for (const [col, row] of lineRule.values()) {
      const _col = x + col;
      const _row = y + row;
      const index = getIndex(_row, _col);
      if (!isInMap(_col, _row) || !isPass(map, index, type)) continue;
      // 小兵没过河之前不允许左右移动，不能后退，到底线时只能左右移动
      if (row === 0) {
        // 左右
        if (!isAcrossRiver(index, type)) {
          result.push(index);
        }
      } else {
        const typeFn = row > 0 ? isRED : isBLACK;
        if (!typeFn(type)) {
          result.push(index);
        }
      }
    }
    return result;
  },
};
