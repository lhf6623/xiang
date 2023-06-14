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
    "flex-center": "flex justify-center items-center",
    "box-1":
      "border border-solid border-#666 shadow box-border h-full overflow-hidden",
    "button-box":
      "shadow border border-solid leading text-xs border-#666 h-22px px-1 rounded-sm overflow-hidden",
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
      prefix: "i-",
    }),
  ],

  transformers: [transformerAttributifyJsx()],
});
