import { defineComponent, computed, useTemplateRef } from 'vue';
import { useAppStore } from '@/stores/app';
import { useGameMsg } from '../composables/useGameMsg';

export function NumberList({ list = [] }: { list: (string | number)[] }) {
  return (
    <ul class='relative flex !h-20px w-324px text-12px'>
      {list.map((item, index) => {
        return (
          <li key={index} class='text-center w-36px h-full leading-20px'>
            {item}
          </li>
        );
      })}
    </ul>
  );
}

export const GameMessage = defineComponent({
  setup() {
    const msgRef = useTemplateRef<HTMLElement>('msgRef');
    const { eventMsg } = useGameMsg(msgRef);

    return () => (
      <span ref='msgRef' class={eventMsg.value.cls}>
        {eventMsg.value.text}
      </span>
    );
  },
});

export const Control = defineComponent({
  setup() {
    const store = useAppStore();

    const nextRecord = (index: number) => {
      store.readRecord(store.record_index + index);
    };
    const isLast = computed(
      () => store.record_index === store.record.length - 1
    );
    const isFirst = computed(() => store.record_index < 0);

    return () => (
      <footer class='flex-row flex-center justify-between h-26px w-full px-10px overflow-hidden'>
        <span class='text-12px flex-shrink-0'>
          <GameMessage />
        </span>
        <span class='flex-row flex-center gap-10px'>
          <button class='x-button' onClick={store.refreshGame}>
            重新开始
          </button>
          <button
            class='x-button'
            disabled={isFirst.value}
            onClick={() => nextRecord(-1)}
          >
            上一步
          </button>
          <button
            class='x-button'
            disabled={isLast.value}
            onClick={() => nextRecord(1)}
          >
            下一步
          </button>
          <button class='x-button' onClick={() => store.toggleTheme()}>
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
    <ul class='absolute top-0 left-0 z-5 w-36px h-36px'>
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
