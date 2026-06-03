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
        'app-bg': 'var(--c-app-bg)',
        'board-bg': 'var(--c-board-bg)',
        'board-line': 'var(--c-board-line)',
        text: 'var(--c-text)',
        accent: 'var(--c-accent)',
        'board-river': 'var(--c-board-river)',
        'hover-bg': 'var(--c-hover-bg)',
        'active-bg': 'var(--c-active-bg)',
        'piece-side-black': 'var(--c-piece-side-black)',
        'piece-side-red': 'var(--c-piece-side-red)',
        'piece-side-black-active': 'var(--c-piece-side-black-active)',
        'piece-side-red-active': 'var(--c-piece-side-red-active)',
        shadow: 'var(--c-shadow)',

        border: 'var(--c-border)',
        'piece-bg': 'var(--c-piece-bg)',
        'piece-inner-bg': 'var(--c-piece-inner-bg)',
        'disabled-text': 'var(--c-disabled-text)',
        'disabled-border': 'var(--c-disabled-border)',
        'disabled-bg': 'var(--c-disabled-bg)',
        'scrollbar-thumb': 'var(--c-scrollbar-thumb)',
        'scrollbar-track': 'var(--c-scrollbar-track)',
      },
    },
  },
  shortcuts: {
    'flex-center': 'flex justify-center items-center',
    'shadow-chess': 'shadow shadow-chess-shadow',
    'x-button':
      'text-11px py-2px px-6px flex-center b-1 b-solid b-chess-border rounded cursor-pointer hover:text-chess-accent hover:border-chess-accent opacity-80 hover:opacity-100 active:bg-chess-hover-bg disabled:cursor-not-allowed disabled:text-chess-disabled-text disabled:border-chess-disabled-border disabled:bg-chess-disabled-bg',
  },
  transformers: [transformerAttributifyJsx(), transformerVariantGroup()],
});
