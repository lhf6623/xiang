import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
  transformerAttributifyJsx,
  transformerVariantGroup,
} from 'unocss';

export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetIcons({})],
  shortcuts: {
    'flex-center': 'flex justify-center items-center',
    'x-button': "text-11px py-2px px-6px flex-center b-1 b-solid b-black rounded cursor-pointer hover-border-red/60 hover-text-red/80 active-bg-red/10 disabled-opacity-30 disabled-cursor-not-allowed"
  },
  transformers: [transformerAttributifyJsx(), transformerVariantGroup()],
});
