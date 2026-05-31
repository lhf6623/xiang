<template>
  <div class="h-full w-full relative flex-center">
    <div
      class="w-516px flex-shrink-0 h-434px shadow relative flex-center flex-col gap-4px overflow-hidden p-4px text-16px text-black bg-white">
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

onMounted(() => {
  // 禁止右键
  document.oncontextmenu = function (e) {
    if (import.meta.env.PROD) {
      e.preventDefault();
    }
  };
});

// 1、机器人对局 写一个算法出来，可以人机对局
// 2、历史对局推演
// ---TODO: 棋谱生成好像存在问题 两列兵 一列三个 一列两个 这个有差异
// 3、棋谱输入可以直观的感受到棋谱和棋子的关系
</script>
