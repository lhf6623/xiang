type Type = "isRed" | "isBlack";
type PieceCodeType = "che" | "ma" | "xiang" | "shi" | "jiang" | "pao" | "bing";
type PieceType = {
  index: number;
  text: string;
  type: Type;
  code: PieceCodeType;
};

type RunRule = {
  [key in PieceCodeType]?: (
    map: Array<PieceType | null>,
    piece: PieceType
  ) => number[];
};

type StoreType = {
  tips: boolean;
  record: Array<string>;
  nextAction: Type;
  identity: Type;
  transformStyle: string;
};

type StoreKeyType = keyof StoreType;
