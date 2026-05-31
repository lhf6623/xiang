import type { AttributifyAttributes } from 'unocss/preset-attributify';

declare module '@vue/runtime-dom' {
  interface HTMLAttributes extends AttributifyAttributes {}
}

export {};

declare global {
  type PieceColorType = 'isRed' | 'isBlack';
  type NullType = null;

  type NumCnType = '九' | '八' | '七' | '六' | '五' | '四' | '三' | '二' | '一';
  type NumType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  type PieceCodeType =
    | 'che'
    | 'ma'
    | 'xiang'
    | 'shi'
    | 'jiang'
    | 'pao'
    | 'bing';
  type PieceTextType =
    | '车'
    | '马'
    | '相'
    | '象'
    | '仕'
    | '士'
    | '帅'
    | '将'
    | '炮'
    | '兵'
    | '卒';

  /** 棋子动作 */
  type PieceKinesis = '进' | '退' | '平';
  type PiecePlace = '前' | '后';

  type AllTextType =
    | PieceTextType
    | PieceKinesis
    | PiecePlace
    | NumCnType
    | NumType;

  type PieceType = {
    index: number;
    text: PieceTextType;
    type: PieceColorType;
    code: PieceCodeType;
  };
  type MapType = Array<PieceType | NullType>;

  type RunRule = {
    [key in PieceCodeType]?: (map: MapType, piece: PieceType) => number[];
  };
  type RecordItem = {
    name: string;
    list: PieceType[];
  };
  type AppStoreType = {
    /** 棋谱记录 */
    record: Array<RecordItem>;
    /** 推演列表 */
    deduction_list: Array<RecordItem>;
    /** 当前棋盘落子情况 */
    list: MapType;
    /** 选中的棋子 */
    active: number[];
    is_run: boolean;
    /** 点击历史记录 */
    record_index: number;
    /** 下一个移动棋子的一方 */
    next: PieceColorType;
  };
}
