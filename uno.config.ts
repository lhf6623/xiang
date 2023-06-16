// uno.config.ts
import {
  defineConfig,
  presetIcons,
  presetUno,
  presetAttributify,
  transformerAttributifyJsx,
} from "unocss";

import presetRemToPx from "@unocss/preset-rem-to-px";

export default defineConfig({
  shortcuts: {
    "m-flex-center": "flex justify-center items-center",
    "m-flex-between": "flex justify-between items-center",
    "m-border":
      "border border-solid border-#666 box-border h-full overflow-hidden box-border relative",
    "m-button":
      "border border-solid border-#666 shadow-md text-xs h-20px px-6px rounded-5px overflow-hidden bg-white",
    "m-active": "bg-#316ac5 text-#fff",
    "m-scroll-y": "overflow-hidden hover:overflow-y-scroll",
    "m-hover-text": "hover:underline cursor-pointer",
  },
  presets: [
    /* 将所有实用程序的 rem 转换为 px。 */
    presetRemToPx(),
    /* 此预设尝试提供流行的实用程序优先框架的通用超集，包括Tailwind CSS，Windi CSS，Bootstrap，Tachyons等。*/
    presetUno(),
    presetAttributify({
      prefix: "un-",
    }),
    presetIcons({
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
      },
    }),
  ],

  transformers: [transformerAttributifyJsx()],
});
