export type gameMsgType =
  | 'check'
  | 'checkmate'
  | 'stalemate'
  | 'illegal-move'
  | 'clear';

export type gameItemMsgType = { text: string; cls: string };

// @unocss-include
export const EVENT_MESSAGE: Record<gameMsgType, gameItemMsgType> = {
  check: { text: '将军！', cls: 'font-bold text-chess-accent inline-block' },
  checkmate: {
    text: '将死！',
    cls: 'font-bold text-chess-accent inline-block',
  },
  stalemate: {
    text: '困毙！',
    cls: 'font-bold text-chess-accent inline-block',
  },
  'illegal-move': {
    text: '移动到此位置会被将军',
    cls: 'text-amber-600 inline-block',
  },
  clear: { text: '', cls: '' },
};

type Handler = (item: gameItemMsgType) => void;

/** 游戏消息发送到界面显示 */
class GameMsg {
  private listeners = new Set<Handler>();

  /** 发送事件 */
  emit(type: gameMsgType) {
    const item = EVENT_MESSAGE[type];
    this.listeners.forEach((fn) => {
      fn(item);
    });
  }

  /** 订阅事件 */
  on(fn: Handler): () => void {
    this.listeners.add(fn);

    return () => {
      this.listeners.delete(fn);
    };
  }

  /** 取消订阅 */
  off(fn: Handler) {
    this.listeners.delete(fn);
  }

  /** 清理提示文字 */
  clearMsg() {
    this.listeners.forEach((fn) => {
      fn(EVENT_MESSAGE.clear);
    });
  }
}

export const gameMsg = new GameMsg();
