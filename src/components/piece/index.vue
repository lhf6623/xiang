<template>
  <li>
    <!-- 斜线 -->
    <i class="lattice-line"></i>
    <!-- 棋子 -->
    <div class="piece">
      <div v-show="data" :class="`xiangqi-piece ${pieceTypeClass}`">
        {{ data?.text }}
      </div>
      <Active v-show="showActive" :color="activeColor" />
    </div>
  </li>
</template>

<script setup lang="ts">
  import { type PropType, computed } from 'vue';
  import Active from './active.vue';
  import { useAppStore } from '@/store/xiang';
  import { RED } from '@/utils/data';

  const store = useAppStore();

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

  const pieceTypeClass = computed(() =>
    props.data?.type === RED ? 'isRed' : 'isBlack'
  );
</script>

<style lang="scss" scoped>
  @import '@/config.scss';

  .piece {
    width: $w;
    height: $h;
    z-index: 100;
    position: relative;
    z-index: 100;
  }
  .xiangqi-piece {
    position: absolute;
    text-align: center;
    color: white;
    width: $w - 2px;
    height: $h - 2px;
    line-height: $h - 2px;
    top: 1px;
    left: 1px;
    border-radius: $h;
    z-index: 99;
    transform: rotate(0deg) translateZ(0);
  }
  .isRed {
    background-color: red;
  }
  .isBlack {
    background-color: black;
  }
</style>
