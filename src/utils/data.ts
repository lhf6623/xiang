/** 黑棋X轴文字 */
export const numbers: NumType[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
/** 红旗X轴文字 */
export const numbers_cn: NumCnType[] = [
  '九',
  '八',
  '七',
  '六',
  '五',
  '四',
  '三',
  '二',
  '一',
];
export const COL = 9;
export const ROW = 10;
export const NULL: NullType = null;
export const BLACK: PieceColorType = 'isBlack';
export const RED: PieceColorType = 'isRed';

/** 除兵外第三个字 "进", "退", "平" */
export const text3: PieceKinesis[] = ['进', '退', '平'];
/** 除兵外多个棋子在一条Y轴的第一个字 "前", "后" */
export const text1: PiecePlace[] = ['前', '后'];

export function indexToXY(index: number): { x: number; y: number } {
  return {
    x: index % COL,
    y: (index / COL) | 0,
  };
}
/**
 * 在地图上
 */
export const isInMap = (col: number, row: number) =>
  col >= 0 && col < COL && row >= 0 && row < ROW;

/**
 * 判断所在位置是否可以走步
 */
export const isPass = (map: MapType, i: number, pieceType: PieceColorType) =>
  isNULL(map[i]) || map[i]?.type !== pieceType;

export const isNULL = (value: PieceType | NullType) => value === NULL;

export const isBLACK = (value: PieceColorType) => value === BLACK;

export const isRED = (value: PieceColorType) => value === RED;

/**
 * 棋盘是一维数组，所以要用坐标还原索引
 * @param row y
 * @param col x
 * @returns
 */
export const getIndex = (row: number, col: number) => row * COL + col;
export const piece_list: PieceType[] = [
  {
    index: 0,
    text: '车',
    code: 'che',
    type: BLACK,
  },
  {
    index: 1,
    text: '马',
    code: 'ma',
    type: BLACK,
  },
  {
    index: 2,
    text: '象',
    code: 'xiang',
    type: BLACK,
  },
  {
    index: 3,
    text: '士',
    code: 'shi',
    type: BLACK,
  },
  {
    index: 4,
    text: '将',
    code: 'jiang',
    type: BLACK,
  },
  {
    index: 5,
    text: '士',
    code: 'shi',
    type: BLACK,
  },
  {
    index: 6,
    text: '象',
    code: 'xiang',
    type: BLACK,
  },
  {
    index: 7,
    text: '马',
    code: 'ma',
    type: BLACK,
  },
  {
    index: 8,
    text: '车',
    code: 'che',
    type: BLACK,
  },
  {
    index: 19,
    text: '炮',
    code: 'pao',
    type: BLACK,
  },
  {
    index: 25,
    text: '炮',
    code: 'pao',
    type: BLACK,
  },
  {
    index: 27,
    text: '卒',
    code: 'bing',
    type: BLACK,
  },
  {
    index: 29,
    text: '卒',
    code: 'bing',
    type: BLACK,
  },
  {
    index: 31,
    text: '卒',
    code: 'bing',
    type: BLACK,
  },
  {
    index: 33,
    text: '卒',
    code: 'bing',
    type: BLACK,
  },
  {
    index: 35,
    text: '卒',
    code: 'bing',
    type: BLACK,
  },
  {
    index: 54,
    text: '兵',
    code: 'bing',
    type: RED,
  },
  {
    index: 56,
    text: '兵',
    code: 'bing',
    type: RED,
  },
  {
    index: 58,
    text: '兵',
    code: 'bing',
    type: RED,
  },
  {
    index: 60,
    text: '兵',
    code: 'bing',
    type: RED,
  },
  {
    index: 62,
    text: '兵',
    code: 'bing',
    type: RED,
  },
  {
    index: 64,
    text: '炮',
    code: 'pao',
    type: RED,
  },
  {
    index: 70,
    text: '炮',
    code: 'pao',
    type: RED,
  },
  {
    index: 81,
    text: '车',
    code: 'che',
    type: RED,
  },
  {
    index: 82,
    text: '马',
    code: 'ma',
    type: RED,
  },
  {
    index: 83,
    text: '相',
    code: 'xiang',
    type: RED,
  },
  {
    index: 84,
    text: '仕',
    code: 'shi',
    type: RED,
  },
  {
    index: 85,
    text: '帅',
    code: 'jiang',
    type: RED,
  },
  {
    index: 86,
    text: '仕',
    code: 'shi',
    type: RED,
  },
  {
    index: 87,
    text: '相',
    code: 'xiang',
    type: RED,
  },
  {
    index: 88,
    text: '马',
    code: 'ma',
    type: RED,
  },
  {
    index: 89,
    text: '车',
    code: 'che',
    type: RED,
  },
];

/**
 * 初始化棋盘棋子位置
 * @returns MapType
 */
export const initMap = (list = piece_list) => {
  const mapList: MapType = Array(COL * ROW).fill(NULL);
  if (list?.length)
    list.forEach((item) => {
      const { index } = item;
      mapList[index] = { ...item };
    });

  return mapList;
};
