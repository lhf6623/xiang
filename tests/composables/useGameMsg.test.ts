import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { TemplateRef } from 'vue';

// ---- mock vue lifecycle ----
const mountHooks: Array<() => void> = [];
const unmountHooks: Array<() => void> = [];

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue');
  return {
    ...actual,
    onMounted: (fn: () => void) => mountHooks.push(fn),
    onUnmounted: (fn: () => void) => unmountHooks.push(fn),
  };
});

// ---- mock gameMsg ----
const mockListeners = new Set<(item: { text: string; cls: string }) => void>();

vi.mock('@/utils/game-msg', () => ({
  gameMsg: {
    on: vi.fn((fn: (item: { text: string; cls: string }) => void) => {
      mockListeners.add(fn);
      return () => mockListeners.delete(fn);
    }),
    off: vi.fn((fn: (item: { text: string; cls: string }) => void) => {
      mockListeners.delete(fn);
    }),
    emit: vi.fn((_type: string) => {
      // not needed for this test
    }),
  },
  EVENT_MESSAGE: {
    check: { text: '将军！', cls: 'font-bold' },
    checkmate: { text: '将死！', cls: 'font-bold' },
    stalemate: { text: '困毙！', cls: 'font-bold' },
    'illegal-move': { text: '非法', cls: '' },
    clear: { text: '', cls: '' },
  },
}));

import { useGameMsg } from '@/composables/useGameMsg';
import { gameMsg, EVENT_MESSAGE } from '@/utils/game-msg';

describe('useGameMsg', () => {
  // fake element with animate
  const mockAnimate = vi.fn().mockReturnValue({ cancel: vi.fn() });
  const fakeElement = { animate: mockAnimate } as unknown as HTMLElement;

  const makeRef = (el: HTMLElement | null): TemplateRef<HTMLElement> =>
    ({ value: el }) as unknown as TemplateRef<HTMLElement>;

  beforeEach(() => {
    mountHooks.length = 0;
    unmountHooks.length = 0;
    mockListeners.clear();
    vi.clearAllMocks();
  });

  it('返回 eventMsg ref', () => {
    const ref = makeRef(fakeElement);
    const { eventMsg } = useGameMsg(ref);
    expect(eventMsg.value).toEqual({ text: '', cls: '' });
  });

  it('onMounted 后订阅 gameMsg', () => {
    const ref = makeRef(fakeElement);
    useGameMsg(ref);

    expect(mountHooks.length).toBe(1);

    // 触发 mounted
    mountHooks[0]();

    expect(gameMsg.on).toHaveBeenCalled();
    expect(mockListeners.size).toBe(1);
  });

  it('gameMsg 消息会更新 eventMsg', () => {
    const ref = makeRef(fakeElement);
    const { eventMsg } = useGameMsg(ref);

    // 模拟挂载
    mountHooks[0]();

    // 模拟发送消息
    const listener = [...mockListeners][0];
    listener(EVENT_MESSAGE.check);

    expect(eventMsg.value).toEqual(EVENT_MESSAGE.check);
  });

  it('收到消息时播放抖动动画', () => {
    const ref = makeRef(fakeElement);
    useGameMsg(ref);
    mountHooks[0]();

    const listener = [...mockListeners][0];
    listener(EVENT_MESSAGE.check);

    expect(mockAnimate).toHaveBeenCalled();
    const args = mockAnimate.mock.calls[0];
    expect(args[0]).toBeInstanceOf(Array); // keyframes
    expect(args[1]).toMatchObject({ duration: 500 });
  });

  it('新消息到来时取消之前的动画', () => {
    const ref = makeRef(fakeElement);
    useGameMsg(ref);
    mountHooks[0]();

    const listener = [...mockListeners][0];

    // 第一次动画
    listener(EVENT_MESSAGE.check);
    const firstAnimation = mockAnimate.mock.results[0]?.value;

    // 第二次动画
    listener(EVENT_MESSAGE.checkmate);

    // first animation should have been cancelled
    expect(firstAnimation.cancel).toHaveBeenCalled();
  });

  it('onUnmounted 时取消订阅', () => {
    const ref = makeRef(fakeElement);
    useGameMsg(ref);

    mountHooks[0]();
    expect(mockListeners.size).toBe(1);

    // 触发 unmounted
    expect(unmountHooks.length).toBe(1);
    unmountHooks[0]();

    // 订阅已被取消
    expect(mockListeners.size).toBe(0);
  });

  it('el 为 null 时不报错', () => {
    const ref = makeRef(null);
    useGameMsg(ref);

    expect(() => {
      mountHooks[0]();
      const listener = [...mockListeners][0];
      listener(EVENT_MESSAGE.check);
    }).not.toThrow();
  });

  it('onUnmounted 在 onMounted 之前调用时 gameMsgFn 为 undefined 不报错', () => {
    const ref = makeRef(fakeElement);
    useGameMsg(ref);

    // 直接调用 unmount，gameMsgFn 尚未赋值
    expect(() => unmountHooks[0]()).not.toThrow();
  });
});
