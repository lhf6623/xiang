<template>
  <div class="relative flex flex-col items-center w-324px h-400px bg-#f5f0ec select-none cursor-pointer shadow">
    <NumberList :list="numbers" />
    <div class="relative w-324px h-360px">
      <svg class="absolute inset-0" width="324" height="360" viewBox="0 0 324 360">
        <!-- 外框2：最外层装饰框，距棋盘3px -->
        <rect :x="verticalX[0] - 6" :y="horizontalLines[0] - 6" :width="verticalX[8] - verticalX[0] + 12"
          :height="horizontalLines[9] - horizontalLines[0] + 12" fill="none" stroke="#000" stroke-width="2" />
        <!-- 外框1：棋盘边框（= 最外层网格线） -->
        <rect :x="verticalX[0]" :y="horizontalLines[0]" :width="verticalX[8] - verticalX[0]"
          :height="horizontalLines[9] - horizontalLines[0]" fill="none" stroke="#000" stroke-width="1" />

        <!-- 横线（内层8条，端点延长0.5px避免缺口） -->
        <line v-for="y in horizontalLines.slice(1, -1)" :key="'h-' + y" :x1="verticalX[0] - 0.5"
          :x2="verticalX[8] + 0.5" :y1="y" :y2="y" stroke="#000" stroke-width="1" />

        <!-- 竖线：内层7列（端点延长0.5px） -->
        <template v-for="x in verticalX.slice(1, -1)" :key="x">
          <line :x1="x" :x2="x" :y1="horizontalLines[0] - 0.5" :y2="riverTop + 0.5" stroke="#000" stroke-width="1" />
          <line :x1="x" :x2="x" :y1="riverBottom - 0.5" :y2="horizontalLines[9] + 0.5" stroke="#000" stroke-width="1" />
        </template>

        <!-- 斜线：九宫格 -->
        <line v-for="(d, i) in palaceDiagonals" :key="'d-' + i" :x1="d.x1" :y1="d.y1" :x2="d.x2" :y2="d.y2"
          stroke="#000" stroke-width="1" />

        <!-- 楚河汉界 -->
        <text x="162" y="182" text-anchor="middle" dominant-baseline="central" font-size="4" fill="#c04040">
          楚河　　　　　　　汉界
        </text>

        <!-- 星位标记 -->
        <path v-for="(s, i) in starPaths" :key="'s-' + i" :d="s" fill="none" stroke="#000" stroke-width="1"
          stroke-linecap="square" stroke-linejoin="round" />
      </svg>

      <!-- 棋子层 -->
      <div class="relative flex flex-wrap z-1">
        <ChessPiece v-for="(item, index) in store.list" :key="index" @click="store.clickLattice(index, item)"
          :data="item" :active="tipsActive" :index="index" />
      </div>
    </div>
    <NumberList :list="numbers_cn" />
  </div>
</template>

<script setup lang="ts">
import ChessPiece from './ChessPiece.vue';
import { computed, onMounted } from 'vue';
import { numbers, numbers_cn } from '@/utils/data';
import { NumberList } from './BoardParts';
import { useAppStore } from '@/stores/app';

const CELL = 36;
const GAP = 4;   // 拐点离中心距离
const LEN = 4;   // 角标线长

const horizontalLines = Array.from({ length: 10 }, (_, i) => i * CELL + CELL / 2);
const verticalX = Array.from({ length: 9 }, (_, i) => i * CELL + CELL / 2);
const riverTop = 4 * CELL + CELL / 2;
const riverBottom = 5 * CELL + CELL / 2;

const palaceDiagonals = [
  { x1: 3 * CELL + CELL / 2, y1: 0 * CELL + CELL / 2, x2: 5 * CELL + CELL / 2, y2: 2 * CELL + CELL / 2 },
  { x1: 5 * CELL + CELL / 2, y1: 0 * CELL + CELL / 2, x2: 3 * CELL + CELL / 2, y2: 2 * CELL + CELL / 2 },
  { x1: 3 * CELL + CELL / 2, y1: 7 * CELL + CELL / 2, x2: 5 * CELL + CELL / 2, y2: 9 * CELL + CELL / 2 },
  { x1: 5 * CELL + CELL / 2, y1: 7 * CELL + CELL / 2, x2: 3 * CELL + CELL / 2, y2: 9 * CELL + CELL / 2 },
];

// 角标映射：tl=左上┌ tr=右上┐ bl=左下└ br=右下┘
type Corner = 'tl' | 'tr' | 'bl' | 'br';

// 点位数据：[col, row, corners]
// col/row 为 1-based 棋盘坐标（和棋子下标一致）
const starData: [number, number, Corner[]][] = [
  // 炮位
  [2, 3, ['tl', 'tr', 'bl', 'br']],
  [2, 8, ['tl', 'tr', 'bl', 'br']],
  [8, 3, ['tl', 'tr', 'bl', 'br']],
  [8, 8, ['tl', 'tr', 'bl', 'br']],

  // row 3 黑兵线 — 左右半边
  [1, 4, ['tl', 'bl']],
  [9, 4, ['tr', 'br']],
  [1, 7, ['tl', 'bl']],
  [9, 7, ['tr', 'br']],

  // 兵位
  [3, 4, ['tl', 'tr', 'bl', 'br']],
  [5, 4, ['tl', 'tr', 'bl', 'br']],
  [7, 4, ['tl', 'tr', 'bl', 'br']],
  [3, 7, ['tl', 'tr', 'bl', 'br']],
  [5, 7, ['tl', 'tr', 'bl', 'br']],
  [7, 7, ['tl', 'tr', 'bl', 'br']],
];

function starPath(col: number, row: number, corners: Corner[]): string {
  const cx = (col - 1) * CELL + CELL / 2;
  const cy = (row - 1) * CELL + CELL / 2;
  const g = GAP; const l = LEN;

  return corners.map(c => {
    switch (c) {
      case 'tl': return `M${cx + g} ${cy + g} L${cx + g + l} ${cy + g} M${cx + g} ${cy + g} L${cx + g} ${cy + g + l}`;
      case 'bl': return `M${cx + g} ${cy - g} L${cx + g + l} ${cy - g} M${cx + g} ${cy - g} L${cx + g} ${cy - g - l}`;
      case 'br': return `M${cx - g} ${cy - g} L${cx - g - l} ${cy - g} M${cx - g} ${cy - g} L${cx - g} ${cy - g - l}`;
      case 'tr': return `M${cx - g} ${cy + g} L${cx - g - l} ${cy + g} M${cx - g} ${cy + g} L${cx - g} ${cy + g + l}`;
    }
  }).join(' ');
}

const starPaths = computed(() =>
  starData.map(([col, row, corners]) => starPath(col, row, corners))
);

const store = useAppStore();
onMounted(() => { store.readRecord(store.record.length - 1); });

const tipsActive = computed(() =>
  store.active.length ? store.active : []
);
</script>