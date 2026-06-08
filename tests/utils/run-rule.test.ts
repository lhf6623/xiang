import { describe, it, expect } from 'vitest';
import { run_rule } from '@/utils/run-rule';
import { RED, BLACK, NULL, COL, ROW } from '@/utils/data';

// ---- helpers ----

const emptyMap = (): MapType => Array(COL * ROW).fill(NULL);

function put(
  map: MapType,
  code: PieceCodeType,
  type: PieceColorType,
  index: number
) {
  map[index] = { code, type, index, text: code as PieceTextType };
}

/** 从数组快速布满棋盘 */
function fromPieces(pieces: [PieceCodeType, PieceColorType, number][]) {
  const map = emptyMap();
  pieces.forEach(([code, type, index]) => put(map, code, type, index));
  return map;
}

/** 将 moves 结果排序后比较（顺序无关） */
function expectMoves(map: MapType, piece: PieceType, expected: number[]) {
  const moves = (run_rule[piece.code]?.(map, piece) || []).sort(
    (a, b) => a - b
  );
  const sorted = [...expected].sort((a, b) => a - b);
  expect(moves).toEqual(sorted);
}

// ====== 车 ======

describe('run_rule - 车 (che)', () => {
  it('空棋盘中心可以向四个方向走满', () => {
    const map = emptyMap();
    // 中心位置 (4,4) = 40，红车
    put(map, 'che', RED, 40);

    const expected: number[] = [];
    // 上 (x=4, y递减): 31,22,13,4
    // 左 (x递减, y=4): 39,38,37,36
    // 下 (x=4, y递增): 49,58,67,76,85
    // 右 (x递增, y=4): 41,42,43,44
    for (let y = 0; y < ROW; y++) {
      if (y !== 4) expected.push(y * COL + 4); // 同列
    }
    for (let x = 0; x < COL; x++) {
      if (x !== 4) expected.push(4 * COL + x); // 同行
    }

    expectMoves(map, map[40]!, expected);
  });

  it('被己方棋子挡住', () => {
    const map = fromPieces([
      ['che', RED, 40], // 中心
      ['bing', RED, 49], // 下方紧邻，挡住
      ['bing', RED, 39], // 左方紧邻，挡住
    ]);

    // 上: 31,22,13,4 | 右: 41,42,43,44 | 左/下: 被己方挡住
    const expected = [31, 22, 13, 4, 41, 42, 43, 44];
    expectMoves(map, map[40]!, expected);
  });

  it('可吃掉敌方棋子但不能越过', () => {
    const map = fromPieces([
      ['che', RED, 40],
      ['bing', BLACK, 49], // 下方紧邻黑卒，可吃
    ]);

    const moves = run_rule.che(map, map[40]!);
    expect(moves).toContain(49);
    expect(moves).not.toContain(58); // 不能越过黑卒
  });

  it('车的走法——被己方马挡住', () => {
    const map2 = emptyMap();
    put(map2, 'che', RED, 81);
    put(map2, 'ma', RED, 82); // 己方马挡住
    const moves = run_rule.che(map2, map2[81]!);
    // 上: 72,63,54,45,36,27,18,9,0
    // 右: 被82挡住 → 无
    expect(moves).not.toContain(83);
    expect(moves).toContain(72);
  });
});

// ====== 马 ======

