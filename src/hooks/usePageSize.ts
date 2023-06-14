import { createSignal, onMount, onCleanup } from "solid-js";

export function usePageSize() {
  const [width, setWidth] = createSignal(0);
  const [height, setHeight] = createSignal(0);
  function setPageSize() {
    setWidth(document.documentElement.clientWidth);
    setHeight(document.documentElement.clientHeight);
  }
  setPageSize();
  onMount(() => {
    window.addEventListener("resize", setPageSize);
  });
  onCleanup(() => {
    window.removeEventListener("resize", setPageSize);
  });

  return {
    width,
    height,
  };
}
