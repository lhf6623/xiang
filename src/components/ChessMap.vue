<template>
  <div
    class="relative flex flex-col items-center w-324px h-400px bg-chess-board-bg select-none cursor-pointer shadow-chess"
  >
    <NumberList :list="numbers" />
    <div class="relative w-324px h-360px">
      <svg
        class="absolute inset-0"
        width="324"
        height="360"
        viewBox="0 0 324 360"
      >
        <rect
          :x="verticalX[0] - 6"
          :y="horizontalLines[0] - 6"
          :width="verticalX[8] - verticalX[0] + 12"
          :height="horizontalLines[9] - horizontalLines[0] + 12"
          fill="none"
          class="stroke-chess-board-line"
          stroke-width="2"
        />
        <rect
          :x="verticalX[0]"
          :y="horizontalLines[0]"
          :width="verticalX[8] - verticalX[0]"
          :height="horizontalLines[9] - horizontalLines[0]"
          fill="none"
          class="stroke-chess-board-line"
          stroke-width="1"
        />
        <line
          v-for="y in horizontalLines.slice(1, -1)"
          :key="'h-' + y"
          :x1="verticalX[0] - 0.5"
          :x2="verticalX[8] + 0.5"
          :y1="y"
          :y2="y"
          class="stroke-chess-board-line"
          stroke-width="1"
        />
        <template v-for="x in verticalX.slice(1, -1)" :key="x">
          <line
            :x1="x"
            :x2="x"
            :y1="horizontalLines[0] - 0.5"
            :y2="riverTop + 0.5"
            class="stroke-chess-board-line"
            stroke-width="1"
          />
          <line
            :x1="x"
            :x2="x"
            :y1="riverBottom - 0.5"
            :y2="horizontalLines[9] + 0.5"
            class="stroke-chess-board-line"
            stroke-width="1"
          />
        </template>
        <line
          v-for="(d, i) in palaceDiagonals"
          :key="'d-' + i"
          :x1="d.x1"
          :y1="d.y1"
          :x2="d.x2"
          :y2="d.y2"
          class="stroke-chess-board-line"
          stroke-width="1"
        />
        <text
          x="162"
          y="182"
          text-anchor="middle"
          dominant-baseline="central"
          font-size="4"
          class="fill-chess-board-river"
        >
          楚 河 汉 界
        </text>
        <path
          v-for="(s, i) in starPaths"
          :key="'s-' + i"
          :d="s"
          fill="none"
          class="stroke-chess-board-line"
          stroke-width="1"
          stroke-linecap="square"
          stroke-linejoin="round"
        />
      </svg>
      <div class="relative flex flex-wrap z-1">
        <ChessPiece
          v-for="(item, index) in store.list"
          :key="index"
          @click="store.clickLattice(index, item)"
          :data="item"
          :active="tipsActive"
          :index="index"
          :isLastMoved="store.lastMove?.to === index"
        />
      </div>
      <!-- 原位标记：棋子移动前的位置（实心圆点，呼吸） -->
      <div
        v-if="store.lastMove"
        class="absolute z-2 w-12px h-12px rounded-full pointer-events-none"
        :class="originMarkerClass"
        :style="originMarkerStyle"
      />
    </div>
    <NumberList :list="numbers_cn" />
  </div>
</template>

