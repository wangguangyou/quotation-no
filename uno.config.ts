import presetRemToPx from '@unocss/preset-rem-to-px'

import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'
export default defineConfig({
  presets: [
    presetAttributify(),
    presetIcons(),
    presetUno(),
    presetRemToPx({
      baseFontSize: 4,
    }),
  ],
  safelist: ['fcc'],
  shortcuts: [
    ['fi', 'flex items-center'],
    ['fcc', 'flex items-center justify-center'],
    ['fbc', 'flex justify-between items-center'],
    ['p-c', 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'],
  ],
})