describe('run_rule - 马 (ma)', () => {
  it('中心无蹩脚时应走8个位置', () => {
    const map = emptyMap();
    put(map, 'ma', RED, 40); // (4,4)

    // (4,4) 的8个马步：
    // (-1,-2)→(3,2)=21, (1,-2)→(5,2)=23
    // (-2,-1)→(2,3)=29, (-2,1)→(2,5)=47
    // (-1,2)→(3,6)=57,  (1,2)→(5,6)=59
    // (2,-1)→(6,3)=33,  (2,1)→(6,5)=51
    const expected = [21, 23, 29, 47, 57, 59, 33, 51];
    expectMoves(map, map[40]!, expected);
  });

  it('蹩马脚时不能走对应方向', () => {
    const map = emptyMap();
    put(map, 'ma', RED, 40); // (4,4)
    // 上方马脚 (4,3)=31 放棋子
    put(map, 'bing', RED, 31);

    const moves = run_rule.ma(map, map[40]!);
    // 上方两个方向 (-1,-2)→(3,2)=21 和 (1,-2)→(5,2)=23 被阻挡
    expect(moves).not.toContain(21);
    expect(moves).not.toContain(23);
    // 其他6个方向正常
    expect(moves).toContain(29);
    expect(moves).toContain(47);
    expect(moves).toContain(57);
    expect(moves).toContain(59);
    expect(moves).toContain(33);
    expect(moves).toContain(51);
  });

  it('可以吃敌方棋子', () => {
    const map = emptyMap();
    put(map, 'ma', RED, 40);
    put(map, 'bing', BLACK, 21); // 黑卒在 (3,2)

    const moves = run_rule.ma(map, map[40]!);
    expect(moves).toContain(21);
  });

  it('不能走到己方棋子位置上', () => {
    const map = emptyMap();
    put(map, 'ma', RED, 40);
    put(map, 'bing', RED, 21); // 己方卒

    const moves = run_rule.ma(map, map[40]!);
    expect(moves).not.toContain(21);
  });

  it('边缘位置走法减少', () => {
    const map = emptyMap();
    put(map, 'ma', RED, 0); // (0,0) 角落

    // 从(0,0): 只有 (1,2)=19 和 (2,1)=11 在棋盘内
    const expected = [19, 11];
    expectMoves(map, map[0]!, expected);
  });
});

// ====== 炮 ======

describe('run_rule - 炮 (pao)', () => {
  it('无炮架时直线移动（同车）', () => {
    const map = emptyMap();
    put(map, 'pao', RED, 40); // (4,4)

    const moves = run_rule.pao(map, map[40]!);
    // 同车：四个方向直线
    // 上: 31,22,13,4 | 左: 39,38,37,36 | 下: 49,58,67,76,85 | 右: 41,42,43,44
    expect(moves).toContain(31);
    expect(moves).toContain(39);
    expect(moves).toContain(49);
    expect(moves).toContain(41);
    // 无炮架时直线移动同车：同列5+同行4（除去自身）共17个空位
    expect(moves.length).toBe(17);
  });

  it('隔一子可以吃', () => {
    const map = emptyMap();
    put(map, 'pao', RED, 40); // (4,4)
    put(map, 'bing', RED, 49); // 炮架在 (4,5)
    put(map, 'ma', BLACK, 58); // 敌方马在 (4,6) → 可吃

    const moves = run_rule.pao(map, map[40]!);
    // 向下：炮架在49，可以吃58
    expect(moves).toContain(58);
    // 但不能走到49（己方棋子）
    expect(moves).not.toContain(49);
    // 也不能越过58
    expect(moves).not.toContain(67);
  });

  it('隔两子不能吃', () => {
    const map = emptyMap();
    put(map, 'pao', RED, 40);
    put(map, 'bing', RED, 49); // 炮架1
    put(map, 'bing', BLACK, 58); // 炮架2（会被吃的那个？不，第二个障碍物）
    put(map, 'ma', BLACK, 67); // 在第三个位置，不能吃到

    const moves = run_rule.pao(map, map[40]!);
    // 向下：49是第一个障碍(己方)，58是第二个障碍——炮只能跳过第一个障碍打第二个障碍位置上的敌人
    // 所以可以吃58
    expect(moves).toContain(58);
    // 但不能吃67
    expect(moves).not.toContain(67);
  });

  it('炮架后没有敌方则不能移动过去', () => {
    const map = emptyMap();
    put(map, 'pao', RED, 40);
    put(map, 'bing', RED, 49); // 炮架
    // 炮架后面全是空的，但炮跳过炮架后必须吃子，不能停留

    const moves = run_rule.pao(map, map[40]!);
    // 跳过49后没有敌人，所以58不在结果中
    expect(moves).not.toContain(58);
  });
});

