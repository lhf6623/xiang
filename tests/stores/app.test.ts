import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { RED, BLACK, NULL, initMap } from '@/utils/data';

// ---- mock gameMsg ----
const mockEmit = vi.fn();
const mockClearMsg = vi.fn();

vi.mock('@/utils/game-msg', () => ({
  gameMsg: {
    on: vi.fn(() => () => {}),
    off: vi.fn(),
    emit: (...args: any[]) => mockEmit(...args),
    clearMsg: () => mockClearMsg(),
  },
  EVENT_MESSAGE: {
    check: { text: '将军！', cls: 'font-bold' },
    checkmate: { text: '将死！', cls: 'font-bold' },
    stalemate: { text: '困毙！', cls: 'font-bold' },
    'illegal-move': { text: '非法', cls: '' },
    clear: { text: '', cls: '' },
  },
}));

// ---- mock nextTick ----
vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue');
  return {
    ...actual,
    nextTick: (fn?: () => void) => {
      // 同步执行以便测试
      if (fn) fn();
      return Promise.resolve();
    },
  };
});

import { useAppStore } from '@/stores/app';

// helpers
function store() {
  return useAppStore();
}

describe('app store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockEmit.mockClear();
    mockClearMsg.mockClear();
  });

  // ---- 初始状态 ----

  describe('初始状态', () => {
    it('应有 32 个棋子', () => {
      const s = store();
      const pieces = s.list.filter((p) => p !== null);
      expect(pieces.length).toBe(32);
    });

    it('红方先行', () => {
      expect(store().next).toBe(RED);
    });

    it('is_run 为 true', () => {
      expect(store().is_run).toBe(true);
    });

    it('record 为空', () => {
      const s = store();
      expect(s.record).toEqual([]);
      expect(s.record_index).toBe(-1);
    });

    it('active 为空', () => {
      expect(store().active).toEqual([]);
    });

    it('lastMove 为 null', () => {
      expect(store().lastMove).toBeNull();
    });
  });

  // ---- refreshGame ----

  describe('refreshGame', () => {
    it('重置所有状态', () => {
      const s = store();
      // 走一步棋改变状态
      s.active = [70, 67];
      s.next = BLACK;
      s.lastMove = { from: 70, to: 67 };

      s.refreshGame();

      expect(s.active).toEqual([]);
      expect(s.is_run).toBe(true);
      expect(s.next).toBe(RED);
      expect(s.record).toEqual([]);
      expect(s.record_index).toBe(-1);
      expect(s.deduction_list).toEqual([]);
      expect(s.lastMove).toBeNull();
      expect(mockClearMsg).toHaveBeenCalled();
    });

    it('棋盘重置为初始布局', () => {
      const s = store();
      // 先走一步
      s.list = s.list.map((v, i) =>
        i === 40
          ? { ...s.list[70]!, index: 40 }
          : i === 70
            ? NULL
            : v !== NULL
              ? { ...v }
              : NULL
      );

      s.refreshGame();

      // 红炮应在原位
      expect(s.list[70]?.code).toBe('pao');
      expect(s.list[70]?.type).toBe(RED);
    });
  });

  // ---- setActive ----

  describe('setActive', () => {
    it('选中棋子后 active 包含棋子位置和可走位置', () => {
      const s = store();
      const piece = s.list[70]!; // 红炮
      s.setActive(piece);

      expect(s.active[0]).toBe(70);
      expect(s.active.length).toBeGreaterThan(1);
    });

    it('传入 null 清空 active', () => {
      const s = store();
      s.setActive(s.list[70]);
      expect(s.active.length).toBeGreaterThan(0);

      s.setActive(null);
      expect(s.active).toEqual([]);
    });

    it('传入 undefined 清空 active', () => {
      const s = store();
      s.setActive(s.list[70]);
      s.setActive(undefined);
      expect(s.active).toEqual([]);
    });
  });

  // ---- toggleTheme ----

  describe('toggleTheme', () => {
    it('循环切换四个主题', () => {
      const s = store();
      expect(s.theme).toBe('light');

      s.toggleTheme();
      expect(s.theme).toBe('dark');

      s.toggleTheme();
      expect(s.theme).toBe('chinese-red');

      s.toggleTheme();
      expect(s.theme).toBe('celadon');

      s.toggleTheme();
      expect(s.theme).toBe('light');
    });
  });

  // ---- readRecord ----

  describe('readRecord', () => {
    it('index < 0 时回到初始棋盘', () => {
      const s = store();
      s.record_index = 2;
      s.active = [70, 67];

      s.readRecord(-1);

      expect(s.record_index).toBe(-1);
      expect(s.active).toEqual([]);
      expect(s.lastMove).toBeNull();
    });

    it('index >= 0 时读取对应记录', () => {
      const s = store();
      // 造一条记录
      s.record = [
        {
          name: '炮二平五',
          list: initMap().flatMap((v) => (v !== NULL ? [{ ...v }] : [])),
        },
      ];

      s.readRecord(0);

      expect(s.record_index).toBe(0);
      expect(s.list.filter((p) => p !== null).length).toBe(32);
    });

    it('读取最后一条记录时 is_run = true 并触发 check', () => {
      const s = store();
      s.record = [
        {
          name: '炮二平五',
          list: initMap().flatMap((v) => (v !== NULL ? [{ ...v }] : [])),
        },
        {
          name: '炮8平5',
          list: initMap().flatMap((v) => (v !== NULL ? [{ ...v }] : [])),
        },
      ];

      s.readRecord(1);

      expect(s.is_run).toBe(true);
    });

    it('读取中间记录时 is_run = false', () => {
      const s = store();
      s.record = [
        {
          name: 'a',
          list: initMap().flatMap((v) => (v !== NULL ? [{ ...v }] : [])),
        },
        {
          name: 'b',
          list: initMap().flatMap((v) => (v !== NULL ? [{ ...v }] : [])),
        },
        {
          name: 'c',
          list: initMap().flatMap((v) => (v !== NULL ? [{ ...v }] : [])),
        },
      ];

      s.readRecord(0);

      expect(s.is_run).toBe(false);
    });

    it('传入自定义 list 覆盖默认棋子', () => {
      const s = store();
      const customList: PieceType[] = [
        { code: 'che', type: RED, index: 0, text: '车' },
        { code: 'jiang', type: RED, index: 1, text: '帅' },
        { code: 'jiang', type: BLACK, index: 2, text: '将' },
      ];

      s.readRecord(-1, customList);

      expect(s.list[0]?.code).toBe('che');
      expect(s.list[1]?.code).toBe('jiang');
      expect(s.list[2]?.code).toBe('jiang');
    });
  });

  // ---- clickLattice（核心走棋逻辑）----

  describe('clickLattice', () => {
    it('is_run 为 false 时不可走棋', () => {
      const s = store();
      // 先选中一个红炮
      const pao = s.list[70]!;
      s.setActive(pao);
      const activeBefore = [...s.active];
      s.is_run = false;
      const nextBefore = s.next;

      // 尝试走棋 — 应该被完全忽略
      s.clickLattice(67, null);

      // 状态不应改变
      expect(s.active).toEqual(activeBefore);
      expect(s.next).toBe(nextBefore);
      expect(s.record).toEqual([]);
    });

    it('选中己方棋子', () => {
      const s = store();
      // 红方先行，点击红炮
      const redPao = s.list[70]!;
      expect(redPao.type).toBe(RED);

      s.clickLattice(70, redPao);

      expect(s.active.length).toBeGreaterThan(0);
      expect(s.active[0]).toBe(70);
    });

    it('不能选中对方棋子', () => {
      const s = store();
      const blackChe = s.list[0]!; // 黑车
      expect(blackChe.type).toBe(BLACK);

      s.clickLattice(0, blackChe);

      expect(s.active).toEqual([]);
    });

    it('点击己方另一个棋子切换选中', () => {
      const s = store();
      // 先选中红炮
      s.clickLattice(70, s.list[70]);
      expect(s.active[0]).toBe(70);

      // 再点红马
      s.clickLattice(82, s.list[82]);
      expect(s.active[0]).toBe(82);
    });

    it('走棋后切换回合', () => {
      const s = store();
      // 选中红炮(70)，走到可走的位置
      const pao = s.list[70]!;
      s.setActive(pao);
      const legalMoves = s.active.slice(1);

      // 选一个合法走法
      const target = legalMoves[0];
      expect(s.next).toBe(RED);

      s.clickLattice(target, s.list[target]);

      expect(s.next).toBe(BLACK);
    });

    it('走棋后生成 record', () => {
      const s = store();
      const pao = s.list[70]!;
      s.setActive(pao);
      const target = s.active[1]; // 第一个合法位置

      s.clickLattice(target, s.list[target]);

      expect(s.record.length).toBe(1);
      expect(s.record[0].name).toBeTruthy();
      expect(s.record_index).toBe(0);
    });

    it('走棋后更新 lastMove', () => {
      const s = store();
      const pao = s.list[70]!;
      s.setActive(pao);
      const target = s.active[1];

      s.clickLattice(target, s.list[target]);

      expect(s.lastMove).toEqual({ from: 70, to: target });
    });

    it('走后导致被将军时 emit illegal-move', () => {
      const s = store();
      // 红帅在85(4,9)，黑车在49(4,5)同列将军，红车在67(4,7)挡中间
      // 红车横移离开x=4列→黑车直接将军红帅→illegal
      const map = Array(90).fill(null) as MapType;
      map[85] = { code: 'jiang', type: RED, index: 85, text: '帅' };
      map[49] = { code: 'che', type: BLACK, index: 49, text: '车' };
      map[67] = { code: 'che', type: RED, index: 67, text: '车' };
      map[4] = { code: 'jiang', type: BLACK, index: 4, text: '将' };
      s.list = map;
      s.next = RED;

      // 选中红车
      const che = s.list[67]!;
      s.setActive(che);
      expect(s.active.length).toBeGreaterThan(1);

      // 尝试横移到68(5,7)，移开后黑车直接将军红帅→illegal
      s.clickLattice(68, null);

      expect(mockEmit).toHaveBeenCalledWith('illegal-move');
    });

    it('点击空位但不在可走范围内不处理', () => {
      const s = store();
      const pao = s.list[70]!;
      s.setActive(pao);

      // 点一个很远且不可达的空位
      const beforeLength = s.active.length;
      s.clickLattice(89, null); // 89 不在炮的可走范围

      // active 不变（空位且不在范围内，直接 return）
      expect(s.active.length).toBe(beforeLength);
      expect(s.next).toBe(RED);
    });

    it('点击敌方棋子但不在可走范围内不处理', () => {
      const s = store();
      const pao = s.list[70]!; // 红炮
      s.setActive(pao);
      const activeBefore = [...s.active];

      // 黑车在 0，不在红炮的 legalMoves 中
      const blackChe = s.list[0]!;
      expect(blackChe.type).toBe(BLACK);

      s.clickLattice(0, blackChe);

      // 状态不变：未走棋，未切选中，未发消息
      expect(s.active).toEqual(activeBefore);
      expect(s.next).toBe(RED);
    });

    it('走棋后 list 正确更新：原位变空，目标位有棋子', () => {
      const s = store();
      const pao = s.list[70]!; // 红炮在 (7,7)
      s.setActive(pao);
      const target = s.active[1];

      s.clickLattice(target, s.list[target]);

      // 原位置变空
      expect(s.list[70]).toBeNull();
      // 目标位置有红炮
      expect(s.list[target]?.code).toBe('pao');
      expect(s.list[target]?.type).toBe(RED);
    });

    it('走棋后触发 check', () => {
      const s = store();
      const pao = s.list[70]!;
      s.setActive(pao);
      const target = s.active[1];

      mockClearMsg.mockClear();
      s.clickLattice(target, s.list[target]);

      // check() 通过 nextTick 同步执行（mock），非将军局面 → clearMsg
      expect(mockClearMsg).toHaveBeenCalled();
    });

    it('可以吃敌方棋子', () => {
      // 红炮70隔黑炮25打黑马7
      const s = store();
      const pao = s.list[70]!; // (7,7)
      s.setActive(pao);

      // 黑马在7，在炮的合法走法中（隔子打）
      expect(s.active).toContain(7);

      const blackMa = s.list[7]!;
      expect(blackMa.type).toBe(BLACK);

      s.clickLattice(7, blackMa);

      // 炮吃马：原位变空，目标位有红炮
      expect(s.list[70]).toBeNull();
      expect(s.list[7]?.code).toBe('pao');
      expect(s.list[7]?.type).toBe(RED);
      expect(s.next).toBe(BLACK);
    });

    it('双方各走一步后 next 切回 RED', () => {
      const s = store();
      // 构造自定义棋盘：红车在40，红帅在85；黑车在0，黑将在4
      const map = Array(90).fill(null) as MapType;
      map[85] = { code: 'jiang', type: RED, index: 85, text: '帅' };
      map[40] = { code: 'che', type: RED, index: 40, text: '车' };
      map[3] = { code: 'jiang', type: BLACK, index: 3, text: '将' }; // x=3≠4，避免对面笑
      map[0] = { code: 'che', type: BLACK, index: 0, text: '车' };
      s.list = map;
      s.next = RED;

      // 红车40横移一步到41（同行空位，移开后不会对面笑）
      const redChe = s.list[40]!;
      s.setActive(redChe);
      s.clickLattice(41, null);
      expect(s.next).toBe(BLACK);

      // 黑车0横移一步到1
      const blackChe = s.list[0]!;
      s.setActive(blackChe);
      expect(s.active).toContain(1);
      s.clickLattice(1, null);

      expect(s.next).toBe(RED); // 切回红方
    });
  });

  // ---- check ----

  describe('check', () => {
    it('初始局面不将军不将死不困毙 → clearMsg', () => {
      const s = store();
      s.check();
      // mock nextTick 同步执行：非将死/困毙/将军 → clearMsg
      expect(mockClearMsg).toHaveBeenCalled();
      expect(mockEmit).not.toHaveBeenCalled();
    });

    it('将军局面 emit check', () => {
      const s = store();
      // 构造将军局面：红帅85，黑车同列49
      const map = Array(90).fill(null) as MapType;
      map[85] = { code: 'jiang', type: RED, index: 85, text: '帅' };
      map[49] = { code: 'che', type: BLACK, index: 49, text: '车' };
      map[4] = { code: 'jiang', type: BLACK, index: 4, text: '将' };
      s.list = map;
      s.next = RED;
      mockClearMsg.mockClear();

      s.check();

      expect(mockEmit).toHaveBeenCalledWith('check');
    });

    it('将死局面 emit checkmate + is_run = false', () => {
      const s = store();
      // 红帅85(4,9)，黑车49(4,5)同列将军，黑车89(8,9)控制第9行
      const map = Array(90).fill(null) as MapType;
      map[85] = { code: 'jiang', type: RED, index: 85, text: '帅' };
      map[49] = { code: 'che', type: BLACK, index: 49, text: '车' };
      map[89] = { code: 'che', type: BLACK, index: 89, text: '车' };
      map[4] = { code: 'jiang', type: BLACK, index: 4, text: '将' };
      s.list = map;
      s.next = RED;

      s.check();

      expect(mockEmit).toHaveBeenCalledWith('checkmate');
      expect(s.is_run).toBe(false);
    });

    it('困毙局面 emit stalemate + is_run = false', () => {
      const s = store();
      // 红帅85被己方仕围死，黑将在同列但被仕76挡住→不对面笑
      // 每个仕的走法都会导致76变空→对面笑，所以全无安全走法
      const map = Array(90).fill(null) as MapType;
      map[85] = { code: 'jiang', type: RED, index: 85, text: '帅' };
      map[84] = { code: 'shi', type: RED, index: 84, text: '仕' };
      map[86] = { code: 'shi', type: RED, index: 86, text: '仕' };
      map[76] = { code: 'shi', type: RED, index: 76, text: '仕' };
      map[4] = { code: 'jiang', type: BLACK, index: 4, text: '将' }; // 同列 x=4，仕76挡住
      s.list = map;
      s.next = RED;

      s.check();

      expect(mockEmit).toHaveBeenCalledWith('stalemate');
      expect(s.is_run).toBe(false);
    });
  });
});
