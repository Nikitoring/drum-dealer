import preprocess from 'svelte-preprocess';

const config = {
  preprocess: preprocess({
    typescript: true,
  }),
  // ... other Svelte configuration
};

export default config;
