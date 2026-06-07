import { gameMsg, type gameItemMsgType } from '@/utils/game-msg';
import { ref, onMounted, onUnmounted, type TemplateRef } from 'vue';

export function useGameMsg(el: TemplateRef<HTMLElement>) {
  const eventMsg = ref<gameItemMsgType>({ text: '', cls: '' });

  let animate: Animation | undefined = undefined;

  let gameMsgFn: () => void;

  onMounted(() => {
    gameMsgFn = gameMsg.on((msg) => {
      eventMsg.value = msg;

      if (animate) animate.cancel();

      animate = el.value?.animate(
        [
          { transform: 'translateX(0)' },
          { transform: 'translateX(-4px)', offset: 0.15 },
          { transform: 'translateX(4px)', offset: 0.3 },
          { transform: 'translateX(-3px)', offset: 0.45 },
          { transform: 'translateX(2px)', offset: 0.6 },
          { transform: 'translateX(-1px)', offset: 0.75 },
          { transform: 'translateX(0)' },
        ],
        { duration: 500, easing: 'ease-out' }
      );
    });
  });

  onUnmounted(() => {
    if (gameMsgFn) gameMsgFn();
  });

  return {
    eventMsg,
  };
}
