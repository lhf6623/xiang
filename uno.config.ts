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
    'flex-around': 'flex justify-around items-center',
    'flex-end': 'flex justify-end items-center',
    'flex-between': 'flex justify-between items-center',
    'flex-center': 'flex justify-center items-center',
  },
  transformers: [transformerAttributifyJsx(), transformerVariantGroup()],
});