// ====== 将/帅 ======

describe('run_rule - 将/帅 (jiang)', () => {
  it('九宫格内可向四个方向走一步', () => {
    const map = emptyMap();
    put(map, 'jiang', RED, 85); // (4,9) 红方九宫中心

    // (4,9) 九宫内：上(4,8)=76, 左(3,9)=84, 右(5,9)=86
    const expected = [76, 84, 86];
    expectMoves(map, map[85]!, expected);
  });

  it('不能走出九宫', () => {
    const map = emptyMap();
    put(map, 'jiang', RED, 84); // (3,9) 九宫边缘

    const moves = run_rule.jiang(map, map[84]!);
    // 不能走到 x=2（九宫外）
    expect(moves).not.toContain(83);
    // 只能右或上
    expectMoves(map, map[84]!, [75, 85]);
  });

  it('不能走到己方棋子位置', () => {
    const map = emptyMap();
    put(map, 'jiang', RED, 85);
    put(map, 'shi', RED, 76); // 上方被己方士占据

    const moves = run_rule.jiang(map, map[85]!);
    expect(moves).not.toContain(76);
    expect(moves).toContain(84);
    expect(moves).toContain(86);
  });

  it('可以吃进入九宫的敌方棋子', () => {
    const map = emptyMap();
    put(map, 'jiang', RED, 85);
    put(map, 'che', BLACK, 76); // 黑车在 (4,8)

    const moves = run_rule.jiang(map, map[85]!);
    expect(moves).toContain(76);
  });
});

// ====== 士/仕 ======

describe('run_rule - 士/仕 (shi)', () => {
  it('在九宫内斜走一步', () => {
    const map = emptyMap();
    put(map, 'shi', RED, 76); // (4,8) 九宫中心上方

    // 斜走：(3,7)=66, (5,7)=68, (3,9)=84, (5,9)=86
    const expected = [66, 68, 84, 86];
    expectMoves(map, map[76]!, expected);
  });

  it('九宫角落只能走一个方向', () => {
    const map = emptyMap();
    put(map, 'shi', RED, 84); // (3,9) 九宫左下角

    // 只能走到 (4,8)=76
    expectMoves(map, map[84]!, [76]);
  });

  it('不能走出九宫', () => {
    const map = emptyMap();
    put(map, 'shi', RED, 66); // (3,7)

    // 不走到的位置不在shiSeat中
    // (3,7) 走 (-1,-1)→(2,6) 不在shiSeat → 排除
    // (3,7) 走 (1,-1)→(4,6) 不在shiSeat → 排除
    // (3,7) 走 (-1,1)→(2,8) 不在shiSeat → 排除
    // (3,7) 走 (1,1)→(4,8)=76 在shiSeat → 保留
    expectMoves(map, map[66]!, [76]);
  });
});

// ====== 象/相 ======

