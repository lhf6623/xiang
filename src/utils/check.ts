import { indexToXY, isNULL, getIndex, RED, BLACK } from './data';
import { jiangSeat } from './run-rule-data';
import { run_rule } from './run-rule';

/** 找到指定颜色的将/帅位置 */
export function findGeneral(map: MapType, color: PieceColorType): number {
  for (const i of jiangSeat) {
    const p = map[i];
    if (p && p.code === 'jiang' && p.type === color) return i;
  }
  return -1;
}

/** 对面笑：两将同列且之间无遮挡 */
function isFlyingGeneral(
  map: MapType,
  generalPos: number,
  enemyGeneralPos: number
): boolean {
  if (enemyGeneralPos === -1) return false;
  const { x: gx, y: gy } = indexToXY(generalPos);
  const { x: ex, y: ey } = indexToXY(enemyGeneralPos);
  if (gx !== ex) return false;

  const minY = Math.min(gy, ey);
  const maxY = Math.max(gy, ey);
  for (let y = minY + 1; y < maxY; y++) {
    if (!isNULL(map[getIndex(y, gx)])) return false;
  }
  return true;
}

/** 判断指定颜色是否被将军（含对面笑） */
export function isInCheck(map: MapType, color: PieceColorType): boolean {
  const generalPos = findGeneral(map, color);
  if (generalPos === -1) return false;

  const enemyColor = color === RED ? BLACK : RED;

  // 对面笑
  if (isFlyingGeneral(map, generalPos, findGeneral(map, enemyColor)))
    return true;

  // 对方每个棋子（除将外）能否攻击到将
  for (let i = 0; i < map.length; i++) {
    const piece = map[i];
    if (!piece || piece.type !== enemyColor || piece.code === 'jiang') continue;
    const moves = run_rule[piece.code]?.(map, piece) || [];
    if (moves.includes(generalPos)) return true;
  }

  return false;
}

/** 判断走子后己方将是否安全 */
export function isMoveSafe(
  map: MapType,
  from: number,
  to: number,
  color: PieceColorType
): boolean {
  const newMap = map.map((p) => (p ? { ...p } : null));
  newMap[to] = { ...newMap[from]!, index: to };
  newMap[from] = null;
  return !isInCheck(newMap, color);
}

/** 获取棋子的安全走法（走后不被将军） */
export function getSafeMoves(map: MapType, piece: PieceType): number[] {
  const moves = run_rule[piece.code]?.(map, piece) || [];
  return moves.filter((to) => isMoveSafe(map, piece.index, to, piece.type));
}

function hasLegalMove(map: MapType, color: PieceColorType): boolean {
  for (let i = 0; i < map.length; i++) {
    const piece = map[i];
    if (!piece || piece.type !== color) continue;
    if (getSafeMoves(map, piece).length > 0) return true;
  }
  return false;
}

/** 判断是否将死 */
export function isCheckmate(map: MapType, color: PieceColorType): boolean {
  return isInCheck(map, color) && !hasLegalMove(map, color);
}

/** 判断是否困毙 */
export function isStalemate(map: MapType, color: PieceColorType): boolean {
  return !isInCheck(map, color) && !hasLegalMove(map, color);
}
