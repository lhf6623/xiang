import { describe, it, expect } from 'vitest';
import {
  findGeneral,
  isInCheck,
  isMoveSafe,
  getSafeMoves,
  isCheckmate,
  isStalemate,
} from '@/utils/check';
import { RED, BLACK, NULL, COL, ROW, initMap } from '@/utils/data';

// ---- helpers ----

/** 创建空棋盘 */
const emptyMap = (): MapType => Array(COL * ROW).fill(NULL);

/** 快捷放置棋子 */
function put(
  map: MapType,
  code: PieceCodeType,
  type: PieceColorType,
  index: number
) {
  map[index] = { code, type, index, text: code as PieceTextType };
}

// ---- findGeneral ----

describe('findGeneral', () => {
  it('找到红帅的位置', () => {
    const map = emptyMap();
    put(map, 'jiang', RED, 85);
    expect(findGeneral(map, RED)).toBe(85);
  });

  it('找到黑将的位置', () => {
    const map = emptyMap();
    put(map, 'jiang', BLACK, 4);
    expect(findGeneral(map, BLACK)).toBe(4);
  });

  it('找不到时将返回 -1', () => {
    expect(findGeneral(emptyMap(), RED)).toBe(-1);
  });
});

// ---- isInCheck ----

describe('isInCheck', () => {
  it('对面笑：两将在同列且无遮拦时应检测到将军', () => {
    const map = emptyMap();
    put(map, 'jiang', RED, 4); // y=0, x=4
    put(map, 'jiang', BLACK, 67); // y=7, x=4
    expect(isInCheck(map, RED)).toBe(true);
    expect(isInCheck(map, BLACK)).toBe(true);
  });

  it('对面笑：同列但有棋子遮挡则不构成将军', () => {
    const map = emptyMap();
    put(map, 'jiang', RED, 4); // y=0, x=4
    put(map, 'jiang', BLACK, 67); // y=7, x=4
    // 用黑方棋子做遮挡，避免遮挡子本身攻击黑将
    put(map, 'bing', BLACK, 31); // y=3, x=4 在中间遮挡
    expect(isInCheck(map, RED)).toBe(false);
    expect(isInCheck(map, BLACK)).toBe(false);
  });

  it('不同列不构成对面笑', () => {
    const map = emptyMap();
    put(map, 'jiang', RED, 4);
    put(map, 'jiang', BLACK, 76); // y=8, x=4 → 不对，不同列
    // 改成不同列
    const map2 = emptyMap();
    put(map2, 'jiang', RED, 4); // x=4
    put(map2, 'jiang', BLACK, 68); // y=7, x=5
    expect(isInCheck(map2, RED)).toBe(false);
  });

  it('车将军：同列有车且无遮挡', () => {
    const map = emptyMap();
    put(map, 'jiang', RED, 4); // x=4
    put(map, 'che', BLACK, 40); // y=4, x=4 同列
    expect(isInCheck(map, RED)).toBe(true);
  });

  it('车将军：同行有车且无遮挡', () => {
    const map = emptyMap();
    put(map, 'jiang', RED, 4); // y=0, x=4
    put(map, 'che', BLACK, 7); // y=0, x=7 同行
    expect(isInCheck(map, RED)).toBe(true);
  });

  it('车被同列己方将遮挡不将军', () => {
    const map = emptyMap();
    put(map, 'jiang', RED, 4); // x=4
    put(map, 'jiang', BLACK, 22); // y=2, x=4 对方将
    put(map, 'che', BLACK, 58); // y=6, x=4 车在将后面
    // 对面笑已经构成将军了，所以换一种：用红方测
    const map2 = emptyMap();
    put(map2, 'jiang', BLACK, 4);
    put(map2, 'che', RED, 40); // 红车在黑将列上，中间有棋子
    put(map2, 'bing', BLACK, 22); // 黑卒在中间遮挡
    expect(isInCheck(map2, BLACK)).toBe(false);
  });

  it('马将军', () => {
    const map = emptyMap();
    put(map, 'jiang', RED, 85); // y=9, x=4
    // 黑马在 (3,7)=66，走马步 [1,2] 到 (4,9)=85
    // 马脚在 (3,8)=75，需为空
    put(map, 'ma', BLACK, 66);
    expect(isInCheck(map, RED)).toBe(true);
  });

  it('马被蹩脚时不能将军', () => {
    const map = emptyMap();
    put(map, 'jiang', RED, 85); // y=9, x=4
    // 黑马在 (3,7)=66，走马步 [1,2] 可到 (4,9)=85
    // 马脚在 (3,8)=75，放棋子蹩马脚
    put(map, 'ma', BLACK, 66);
    put(map, 'bing', RED, 75); // 蹩马脚
    expect(isInCheck(map, RED)).toBe(false);
  });

  it('炮将军：隔一子打', () => {
    const map = emptyMap();
    put(map, 'jiang', RED, 85); // y=9, x=4
    put(map, 'pao', BLACK, 13); // y=1, x=4 同列，在 y=1
    put(map, 'bing', RED, 40); // y=4, x=4 炮架
    expect(isInCheck(map, RED)).toBe(true);
  });

  it('炮无炮架不能将军', () => {
    const map = emptyMap();
    put(map, 'jiang', RED, 85); // y=9, x=4
    put(map, 'pao', BLACK, 13); // y=1, x=4 同列
    // 中间无炮架
    expect(isInCheck(map, RED)).toBe(false);
  });

  it('初始局面双方都不被将军', () => {
    const map = initMap();
    expect(isInCheck(map, RED)).toBe(false);
    expect(isInCheck(map, BLACK)).toBe(false);
  });
});

