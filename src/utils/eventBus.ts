import { ref, watch } from 'vue';

export type GameEventType = 'check' | 'checkmate' | 'stalemate' | 'illegal-move';

export interface GameEvent {
  type: GameEventType;
}

const eventRef = ref<GameEvent | null>(null);

/** 游戏事件发布订阅 */
export const gameEvent = {
  emit(type: GameEventType) {
    eventRef.value = { type };
  },
  clear() {
    eventRef.value = null;
  },
  on(fn: (event: GameEvent | null) => void) {
    return watch(eventRef, fn);
  },
};
