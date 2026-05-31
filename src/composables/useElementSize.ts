import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue';

export function useElementSize(target: Ref<HTMLElement | null>): {
  width: Ref<number>;
  height: Ref<number>;
} {
  const width = ref(0);
  const height = ref(0);

  let observer: ResizeObserver | null = null;

  onMounted(() => {
    const el = target.value;
    if (!el) return;

    width.value = el.offsetWidth;
    height.value = el.offsetHeight;

    observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { inlineSize, blockSize } = entry.contentBoxSize?.[0] ?? {};
        if (inlineSize != null) width.value = inlineSize;
        if (blockSize != null) height.value = blockSize;
      }
    });
    observer.observe(el);
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
  });

  return { width, height };
}