<script setup lang="ts">
  import ChessPiece from './ChessPiece.vue';
  import { computed, onMounted } from 'vue';
  import { numbers, numbers_cn, RED } from '@/utils/data';
  import { NumberList } from './BoardParts';
  import { useAppStore } from '@/stores/app';

  const CELL = 36;
  const GAP = 4;
  const LEN = 4;
  const horizontalLines = Array.from(
    { length: 10 },
    (_, i) => i * CELL + CELL / 2
  );
  const verticalX = Array.from({ length: 9 }, (_, i) => i * CELL + CELL / 2);
  const riverTop = 4 * CELL + CELL / 2;
  const riverBottom = 5 * CELL + CELL / 2;
  const palaceDiagonals = [
    {
      x1: 3 * CELL + CELL / 2,
      y1: 0 * CELL + CELL / 2,
      x2: 5 * CELL + CELL / 2,
      y2: 2 * CELL + CELL / 2,
    },
    {
      x1: 5 * CELL + CELL / 2,
      y1: 0 * CELL + CELL / 2,
      x2: 3 * CELL + CELL / 2,
      y2: 2 * CELL + CELL / 2,
    },
    {
      x1: 3 * CELL + CELL / 2,
      y1: 7 * CELL + CELL / 2,
      x2: 5 * CELL + CELL / 2,
      y2: 9 * CELL + CELL / 2,
    },
    {
      x1: 5 * CELL + CELL / 2,
      y1: 7 * CELL + CELL / 2,
      x2: 3 * CELL + CELL / 2,
      y2: 9 * CELL + CELL / 2,
    },
  ];
  type Corner = 'tl' | 'tr' | 'bl' | 'br';
  const starData: [number, number, Corner[]][] = [
    [2, 3, ['tl', 'tr', 'bl', 'br']],
    [2, 8, ['tl', 'tr', 'bl', 'br']],
    [8, 3, ['tl', 'tr', 'bl', 'br']],
    [8, 8, ['tl', 'tr', 'bl', 'br']],
    [1, 4, ['tl', 'bl']],
    [9, 4, ['tr', 'br']],
    [1, 7, ['tl', 'bl']],
    [9, 7, ['tr', 'br']],
    [3, 4, ['tl', 'tr', 'bl', 'br']],
    [5, 4, ['tl', 'tr', 'bl', 'br']],
    [7, 4, ['tl', 'tr', 'bl', 'br']],
    [3, 7, ['tl', 'tr', 'bl', 'br']],
    [5, 7, ['tl', 'tr', 'bl', 'br']],
    [7, 7, ['tl', 'tr', 'bl', 'br']],
  ];
  function starPath(col: number, row: number, corners: Corner[]): string {
    const cx = (col - 1) * CELL + CELL / 2,
      cy = (row - 1) * CELL + CELL / 2,
      g = GAP,
      l = LEN;
    return corners
      .map((c) => {
        switch (c) {
          case 'tl':
            return `M${cx + g} ${cy + g} L${cx + g + l} ${cy + g} M${cx + g} ${cy + g} L${cx + g} ${cy + g + l}`;
          case 'bl':
            return `M${cx + g} ${cy - g} L${cx + g + l} ${cy - g} M${cx + g} ${cy - g} L${cx + g} ${cy - g - l}`;
          case 'br':
            return `M${cx - g} ${cy - g} L${cx - g - l} ${cy - g} M${cx - g} ${cy - g} L${cx - g} ${cy - g - l}`;
          case 'tr':
            return `M${cx - g} ${cy + g} L${cx - g - l} ${cy + g} M${cx - g} ${cy + g} L${cx - g} ${cy + g + l}`;
        }
      })
      .join(' ');
  }
  const starPaths = computed(() =>
    starData.map(([col, row, corners]) => starPath(col, row, corners))
  );
  const store = useAppStore();
  onMounted(() => {
    store.readRecord(store.record.length - 1);
  });
  const tipsActive = computed(() => (store.active.length ? store.active : []));

  // 原位标记样式
  const DOT = 12; // 实心圆点直径
  const originMarkerStyle = computed(() => {
    if (!store.lastMove) return {};
    const from = store.lastMove.from;
    const col = from % 9;
    const row = Math.floor(from / 9);
    return {
      left: `${col * CELL + (CELL - DOT) / 2}px`,
      top: `${row * CELL + (CELL - DOT) / 2}px`,
    };
  });

  const originMarkerClass = computed(() => {
    if (!store.lastMove) return '';
    const movedPiece = store.list[store.lastMove.to];
    if (!movedPiece) return '';
    return movedPiece.type === RED
      ? 'origin-marker-red'
      : 'origin-marker-black';
  });
</script>
