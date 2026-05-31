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
  theme: {
    colors: {
      chess: {
        bg:     'var(--c-bg)',
        board:  'var(--c-board)',
        line:   'var(--c-line)',
        text:   'var(--c-text)',
        accent: 'var(--c-accent)',
        river:  'var(--c-river)',
        hover:  'var(--c-hover)',
        active: 'var(--c-active)',
        black:  'var(--c-black)',
        red:    'var(--c-red)',
        'active-red':   'var(--c-active-red)',
        'active-black': 'var(--c-active-black)',
        shadow: 'var(--c-shadow)',
      },
    },
  },
  shortcuts: {
    'flex-center': 'flex justify-center items-center',
    'shadow-chess': 'shadow shadow-chess-shadow',
    'x-button': 'text-11px py-2px px-6px flex-center b-1 b-solid b-chess-line rounded cursor-pointer hover:text-chess-accent hover:border-chess-accent opacity-80 hover:opacity-100 active:bg-chess-hover disabled:opacity-30 disabled:cursor-not-allowed',
  },
  transformers: [transformerAttributifyJsx(), transformerVariantGroup()],
});