<template>
  <div class="h-full w-full relative flex-center">
    <div
      class="w-516px flex-shrink-0 h-434px shadow-chess relative flex-center flex-col gap-4px overflow-hidden p-4px text-16px text-chess-text bg-chess-app-bg"
    >
      <section class="w-full flex flex-row gap-4px h-full">
        <Maps />
        <RecordList />
      </section>
      <Control />
    </div>
  </div>
</template>
<script setup lang="ts">
  import { onMounted } from 'vue';
  import Maps from '@/components/ChessMap.vue';
  import { Control } from '@/components/BoardParts';
  import RecordList from '@/components/RecordList.vue';
  import { useAppStore } from '@/stores/app';

  const store = useAppStore();

  onMounted(() => {
    // 禁止右键
    document.oncontextmenu = function (e) {
      if (import.meta.env.PROD) {
        e.preventDefault();
      }
    };

    // 初始化主题
    document.documentElement.dataset.theme = store.theme;
  });
</script>
