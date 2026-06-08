import { describe, it, expect } from 'vitest';
import { makingChess, getText3 } from '@/utils/making-chess';
import { RED, BLACK, NULL, COL, ROW, initMap } from '@/utils/data';

// ---- helpers ----

const emptyMap = (): MapType => Array(COL * ROW).fill(NULL);

/** 棋子文本映射（红/黑可能不同） */
const PIECE_TEXT: Record<
  PieceCodeType,
  { red: PieceTextType; black: PieceTextType }
> = {
  che: { red: '车', black: '车' },
  ma: { red: '马', black: '马' },
  xiang: { red: '相', black: '象' },
  shi: { red: '仕', black: '士' },
  jiang: { red: '帅', black: '将' },
  pao: { red: '炮', black: '炮' },
  bing: { red: '兵', black: '卒' },
};

function put(
  map: MapType,
  code: PieceCodeType,
  type: PieceColorType,
  index: number
) {
  const text = PIECE_TEXT[code][type === RED ? 'red' : 'black'];
  map[index] = { code, type, index, text };
}

// ====== getText3（方向：进/退/平）======

describe('getText3', () => {
  it('同行移动为平', () => {
    const piece: PieceType = { code: 'che', type: RED, index: 0, text: '车' };
    expect(getText3(0, 1, piece)).toBe('平');
  });

  it('红方向前（y减小）为进', () => {
    const piece: PieceType = { code: 'che', type: RED, index: 85, text: '车' };
    expect(getText3(85, 40, piece)).toBe('进');
  });

  it('红方向后（y增大）为退', () => {
    const piece: PieceType = { code: 'che', type: RED, index: 40, text: '车' };
    expect(getText3(40, 85, piece)).toBe('退');
  });

  it('黑方向前（y增大）为进', () => {
    const piece: PieceType = { code: 'che', type: BLACK, index: 4, text: '车' };
    expect(getText3(4, 40, piece)).toBe('进');
  });

  it('黑方向后（y减小）为退', () => {
    const piece: PieceType = {
      code: 'che',
      type: BLACK,
      index: 40,
      text: '车',
    };
    expect(getText3(40, 4, piece)).toBe('退');
  });
});

// ====== makingChess（完整棋谱）======

