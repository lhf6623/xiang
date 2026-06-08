import { describe, it, expect, vi, beforeEach } from 'vitest';
import { shallowRef } from 'vue';

// ---- mock vue lifecycle ----
const mountHooks: Array<() => void> = [];
const beforeUnmountHooks: Array<() => void> = [];

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue');
  return {
    ...actual,
    onMounted: (fn: () => void) => mountHooks.push(fn),
    onBeforeUnmount: (fn: () => void) => beforeUnmountHooks.push(fn),
  };
});

// ---- mock ResizeObserver ----
class MockResizeObserver {
  static instances: MockResizeObserver[] = [];
  callback: ResizeObserverCallback;
  observed: Element[] = [];

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    MockResizeObserver.instances.push(this);
  }

  observe(el: Element) {
    this.observed.push(el);
  }

  unobserve(_el: Element) {}

  disconnect() {
    this.observed = [];
  }

  // helper: simulate resize
  simulateResize(width: number, height: number) {
    const entry: ResizeObserverEntry = {
      contentBoxSize: [{ inlineSize: width, blockSize: height }],
    } as unknown as ResizeObserverEntry;
    this.callback([entry], this as unknown as ResizeObserver);
  }

  // helper: simulate resize without contentBoxSize (triggers fallback)
  simulateResizeNoContentBoxSize() {
    const entry: ResizeObserverEntry = {
      contentBoxSize: undefined,
    } as unknown as ResizeObserverEntry;
    this.callback([entry], this as unknown as ResizeObserver);
  }
}

// Replace global
vi.stubGlobal('ResizeObserver', MockResizeObserver);

import { useElementSize } from '@/composables/useElementSize';

describe('useElementSize', () => {
  beforeEach(() => {
    mountHooks.length = 0;
    beforeUnmountHooks.length = 0;
    MockResizeObserver.instances = [];
  });

  function createFakeElement(w: number, h: number): HTMLElement {
    return { offsetWidth: w, offsetHeight: h } as HTMLElement;
  }

  it('返回 width/height ref，初始值为 0', () => {
    const elRef = shallowRef<HTMLElement | null>(null);
    const { width, height } = useElementSize(elRef);
    expect(width.value).toBe(0);
    expect(height.value).toBe(0);
  });

  it('onMounted 后读取元素初始尺寸', () => {
    const el = createFakeElement(200, 100);
    const elRef = shallowRef<HTMLElement | null>(el);
    const { width, height } = useElementSize(elRef);

    mountHooks[0]();

    expect(width.value).toBe(200);
    expect(height.value).toBe(100);
  });

  it('onMounted 后创建 ResizeObserver', () => {
    const el = createFakeElement(200, 100);
    const elRef = shallowRef<HTMLElement | null>(el);
    useElementSize(elRef);

    mountHooks[0]();

    expect(MockResizeObserver.instances.length).toBe(1);
    expect(MockResizeObserver.instances[0].observed[0]).toBe(el);
  });

  it('ResizeObserver 更新尺寸', () => {
    const el = createFakeElement(200, 100);
    const elRef = shallowRef<HTMLElement | null>(el);
    const { width, height } = useElementSize(elRef);

    mountHooks[0]();

    // 模拟 resize
    MockResizeObserver.instances[0].simulateResize(300, 150);

    expect(width.value).toBe(300);
    expect(height.value).toBe(150);
  });

  it('ResizeObserver 无 contentBoxSize 时不更新尺寸（走 ?? {} 回退）', () => {
    const el = createFakeElement(200, 100);
    const elRef = shallowRef<HTMLElement | null>(el);
    const { width, height } = useElementSize(elRef);

    mountHooks[0]();
    expect(width.value).toBe(200);

    // 模拟无 contentBoxSize 的 resize
    MockResizeObserver.instances[0].simulateResizeNoContentBoxSize();

    // 走 ?? {} 回退，inlineSize/blockSize 为 undefined → null check 跳过 → 尺寸不变
    expect(width.value).toBe(200);
    expect(height.value).toBe(100);
  });

  it('元素为 null 时不创建 observer 且不报错', () => {
    const elRef = shallowRef<HTMLElement | null>(null);
    useElementSize(elRef);

    expect(() => mountHooks[0]()).not.toThrow();
    expect(MockResizeObserver.instances.length).toBe(0);
  });

  it('onBeforeUnmount 时断开 observer', () => {
    const el = createFakeElement(200, 100);
    const elRef = shallowRef<HTMLElement | null>(el);
    useElementSize(elRef);

    mountHooks[0]();
    expect(MockResizeObserver.instances[0].observed.length).toBe(1);

    beforeUnmountHooks[0]();
    expect(MockResizeObserver.instances[0].observed.length).toBe(0);
  });

  it('多个元素独立监听', () => {
    const el1 = createFakeElement(100, 50);
    const el2 = createFakeElement(200, 80);
    const ref1 = shallowRef<HTMLElement | null>(el1);
    const ref2 = shallowRef<HTMLElement | null>(el2);

    const result1 = useElementSize(ref1);
    const result2 = useElementSize(ref2);

    mountHooks[0]();
    mountHooks[1]();

    expect(result1.width.value).toBe(100);
    expect(result2.width.value).toBe(200);
  });
});
