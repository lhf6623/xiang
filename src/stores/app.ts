import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { defineStore } from 'pinia';

import { NULL, RED, BLACK, piece_list } from '@/utils/data';

import { makingChess, initMap } from '@/utils';
import { run_rule } from '@/utils/run-rule';
import { cloneDeep, isEmpty } from 'lodash-es';

import { version_key } from '@/utils';

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
    },
    /** 读取记录 */
    readRecord(index: number, list?: PieceType[]) {
      this.active = [];
      this.record_index = index;
      const pieceList = index < 0 ? piece_list : this.record[index].list;

      this.list = initMap(list ?? pieceList);

      this.is_run = index === this.record.length - 1;
    },
    /** 棋盘格子的活动状态 */
    setActive(piece: PieceType | null | undefined) {
      if (piece) {
        const { code, index } = piece;
        const run_lattice = run_rule[code]?.(this.list, piece) || [];
        this.active = [index, ...run_lattice];
      } else {
        this.active = [];
      }
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
        const _mapList = cloneDeep(this.list);

        this.list[index] = { ..._piece, index };
        this.list[pieceIndex] = NULL;
        this.setActive(null);

        this.next = this.next === RED ? BLACK : RED;

        this.record.push({
          name: makingChess(_mapList, pieceIndex, index),
          list: this.list.flatMap((item) => (item === NULL ? [] : [item])),
        });
        this.record_index = this.record.length - 1;
        return;
      }

      // 选中棋子
      if (item !== NULL && isEmpty(this.active) && this.next === item.type) {
        this.setActive(item);
      }
    },
  },
  persist: {
    key: version_key,
    storage: localStorage,
  },
});
