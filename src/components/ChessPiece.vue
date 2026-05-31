<template>
  <div class="relative w-36px h-36px flex-center">
    <!-- 棋子 -->
    <div
      v-show="data"
      class="absolute shadow text-center text-16px w-34px h-34px rounded-full z-99 b b-solid bg-#fff"
      :class="{
        'b-#ff0000' :  props.data?.type === RED,
        'b-#000': props.data?.type === BLACK
      }"
    >
      <div class="w-28px h-28px flex-center b b-solid absolute top-2px left-2px rounded-full" :class="{
        'b-#ff0000' :  props.data?.type === RED,
        'b-#000': props.data?.type === BLACK
      }">
        {{ data?.text }}
      </div>
    </div>
    <Active v-show="showActive" :color="activeColor" />
  </div>
</template>

<script setup lang="ts">
  import { type PropType, computed } from 'vue';
  import { Active } from './BoardParts';
  import { BLACK, RED } from '@/utils/data';

  const props = defineProps({
    data: {
      type: Object as PropType<PieceType | null>,
      default: () => ({}),
    },
    index: {
      type: Number,
      default: 0,
    },
    active: {
      type: Array as PropType<number[]>,
      default: () => [],
    },
  });

  const activeColor = computed(() => {
    const isRed = props.active.findIndex((item) => item === props.index) === 0;
    return isRed ? 'red' : 'black';
  });

  const showActive = computed(() => {
    return props.active.includes(props.index);
  });
</script>