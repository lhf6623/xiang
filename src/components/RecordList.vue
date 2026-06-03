<template>
  <div
    class="shadow-chess flex flex-col bg-chess-app-bg text-12px overflow-hidden w-180px min-w-180px h-full"
  >
    <header
      class="px-8px h-22px flex-shrink-0 flex items-center text-12px font-bold text-chess-text b-b-1 b-solid b-chess-border"
    >
      棋谱序列
      <span v-if="!store.is_run" class="scale-75 inline-block">[历史]</span>
    </header>
    <div ref="scrollRef" class="flex-1 h-full overflow-y-auto">
      <ul ref="recordRef" class="text-center">
        <li
          :class="`b-b ${isStart ? 'bg-chess-active-bg font-bold' : ''}`"
          @click="store.readRecord(-1)"
        >
          ===棋局开始===
        </li>
        <li
          v-for="([item1, item2], index) in list"
          class="relative flex-center gap-2 b-b"
          :key="index"
        >
          <span @click="readRecord(index, 0)" class="w-54% text-left pl-3">
            <span>{{ index < 9 ? '&nbsp;' : '' }}</span>
            <span>{{ index + 1 }}.</span>
            <span :class="`hover:bg-chess-hover-bg ${getAcriveStyle(index, 0)}`">
              {{ item1.name }}
            </span>
          </span>
          <span @click="readRecord(index, 1)" class="flex-1 text-left">
            <span
              class="hover:bg-chess-hover-bg"
              :class="`${getAcriveStyle(index, 1)}`"
            >
              {{ item2?.name }}
            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useElementSize } from '@/composables/useElementSize';
  import { computed, useTemplateRef, watch } from 'vue';
  import { useAppStore } from '@/stores/app';

  const recordListRef = useTemplateRef<HTMLElement | null>('recordRef');
  const scrollRef = useTemplateRef<HTMLElement | null>('scrollRef');

  const store = useAppStore();

  const { height } = useElementSize(recordListRef);
  watch(
    () => height,
    () => {
      scrollRef.value?.scrollBy({
        top: height.value,
        behavior: 'smooth',
      });
    },
    { deep: true }
  );
  const list = computed(() => {
    // 列表中的两个项为一项
    return store.record.reduce((acc, cur, _index) => {
      const last_arr = acc.at(-1);
      if (Array.isArray(last_arr) && last_arr.length < 2) {
        last_arr.push(cur);
      } else {
        acc.push([cur]);
      }
      return acc;
    }, [] as RecordItem[][]);
  });
  // 开始
  const isStart = computed(() => store.record_index === -1);

  function readRecord(index: number, type: 0 | 1) {
    const i = index * 2 + type;

    store.readRecord(i);
  }

  function getAcriveStyle(index: number, type: 0 | 1) {
    const isActive = index * 2 + type === store.record_index;

    return isActive ? 'bg-chess-active-bg font-bold' : '';
  }
</script>
