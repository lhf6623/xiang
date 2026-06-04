import { indexToXY, isNULL, isRED } from './data';
import { numbers, numbers_cn, text1, text3 } from './data';

const [QIAN, HOU] = text1;
const [JIN, TUI, PING] = text3;

/**
 * 直走的直接加减，马，相，士之类的需要按照x轴数字来显示
 * @param beforeIndex
 * @param afterIndex
 * @param piece
 */
const getText4 = (
  beforeIndex: number,
  afterIndex: number,
  { type }: PieceType
): string | number => {
  const isRed = isRED(type);
  const { y: beforeY, x: beforeX } = indexToXY(beforeIndex);
  const { y: afterY, x: afterX } = indexToXY(afterIndex);

  // y轴相等，平移
  if (beforeY === afterY || (beforeX !== afterX && beforeY !== afterY)) {
    return isRed ? numbers_cn[afterX] : numbers[afterX];
  } else {
    // x轴相等，上下移动
    //if (beforeX === afterX) {
    const _y = Math.abs(afterY - beforeY);
    return isRed ? numbers_cn[numbers_cn.length - _y] : numbers[_y - 1];
  }
};

/**
 * 棋谱第三个字
 * @param beforeIndex 移动前棋子下标
 * @param afterIndex 移动后棋子下标
 * @param piece 当前棋子
 */
export const getText3 = (
  beforeIndex: number,
  afterIndex: number,
  { type }: PieceType
): PieceKinesis => {
  const isRed = isRED(type);
  const { y: beforeY } = indexToXY(beforeIndex);
  const { y: afterY } = indexToXY(afterIndex);

  // 直线
  if (beforeY === afterY) return PING;

  // 红棋，移动前棋子 小于当前棋子 退，反之 进
  // 黑棋，移动前棋子 小于当前棋子 进，反之 退
  if (isRed) {
    return beforeIndex < afterIndex ? TUI : JIN;
  } else {
    return beforeIndex < afterIndex ? JIN : TUI;
  }
};

/**
 * 棋谱第二个字
 * @param index
 * @param isRed
 */
const getText2 = (index: number, type: PieceColorType): string | number => {
  const { x } = indexToXY(index);

  return isRED(type) ? numbers_cn[x] : numbers[x];
};

/**
 * 获取Y线上相同的棋子下标 这里返回的是从 黑色方开始的下标
 * @param indexArr 相同棋子下标数组
 * @param piece 移动之前的棋子
 */
const getYIndex = (indexArr: MapType, piece: PieceType): number[] => {
  const { x } = indexToXY(piece.index);
  return indexArr.flatMap((item) => {
    if (isNULL(item)) return [];
    const { index, code, type } = item;
    const _x = indexToXY(index).x;
    if (_x == x && code === piece.code && type === piece.type) {
      return [index];
    }
    return [];
  });
};

/**
 * 获取棋谱第一个字，如果 y 轴有相同的棋子，有两个字
 * @param mapArr
 * @param piece
 */
const getText1 = (mapArr: MapType, piece: PieceType): string => {
  const { index, type, text } = piece;
  const isRed = isRED(type);

  let yArr = getYIndex(mapArr, piece);
  if (yArr.length === 1) return text;
  yArr = isRed ? yArr : yArr.toReversed();

  const pieceIndex = yArr.indexOf(index);
  if (pieceIndex === 0) return `${QIAN}${text}`;
  if (pieceIndex === yArr.length - 1) return `${HOU}${text}`;

  const text_num = isRed
    ? numbers_cn.toReversed()[pieceIndex]
    : numbers[pieceIndex];

  return `${text_num}${text}`;
};

/**
 * 象棋棋谱制作
 * @param mapArr 棋盘数组
 * @param beforeIndex 移动之前的棋子下标
 * @param afterIndex 移动过后的棋子下标
 * @returns {String} 棋谱
 */
export const makingChess = (
  mapArr: MapType,
  beforeIndex: number,
  afterIndex: number
): string => {
  const beforePice = mapArr[beforeIndex]!;
  // y 轴上相同棋子可能有三个字
  const text1 = getText1(mapArr, beforePice);
  const text2 = getText2(beforeIndex, beforePice.type);
  const text3 = getText3(beforeIndex, afterIndex, beforePice);
  const text4 = getText4(beforeIndex, afterIndex, beforePice);
  return `${text1}${text2}${text3}${text4}`;
};
