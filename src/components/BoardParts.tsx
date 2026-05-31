import { defineComponent, computed } from 'vue';
import { useAppStore } from '@/stores/app';

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

export const Control = defineComponent({
  setup() {
    const store = useAppStore();

    const nextRecord = (index: number) => {
      store.readRecord(store.record_index + index);
    };
    const isLast = computed(() => {
      return store.record_index === store.record.length - 1;
    });
    const isFirst = computed(() => {
      return store.record_index < 0;
    });

    return () => (
      <footer class='flex-row flex-center justify-between h-26px w-full px-34px overflow-hidden'>
        <button class='x-button' onClick={store.refreshGame}>
          重新开始
        </button>
        <div class='flex flex-row gap-2px'>
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
        </div>
      </footer>
    );
  },
});

export function Active({ color }: { color: string }) {
  return (
    <ul class='absolute top-0 left-0 z-5 w-36px h-36px'>
      <li
        style={`border-color: ${color}`}
        class='absolute w-7px h-7px top-1px left-1px b-none b-t b-l b-t-solid b-l-solid'
      ></li>
      <li
        style={`border-color: ${color}`}
        class='absolute w-7px h-7px top-1px right-1px b-none b-t b-r b-t-solid b-r-solid'
      ></li>
      <li
        style={`border-color: ${color}`}
        class='absolute w-7px h-7px bottom-1px left-1px b-none b-b b-l b-b-solid b-l-solid'
      ></li>
      <li
        style={`border-color: ${color}`}
        class='absolute w-7px h-7px bottom-1px right-1px b-none b-b b-r b-b-solid b-r-solid'
      ></li>
    </ul>
  );
}