// ---- isMoveSafe ----

describe('isMoveSafe', () => {
  it('走动后不被将军则为安全', () => {
    const map = emptyMap();
    put(map, 'jiang', RED, 85); // y=9, x=4
    put(map, 'che', RED, 81); // y=9, x=0
    // 红车从81走到82，不应该导致被将军
    expect(isMoveSafe(map, 81, 82, RED)).toBe(true);
  });

  it('走动后导致己方被将军则为不安全', () => {
    const map = emptyMap();
    put(map, 'jiang', RED, 4); // y=0, x=4
    put(map, 'jiang', BLACK, 67); // y=7, x=4 对面笑
    put(map, 'che', RED, 22); // y=2, x=4 挡在两将之间
    // 红车在22挡着对面笑，如果移开红方就被对面笑将军
    expect(isMoveSafe(map, 22, 23, RED)).toBe(false);
  });
});

// ---- getSafeMoves ----

describe('getSafeMoves', () => {
  it('将军应返回所有走后不被将军的走法', () => {
    const map = emptyMap();
    put(map, 'jiang', RED, 85); // y=9, x=4
    put(map, 'jiang', BLACK, 4); // y=0, x=4（不会对面笑）

    const general = map[85]!;
    const moves = getSafeMoves(map, general);
    // 帅可以在九宫格内移动
    expect(moves.length).toBeGreaterThan(0);
    // 所有走法都不应导致被将军
    for (const to of moves) {
      expect(isMoveSafe(map, 85, to, RED)).toBe(true);
    }
  });

  it('被将军时安全走法应受限', () => {
    const map = emptyMap();
    put(map, 'jiang', RED, 85); // y=9, x=4
    put(map, 'che', BLACK, 13); // y=1, x=4 同列将军
    // 帅只能左右移动（或被挡住无法移动）
    const general = map[85]!;
    const moves = getSafeMoves(map, general);
    // x=4 被将军，帅只能左右移
    expect(moves.every((m) => m === 84 || m === 86)).toBe(true);
  });
});

// ---- isCheckmate (将死) ----

describe('isCheckmate', () => {
  it('应将死局面', () => {
    // 红方被双车错将死
    const map = emptyMap();
    put(map, 'jiang', RED, 85); // y=9, x=4
    // 黑车控制第9行
    put(map, 'che', BLACK, 0); // y=0, x=0
    put(map, 'che', BLACK, 8); // y=0, x=8
    // 黑将
    put(map, 'jiang', BLACK, 4); // y=0, x=4

    // 红帅在85(y=9,x=4)，黑双车分别在同一行...这不太对
    // 简单构造：红帅被对面笑+无法逃脱
    const map2 = emptyMap();
    put(map2, 'jiang', RED, 85); // y=9, x=4
    put(map2, 'jiang', BLACK, 4); // y=0, x=4 - 对面笑！
    put(map2, 'che', BLACK, 7); // y=0, x=7 - 控制第0行

    // 红帅在85，对面笑迫使红帅移动
    // x=4 同列，红帅可以左右移到 x=3(84) 或 x=5(86)
    // 假设黑车在第9行守株待兔
    const map3 = emptyMap();
    put(map3, 'jiang', RED, 85); // y=9, x=4
    put(map3, 'jiang', BLACK, 4); // y=0, x=4
    // 两个黑车分别控制第8行和第9行
    put(map3, 'che', BLACK, 72); // y=8, x=0 - 控制第8行
    put(map3, 'che', BLACK, 89); // y=9, x=8 - 与帅同行
    // 红帅在85，对面笑（将帅同列），帅必须离开x=4列
    // 但84和86都在第9行，被黑车(89)攻击
    expect(isCheckmate(map3, RED)).toBe(true);
  });

  it('初始局面不是将死', () => {
    const map = initMap();
    expect(isCheckmate(map, RED)).toBe(false);
    expect(isCheckmate(map, BLACK)).toBe(false);
  });
});

// ---- isStalemate (困毙) ----

describe('isStalemate', () => {
  it('初始局面不是困毙', () => {
    const map = initMap();
    expect(isStalemate(map, RED)).toBe(false);
    expect(isStalemate(map, BLACK)).toBe(false);
  });

  it('无子可动且未被将军时判定为困毙', () => {
    // 构造：红帅被己方棋子堵死，无法移动
    const map = emptyMap();
    put(map, 'jiang', RED, 85); // y=9, x=4
    put(map, 'jiang', BLACK, 4); // y=0, x=4（不同行不会对面笑）
    // 用己方仕堵住帅的去路
    put(map, 'shi', RED, 84); // y=9, x=3
    put(map, 'shi', RED, 86); // y=9, x=5
    put(map, 'shi', RED, 76); // y=8, x=4

    // 红帅被自己的仕全堵住，无子可动
    const general = map[85]!;
    const moves = getSafeMoves(map, general);
    expect(moves.length).toBe(0);

    // 此时未被将军
    expect(isInCheck(map, RED)).toBe(false);

    // 没有其他红方可动棋子
    // 所以应该是困毙
    expect(isStalemate(map, RED)).toBe(true);
  });
});
