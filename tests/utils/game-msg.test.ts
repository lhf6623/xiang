import { describe, it, expect, vi } from 'vitest';
import { EVENT_MESSAGE, gameMsg, type gameMsgType } from '@/utils/game-msg';

// ====== EVENT_MESSAGE 常量 ======

describe('EVENT_MESSAGE', () => {
  it('check 类型应有 text 和 cls', () => {
    expect(EVENT_MESSAGE.check.text).toBe('将军！');
    expect(EVENT_MESSAGE.check.cls).toContain('font-bold');
  });

  it('checkmate 类型', () => {
    expect(EVENT_MESSAGE.checkmate.text).toBe('将死！');
  });

  it('stalemate 类型', () => {
    expect(EVENT_MESSAGE.stalemate.text).toBe('困毙！');
  });

  it('illegal-move 类型', () => {
    expect(EVENT_MESSAGE['illegal-move'].text).toBe('移动到此位置会被将军');
  });

  it('clear 类型 text 为空', () => {
    expect(EVENT_MESSAGE.clear.text).toBe('');
    expect(EVENT_MESSAGE.clear.cls).toBe('');
  });

  it('应包含所有 5 种消息类型', () => {
    const keys = Object.keys(EVENT_MESSAGE) as gameMsgType[];
    expect(keys.sort()).toEqual(
      ['check', 'checkmate', 'stalemate', 'illegal-move', 'clear'].sort()
    );
  });
});

// ====== GameMsg 类 ======

describe('GameMsg', () => {
  it('emit 应通知所有已订阅的 listener', () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    gameMsg.on(fn1);
    gameMsg.on(fn2);

    gameMsg.emit('check');

    expect(fn1).toHaveBeenCalledWith(EVENT_MESSAGE.check);
    expect(fn2).toHaveBeenCalledWith(EVENT_MESSAGE.check);

    // cleanup
    gameMsg.off(fn1);
    gameMsg.off(fn2);
  });

  it('on 返回取消订阅函数', () => {
    const fn = vi.fn();
    const unsubscribe = gameMsg.on(fn);

    // 收到一次
    gameMsg.emit('checkmate');
    expect(fn).toHaveBeenCalledTimes(1);

    // 取消订阅后不再收到
    unsubscribe();
    gameMsg.emit('checkmate');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('off 可以取消订阅', () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    gameMsg.on(fn1);
    gameMsg.on(fn2);
    gameMsg.off(fn1);

    gameMsg.emit('stalemate');

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledWith(EVENT_MESSAGE.stalemate);

    // cleanup
    gameMsg.off(fn2);
  });

  it('clearMsg 发送 clear 消息给所有 listener', () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    gameMsg.on(fn1);
    gameMsg.on(fn2);

    gameMsg.clearMsg();

    expect(fn1).toHaveBeenCalledWith(EVENT_MESSAGE.clear);
    expect(fn2).toHaveBeenCalledWith(EVENT_MESSAGE.clear);

    // cleanup
    gameMsg.off(fn1);
    gameMsg.off(fn2);
  });

  it('重复添加同一 listener 不重复通知', () => {
    const fn = vi.fn();

    gameMsg.on(fn);
    gameMsg.on(fn); // 重复添加，Set 去重

    gameMsg.emit('check');

    expect(fn).toHaveBeenCalledTimes(1);

    // cleanup
    gameMsg.off(fn);
  });

  it('没有 listener 时 emit 不报错', () => {
    // 所有之前的 listener 已 cleanup，这里应安全
    expect(() => gameMsg.emit('check')).not.toThrow();
  });
});
