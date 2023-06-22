export const NULL = null;
export const BLACK = "isBlack";
export const RED = "isRed";
interface PieceType {
  text: string;
  code: string;
  type: "isBlack" | "isRed";
}

export const piece_obj: Record<number, PieceType> = {
  0: {
    text: "车",
    code: "che",
    type: BLACK,
  },
  1: {
    text: "马",
    code: "ma",
    type: BLACK,
  },
  2: {
    text: "象",
    code: "xiang",
    type: BLACK,
  },
  3: {
    text: "士",
    code: "shi",
    type: BLACK,
  },
  4: {
    text: "将",
    code: "jiang",
    type: BLACK,
  },
  5: {
    text: "士",
    code: "shi",
    type: BLACK,
  },
  6: {
    text: "象",
    code: "xiang",
    type: BLACK,
  },
  7: {
    text: "马",
    code: "ma",
    type: BLACK,
  },
  8: {
    text: "车",
    code: "che",
    type: BLACK,
  },
  19: {
    text: "炮",
    code: "pao",
    type: BLACK,
  },
  25: {
    text: "炮",
    code: "pao",
    type: BLACK,
  },
  27: {
    text: "卒",
    code: "bing",
    type: BLACK,
  },
  29: {
    text: "卒",
    code: "bing",
    type: BLACK,
  },
  31: {
    text: "卒",
    code: "bing",
    type: BLACK,
  },
  33: {
    text: "卒",
    code: "bing",
    type: BLACK,
  },
  35: {
    text: "卒",
    code: "bing",
    type: BLACK,
  },
  54: {
    text: "兵",
    code: "bing",
    type: RED,
  },
  56: {
    text: "兵",
    code: "bing",
    type: RED,
  },
  58: {
    text: "兵",
    code: "bing",
    type: RED,
  },
  60: {
    text: "兵",
    code: "bing",
    type: RED,
  },
  62: {
    text: "兵",
    code: "bing",
    type: RED,
  },
  64: {
    text: "炮",
    code: "pao",
    type: RED,
  },
  70: {
    text: "炮",
    code: "pao",
    type: RED,
  },
  81: {
    text: "车",
    code: "che",
    type: RED,
  },
  82: {
    text: "马",
    code: "ma",
    type: RED,
  },
  83: {
    text: "相",
    code: "xiang",
    type: RED,
  },
  84: {
    text: "仕",
    code: "shi",
    type: RED,
  },
  85: {
    text: "帅",
    code: "jiang",
    type: RED,
  },
  86: {
    text: "仕",
    code: "shi",
    type: RED,
  },
  87: {
    text: "相",
    code: "xiang",
    type: RED,
  },
  88: {
    text: "马",
    code: "ma",
    type: RED,
  },
  89: {
    text: "车",
    code: "che",
    type: RED,
  },
};
