export default {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          // Preserve CSS custom properties for dark mode
          cssDeclarationSorter: false,
          reduceIdents: false,
        }],
      },
    } : {}),
  },
}
