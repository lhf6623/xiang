import { createPinia, defineStore } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import { NULL, RED, BLACK, piece_list } from '@/utils/data';

import { makingChess, initMap } from '@/utils';
import { run_rule } from '@/utils/run-rule';
import { isMoveSafe, isInCheck, isCheckmate, isStalemate } from '@/utils/check';
import { gameMsg } from '@/utils/game-msg';
import { version_key } from '@/utils';
import { nextTick } from 'vue';

export const store = createPinia();
store.use(piniaPluginPersistedstate);

export const useAppStore = defineStore('app', {
  state: (): AppStoreType => ({
    list: initMap(),
    active: [],
    is_run: true,
    record_index: -1,
    record: [],
    next: RED,
    deduction_list: [],
    theme: 'light',
    lastMove: null,
  }),
  actions: {
    /* 重新开始 */
    refreshGame() {
      this.list = initMap();
      this.active = [];
      this.is_run = true;
      this.next = RED;
      this.record = [];
      this.record_index = -1;
      this.deduction_list = [];
      this.lastMove = null;
      gameMsg.clearMsg();
    },
    /** 读取记录 */
    readRecord(index: number, list?: PieceType[]) {
      this.active = [];
      this.lastMove = null;
      gameMsg.clearMsg();
      this.record_index = index;
      const pieceList = index < 0 ? piece_list : this.record[index].list;

      this.list = initMap(list ?? pieceList);

      this.is_run = index === this.record.length - 1;

      if (this.record.length - 1 === index) {
        this.check();
      }
    },
    /** 棋盘格子的活动状态 */
    setActive(piece: PieceType | null | undefined) {
      if (piece) {
        const moves = run_rule[piece.code]?.(this.list, piece) || [];
        this.active = [piece.index, ...moves];
      } else {
        this.active = [];
      }
    },
    toggleTheme() {
      const themes: AppStoreType['theme'][] = [
        'light',
        'dark',
        'chinese-red',
        'celadon',
      ];
      const idx = themes.indexOf(this.theme);
      this.theme = themes[(idx + 1) % themes.length];
      document.documentElement.dataset.theme = this.theme;
    },
    /** 点击格子，选中 或者 移动棋子 */
    clickLattice(index: number, item: PieceType | null) {
      if (!this.is_run) return;
      const [pieceIndex] = this.active;
      // 走棋
      if (this.active.length) {
        const _piece = this.list[pieceIndex]!; // active 中的第一个一定是个棋子

        // 空地, 不在棋子可行走范围内
        if (item === NULL && !this.active.includes(index)) return;

        if (item) {
          // 同一阵营的更新选中棋子
          if (_piece.type === item.type) {
            this.setActive(item);
            return;
          }
          // 不在棋子可行走范围内
          if (!this.active.includes(index)) return;
        }

        // 走后是否会导致己方被将军
        if (!isMoveSafe(this.list, pieceIndex, index, _piece.type)) {
          gameMsg.emit('illegal-move');
          return;
        }

        const _mapList = this.list.map((v) => (v !== NULL ? { ...v } : NULL));

        // 通过创建新数组引用触发 Vue 响应式更新
        const list = [...this.list];
        list[index] = { ..._piece, index };
        list[pieceIndex] = NULL;
        this.list = list;
        this.lastMove = { from: pieceIndex, to: index };
        this.setActive(null);

        this.next = this.next === RED ? BLACK : RED;

        this.record.push({
          name: makingChess(_mapList, pieceIndex, index),
          list: this.list.flatMap((item) => (item === NULL ? [] : [item])),
        });
        this.record_index = this.record.length - 1;

        this.check();
        return;
      }

      // 选中棋子
      if (
        item !== NULL &&
        this.active.length === 0 &&
        this.next === item.type
      ) {
        this.setActive(item);
      }
    },
    // 检查将死
    check() {
      nextTick(() => {
        // 判断将军/将死/困毙
        if (isCheckmate(this.list, this.next)) {
          gameMsg.emit('checkmate');
          this.is_run = false;
        } else if (isStalemate(this.list, this.next)) {
          gameMsg.emit('stalemate');
          this.is_run = false;
        } else if (isInCheck(this.list, this.next)) {
          gameMsg.emit('check');
        }
      });
    },
  },
  persist: {
    key: version_key,
    storage: localStorage,
  },
});