describe('run_rule - 象/相 (xiang)', () => {
  it('中心走田字四个方向', () => {
    const map = emptyMap();
    put(map, 'xiang', RED, 76); // (4,8)

    // 象从 (4,8):
    // (-2,-2)→(2,6)=56, (2,-2)→(6,6)=60
    // (-2,2)→(2,10) 出界, (2,2)→(6,10) 出界
    const moves = run_rule.xiang(map, map[76]!);
    // 需要检查是否过河: (2,6)→isAcrossRiver(56, 'isRed')...
    // 红方不能过河 = y >= 5 时才可以。y=6 >= 5，不过河。OK
    // (6,6)→60, y=6 >= 5，OK
    // 象眼: (-1,-1)→(3,7)=67, (1,-1)→(5,7)=69 需为空
    expect(moves).toContain(56);
    expect(moves).toContain(60);
    expect(moves.length).toBe(2);
  });

  it('象眼被堵不能走', () => {
    const map = emptyMap();
    put(map, 'xiang', RED, 76); // (4,8)
    put(map, 'bing', RED, 66); // 堵 (3,7) = 左上象眼（不是67）

    const moves = run_rule.xiang(map, map[76]!);
    expect(moves).not.toContain(56); // 这个方向被堵
    expect(moves).toContain(60); // 另一个方向正常
  });

  it('不能过河', () => {
    const map = emptyMap();
    // 红象在 (4,5)=49，往下走田字到 (2,3) 或 (6,3)
    put(map, 'xiang', RED, 49); // (4,5)

    const moves = run_rule.xiang(map, map[49]!);
    // (4,5)→(-2,-2)→(2,3)=29: y=3<5 过河！→排除
    // (4,5)→(2,-2)→(6,3)=33: y=3<5 过河！→排除
    // (4,5)→(-2,2)→(2,7)=65: y=7>=5 不过河，象眼(3,6)空→保留
    // (4,5)→(2,2)→(6,7)=69: y=7>=5 不过河，象眼(5,6)空→保留
    expect(moves).not.toContain(29); // 过河
    expect(moves).not.toContain(33); // 过河
    expect(moves).toContain(65);
    expect(moves).toContain(69);
  });
});

// ====== 兵/卒 ======

describe('run_rule - 兵/卒 (bing)', () => {
  it('红兵未过河只能向前走一步', () => {
    const map = emptyMap();
    put(map, 'bing', RED, 58); // (4,6) 未过河

    // 只能向前（上，y-1）: (4,5)=49
    expectMoves(map, map[58]!, [49]);
  });

  it('红兵过河后可以左右移动', () => {
    const map = emptyMap();
    put(map, 'bing', RED, 40); // (4,4) 已过河

    const moves = run_rule.bing(map, map[40]!);
    // 向前: (4,3)=31
    // 左右: (3,4)=39, (5,4)=41
    expect(moves).toContain(31);
    expect(moves).toContain(39);
    expect(moves).toContain(41);
    // 不能后退
    expect(moves).not.toContain(49);
  });

  it('黑卒未过河只能向前走一步', () => {
    const map = emptyMap();
    put(map, 'bing', BLACK, 31); // (4,3) 未过河（黑方视角）

    // 黑卒向前 = y+1: (4,4)=40
    expectMoves(map, map[31]!, [40]);
  });

  it('黑卒过河后可以左右移动', () => {
    const map = emptyMap();
    put(map, 'bing', BLACK, 49); // (4,5) 已过河（黑方视角）

    const moves = run_rule.bing(map, map[49]!);
    // 向前(y+1): (4,6)=58
    // 左右: (3,5)=48, (5,5)=50
    expect(moves).toContain(58);
    expect(moves).toContain(48);
    expect(moves).toContain(50);
    expect(moves).not.toContain(40); // 不能后退
  });

  it('兵到底线只能横向移动（虽然规则禁止过河前进）', () => {
    const map = emptyMap();
    put(map, 'bing', RED, 4); // (4,0) 红方视角的最顶端（对方底线）

    const moves = run_rule.bing(map, map[4]!);
    // 向前 y-1 会出界
    // 已过河，可以左右移动
    expect(moves).toContain(3); // (3,0)
    expect(moves).toContain(5); // (5,0)
    // 不能后退
    expect(moves).not.toContain(13);
  });

  it('不能吃己方棋子', () => {
    const map = emptyMap();
    put(map, 'bing', RED, 40);
    put(map, 'bing', RED, 31); // 前方己方棋子

    const moves = run_rule.bing(map, map[40]!);
    expect(moves).not.toContain(31);
  });

  it('可以吃敌方棋子', () => {
    const map = emptyMap();
    put(map, 'bing', RED, 40);
    put(map, 'bing', BLACK, 31); // 前方敌方棋子

    const moves = run_rule.bing(map, map[40]!);
    expect(moves).toContain(31);
  });
});
