import { describe, it, expect } from 'vitest';
import {
  indexToXY,
  xyToIndex,
  isInMap,
  isPass,
  isNULL,
  isBLACK,
  isRED,
  isAcrossRiver,
  getIndex,
  initMap,
  RED,
  BLACK,
  COL,
  ROW,
} from '@/utils/data';

// ---- indexToXY / xyToIndex ----

describe('indexToXY', () => {
  it('角落位置转换', () => {
    expect(indexToXY(0)).toEqual({ x: 0, y: 0 });
    expect(indexToXY(89)).toEqual({ x: 8, y: 9 });
  });

  it('中间位置转换', () => {
    expect(indexToXY(40)).toEqual({ x: 4, y: 4 });
    expect(indexToXY(85)).toEqual({ x: 4, y: 9 });
  });

  it('42 对应 (6,4)', () => {
    // 42 = 4*9 + 6 → y=4, x=6
    expect(indexToXY(42)).toEqual({ x: 6, y: 4 });
  });
});

describe('xyToIndex', () => {
  it('应和 indexToXY 互为逆运算', () => {
    for (let i = 0; i < COL * ROW; i++) {
      const { x, y } = indexToXY(i);
      expect(xyToIndex(x, y)).toBe(i);
    }
  });
});

// ---- getIndex ----

describe('getIndex', () => {
  it('应等于 xyToIndex', () => {
    expect(getIndex(0, 0)).toBe(0);
    expect(getIndex(9, 8)).toBe(89);
    expect(getIndex(4, 4)).toBe(40);
  });
});

// ---- isInMap ----

describe('isInMap', () => {
  it('棋盘内部坐标返回 true', () => {
    expect(isInMap(0, 0)).toBe(true);
    expect(isInMap(8, 9)).toBe(true);
    expect(isInMap(4, 5)).toBe(true);
  });

  it('棋盘外部坐标返回 false', () => {
    expect(isInMap(-1, 0)).toBe(false);
    expect(isInMap(0, -1)).toBe(false);
    expect(isInMap(9, 0)).toBe(false);
    expect(isInMap(0, 10)).toBe(false);
  });
});

// ---- isNULL ----

describe('isNULL', () => {
  it('null 返回 true', () => {
    expect(isNULL(null)).toBe(true);
  });

  it('棋子对象返回 false', () => {
    const piece: PieceType = { code: 'che', type: RED, index: 0, text: '车' };
    expect(isNULL(piece)).toBe(false);
  });
});

// ---- isRED / isBLACK ----

describe('isRED', () => {
  it("'isRed' 返回 true", () => expect(isRED(RED)).toBe(true));
  it("'isBlack' 返回 false", () => expect(isRED(BLACK)).toBe(false));
});

describe('isBLACK', () => {
  it("'isBlack' 返回 true", () => expect(isBLACK(BLACK)).toBe(true));
  it("'isRed' 返回 false", () => expect(isBLACK(RED)).toBe(false));
});

// ---- isPass ----

describe('isPass', () => {
  it('空位始终可走', () => {
    const map: MapType = [null];
    expect(isPass(map, 0, RED)).toBe(true);
  });

  it('己方棋子位置不可走', () => {
    const map: MapType = [null];
    map[0] = { code: 'che', type: RED, index: 0, text: '车' };
    expect(isPass(map, 0, RED)).toBe(false);
  });

  it('敌方棋子位置可走（可吃）', () => {
    const map: MapType = [null];
    map[0] = { code: 'che', type: BLACK, index: 0, text: '车' };
    expect(isPass(map, 0, RED)).toBe(true);
  });
});

// ---- isAcrossRiver ----

describe('isAcrossRiver', () => {
  it('红方在己方半场（y>=5）返回 true，过河后（y<5）返回 false', () => {
    expect(isAcrossRiver(getIndex(5, 4), RED)).toBe(true); // y=5 己方半场
    expect(isAcrossRiver(getIndex(4, 4), RED)).toBe(false); // y=4 已过河
  });

  it('黑方在己方半场（y<5）返回 true，过河后（y>=5）返回 false', () => {
    expect(isAcrossRiver(getIndex(4, 4), BLACK)).toBe(true); // y=4 己方半场
    expect(isAcrossRiver(getIndex(5, 4), BLACK)).toBe(false); // y=5 已过河
  });

  it('河界线准确行为', () => {
    // 红方
    expect(isAcrossRiver(getIndex(4, 0), RED)).toBe(false); // y=4 过河
    expect(isAcrossRiver(getIndex(5, 0), RED)).toBe(true); // y=5 未过河
    // 黑方
    expect(isAcrossRiver(getIndex(4, 0), BLACK)).toBe(true); // y=4 未过河
    expect(isAcrossRiver(getIndex(5, 0), BLACK)).toBe(false); // y=5 过河
  });

  it('非红非黑的非法类型返回 false（防御分支）', () => {
    expect(isAcrossRiver(0, 'invalid' as PieceColorType)).toBe(false);
  });
});

// ---- initMap ----

describe('initMap', () => {
  it('初始棋盘应有 90 个位置', () => {
    const map = initMap();
    expect(map.length).toBe(COL * ROW);
  });

  it('初始棋盘应有 32 个棋子', () => {
    const map = initMap();
    const pieces = map.filter((p) => p !== null);
    expect(pieces.length).toBe(32);
  });

  it('黑将应在位置 4', () => {
    const map = initMap();
    const jiang = map[4];
    expect(jiang?.code).toBe('jiang');
    expect(jiang?.type).toBe(BLACK);
  });

  it('红帅应在位置 85', () => {
    const map = initMap();
    const jiang = map[85];
    expect(jiang?.code).toBe('jiang');
    expect(jiang?.type).toBe(RED);
  });

  it('默认使用 piece_list', () => {
    const map = initMap();
    // 红车在 81
    expect(map[81]?.code).toBe('che');
    expect(map[81]?.type).toBe(RED);
  });

  it('传入空列表返回空棋盘', () => {
    const map = initMap([]);
    expect(map.every((p) => p === null)).toBe(true);
  });

  it('传入自定义列表', () => {
    const customPiece: PieceType = {
      code: 'ma',
      type: RED,
      index: 50,
      text: '马',
    };
    const map = initMap([customPiece]);
    expect(map[50]?.code).toBe('ma');
    expect(map[50]?.type).toBe(RED);
    // 其他位置为空
    expect(map[0]).toBeNull();
  });
});