describe('makingChess', () => {
  // --- 红方 ---

  it('红炮平五路：炮二平五', () => {
    const map = initMap();
    // 红炮在 70 (y=7, x=7, 红方 numbers_cn[7]='二' 路)
    // 平移到 67 (y=7, x=4, 红方 numbers_cn[4]='五' 路)
    const notation = makingChess(map, 70, 67);
    expect(notation).toBe('炮二平五');
  });

  it('红车直进：车一进一', () => {
    const map = initMap();
    // 红车在 89 (y=9, x=8, 红方 numbers_cn[8]='一' 路)
    // 直进一步到 80 (y=8, x=8)，步数1→numbers_cn[9-1]=numbers_cn[8]='一'
    const notation = makingChess(map, 89, 80);
    expect(notation).toBe('车一进一');
  });

  it('红车直退：车一退一', () => {
    const map = emptyMap();
    put(map, 'che', RED, 80); // (y=8, x=8)
    put(map, 'jiang', RED, 85);
    // 从 80 退到 89 (y=9, x=8)，步数1
    const notation = makingChess(map, 80, 89);
    expect(notation).toBe('车一退一');
  });

  it('红马进三路：马二进三', () => {
    // 红马在 88 (y=9, x=7, numbers_cn[7]='二')
    // 马步 [-1,-2]→(6,7)=69, x=6, numbers_cn[6]='三'
    const map2 = emptyMap();
    put(map2, 'ma', RED, 88); // (7,9) 二路
    put(map2, 'jiang', RED, 85);
    // 从(7,9)走马步 [-1,-2]→(6,7)=69 → x=6, numbers_cn[6]='三'
    const notation = makingChess(map2, 88, 69);
    expect(notation).toBe('马二进三');
  });

  it('红相飞至中路：相七进五', () => {
    const map = initMap();
    // 红相在 83 (y=9, x=2, numbers_cn[2]='七')
    // 飞田字到 67 (y=7, x=4, numbers_cn[4]='五')
    const notation = makingChess(map, 83, 67);
    expect(notation).toBe('相七进五');
  });

  it('红仕斜走：仕四进五', () => {
    const map = emptyMap();
    put(map, 'shi', RED, 84); // (3,9) x=3→numbers_cn[3]='六'
    put(map, 'jiang', RED, 85);
    // (3,9)→(4,8)=76, x=4→'五'
    const notation = makingChess(map, 84, 76);
    expect(notation).toBe('仕六进五');
  });

  it('红兵平移：兵三平四', () => {
    const map = emptyMap();
    put(map, 'bing', RED, 56); // (2,6) x=2→numbers_cn[2]='七'
    put(map, 'jiang', RED, 85);
    // 同行平移到 55 (1,6) x=1→numbers_cn[1]='八'：兵七平八
    const notation = makingChess(map, 56, 55);
    expect(notation).toBe('兵七平八');
  });

  it('红兵直进：兵三进一', () => {
    const map = emptyMap();
    put(map, 'bing', RED, 56); // (2,6) x=2→numbers_cn[2]='七'
    put(map, 'jiang', RED, 85);
    // 同列直进一步到 47 (2,5)，步数1→'一'
    const notation = makingChess(map, 56, 47);
    expect(notation).toBe('兵七进一');
  });

  // --- 黑方 ---

  it('黑炮平5路：炮8平5', () => {
    const map = initMap();
    // 黑左炮在 19 (y=2, x=1, numbers[1]=2 → 2路)
    // 平移到 22 (y=2, x=4, numbers[4]=5 → 5路)
    const notation = makingChess(map, 19, 22);
    expect(notation).toBe('炮2平5');
  });

  it('黑马进3路：马8进7', () => {
    const map = initMap();
    // 黑右马在 7 (y=0, x=7, numbers[7]=8 → 8路)
    // 马步到 24 (y=2, x=6, numbers[6]=7 → 7路)
    const notation = makingChess(map, 7, 24);
    expect(notation).toBe('马8进7');
  });

  it('黑卒前进：卒7进1', () => {
    const map = initMap();
    // 黑卒在 33 (y=3, x=6, numbers[6]=7 → 7路)（初始位置）
    // 前进到 42 (y=4, x=6)，步数1
    const notation = makingChess(map, 33, 42);
    expect(notation).toBe('卒7进1');
  });

  // --- 同列多子 ---

  it('同列两个红车：前车/后车', () => {
    const map = emptyMap();
    put(map, 'che', RED, 31); // (4,3) 靠对方（前）
    put(map, 'che', RED, 67); // (4,7) 靠己方（后）
    put(map, 'jiang', RED, 85);

    // 红方升序：[31(前), 67(后)]
    const notation1 = makingChess(map, 31, 30);
    expect(notation1.startsWith('前车')).toBe(true);

    const notation2 = makingChess(map, 67, 66);
    expect(notation2.startsWith('后车')).toBe(true);
  });

  it('同列三个红兵：前/中/后', () => {
    const map = emptyMap();
    put(map, 'bing', RED, 22); // (4,2) 靠对方=前
    put(map, 'bing', RED, 40); // (4,4) 中
    put(map, 'bing', RED, 58); // (4,6) 靠己方=后
    put(map, 'jiang', RED, 85);

    // 升序：[22(前), 40(中), 58(后)]
    expect(makingChess(map, 22, 31).startsWith('前兵')).toBe(true);
    expect(makingChess(map, 40, 31).startsWith('中兵')).toBe(true);
    expect(makingChess(map, 58, 31).startsWith('后兵')).toBe(true);
  });

  it('同列四个红兵：前/二/三/后', () => {
    const map = emptyMap();
    put(map, 'bing', RED, 13); // (4,1) 靠对方=前
    put(map, 'bing', RED, 31); // (4,3) 二
    put(map, 'bing', RED, 49); // (4,5) 三
    put(map, 'bing', RED, 67); // (4,7) 靠己方=后
    put(map, 'jiang', RED, 85);

    expect(makingChess(map, 13, 14).startsWith('前兵')).toBe(true);
    expect(makingChess(map, 31, 32).startsWith('二兵')).toBe(true);
    expect(makingChess(map, 49, 50).startsWith('三兵')).toBe(true);
    expect(makingChess(map, 67, 68).startsWith('后兵')).toBe(true);
  });

  // --- 黑方同列多子 ---

  it('同列两个黑车：前车/后车（黑方 yArr 反转分支）', () => {
    const map = emptyMap();
    // 黑方：index 大的离红方近（前），yArr.toReversed() 后 [67(前), 31(后)]
    put(map, 'che', BLACK, 31); // (4,3)
    put(map, 'che', BLACK, 67); // (4,7) 离红方近→前
    put(map, 'jiang', BLACK, 4);
    put(map, 'jiang', RED, 85);

    expect(makingChess(map, 67, 66).startsWith('前车')).toBe(true);
    expect(makingChess(map, 31, 30).startsWith('后车')).toBe(true);
  });

  it('同列四个黑卒：前/2/3/后（黑方数字编号分支）', () => {
    const map = emptyMap();
    // 黑方升序后 reverse：[67(前), 49(2), 31(3), 13(后)]
    put(map, 'bing', BLACK, 13); // (4,1)
    put(map, 'bing', BLACK, 31); // (4,3)
    put(map, 'bing', BLACK, 49); // (4,5)
    put(map, 'bing', BLACK, 67); // (4,7)
    put(map, 'jiang', BLACK, 4);
    put(map, 'jiang', RED, 85);

    expect(makingChess(map, 67, 68).startsWith('前卒')).toBe(true);
    expect(makingChess(map, 49, 50).startsWith('2卒')).toBe(true);
    expect(makingChess(map, 31, 32).startsWith('3卒')).toBe(true);
    expect(makingChess(map, 13, 14).startsWith('后卒')).toBe(true);
  });

  // --- 直走步数（第4字为步数）---

  it('红车直进多步：车五进五', () => {
    const map = emptyMap();
    put(map, 'che', RED, 85); // (4,9) x=4→'五'
    put(map, 'jiang', RED, 84);
    // 直进到 (4,4)=40，步数|9-4|=5→numbers_cn[9-5]='五'
    const notation = makingChess(map, 85, 40);
    expect(notation).toBe('车五进五');
  });

  it('黑车直进多步：车5进5', () => {
    const map = emptyMap();
    put(map, 'che', BLACK, 4); // (4,0) x=4→numbers[4]=5
    put(map, 'jiang', BLACK, 3);
    // 直进到 (4,4)=40，步数|0-4|=4→numbers[4-1]=4...
    // 不对，4→到49(4,5)=步数5
    const notation = makingChess(map, 4, 49);
    expect(notation).toBe('车5进5');
  });

  // --- 将/帅 ---

  it('红帅进一：帅五进一', () => {
    const map = emptyMap();
    put(map, 'jiang', RED, 85); // (4,9) x=4→'五'
    put(map, 'jiang', BLACK, 4); // 需要对方将存在于棋盘
    // 红帅进到 76 (4,8)，步数1→'一'
    const notation = makingChess(map, 85, 76);
    expect(notation).toBe('帅五进一');
  });
});
