import { createSignal, onMount, onCleanup } from "solid-js";
import dayjs from "dayjs";

export const useNowDate = (formatStr = "YYYY年M月D日 H点m分s秒") => {
  const [time, setTime] = createSignal(dayjs().format(formatStr));
  let timId: NodeJS.Timer | null = null;
  onMount(() => {
    timId = setInterval(() => {
      setTime(dayjs().format(formatStr));
    }, 1000);
  });

  onCleanup(() => {
    timId && clearInterval(timId);
  });
  return { time };
};
