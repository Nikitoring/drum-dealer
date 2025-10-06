import preprocess from 'svelte-preprocess';

const config = {
  preprocess: preprocess({
    typescript: true,
    scss: {
      prependData: `@import 'src/styles/variables.scss';`,
    },
    postcss: true,
  }),
  // ... other Svelte configuration
};

export default config;
