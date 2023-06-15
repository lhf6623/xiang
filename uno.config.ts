// uno.config.ts
import {
  defineConfig,
  presetIcons,
  presetUno,
  presetAttributify,
  transformerAttributifyJsx,
} from "unocss";

import presetRemToPx from "@unocss/preset-rem-to-px";

import { shortcuts } from "./devConfig/uno";

export default defineConfig({
  shortcuts,
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
