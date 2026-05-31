<template>
  <div
    class="shadow flex flex-col bg-white text-12px overflow-hidden w-180px z-50 flex-1"
  >
    <header class="bg-#99ddff px-6px h-18px flex-shrink-0">
      棋谱序列
      <span v-if="!store.is_run" class="scale-75 inline-block">[历史]</span>
    </header>
    <div ref="scrollRef" class="flex-1 h-full overflow-y-auto">
      <ul ref="recordRef" class="text-center">
        <li
          :class="`b-b ${isStart ? 'text-white bg-#0062ff99' : ''}`"
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
            <span :class="`hover:bg-#0062ff33 ${getAcriveStyle(index, 0)}`">
              {{ item1.name }}
            </span>
          </span>
          <span @click="readRecord(index, 1)" class="flex-1 text-left">
            <span :class="`hover:bg-#0062ff33 ${getAcriveStyle(index, 1)}`">
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
    return store.record.reduce((acc, cur, index) => {
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

    return isActive ? 'bg-#0062ff99 text-white hover:text-black' : '';
  }
</script>
