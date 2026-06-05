import { defineComponent, computed, ref, nextTick, onUnmounted } from 'vue';
import { useAppStore } from '@/stores/app';
import { gameEvent, type GameEventType } from '@/utils/eventBus';

const MESSAGE_MAP: Record<GameEventType, { text: string; cls: string }> = {
  check: { text: '将军！', cls: 'font-bold text-chess-accent' },
  checkmate: { text: '将死！', cls: 'font-bold text-chess-accent' },
  stalemate: { text: '困毙！', cls: 'font-bold text-chess-accent' },
  'illegal-move': { text: '移动到此位置会被将军', cls: 'text-amber-600' },
};

export function NumberList({ list = [] }: { list: (string | number)[] }) {
  return (
    <ul class="relative flex !h-20px w-324px text-12px">
      {list.map((item, index) => {
        return (
          <li key={index} class="text-center w-36px h-full leading-20px">
            {item}
          </li>
        );
      })}
    </ul>
  );
}

export const Control = defineComponent({
  setup() {
    const store = useAppStore();

    const nextRecord = (index: number) => {
      store.readRecord(store.record_index + index);
    };
    const isLast = computed(() => store.record_index === store.record.length - 1);
    const isFirst = computed(() => store.record_index < 0);

    const msgRef = ref<HTMLElement>();
    const message = ref<{ text: string; cls: string } | null>(null);

    const stopWatch = gameEvent.on(async (e) => {
      if (!e) {
        message.value = null;
        return;
      }
      message.value = MESSAGE_MAP[e.type] ?? null;
      await nextTick();
      msgRef.value?.animate(
          [
            { transform: 'translateX(0)' },
            { transform: 'translateX(-4px)', offset: 0.15 },
            { transform: 'translateX(4px)', offset: 0.3 },
            { transform: 'translateX(-3px)', offset: 0.45 },
            { transform: 'translateX(2px)', offset: 0.6 },
            { transform: 'translateX(-1px)', offset: 0.75 },
            { transform: 'translateX(0)' },
          ],
          { duration: 500, easing: 'ease-out' },
        );
    });

    onUnmounted(stopWatch);

    return () => (
      <footer class="flex-row flex-center justify-between h-26px w-full px-10px overflow-hidden">
        <span class="text-12px flex-shrink-0">
          {message.value && (
            <span ref={msgRef} class={`inline-block ${message.value.cls}`}>
              {message.value.text}
            </span>
          )}
        </span>
        <span class="flex-row flex-center gap-10px">
          <button class="x-button" onClick={store.refreshGame}>
            重新开始
          </button>
          <button
            class="x-button"
            disabled={isFirst.value}
            onClick={() => nextRecord(-1)}
          >
            上一步
          </button>
          <button
            class="x-button"
            disabled={isLast.value}
            onClick={() => nextRecord(1)}
          >
            下一步
          </button>
          <button class="x-button" onClick={() => store.toggleTheme()}>
            {
              { light: '☀️', dark: '🌙', 'chinese-red': '🏮', celadon: '🍃' }[
                store.theme
              ]
            }
          </button>
        </span>
      </footer>
    );
  },
});

export function Active({ cls }: { cls: string }) {
  return (
    <ul class="absolute top-0 left-0 z-5 w-36px h-36px">
      <li
        class={`absolute w-7px h-7px top-1px left-1px b-none b-t b-l b-t-solid b-l-solid ${cls}`}
      />
      <li
        class={`absolute w-7px h-7px top-1px right-1px b-none b-t b-r b-t-solid b-r-solid ${cls}`}
      />
      <li
        class={`absolute w-7px h-7px bottom-1px left-1px b-none b-b b-l b-b-solid b-l-solid ${cls}`}
      />
      <li
        class={`absolute w-7px h-7px bottom-1px right-1px b-none b-b b-r b-b-solid b-r-solid ${cls}`}
      />
    </ul>
  );
}
